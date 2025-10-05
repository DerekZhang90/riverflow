# 上线前开发计划

**目标**: 快速上线 MVP (最小可行产品)
**最后更新**: 2025-10-04

---

## 🎯 当前状态

✅ **已完成核心功能**:
- Seedream 4.0 和 Nano Banana 图片生成
- 文生图和图生图模式
- 多图网格展示 (最多15张)
- Cloudflare R2 永久存储
- 用户认证 (Google OAuth)

---

## 📋 上线前必做任务 (按顺序执行)

### 阶段 1: 清理技术债务 ⚡ 立即执行
**预计时间**: 30分钟
**目标**: 清理废弃代码,避免混乱

#### 任务清单:
- [ ] 删除 KIE.AI 相关文件:
  ```
  src/backend/utils/kieai.ts
  src/app/api/predictions/kieai/[taskId]/route.ts
  src/app/api/webhook/kieai/route.ts
  src/components/replicate/img-to-video/ (整个目录)
  ```

- [ ] 清理 `.env` 配置:
  ```env
  # 删除这些旧配置
  KIE_API_TOKEN
  REPLICATE_API_TOKEN
  REPLICATE_WEBHOOK_SECRET
  REPLICATE_URL
  ```

- [ ] 删除不需要的文档:
  ```
  DEVELOPMENT_STEPS.md (已过时)
  DATABASE_MIGRATION.md (内容已整合)
  ```

- [ ] 更新 `package.json`:
  - 移除未使用的依赖

---

### 阶段 2: 积分系统设计与检查 🎯 高优先级
**预计时间**: 2-3小时
**目标**: 确保积分系统逻辑正确,防止漏洞

#### 2.1 设计积分消耗规则

**AI 模型积分定价** (✅ 已确认):
```
极简规则: 1 积分 = 1 张图 (任何模型,任何模式)

Seedream 4.0: 1 积分/张
Nano Banana: 1 积分/张

组图模式: 生成多少张扣多少积分
- 生成 5 张 = 5 积分
- 生成 15 张 = 15 积分
```

#### 2.2 检查积分扣除逻辑

**任务清单**:
- [ ] 检查 `src/backend/service/credit_usage.ts`:
  - [ ] `checkCreditUsageByUserId()` 扣费前验证
  - [ ] `deductCredit()` 扣费逻辑
  - [ ] 确保生成失败时不扣费

- [ ] 检查 API 路由积分验证:
  - [ ] `/api/predictions/seedream-text-to-image`
  - [ ] `/api/predictions/seedream-image-to-image`
  - [ ] `/api/predictions/nanobanana-text-to-image`
  - [ ] `/api/predictions/nanobanana-image-to-image`

- [ ] 测试积分流程:
  - [ ] 新用户注册获得 5 免费积分
  - [ ] 生成成功扣除积分
  - [ ] 生成失败不扣积分
  - [ ] 积分不足时拒绝请求

#### 2.3 更新数据库 effect 表

**SQL 脚本**: `src/backend/sql/update_pricing.sql`

```sql
-- 统一设置为 1 积分 = 1 图
UPDATE effect SET credit = 1 WHERE id = 2; -- Seedream 4.0
UPDATE effect SET credit = 1 WHERE id = 3; -- Nano Banana

-- 禁用旧模型
UPDATE effect SET is_open = 0 WHERE id = 1; -- RiverFlow (暂时关闭)
```

---

### 阶段 3: 订阅价格与积分设计 💰 高优先级
**预计时间**: 2-3小时
**目标**: 设计合理的订阅套餐

#### 3.1 订阅套餐设计 (✅ 已确认 - 梯度定价方案)

**定价理念**: 升级越多,单价越低,吸引用户升级

| 套餐 | 月付 | 年付 | 月付积分 | 年付积分 | 单价(月付) | 单价(年付) | vs官方 |
|------|------|------|---------|---------|-----------|-----------|--------|
| **Basic** | $9.9 | $99 | 300 | 3600 | $0.033 | $0.028 | +6% / -10% |
| **Standard** ⭐ | $19.9 | $199 | 700 | 8400 | $0.028 | $0.024 | -10% / -23% |
| **Premium** | $39.9 | $399 | 1600 | 19200 | $0.025 | $0.021 | -19% / -32% |

**利润率**:
- Basic: 50% (月付) / 40% (年付)
- Standard: 42% (月付) / 30% (年付)
- Premium: 34% (月付) / 21% (年付)

**免费试用**: 10 积分 (一次性)

**详细方案**: 见 [PRICING_FINAL.md](PRICING_FINAL.md)

#### 3.2 更新 subscription_plans 表

**SQL 脚本**: `src/backend/sql/update_pricing.sql`

```sql
-- Basic 套餐
UPDATE subscription_plans SET price = 9.90, credit_per_interval = 300 WHERE id = 2;  -- 月付
UPDATE subscription_plans SET price = 99.00, credit_per_interval = 3600 WHERE id = 5; -- 年付

-- Standard 套餐
UPDATE subscription_plans SET price = 19.90, credit_per_interval = 700 WHERE id = 3;  -- 月付
UPDATE subscription_plans SET price = 199.00, credit_per_interval = 8400 WHERE id = 6; -- 年付

-- Premium 套餐
UPDATE subscription_plans SET price = 39.90, credit_per_interval = 1600 WHERE id = 4;  -- 月付
UPDATE subscription_plans SET price = 399.00, credit_per_interval = 19200 WHERE id = 8; -- 年付
```

#### 3.3 决策问题 (✅ 已确认)

- ✅ 积分按订阅周期重置 (月付按月,年付按年)
- ✅ 组图模式额外计费 (生成多少张扣多少积分)
- ✅ 生成失败积分退回
- ✅ 支付平台使用 Creem.io

---

### 阶段 4: Creem.io 订阅配置 💳 高优先级
**预计时间**: 3-4小时
**目标**: 集成 Creem.io 支付系统

> **注意**: 用户指定使用 **Creem.io** 作为支付平台,用户将提供文档。

**任务清单**:
- [ ] 等待用户提供 Creem.io 文档
- [ ] 注册 Creem.io 账号
- [ ] 创建产品 (Products):
  - [ ] Basic 月付 ($9.9 / 300 积分)
  - [ ] Basic 年付 ($99 / 3600 积分)
  - [ ] Standard 月付 ($19.9 / 700 积分)
  - [ ] Standard 年付 ($199 / 8400 积分)
  - [ ] Premium 月付 ($39.9 / 1600 积分)
  - [ ] Premium 年付 ($399 / 19200 积分)

- [ ] 获取 API 密钥并配置环境变量

#### 4.2 代码改造

**需要修改的文件**:
1. **替换 Stripe 相关代码**:
   ```
   src/app/api/webhook/stripe/route.ts → 改为 Creem.io
   src/backend/lib/stripe.ts (如存在) → 改为 Creem.io
   ```

2. **创建 Creem.io 集成**:
   ```
   src/backend/lib/creem.ts (新建)
   src/app/api/webhook/creem/route.ts (新建)
   src/app/api/checkout/route.ts (修改)
   ```

3. **更新前端订阅页面**:
   ```
   src/app/[locale]/(free)/pricing/page.tsx (修改)
   src/components/price/pricing-tiers.tsx (更新价格)
   ```

#### 4.3 Webhook 配置

**Creem.io Webhook 事件** (待用户提供文档):
- 订阅创建事件
- 订阅续费事件
- 订阅取消事件
- 一次性购买事件
- `subscription_cancelled` - 订阅取消

**处理逻辑** (同 Stripe):
1. 验证 Webhook 签名
2. 解析事件类型
3. 更新 `user_subscriptions` 表
4. 更新 `credit_usage` 表
5. 记录 `payment_history`

---

### 阶段 5: 国际化 (i18n) 🌍 高优先级
**预计时间**: 4-5小时
**目标**: 默认英文,支持中英文切换

#### 5.1 当前状态检查

**已有基础**:
- ✅ 使用 `next-intl` 库
- ✅ 路由结构: `/[locale]/...`
- ✅ 翻译文件: `messages/en.json`

#### 5.2 完善翻译文件

**任务清单**:
- [ ] 创建 `messages/en.json` (英文)
- [ ] 创建 `messages/zh.json` (中文)

**需要翻译的模块**:
```
├── common (通用)
│   ├── navigation (导航)
│   ├── buttons (按钮)
│   └── errors (错误信息)
├── home (首页)
├── generator (AI 生成器)
│   ├── models (模型选择)
│   ├── parameters (参数配置)
│   └── results (结果展示)
├── pricing (订阅价格)
├── auth (登录/注册)
└── footer (页脚)
```

#### 5.3 修改默认语言

**文件**: `src/i18n.ts` 或 `middleware.ts`

```typescript
// 修改默认语言为英文
export const defaultLocale = 'en';
export const locales = ['en', 'zh'] as const;
```

#### 5.4 添加语言切换器

**组件**: `src/components/LanguageSwitcher.tsx`

```tsx
// 在导航栏添加语言切换
<Select>
  <SelectItem value="en">English</SelectItem>
  <SelectItem value="zh">中文</SelectItem>
</Select>
```

#### 5.5 翻译优先级

**第一批翻译** (上线必需):
1. 首页文案
2. AI 生成器界面
3. 订阅价格页面
4. 错误提示信息

**第二批翻译** (可延后):
1. 帮助文档
2. 法律条款
3. FAQ

---

## 🚀 上线检查清单

完成以上所有阶段后,执行最终检查:

### 功能测试
- [ ] 注册新用户获得 5 免费积分
- [ ] 所有 AI 模型生成功能正常
- [ ] 积分扣除逻辑正确
- [ ] R2 图片存储正常
- [ ] 订阅购买流程完整
- [ ] Webhook 接收正常
- [ ] 英文/中文切换正常

### 性能检查
- [ ] 图片加载速度 < 2秒
- [ ] 页面首屏加载 < 3秒
- [ ] 无内存泄漏
- [ ] 移动端适配正常

### 安全检查
- [ ] 环境变量不泄露
- [ ] API 路由鉴权正确
- [ ] Webhook 签名验证
- [ ] SQL 注入防护
- [ ] XSS 防护

### SEO 优化
- [ ] 设置 meta 标签 (title, description)
- [ ] 添加 Open Graph 标签
- [ ] 生成 sitemap.xml
- [ ] 添加 robots.txt
- [ ] 配置 Google Analytics

### 部署准备
- [ ] 配置生产环境变量 (Vercel)
- [ ] 设置自定义域名
- [ ] 配置 SSL 证书
- [ ] 设置错误监控 (Sentry)

---

## 📅 预估时间表

| 阶段 | 任务 | 预计时间 | 负责人 |
|------|------|---------|--------|
| 1 | 清理技术债务 | 0.5小时 | Claude |
| 2 | 积分系统设计与检查 | 2-3小时 | Claude + 用户 |
| 3 | 订阅价格设计 | 2-3小时 | 用户决策 + Claude 实施 |
| 4 | Lemon Squeezy 配置 | 3-4小时 | Claude |
| 5 | 国际化 (i18n) | 4-5小时 | Claude |
| 测试 | 完整测试 | 2-3小时 | 用户 + Claude |
| 部署 | 上线发布 | 1-2小时 | Claude |
| **总计** | | **15-20小时** | |

**建议工作安排**:
- Day 1-2: 阶段 1-2 (清理 + 积分系统)
- Day 3-4: 阶段 3-4 (订阅价格 + 支付集成)
- Day 5-6: 阶段 5 (国际化)
- Day 7: 测试和部署

---

## 🎯 上线后优化计划 (V2)

上线后根据用户反馈,逐步添加:

1. **Webhook 支持** (减少轮询)
2. **历史记录页面** (查看生成历史)
3. **图片编辑功能** (裁剪、滤镜)
4. **批量生成** (一次生成多个提示词)
5. **API 接口** (供开发者使用)

---

## 📞 需要确认的问题

请确认以下问题,我才能开始执行:

### 关于支付平台:
❓ 你提到的 "creem.io" 具体是指哪个平台?
- [ ] Lemon Squeezy (lemonsqueezy.com)
- [ ] Paddle (paddle.com)
- [ ] 其他: _____________

### 关于订阅价格:
❓ 是否同意上面的定价方案?
- [ ] 同意
- [ ] 需要调整 (请说明)

### 关于积分规则:
❓ 组图模式是否额外计费?
- [ ] 是,按图片数额外收费
- [ ] 否,统一价格

❓ 积分是否永久有效?
- [ ] 是,永久有效
- [ ] 否,按月重置

---

**准备好开始了吗?告诉我从哪个阶段开始! 🚀**

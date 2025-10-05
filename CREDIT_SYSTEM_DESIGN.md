# 积分系统设计文档

**版本**: v2.0 (最终确认版)
**最后更新**: 2025-10-05
**状态**: ✅ 已确认,准备实施

---

## 📊 积分系统概述

### 核心概念

**积分 (Credits)** 是用户使用 AI 生成功能的虚拟货币:
- 用户通过订阅或购买获得积分
- 每次 AI 生成消耗相应积分
- 积分不足时无法生成
- 生成失败时积分退回

---

## 💰 积分定价规则 (极简方案)

### 统一积分规则 ✅

```
1 积分 = 1 张图 (任何模型,任何模式)
```

### AI 模型积分消耗表

| 模型 | 功能 | 单图积分 | 组图积分 | 示例 |
|------|------|---------|---------|------|
| **Seedream 4.0** | 文生图 | 1 积分 | 按张计费 | 5张图 = 5积分 |
| **Seedream 4.0** | 图生图 | 1 积分 | 按张计费 | 3张图 = 3积分 |
| **Nano Banana** | 文生图 | 1 积分 | 按张计费 | 1张图 = 1积分 |
| **Nano Banana** | 图生图 | 1 积分 | 按张计费 | 10张图 = 10积分 |

### 定价逻辑

**统一计费公式**:
```
总积分 = 生成图片数 × 1

示例:
- 生成 1 张: 1 积分
- 生成 5 张: 5 积分
- 生成 15 张: 15 积分
```

**优势**:
- ✅ 极简规则,用户易理解
- ✅ 不区分模型,简化计费
- ✅ 组图按张计费,灵活透明
- ✅ 后端实现简单,降低出错率

---

## 🔄 积分生命周期

### 1. 积分获取

#### 新用户注册
```
触发时机: 用户首次登录
赠送积分: 5 积分 (一次性)
有效期: 永久 (直到用完)
```

#### 订阅套餐 (梯度定价)
```
触发时机: 订阅成功/续费成功
积分数量:
  - Basic 月付: 300 积分/月
  - Basic 年付: 3600 积分/年 (月均 300)
  - Standard 月付: 700 积分/月
  - Standard 年付: 8400 积分/年 (月均 700)
  - Premium 月付: 1600 积分/月
  - Premium 年付: 19200 积分/年 (月均 1600)
有效期: 当前计费周期结束
重置规则: 按订阅周期重置 (月付按月,年付按年)
累积规则: 不累积,每周期重置为套餐额度
```

#### 一次性购买 (待定)
```
触发时机: 购买积分包
积分数量: TBD (待 Creem.io 集成后确定)
有效期: 永久 (直到用完)
叠加规则: 可与订阅积分叠加使用
```

### 2. 积分扣除

**扣除时机**: 生成任务提交成功后

**扣除流程**:
```
1. 用户提交生成请求
2. 后端计算所需积分 (生成图片数 × 1)
3. 检查用户剩余积分 (checkCreditUsageByUserId)
4. 积分充足 → 创建任务
5. 任务提交成功 → 扣除积分 (deductCredit)
6. 任务提交失败 → 不扣积分
```

**示例**:
```
用户选择生成 5 张图片:
  → 计算积分: 5 × 1 = 5 积分
  → 检查余额: 剩余 10 积分 ✅
  → 扣除积分: 10 - 5 = 5 积分
```

### 3. 积分退回

**退回场景**:
- 生成失败 (云雾 API 返回错误)
- 生成超时 (10分钟无响应)
- 系统错误

**退回逻辑** (待实现):
```sql
-- 退回积分
UPDATE credit_usage
SET used_count = used_count - {refund_amount}
WHERE user_id = {user_id}
  AND is_subscription_active = true;
```

---

## 🗄️ 数据库设计

### credit_usage 表结构

```sql
CREATE TABLE credit_usage (
  id SERIAL PRIMARY KEY,
  user_id text NOT NULL,                    -- 用户ID
  user_subscriptions_id integer NOT NULL,   -- 订阅ID
  used_count integer NOT NULL,              -- 已使用积分
  period_start timestamp with time zone NOT NULL,
  period_end timestamp with time zone NOT NULL,
  is_subscription_active boolean NOT NULL,
  period_remain_count integer NULL,         -- 剩余积分
  created_at timestamp with time zone NULL,
  updated_at timestamp with time zone NULL
);
```

### 关键字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `used_count` | 当前周期已使用积分 | 23 |
| `period_remain_count` | 当前周期剩余积分 | 77 |
| `period_start` | 周期开始时间 | 2025-10-01 00:00:00 |
| `period_end` | 周期结束时间 | 2025-10-31 23:59:59 |
| `is_subscription_active` | 订阅是否有效 | true |

---

## 🔧 核心服务函数

### 1. 检查积分余额

**文件**: `src/backend/service/credit_usage.ts`

```typescript
export async function checkCreditUsageByUserId(
  userId: string
): Promise<number> {
  // 返回值:
  // -1: 未初始化 (新用户)
  // -2: 无订阅或积分不足
  // -3: 订阅已过期
  // >=0: 剩余积分数
}
```

### 2. 扣除积分

```typescript
export async function deductCredit(
  userId: string,
  creditAmount: number
): Promise<boolean> {
  // 1. 查询当前剩余积分
  // 2. 检查是否足够
  // 3. 更新 used_count
  // 4. 更新 period_remain_count
  // 5. 返回成功/失败
}
```

### 3. 初始化新用户积分

```typescript
export async function initializeUserCredit(
  userId: string
): Promise<void> {
  // 1. 创建 credit_usage 记录
  // 2. 设置 used_count = 0
  // 3. 设置 period_remain_count = 5
  // 4. 设置 period_start = now
  // 5. 设置 period_end = 永久
}
```

---

## ⚠️ 当前问题和优化

### 已知问题

#### 问题 1: API 路由积分计算需要更新
**位置**: 所有 AI 生成 API 路由

**当前代码** (需要检查):
```typescript
// 可能仍使用旧的固定积分
const credit = 2; // Seedream 固定 2 积分
const credit = 1; // Nano Banana 固定 1 积分
```

**应该改为统一规则**:
```typescript
// 统一规则: 1 积分 = 1 图
const imageCount = max_images || 1;
const totalCredit = imageCount; // 简化为图片数即积分数
```

**需要检查的文件**:
- `/api/predictions/seedream-text-to-image`
- `/api/predictions/seedream-image-to-image`
- `/api/predictions/nanobanana-text-to-image`
- `/api/predictions/nanobanana-image-to-image`

#### 问题 2: 数据库 effect 表积分值需要更新
**影响**: effect 表中可能仍存储旧的积分值

**解决方案**:
执行 SQL 更新脚本 `src/backend/sql/update_pricing.sql`:
```sql
UPDATE effect SET credit = 1 WHERE id = 2; -- Seedream 4.0
UPDATE effect SET credit = 1 WHERE id = 3; -- Nano Banana
```

#### 问题 3: 生成失败时未退还积分
**影响**: 用户损失积分

**解决方案**:
```typescript
// 在 webhook 或轮询检测到失败时:
if (prediction.status === 'failed') {
  await refundCredit(userId, creditAmount);
}
```

#### 问题 4: 新用户积分初始化
**当前状态**: 已实现,用户首次登录自动获得 5 积分
**验证**: 确认 `src/backend/service/credit_usage.ts:14-25` 代码正常工作

---

## ✅ 待实现功能清单

### 高优先级 (上线前必做)
- [ ] 更新所有 API 路由积分计算逻辑 (改为 1 积分 = 1 图)
- [ ] 执行 SQL 更新 effect 表积分值
- [ ] 执行 SQL 更新 subscription_plans 表价格
- [ ] 实现生成失败积分退还
- [ ] 测试所有积分流程

### 中优先级 (上线后优化)
- [ ] 积分使用历史记录页面
- [ ] 积分到期提醒
- [ ] 订阅续费积分重置验证

### 低优先级 (V2 功能)
- [ ] 积分转赠功能
- [ ] 积分活动奖励
- [ ] VIP 用户额外折扣

---

## 📈 积分使用统计

### 需要追踪的指标

1. **用户维度**:
   - 平均每日消耗积分
   - 积分转化率 (免费用户 → 付费用户)
   - 积分不足频率

2. **模型维度**:
   - Seedream vs Nano Banana 使用比例
   - 组图模式使用频率
   - 平均每次生成图片数

3. **财务维度**:
   - 每积分成本 (API 费用 / 总积分消耗)
   - 每用户平均收入 (ARPU)
   - 订阅续费率

---

## 🧪 测试用例

### 测试场景 1: 新用户注册
```
1. 用户首次登录
2. 检查 credit_usage 表
3. 期望: period_remain_count = 5
```

### 测试场景 2: 生成单图 (Seedream)
```
1. 用户有 10 积分
2. 使用 Seedream 生成 1 张图
3. 期望: 剩余 9 积分 (10 - 1)
```

### 测试场景 3: 生成组图 (Seedream)
```
1. 用户有 20 积分
2. 使用 Seedream 生成 5 张图
3. 期望: 剩余 15 积分 (20 - 5)
```

### 测试场景 4: 生成单图 (Nano Banana)
```
1. 用户有 10 积分
2. 使用 Nano Banana 生成 1 张图
3. 期望: 剩余 9 积分 (10 - 1)
```

### 测试场景 5: 积分不足
```
1. 用户有 3 积分
2. 尝试生成 5 张图
3. 期望: 返回错误 "积分不足,需要 5 积分,当前剩余 3 积分"
```

### 测试场景 6: 生成失败退款
```
1. 用户有 10 积分
2. 生成任务提交成功 (扣除 5 积分,剩余 5)
3. 生成任务失败
4. 期望: 积分退回,剩余恢复为 10
```

### 测试场景 7: 订阅积分重置
```
1. 用户订阅 Standard 月付 (700 积分)
2. 使用 300 积分 (剩余 400)
3. 下月 1 号自动续费
4. 期望: 积分重置为 700,不累积
```

---

## 📝 下一步操作

1. ✅ 完成本文档更新
2. ⏳ 检查所有 API 路由积分计算逻辑
3. ⏳ 执行 SQL 更新数据库 (effect 表和 subscription_plans 表)
4. ⏳ 实现积分退款机制
5. ⏳ 测试所有场景
6. ⏳ 部署到生产环境

---

**文档维护者**: Claude
**最后更新**: 2025-10-05
**审核状态**: ✅ 已更新为最终方案

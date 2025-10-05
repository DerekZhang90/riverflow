# R2 配置检查清单

按照此清单逐项完成配置,确保 R2 存储正常工作。

---

## ✅ 配置前准备

- [ ] 我已注册 Cloudflare 账号
- [ ] 我已登录 Cloudflare Dashboard (https://dash.cloudflare.com/)
- [ ] 我知道如何使用终端/命令行工具

---

## ✅ Cloudflare R2 设置

### 步骤 1: 创建存储桶
- [ ] 进入 R2 Object Storage 页面
- [ ] 点击 "Create bucket"
- [ ] 输入存储桶名称(例如: `ai-image-generator`)
- [ ] 选择区域(推荐: APAC 亚太区)
- [ ] 成功创建存储桶

**我的存储桶名称**: ___________________________

### 步骤 2: 开启公共访问
- [ ] 进入存储桶的 Settings 标签
- [ ] 找到 "Public Access" 部分
- [ ] 点击 "Allow Access" 或 "Connect Domain"
- [ ] 看到自动生成的 R2.dev 域名

**我的 R2 公共域名**: https://pub-________________.r2.dev

### 步骤 3: 创建 API Token
- [ ] 返回 R2 主页,点击 "Manage R2 API Tokens"
- [ ] 点击 "Create API token"
- [ ] 输入 Token 名称(例如: `ai-generator-token`)
- [ ] 权限选择: **Object Read & Write**
- [ ] 应用范围: 选择刚创建的存储桶
- [ ] 点击创建并**立即复制保存**以下信息:

**Access Key ID**: ___________________________
**Secret Access Key**: ___________________________

### 步骤 4: 获取 Account ID
- [ ] 在浏览器地址栏查看 URL
- [ ] 或在 R2 页面右侧查看 Account ID
- [ ] 复制 Account ID

**Account ID**: ___________________________

---

## ✅ 项目环境变量配置

### 步骤 5: 编辑 .env 文件
- [ ] 打开项目根目录的 `.env` 文件
- [ ] 找到 `## R2` 配置部分
- [ ] 填写以下信息:

```env
R2_BUCKET_NAME="你的存储桶名称"
R2_ACCESS_KEY_ID="你的Access Key ID"
R2_SECRET_ACCESS_KEY="你的Secret Access Key"
R2_ENDPOINT="https://pub-xxxxxx.r2.dev"
R2_ACCOUNT_ID="你的Account ID"
```

- [ ] **保存文件** (Ctrl+S 或 Cmd+S)
- [ ] **关闭编辑器**(确保保存生效)

---

## ✅ 代码配置检查

### 步骤 6: 检查 Next.js 配置
- [ ] 打开 `next.config.mjs` 文件
- [ ] 确认包含 R2 域名配置:

```javascript
{
  protocol: "https",
  hostname: "**.r2.dev",
  pathname: "/**",
}
```

✅ 此步骤已完成,无需修改

---

## ✅ 启动和测试

### 步骤 7: 重启开发服务器
- [ ] 在终端中按 `Ctrl + C` 停止当前服务器
- [ ] 运行 `npm run dev` 重新启动
- [ ] 等待编译完成
- [ ] 访问 http://localhost:3000 确认网站正常运行

### 步骤 8: 测试单图生成
- [ ] 登录你的账号
- [ ] 选择 **Nano Banana** 模型(速度快,适合测试)
- [ ] 输入简单提示词,例如: `a red apple`
- [ ] 点击生成
- [ ] 等待图片生成完成

**检查终端日志**:
```
应该看到以下日志:
✅ Uploading image to R2: https://...
✅ Image uploaded successfully, new URL: https://pub-xxx.r2.dev/...
✅ Effect result updated in database
```

- [ ] 图片正常显示
- [ ] 右键查看图片属性,URL 是 `https://pub-xxx.r2.dev/...` 开头

### 步骤 9: 测试多图生成
- [ ] 选择 **Seedream 4.0** 模型
- [ ] 将 **Sequential Generation** 改为 **auto**
- [ ] 设置 **Max Images** 为 `2`(先测试少量)
- [ ] 输入提示词: `beautiful landscape`
- [ ] 点击生成

**检查终端日志**:
```
应该看到以下日志:
✅ Uploading 2 images to R2
✅ Successfully uploaded 2 images to R2
✅ Effect result updated in database with URL: ["https://...","https://..."]
```

- [ ] 所有图片都正常显示
- [ ] 显示为网格布局
- [ ] 每张图片都有编号(#1, #2)

### 步骤 10: 验证 R2 存储桶
- [ ] 返回 Cloudflare R2 Dashboard
- [ ] 进入你的存储桶
- [ ] 点击浏览文件
- [ ] 能看到 `ssat/images/` 文件夹
- [ ] 文件夹内有刚才生成的图片文件

---

## ✅ 数据库验证(可选)

### 步骤 11: 检查数据库记录
连接数据库:

```bash
psql -U postgres.ycttmsitjguwrtsgcxwe -h aws-1-us-west-1.pooler.supabase.com -p 6543 -d postgres
```

输入密码: `Maodan1990`

执行查询:

```sql
SELECT id, original_id, url, status, created_at
FROM effect_result
ORDER BY created_at DESC
LIMIT 3;
```

- [ ] 能看到最新的生成记录
- [ ] `url` 字段包含 R2 链接
- [ ] 单图是字符串格式
- [ ] 多图是 JSON 数组格式

---

## ❌ 问题排查

### 如果图片上传失败:

#### 问题 A: 日志显示 "403 Forbidden"
**原因**: API Token 权限不足

**解决方法**:
1. 返回 Cloudflare R2 → Manage R2 API Tokens
2. 删除旧 Token
3. 重新创建,确保选择 **"Object Read & Write"** 权限
4. 更新 `.env` 文件中的密钥
5. 重启服务器: `Ctrl+C` 然后 `npm run dev`

#### 问题 B: 日志显示 "NoSuchBucket"
**原因**: 存储桶名称错误

**解决方法**:
1. 检查 `.env` 中的 `R2_BUCKET_NAME` 是否与 R2 Dashboard 完全一致
2. 注意区分大小写
3. 不要有多余空格

#### 问题 C: 图片显示不出来
**原因**: 公共访问未开启

**解决方法**:
1. 进入 R2 存储桶 → Settings
2. 确认 Public Access 已启用
3. 检查 `R2_ENDPOINT` 是否正确(必须是公共域名)

#### 问题 D: 没有任何上传日志
**原因**: 环境变量未生效

**解决方法**:
1. 确认 `.env` 文件已保存
2. 必须**重启服务器**才能加载新环境变量
3. 检查 `.env` 文件格式(不要有多余引号或空格)

---

## 📞 获取帮助

如果以上步骤都无法解决问题,请提供以下信息:

1. **终端完整日志**(从开始生成到结束)
2. **浏览器控制台错误**(F12 → Console 标签)
3. **你的 `.env` R2 配置**(隐藏密钥的中间部分)
4. **R2 存储桶截图**(Settings 页面)

---

## 🎉 配置完成!

全部打勾后,恭喜你完成了 R2 存储配置!

现在你的应用已经具备:
- ✅ 永久存储用户生成的图片
- ✅ 支持单图和多图(最多15张)
- ✅ 自动上传到 Cloudflare R2
- ✅ 数据库记录 R2 永久链接
- ✅ 免费额度每月 10GB 存储

下一步可以:
- 开发历史记录功能(展示用户的所有生成结果)
- 配置 Webhook(异步处理,提升性能)
- 添加图片下载功能
- 实现图片分享功能

祝使用愉快! 🚀

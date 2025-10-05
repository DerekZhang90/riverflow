# Cloudflare R2 存储配置指南

本指南将帮助你完成 R2 存储的完整配置,实现图片永久存储。

---

## 第一步: 创建 Cloudflare R2 存储桶

### 1.1 登录 Cloudflare Dashboard
1. 访问 https://dash.cloudflare.com/
2. 使用你的 Cloudflare 账号登录(如果没有账号,先注册一个)

### 1.2 进入 R2 管理页面
1. 在左侧菜单找到 **R2 Object Storage**
2. 点击进入 R2 管理页面
3. 如果是第一次使用,需要点击 "Purchase R2" 或 "Start using R2"(免费额度: 每月10GB存储 + 1000万次A类操作)

### 1.3 创建存储桶(Bucket)
1. 点击 **"Create bucket"** 按钮
2. 填写以下信息:
   - **Bucket name**: 输入一个名称,例如 `ai-image-generator`(全小写,可以用连字符)
   - **Location**: 选择离你用户最近的区域,例如:
     - `APAC` - 亚太地区(适合中国/亚洲用户)
     - `WNAM` - 北美西部
     - `ENAM` - 北美东部
3. 点击 **"Create bucket"** 完成创建
4. 记录下你的 **Bucket Name**,例如: `ai-image-generator`

### 1.4 配置公共访问(重要!)
1. 进入刚创建的存储桶
2. 点击 **"Settings"** 标签
3. 找到 **"Public Access"** 部分
4. 点击 **"Connect Domain"** 或 **"Allow Access"**
5. 你会看到一个自动生成的公共URL,格式类似:
   ```
   https://pub-xxxxxxxxxxxxxx.r2.dev
   ```
6. **记录这个 URL**,这就是你的 `R2_ENDPOINT`

> 💡 如果你有自己的域名,也可以绑定自定义域名,但使用默认的 `.r2.dev` 域名即可

---

## 第二步: 获取 R2 API 凭证

### 2.1 创建 API Token
1. 返回 R2 主页面
2. 点击右上角的 **"Manage R2 API Tokens"**
3. 点击 **"Create API token"** 按钮

### 2.2 配置 Token 权限
1. **Token name**: 输入名称,例如 `ai-generator-api-token`
2. **Permissions**: 选择 **"Object Read & Write"**(读写权限)
3. **TTL**: 选择 **"Forever"**(永久有效)
4. **Specify bucket(s)**: 选择 **"Apply to specific buckets only"**
5. 勾选你刚才创建的存储桶(例如 `ai-image-generator`)
6. 点击 **"Create API Token"**

### 2.3 保存凭证信息
创建成功后,会显示以下信息(只显示一次,务必保存!):

```
Access Key ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Secret Access Key: yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

**记录以下信息**:
- ✅ **Access Key ID** → 这是 `R2_ACCESS_KEY_ID`
- ✅ **Secret Access Key** → 这是 `R2_SECRET_ACCESS_KEY`

### 2.4 获取 Account ID
1. 在 Cloudflare Dashboard 页面,查看浏览器地址栏
2. URL 格式: `https://dash.cloudflare.com/{ACCOUNT_ID}/r2/...`
3. 或者在 R2 页面右侧找到 **"Account ID"**
4. **记录这个 Account ID** → 这是 `R2_ACCOUNT_ID`

---

## 第三步: 配置环境变量

### 3.1 编辑 `.env` 文件
打开项目根目录的 `.env` 文件,找到 R2 配置部分:

```env
## R2
R2_BUCKET_NAME=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_TOKEN=""
R2_ENDPOINT=""
R2_ACCOUNT_ID=""
```

### 3.2 填写配置信息
将刚才记录的信息填入(请替换成你自己的真实值):

```env
## R2
R2_BUCKET_NAME="ai-image-generator"
R2_ACCESS_KEY_ID="你的Access Key ID"
R2_SECRET_ACCESS_KEY="你的Secret Access Key"
R2_TOKEN=""
R2_ENDPOINT="https://pub-xxxxxxxxxxxxxx.r2.dev"
R2_ACCOUNT_ID="你的Account ID"
```

> ⚠️ **注意**:
> - `R2_TOKEN` 可以留空,不需要填写
> - 确保 `R2_ENDPOINT` 是以 `https://` 开头的完整URL
> - 不要在引号内添加多余的空格

### 3.3 保存文件
保存 `.env` 文件后,环境变量配置完成!

---

## 第四步: 数据库确认

### 4.1 检查数据库表结构
你的数据库 `effect_result` 表已经包含了存储URL的字段,无需修改:

```sql
url text NULL  -- 存储 R2 永久链接(单图URL或JSON数组)
```

### 4.2 数据存储格式说明
- **单张图片**: 直接存储 R2 URL 字符串
  ```
  https://pub-xxx.r2.dev/ssat/images/abc123-1.jpg
  ```

- **多张图片**: 存储 JSON 数组字符串
  ```json
  ["https://pub-xxx.r2.dev/ssat/images/abc123-1.jpg","https://pub-xxx.r2.dev/ssat/images/abc123-2.jpg"]
  ```

**不需要修改数据库结构**,现有的 `url text` 字段可以存储任意长度的文本。

---

## 第五步: 重启开发服务器

### 5.1 停止当前服务
如果你的开发服务器正在运行,按 `Ctrl + C` 停止

### 5.2 重新启动
```bash
npm run dev
```

这样新的环境变量才会生效!

---

## 第六步: 测试 R2 上传功能

### 6.1 测试单图上传
1. 访问 http://localhost:3000
2. 登录你的账号
3. 选择 **Seedream 4.0** 或 **Nano Banana** 模型
4. 输入提示词,例如: `a beautiful sunset over mountains`
5. 点击生成

### 6.2 查看后端日志
在终端中查看日志,应该能看到:

```
Uploading image to R2: https://...yunwu.ai/...
Image uploaded successfully, new URL: https://pub-xxx.r2.dev/ssat/images/...
Effect result updated in database with URL: https://pub-xxx.r2.dev/...
```

### 6.3 测试多图上传(组图模式)
1. 选择 **Seedream 4.0** 模型
2. 将 **Sequential Generation** 设置为 **auto**
3. 设置 **Max Images** 为 `3`(测试用少量图片)
4. 输入提示词并生成

### 6.4 查看多图上传日志
应该看到:

```
Uploading 3 images to R2
Successfully uploaded 3 images to R2
Effect result updated in database with URL: ["https://...","https://...","https://..."]
```

### 6.5 验证 R2 存储桶
1. 返回 Cloudflare R2 Dashboard
2. 进入你的存储桶
3. 应该能看到 `ssat/images/` 文件夹下有新上传的图片文件

---

## 第七步: 验证完整流程

### 7.1 检查前端显示
- 生成的图片应该正常显示
- 右键查看图片属性,URL应该是 `https://pub-xxx.r2.dev/...` 开头
- 多图应该以网格形式显示

### 7.2 检查数据库
连接到你的 Supabase 数据库:

```bash
psql -U postgres.ycttmsitjguwrtsgcxwe -h aws-1-us-west-1.pooler.supabase.com -p 6543 -d postgres
```

查询最新的生成记录:

```sql
SELECT id, url, status, created_at
FROM effect_result
ORDER BY created_at DESC
LIMIT 5;
```

应该看到 `url` 字段包含 R2 链接。

---

## 常见问题排查

### ❌ 问题1: 图片显示不出来
**原因**: R2 存储桶未开启公共访问

**解决**:
1. 进入 R2 存储桶 Settings
2. 确认 Public Access 已开启
3. 检查 `R2_ENDPOINT` 是否正确

### ❌ 问题2: 上传失败,日志显示 403 错误
**原因**: API Token 权限不足

**解决**:
1. 返回 R2 API Tokens 页面
2. 删除旧 Token
3. 重新创建,确保选择 "Object Read & Write" 权限
4. 更新 `.env` 中的密钥
5. 重启服务器

### ❌ 问题3: 上传失败,日志显示 "bucket not found"
**原因**: Bucket Name 错误

**解决**:
1. 检查 `.env` 中的 `R2_BUCKET_NAME` 是否与 R2 Dashboard 中的名称完全一致
2. 注意大小写敏感
3. 不要包含多余的空格或引号

### ❌ 问题4: Next.js 图片域名错误
**原因**: `next.config.mjs` 未配置 R2 域名

**解决**:
打开 `next.config.mjs`,在 `remotePatterns` 中添加:

```javascript
{
  protocol: "https",
  hostname: "pub-*.r2.dev",
  pathname: "/**",
}
```

或者添加你的具体域名:

```javascript
{
  protocol: "https",
  hostname: "pub-xxxxxxxxxxxxxx.r2.dev",
}
```

---

## 成本估算

Cloudflare R2 免费额度(每月):
- ✅ **存储**: 10 GB(约10,000张高清图片)
- ✅ **Class A 操作**(上传): 100万次
- ✅ **Class B 操作**(下载): 1000万次
- ✅ **流量**: 免费(无出站费用!)

对于个人项目或小型应用,**免费额度完全够用**!

---

## 下一步

配置完成后,你可以:

1. ✅ 测试图片生成和存储
2. ✅ 验证 R2 永久链接
3. ✅ 继续开发历史记录功能
4. ✅ 配置 Webhook(可选,用于生产环境)

如果遇到任何问题,请检查:
- 终端日志输出
- 浏览器控制台错误
- R2 Dashboard 中的文件列表

祝配置顺利! 🎉

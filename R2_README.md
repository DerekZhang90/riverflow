# R2 存储配置 - 快速开始

## 📋 概览

本项目已实现 **Cloudflare R2 永久存储** 功能,用于保存用户生成的AI图片。

- ✅ 代码已完成,无需修改
- ⚠️ 需要配置环境变量
- 📖 完整指南见下方文档

---

## 🚀 快速配置(5分钟)

### 步骤 1: 创建 R2 存储桶

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **R2 Object Storage**
3. 点击 **Create bucket**
4. 输入名称(如 `ai-image-generator`),选择区域(推荐 APAC)
5. 创建后进入 **Settings** → 开启 **Public Access**
6. 记录公共URL: `https://pub-xxxxx.r2.dev`

### 步骤 2: 获取 API 凭证

1. 点击 **Manage R2 API Tokens**
2. 创建新 Token,权限选择 **Object Read & Write**
3. 应用到刚创建的存储桶
4. **立即保存**显示的密钥(只显示一次!)

### 步骤 3: 配置 .env

打开 `.env` 文件,填写 R2 配置:

```env
R2_BUCKET_NAME="ai-image-generator"
R2_ACCESS_KEY_ID="你的Access Key ID"
R2_SECRET_ACCESS_KEY="你的Secret Access Key"
R2_ENDPOINT="https://pub-xxxxx.r2.dev"
R2_ACCOUNT_ID="你的Account ID"
```

### 步骤 4: 重启服务器

```bash
# 停止当前服务 (Ctrl+C)
npm run dev
```

---

## 📚 详细文档

| 文档 | 用途 |
|------|------|
| **[R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md)** | 完整配置指南(带截图说明) |
| **[R2_CHECKLIST.md](R2_CHECKLIST.md)** | 配置检查清单(逐项确认) |
| **[CLAUDE.md](CLAUDE.md)** | 技术架构文档 |
| **[NEXT_STEPS.md](NEXT_STEPS.md)** | 开发路线图 |

---

## ✅ 配置验证

### 测试单图生成

1. 访问 http://localhost:3000
2. 登录账号
3. 选择 **Nano Banana** 模型
4. 输入提示词: `a red apple`
5. 生成并查看日志:

```bash
✅ Uploading image to R2: https://...
✅ Image uploaded successfully, new URL: https://pub-xxx.r2.dev/...
```

### 测试多图生成

1. 选择 **Seedream 4.0** 模型
2. 设置 **Sequential Generation** = `auto`
3. 设置 **Max Images** = `3`
4. 输入提示词并生成
5. 查看日志:

```bash
✅ Uploading 3 images to R2
✅ Successfully uploaded 3 images to R2
```

---

## 🔧 故障排查

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 403 Forbidden | API权限不足 | 重新创建Token,选择 Read & Write 权限 |
| NoSuchBucket | 存储桶名错误 | 检查 `R2_BUCKET_NAME` 是否一致 |
| 图片不显示 | 未开启公共访问 | 在存储桶 Settings 开启 Public Access |
| 无上传日志 | 环境变量未生效 | 保存 .env 后必须重启服务器 |

---

## 💰 成本说明

Cloudflare R2 **免费额度**(每月):

- 📦 存储: 10 GB (约 10,000 张高清图片)
- ⬆️ 上传: 100万次
- ⬇️ 下载: 1000万次
- 🌐 流量: **完全免费**(无出站费用)

**个人项目和小型应用免费额度完全够用!**

---

## 📊 数据存储格式

### 数据库 `effect_result` 表

| 场景 | `url` 字段存储格式 |
|------|-------------------|
| 单张图片 | `https://pub-xxx.r2.dev/ssat/images/abc123-1.jpg` |
| 多张图片 | `["https://...jpg","https://...jpg"]` (JSON数组) |

### R2 存储桶文件结构

```
ai-image-generator/
└── ssat/
    └── images/
        ├── taskid1-1.jpg
        ├── taskid1-2.jpg
        ├── taskid1-3.jpg
        └── taskid2-1.jpg
```

---

## 🎯 技术亮点

### 已实现功能

- ✅ 单图/多图自动识别
- ✅ 并行批量上传(最多15张)
- ✅ 自动重试机制
- ✅ 前端智能解析(支持字符串和JSON数组)
- ✅ 永久链接存储(不受Yunwu临时URL限制)

### 核心代码位置

| 功能 | 文件路径 |
|------|---------|
| R2上传工具 | [src/backend/lib/r2.ts](src/backend/lib/r2.ts) |
| 业务逻辑 | [src/backend/service/effect_result.ts](src/backend/service/effect_result.ts) |
| API接口 | [src/app/api/effect_result/update/route.ts](src/app/api/effect_result/update/route.ts) |
| 前端轮询 | [src/components/replicate/text-to-image/worker.tsx](src/components/replicate/text-to-image/worker.tsx) |
| 多图显示 | [src/components/replicate/text-to-image/img-output.tsx](src/components/replicate/text-to-image/img-output.tsx) |

---

## 📞 需要帮助?

如果遇到问题,请提供:

1. 终端完整日志
2. 浏览器控制台错误 (F12 → Console)
3. `.env` R2配置(隐藏密钥中间部分)
4. R2存储桶截图

---

## 🎉 下一步开发

配置完成后,可以继续开发:

- [ ] 历史记录页面(展示用户所有生成结果)
- [ ] 图片分享功能
- [ ] 批量下载优化
- [ ] Webhook异步处理(提升性能)

---

**祝配置顺利!** 🚀

如有问题,请查阅详细文档或联系支持。

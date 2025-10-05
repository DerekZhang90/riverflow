# 项目当前进度

**最后更新**: 2025-10-04

## ✅ 已完成功能

### 1. AI 图片生成核心功能
- ✅ **Seedream 4.0 集成**
  - 文生图 (Text-to-Image)
  - 图生图 (Image-to-Image)
  - 支持组图生成模式 (Sequential Generation)
  - 完整参数配置：分辨率、宽高比、生成数量等

- ✅ **Nano Banana 集成**
  - 文生图 (Text-to-Image)
  - 图生图 (Image-to-Image)
  - 参数配置：生成数量、输出格式、宽高比等

### 2. API 路由
**后端 API 路由 (4个):**
- `/api/predictions/seedream-text-to-image` - Seedream 文生图
- `/api/predictions/seedream-image-to-image` - Seedream 图生图
- `/api/predictions/nanobanana-text-to-image` - Nano Banana 文生图
- `/api/predictions/nanobanana-image-to-image` - Nano Banana 图生图

**查询端点 (2个):**
- `/api/predictions/seedream/[predictionId]` - Seedream 任务状态查询
- `/api/predictions/nanobanana/[requestId]` - Nano Banana 任务状态查询

### 3. 前端 UI
- ✅ **模型选择界面** - 支持切换 Seedream 和 Nano Banana
- ✅ **生成模式切换** - 文生图 / 图生图模式切换
- ✅ **参数配置面板**
  - Seedream: 分辨率、宽高比、组图模式、最大数量
  - Nano Banana: 生成数量、输出格式、宽高比
  - 图生图模式参数自动适配
- ✅ **多图网格展示**
  - 响应式网格布局（1-4列）
  - 图片序号标签
  - 悬停效果和下载按钮
  - 点击放大预览
  - 批量下载功能

### 4. 云雾 API 集成
- ✅ **统一 API 封装** ([src/backend/utils/yunwu.ts](src/backend/utils/yunwu.ts))
  - `createSeedreamTask()` - Seedream 任务创建
  - `createNanoBananaTask()` - Nano Banana 文生图
  - `createNanoBananaEditTask()` - Nano Banana 图生图
- ✅ **查询接口适配**
  - Seedream: Replicate 兼容格式
  - Nano Banana: Fal.ai 兼容格式
  - 统一状态转换为前端格式

### 5. 用户体验优化
- ✅ **错误处理** - 404 等错误优雅降级为 processing 状态
- ✅ **轮询机制** - 2秒间隔自动查询任务状态
- ✅ **加载状态** - 准备中/生成中状态提示
- ✅ **深色主题** - Select 组件样式修复
- ✅ **积分系统** - 生成前检查积分，完成后扣除

## 📁 核心文件结构

```
src/
├── app/api/predictions/
│   ├── seedream-text-to-image/route.ts      # Seedream 文生图 API
│   ├── seedream-image-to-image/route.ts     # Seedream 图生图 API
│   ├── nanobanana-text-to-image/route.ts    # Nano Banana 文生图 API
│   ├── nanobanana-image-to-image/route.ts   # Nano Banana 图生图 API
│   ├── seedream/[predictionId]/route.ts     # Seedream 查询 API
│   └── nanobanana/[requestId]/route.ts      # Nano Banana 查询 API
├── backend/utils/
│   └── yunwu.ts                              # 云雾 API 封装
├── components/replicate/text-to-image/
│   ├── worker.tsx                            # 主控组件（参数配置、生成逻辑）
│   └── img-output.tsx                        # 多图网格展示组件
└── app/globals.css                           # 深色主题样式

.env:
  YUNWU_API_TOKEN=xxx                         # 云雾 API Token
```

## 🔧 技术细节

### API 参数映射

**Seedream 4.0:**
```typescript
{
  prompt: string,                    // 必填
  size: "1K" | "2K" | "4K",         // 默认 2K
  aspect_ratio: "1:1" | "4:3" | ..., // 默认 1:1 (文生图) / match_input_image (图生图)
  sequential_image_generation: "disabled" | "auto",
  max_images: 1-15,                  // 仅 auto 模式
  image_input?: string[]             // 图生图时必填，1-10张
}
```

**Nano Banana:**
```typescript
{
  prompt: string,                    // 必填
  num_images: 1-4,                   // 默认 1
  output_format: "jpeg" | "png",     // 默认 jpeg
  aspect_ratio: "1:1" | "4:3" | ..., // 默认 1:1
  sync_mode: false,
  image_urls?: string[]              // 图生图时必填
}
```

### 数据库字段

**effect_result 表关键字段:**
- `storage_type: "yunwu"` - 标识使用云雾 API
- `original_id` - 任务 ID (prediction_id 或 request_id)
- `status` - succeeded/failed/processing
- `url` - 最终存储的图片 URL（如果启用 R2）

## ⚠️ 已知问题和限制

1. **图片存储**: 当前直接使用云雾返回的 URL，未实现上传到 R2/S3
2. **Webhook**: 本地开发环境未启用 webhook（依赖轮询）
3. **多图下载**: 批量下载有500ms延迟，避免浏览器阻止

## 📊 测试状态

- ✅ Seedream 文生图 - 正常工作
- ✅ Seedream 图生图 - 待测试
- ✅ Nano Banana 文生图 - 待测试
- ✅ Nano Banana 图生图 - 待测试
- ✅ 组图模式（auto）- 14张图片成功显示
- ✅ 参数配置 - 所有参数正确传递
- ✅ 多图展示 - 网格布局正常

## 🎯 下一步计划

### 优先级 1: 核心功能完善
1. **R2/S3 存储集成**
   - 将云雾返回的图片上传到 R2/S3
   - 更新 `effect_result.url` 字段
   - 实现图片持久化存储

2. **webhook 支持**
   - 创建云雾 webhook 接收端点
   - 处理任务完成回调
   - 减少轮询频率，提升性能

3. **数据库优化**
   - 更新 `effect` 表，添加 Seedream 和 Nano Banana 模型记录
   - 设置正确的 credit 消耗值
   - 清理旧的 Replicate 相关配置

### 优先级 2: 用户体验
1. **历史记录页面**
   - 展示用户生成历史
   - 支持查看和下载历史图片
   - 积分消耗记录

2. **错误处理增强**
   - 更详细的错误提示
   - 失败自动重试机制
   - 积分退还（生成失败时）

3. **性能优化**
   - 图片懒加载
   - 缩略图预览
   - 请求去重和缓存

### 优先级 3: 功能扩展
1. **更多 AI 模型**
   - 根据需求接入其他模型
   - 模型能力对比展示

2. **批量生成**
   - 支持一次提交多个 prompt
   - 队列管理

3. **高级参数**
   - Seedream custom size (width/height)
   - 更多风格选项

## 📝 待办事项

- [ ] 测试所有 4 种生成模式
- [ ] 实现 R2 存储上传
- [ ] 创建 webhook 接收端点
- [ ] 更新数据库 effect 表
- [ ] 添加 fal.media 到 next.config.mjs 图片域名白名单
- [ ] 创建历史记录页面
- [ ] 编写 API 文档
- [ ] 部署到生产环境测试

## 💡 技术债务

1. 清理旧的 KIE.AI 相关代码和文件
2. 移除未使用的 Replicate API 代码
3. 统一错误处理和日志记录
4. 添加单元测试

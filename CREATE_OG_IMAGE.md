# 快速创建 Open Graph 图片指南

## 🎨 什么是 OG 图片？

Open Graph 图片是在社交媒体（Facebook、Twitter、LinkedIn 等）分享网站链接时显示的预览图。

**示例**：
```
当有人分享 https://riverflow.art 时：
┌─────────────────────────────────┐
│  [图片 1200x630px]              │
│  RiverFlow.art                  │
│  Professional AI Image Generator│
└─────────────────────────────────┘
```

---

## 🚀 方法 1：使用 Canva（推荐，5 分钟）

### 步骤：

1. **访问 Canva**
   - URL: https://www.canva.com/
   - 免费账号即可

2. **创建自定义尺寸**
   - 点击"创建设计"
   - 选择"自定义尺寸"
   - 输入：宽度 1200px，高度 630px
   - 点击"创建新设计"

3. **设计内容**

   **背景**：
   - 选择深色背景：#0a0a0a（黑色）
   - 或使用渐变：从 #0a0a0a 到 #1a1a3a

   **添加元素**：
   ```
   [大标题] RiverFlow.art
   字体：Bold, 80-100px
   颜色：白色 #FFFFFF

   [副标题] Professional AI Image Generator
   字体：Regular, 40px
   颜色：灰色 #9CA3AF

   [装饰] 添加蓝色/紫色渐变圆形
   位置：右上角和左下角，模糊效果
   ```

4. **下载**
   - 点击右上角"分享"
   - 选择"下载"
   - 格式：JPG（推荐）或 PNG
   - 质量：高质量

5. **重命名和保存**
   ```bash
   下载后重命名为：og-image.jpg
   复制一份命名为：og-image-riverflow.jpg

   移动到项目文件夹：
   mv ~/Downloads/og-image.jpg /Users/shaopuzhang/projects/AI-Image-and-Video-Generator-Minimalist-Template/public/
   mv ~/Downloads/og-image-riverflow.jpg /Users/shaopuzhang/projects/AI-Image-and-Video-Generator-Minimalist-Template/public/
   ```

---

## 🎯 方法 2：使用 Figma（专业，10 分钟）

### 步骤：

1. **打开 Figma**
   - URL: https://www.figma.com/
   - 免费账号

2. **创建画布**
   - Frame：1200x630px

3. **设计参考**
   ```
   背景：
   - Fill: Linear gradient
   - From: #0a0a0a (top-left)
   - To: #1e1e3f (bottom-right)

   主标题：
   - Text: "RiverFlow.art"
   - Font: Inter Bold, 96px
   - Color: #FFFFFF

   副标题：
   - Text: "Next-Generation AI Image Generator"
   - Font: Inter Regular, 48px
   - Color: #94A3B8

   装饰元素：
   - 2-3 个模糊圆形
   - Colors: #3B82F6, #8B5CF6
   - Blur: 150px
   ```

4. **导出**
   - 选中 Frame
   - 右侧面板 → Export
   - Format: JPG, 2x
   - Export

---

## ⚡ 方法 3：使用 AI 生成（最快，2 分钟）

### 使用 Midjourney/DALL-E

**提示词**：
```
Create a professional open graph image for an AI image generator website called "RiverFlow.art".
Dark background (#0a0a0a), modern minimalist design,
blue and purple gradient accents,
text "RiverFlow.art" in large white bold font,
subtitle "Professional AI Image Generator" in gray,
1200x630 pixels, high quality
```

**或使用你自己的 RiverFlow 工具**：
```
# 在 /text-to-image 页面使用 Seedream 4.0

Prompt: "Open graph social media preview image,
dark modern tech background,
blue purple gradient,
professional AI branding,
minimalist design, 1200x630 aspect ratio"

Aspect Ratio: 16:9
```

---

## 🔧 方法 4：临时使用 Logo（应急，30 秒）

如果暂时没有时间设计，先用现有 logo：

```bash
cd /Users/shaopuzhang/projects/AI-Image-and-Video-Generator-Minimalist-Template

# 复制 logo 作为临时 OG 图片
cp public/logo.jpeg public/og-image.jpg
cp public/logo.jpeg public/og-image-riverflow.jpg
```

**注意**：这只是临时方案，建议尽快替换为正式设计的图片。

---

## ✅ 验证图片

### 1. 检查文件存在
```bash
ls -lh /Users/shaopuzhang/projects/AI-Image-and-Video-Generator-Minimalist-Template/public/og-image*.jpg

# 应该看到：
# og-image.jpg
# og-image-riverflow.jpg
```

### 2. 检查尺寸
```bash
# macOS
file public/og-image.jpg

# 或使用在线工具
# 上传到 https://www.iloveimg.com/resize-image
# 确认：1200x630px
```

### 3. 测试社交媒体预览

**Facebook Sharing Debugger**：
```
URL: https://developers.facebook.com/tools/debug/
输入: https://riverflow.art
点击: Debug

检查 og:image 是否正确显示
```

**Twitter Card Validator**：
```
URL: https://cards-dev.twitter.com/validator
输入: https://riverflow.art

检查预览图是否正确
```

**LinkedIn Post Inspector**：
```
URL: https://www.linkedin.com/post-inspector/
输入: https://riverflow.art
```

---

## 🎨 设计规范参考

### 颜色方案
```css
/* 主色 */
--bg-dark: #0a0a0a;
--text-white: #FFFFFF;
--text-gray: #9CA3AF;

/* 强调色 */
--blue: #3B82F6;
--purple: #8B5CF6;

/* 渐变 */
background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
```

### 字体建议
- **标题**：Inter Bold / Poppins Bold / Montserrat Bold
- **副标题**：Inter Regular / Roboto / Open Sans

### 布局建议
```
┌─────────────────────────────────────┐
│                                     │
│    [模糊圆形装饰 - 右上角]          │
│                                     │
│         RiverFlow.art               │  ← 居中，大号，白色
│                                     │
│    Professional AI Image Generator  │  ← 居中，中号，灰色
│                                     │
│    [模糊圆形装饰 - 左下角]          │
│                                     │
└─────────────────────────────────────┘
     1200px x 630px
```

---

## 📐 尺寸要求

| 平台 | 推荐尺寸 | 我们使用 |
|------|---------|---------|
| Facebook | 1200x630px | ✅ 1200x630px |
| Twitter | 1200x675px | ✅ 1200x630px (通用) |
| LinkedIn | 1200x627px | ✅ 1200x630px (通用) |
| 微信/微博 | 900x500px | ✅ 1200x630px (自动缩放) |

**1200x630px 是最通用的尺寸，适用于所有平台。**

---

## 🔄 更新图片

如果以后需要更新图片：

1. 创建新图片（相同尺寸）
2. 重命名为 `og-image.jpg`
3. 替换 `public/og-image.jpg`
4. 清除社交媒体缓存：
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: 重新分享链接即可
   - LinkedIn: https://www.linkedin.com/post-inspector/

---

## 💡 设计灵感

参考这些优秀的 OG 图片设计：
- Vercel: https://vercel.com/
- Stripe: https://stripe.com/
- GitHub: https://github.com/
- Linear: https://linear.app/

**共同特点**：
- 简洁清晰
- 品牌色明显
- 文字可读性强
- 有视觉焦点

---

## ✅ 完成检查

- [ ] 创建了 `og-image.jpg`（1200x630px）
- [ ] 创建了 `og-image-riverflow.jpg`（1200x630px）
- [ ] 文件保存在 `public/` 文件夹
- [ ] 使用 Facebook Debugger 验证
- [ ] 文件大小 < 1MB（加载速度）
- [ ] 图片清晰，文字可读

---

## 🎉 大功告成！

创建完 OG 图片后，你的网站在社交媒体上的分享效果将会大大提升！

**下一步**：
1. 创建 OG 图片 ✅
2. 提交到 Google Search Console（查看 SEO_CHECKLIST.md）
3. 开始享受 SEO 流量！🚀

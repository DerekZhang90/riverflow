# 国际化 (i18n) 实施计划

**版本**: v1.0
**最后更新**: 2025-10-04
**目标**: 默认英文,支持中英文切换

---

## 🎯 目标

1. **默认语言**: 英文 (面向国际用户)
2. **支持语言**: 英文 (en) + 中文 (zh)
3. **切换方式**: 导航栏语言选择器
4. **URL 结构**: `/en/...` 和 `/zh/...`
5. **SEO 友好**: 每个语言独立 URL

---

## 📂 当前技术栈

### 已有基础
- ✅ **库**: `next-intl` (Next.js 官方推荐)
- ✅ **路由**: `/[locale]/...` 结构已存在
- ✅ **配置**: `i18n.ts` 或 `next.config.mjs` 已配置

### 需要检查的文件
```
├── src/
│   ├── i18n.ts (或 middleware.ts)
│   ├── app/
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   └── messages/
│       ├── en.json
│       └── zh.json (待创建)
```

---

## 🔧 实施步骤

### 步骤 1: 修改默认语言配置 (30分钟)

#### 1.1 找到配置文件

可能的位置:
- `src/i18n.ts`
- `src/middleware.ts`
- `next.config.mjs`

#### 1.2 修改默认语言

**当前配置** (假设):
```typescript
// src/i18n.ts
export const defaultLocale = 'zh'; // 中文
export const locales = ['zh', 'en'] as const;
```

**修改为**:
```typescript
// src/i18n.ts
export const defaultLocale = 'en'; // 英文 ✅
export const locales = ['en', 'zh'] as const;
```

#### 1.3 更新中间件

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en', // 默认英文
  localePrefix: 'always' // 始终显示语言前缀 /en/... /zh/...
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

---

### 步骤 2: 创建翻译文件 (3-4小时)

#### 2.1 文件结构

```
messages/
├── en.json (英文,默认语言)
└── zh.json (中文)
```

#### 2.2 翻译模块划分

```json
{
  "common": {
    "appName": "AI Image Generator",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "nav": {
    "home": "Home",
    "generator": "Generator",
    "pricing": "Pricing",
    "history": "History",
    "signin": "Sign In",
    "signout": "Sign Out"
  },
  "home": {
    "hero": {
      "title": "Create Stunning Images with AI",
      "subtitle": "Generate high-quality images...",
      "cta": "Get Started Free"
    }
  },
  "generator": {
    "models": {
      "seedream": "Seedream V4",
      "nanobanana": "Nano Banana"
    },
    "modes": {
      "textToImage": "Text to Image",
      "imageToImage": "Image to Image"
    },
    "parameters": {
      "prompt": "Prompt",
      "size": "Size",
      "aspectRatio": "Aspect Ratio"
    },
    "buttons": {
      "generate": "Generate",
      "download": "Download"
    }
  },
  "pricing": {
    "title": "Choose Your Plan",
    "free": "Free Trial",
    "starter": "Starter",
    "pro": "Professional",
    "premium": "Premium"
  },
  "errors": {
    "insufficient_credits": "Insufficient credits",
    "generation_failed": "Generation failed",
    "network_error": "Network error"
  }
}
```

#### 2.3 优先级翻译

**第一批** (上线必需):
1. 导航栏
2. 首页
3. AI 生成器界面
4. 订阅价格页面
5. 错误提示

**第二批** (可延后):
1. 帮助文档
2. 法律条款
3. FAQ
4. 博客

---

### 步骤 3: 使用翻译 (1-2小时)

#### 3.1 在服务端组件中使用

```typescript
// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

#### 3.2 在客户端组件中使用

```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function Generator() {
  const t = useTranslations('generator');

  return (
    <button>{t('buttons.generate')}</button>
  );
}
```

#### 3.3 带参数的翻译

**翻译文件**:
```json
{
  "greeting": "Hello, {name}!",
  "credits_remaining": "You have {count} credits remaining"
}
```

**使用**:
```typescript
t('greeting', { name: 'Alice' })
// 输出: "Hello, Alice!"

t('credits_remaining', { count: 10 })
// 输出: "You have 10 credits remaining"
```

---

### 步骤 4: 添加语言切换器 (1小时)

#### 4.1 创建组件

**文件**: `src/components/LanguageSwitcher.tsx`

```typescript
'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Select, SelectItem } from '@nextui-org/react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    // 替换当前路径的语言部分
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <Select
      selectedKeys={[locale]}
      onSelectionChange={(keys) => handleChange(Array.from(keys)[0] as string)}
      className="w-24"
    >
      <SelectItem key="en" value="en">
        🇺🇸 EN
      </SelectItem>
      <SelectItem key="zh" value="zh">
        🇨🇳 中文
      </SelectItem>
    </Select>
  );
}
```

#### 4.2 集成到导航栏

**文件**: `src/components/layout/navbar/navbar.tsx`

```typescript
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  return (
    <nav>
      {/* 其他导航项 */}
      <LanguageSwitcher />
    </nav>
  );
}
```

---

### 步骤 5: SEO 优化 (1小时)

#### 5.1 添加 hreflang 标签

```typescript
// src/app/[locale]/layout.tsx
export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    alternates: {
      canonical: `https://yoursite.com/${params.locale}`,
      languages: {
        'en-US': 'https://yoursite.com/en',
        'zh-CN': 'https://yoursite.com/zh'
      }
    }
  };
}
```

#### 5.2 翻译 Metadata

```typescript
// messages/en.json
{
  "metadata": {
    "title": "AI Image Generator - Create Stunning Images",
    "description": "Generate high-quality images with AI..."
  }
}

// src/app/[locale]/layout.tsx
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description')
  };
}
```

---

## 📝 完整翻译文件示例

### messages/en.json (英文)

```json
{
  "common": {
    "appName": "AI Image Generator",
    "loading": "Loading...",
    "credits": "Credits",
    "creditsRemaining": "You have {count} credits remaining"
  },
  "nav": {
    "home": "Home",
    "generator": "Generator",
    "pricing": "Pricing",
    "history": "History",
    "signin": "Sign In",
    "signout": "Sign Out"
  },
  "home": {
    "hero": {
      "title": "Create Stunning Images with AI",
      "subtitle": "Transform your ideas into beautiful images using state-of-the-art AI models",
      "cta": "Get Started Free"
    },
    "features": {
      "title": "Powerful Features",
      "fast": "Lightning Fast",
      "quality": "High Quality",
      "models": "Multiple Models"
    }
  },
  "generator": {
    "title": "AI Image Generator",
    "models": {
      "label": "Choose AI Model",
      "seedream": "Seedream V4",
      "seedreamDesc": "High-quality image generation with text and image support",
      "nanobanana": "Nano Banana",
      "nanobananaDesc": "Fast generation for rapid prototyping"
    },
    "modes": {
      "label": "Generation Mode",
      "textToImage": "Text to Image",
      "imageToImage": "Image to Image"
    },
    "parameters": {
      "prompt": "Prompt",
      "promptPlaceholder": "Describe the image you want to create...",
      "size": "Size",
      "aspectRatio": "Aspect Ratio",
      "sequentialGeneration": "Sequential Generation",
      "maxImages": "Max Images"
    },
    "buttons": {
      "generate": "Generate ({credits} Credits)",
      "generating": "Generating...",
      "download": "Download",
      "downloadAll": "Download All"
    },
    "results": {
      "title": "Generated Results",
      "success": "Generation completed",
      "failed": "Generation failed"
    }
  },
  "pricing": {
    "title": "Choose Your Plan",
    "subtitle": "Flexible pricing for every need",
    "free": {
      "name": "Free Trial",
      "price": "$0",
      "credits": "5 credits (one-time)",
      "features": [
        "Try all AI models",
        "R2 cloud storage",
        "Community support"
      ]
    },
    "starter": {
      "name": "Starter",
      "price": "$9.9",
      "period": "/month",
      "credits": "100 credits/month",
      "features": [
        "All Free features",
        "50-100 images/month",
        "Email support"
      ]
    }
  },
  "errors": {
    "insufficient_credits": "Insufficient credits. Please upgrade your plan.",
    "generation_failed": "Image generation failed. Please try again.",
    "network_error": "Network error. Please check your connection.",
    "invalid_prompt": "Invalid prompt. Please enter a description."
  }
}
```

### messages/zh.json (中文)

```json
{
  "common": {
    "appName": "AI 图片生成器",
    "loading": "加载中...",
    "credits": "积分",
    "creditsRemaining": "您还有 {count} 积分"
  },
  "nav": {
    "home": "首页",
    "generator": "AI 生成",
    "pricing": "订阅价格",
    "history": "历史记录",
    "signin": "登录",
    "signout": "退出"
  },
  "home": {
    "hero": {
      "title": "用 AI 创造惊艳的图片",
      "subtitle": "使用最先进的 AI 模型,将您的想法转化为精美图片",
      "cta": "免费开始"
    },
    "features": {
      "title": "强大功能",
      "fast": "闪电般快速",
      "quality": "高质量",
      "models": "多模型"
    }
  },
  "generator": {
    "title": "AI 图片生成器",
    "models": {
      "label": "选择 AI 模型",
      "seedream": "Seedream V4",
      "seedreamDesc": "高质量图片生成,支持文生图和图生图",
      "nanobanana": "Nano Banana",
      "nanobananaDesc": "快速生成,适合快速原型和创意探索"
    },
    "modes": {
      "label": "生成模式",
      "textToImage": "文生图",
      "imageToImage": "图生图"
    },
    "parameters": {
      "prompt": "提示词",
      "promptPlaceholder": "描述您想要创建的图片...",
      "size": "分辨率",
      "aspectRatio": "宽高比",
      "sequentialGeneration": "组图生成模式",
      "maxImages": "最大图片数"
    },
    "buttons": {
      "generate": "生成图片 ({credits} 积分)",
      "generating": "生成中...",
      "download": "下载",
      "downloadAll": "批量下载"
    },
    "results": {
      "title": "生成结果",
      "success": "生成完成",
      "failed": "生成失败"
    }
  },
  "pricing": {
    "title": "选择您的套餐",
    "subtitle": "灵活的定价方案,满足各种需求",
    "free": {
      "name": "免费试用",
      "price": "$0",
      "credits": "5 积分 (一次性)",
      "features": [
        "试用所有 AI 模型",
        "R2 云存储",
        "社区支持"
      ]
    },
    "starter": {
      "name": "入门套餐",
      "price": "$9.9",
      "period": "/月",
      "credits": "100 积分/月",
      "features": [
        "包含免费套餐所有功能",
        "每月生成 50-100 张图",
        "邮件支持"
      ]
    }
  },
  "errors": {
    "insufficient_credits": "积分不足,请升级套餐。",
    "generation_failed": "图片生成失败,请重试。",
    "network_error": "网络错误,请检查您的网络连接。",
    "invalid_prompt": "无效的提示词,请输入描述。"
  }
}
```

---

## ✅ 实施检查清单

### 配置阶段
- [ ] 修改 `defaultLocale` 为 `'en'`
- [ ] 更新 middleware.ts
- [ ] 配置 localePrefix

### 翻译阶段
- [ ] 创建 `messages/en.json`
- [ ] 创建 `messages/zh.json`
- [ ] 翻译导航栏
- [ ] 翻译首页
- [ ] 翻译 AI 生成器
- [ ] 翻译订阅价格页面
- [ ] 翻译错误信息

### 组件开发
- [ ] 创建 LanguageSwitcher 组件
- [ ] 集成到导航栏
- [ ] 测试语言切换功能

### SEO 优化
- [ ] 添加 hreflang 标签
- [ ] 翻译 metadata
- [ ] 生成多语言 sitemap

### 测试
- [ ] 测试 /en 路由
- [ ] 测试 /zh 路由
- [ ] 测试语言切换
- [ ] 测试所有翻译是否正确显示

---

## 📅 时间估算

| 任务 | 时间 |
|------|------|
| 修改配置 | 30分钟 |
| 翻译文件 (第一批) | 3-4小时 |
| 创建语言切换器 | 1小时 |
| SEO 优化 | 1小时 |
| 测试和修复 | 1小时 |
| **总计** | **6-8小时** |

---

## 🚀 下一步

1. [ ] 用户确认翻译优先级
2. [ ] 开始修改配置
3. [ ] 创建英文翻译文件
4. [ ] 复制并翻译中文版本
5. [ ] 添加语言切换器
6. [ ] 测试完整流程

---

**文档维护者**: Claude
**审核状态**: 待开始实施

import React from "react";
import WorkerWrapper from "@/components/replicate/text-to-image/worker-wraper";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  const locale = params.locale === "en" ? "en" : "zh";

  if (locale === "en") {
    return {
      title: "Free AI Image Generator - Seedream V4 & Nano Banana | Free Credits",
      description:
        "Create stunning visuals with Seedream V4 and Nano Banana AI models. Supports both text-to-image and image-to-image workflows with free starter credits.",
      keywords: "AI image generation, Seedream, Nano Banana, text to image, image to image, AI art, free AI generator",
      alternates: {
        canonical: 'https://riverflow.art/text-to-image',
        languages: {
          'x-default': 'https://riverflow.art/text-to-image',
          'en': 'https://riverflow.art/text-to-image',
          'zh': 'https://riverflow.art/zh/text-to-image',
        },
      },
    };
  }

  return {
    title: "免费 AI 图片生成 - Seedream V4 & Nano Banana | 免费体验",
    description: "使用 Seedream V4 和 Nano Banana AI 模型生成精美图片。支持文生图和图生图，多种尺寸和分辨率，免费积分立即开始创作。",
    keywords: "AI 图片生成, Seedream, Nano Banana, 文生图, 图生图, AI 绘画, 免费 AI 生成器",
    alternates: {
      canonical: 'https://riverflow.art/zh/text-to-image',
      languages: {
        'x-default': 'https://riverflow.art/text-to-image',
        'en': 'https://riverflow.art/text-to-image',
        'zh': 'https://riverflow.art/zh/text-to-image',
      },
    },
  };
}

export default function TextToImage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const effectId = "2";
  const multiLanguage = "TextToImage";
  const outputDefaultImage = "";
  const isEnglish = locale === "en";

  const copy = isEnglish
    ? {
        badge: "Free AI Image Studio",
        headingLine1: "Create with AI",
        headingLine2: "Stunning Imagery",
        subtitle: "Free AI Image Studio - Supports both text-to-image and image-to-image workflows",
        highlights: [
          { color: "bg-green-400", label: "Seedream V4" },
          { color: "bg-purple-400", label: "Nano Banana" },
          { color: "bg-blue-400", label: "5 free credits" },
        ],
      }
    : {
        badge: "免费 AI 图片生成",
        headingLine1: "使用 AI 创作",
        headingLine2: "精美图片",
        subtitle: "免费 AI 图片生成 - 支持文生图和图生图两种模式",
        highlights: [
          { color: "bg-green-400", label: "Seedream V4" },
          { color: "bg-purple-400", label: "Nano Banana" },
          { color: "bg-blue-400", label: "5 免费积分" },
        ],
      };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero 区域 */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-6">
              <span className="text-sm text-blue-400 font-medium">{copy.badge}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block">{copy.headingLine1}</span>
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {copy.headingLine2}
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-4">{copy.subtitle}</p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              {copy.highlights.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pb-20 flex justify-center">
        <div className="w-full max-w-7xl">
          <WorkerWrapper
            effectId={effectId}
            multiLanguage={multiLanguage}
            outputDefaultImage={outputDefaultImage}
          />
        </div>
      </div>
    </main>
  );
}

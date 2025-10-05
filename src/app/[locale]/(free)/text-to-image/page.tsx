import React from "react";
import TopHero from "@/components/landingpage/top";
import WorkerWrapper from "@/components/replicate/text-to-image/worker-wraper";
import { getMetadata } from "@/components/seo/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return {
    title: "AI 图片生成 - Seedream V4 & Nano Banana | 免费体验",
    description: "使用 Seedream V4 和 Nano Banana AI 模型生成精美图片。支持文生图和图生图，多种尺寸和分辨率，免费积分立即开始创作。",
    keywords: "AI 图片生成, Seedream, Nano Banana, 文生图, 图生图, AI 绘画",
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

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero 区域 */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-6">
              <span className="text-sm text-blue-400 font-medium">AI 图片生成</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block">使用 AI 创作</span>
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                精美图片
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-4">
              支持文生图和图生图两种模式
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Seedream V4</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Nano Banana</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>免费积分</span>
              </div>
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

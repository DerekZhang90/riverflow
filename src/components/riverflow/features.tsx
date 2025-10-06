"use client";

import { useLocale } from "next-intl";

export function RiverFlowFeatures() {
  const locale = useLocale();

  const featureSets =
    locale === "en"
      ? {
          heading: "Why creators love RiverFlow",
          description:
            "Advanced AI tooling that delivers premium quality, rapid speed, and reliable control for every project.",
          items: [
            {
              icon: "✨",
              title: "Exquisite quality",
              description: "Industry-leading fidelity with 4K output, rich details, and balanced color reproduction.",
            },
            {
              icon: "⚡",
              title: "Rapid rendering",
              description: "Generate polished images in 5–10 seconds—up to 3× faster than traditional models.",
            },
            {
              icon: "🎯",
              title: "Prompt precision",
              description: "Delivers up to 98% intent accuracy so every prompt lands exactly as envisioned.",
            },
            {
              icon: "🎨",
              title: "Style versatility",
              description: "Supports realism, anime, 3D, illustration, and 20+ creative aesthetics out of the box.",
            },
            {
              icon: "🖼️",
              title: "Smart optimization",
              description: "AI-enhanced composition, lighting, and color with no expert knowledge required.",
            },
            {
              icon: "🔄",
              title: "Image-to-image",
              description: "Transform reference shots into fresh concepts while preserving the core style.",
            },
          ],
        }
      : {
          heading: "为什么选择 RiverFlow",
          description: "先进的 AI 技术，为创作者提供前所未有的创作体验",
          items: [
            {
              icon: "✨",
              title: "极致画质",
              description: "业界领先的图像质量，支持 4K 超高清输出，细节丰富，色彩准确",
            },
            {
              icon: "⚡",
              title: "快速生成",
              description: "仅需 5-10 秒即可生成高质量图片，比传统模型快 3 倍",
            },
            {
              icon: "🎯",
              title: "精准控制",
              description: "提示词理解准确率达 98%，生成结果高度符合预期",
            },
            {
              icon: "🎨",
              title: "风格多样",
              description: "支持写实、动漫、3D、插画等 20+ 种艺术风格",
            },
            {
              icon: "🖼️",
              title: "智能优化",
              description: "AI 自动优化构图、光影和色彩，无需专业知识",
            },
            {
              icon: "🔄",
              title: "图生图",
              description: "支持基于参考图生成，保持风格的同时创造全新作品",
            },
          ],
        };

  return (
    <section id="features" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {featureSets.heading}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {featureSets.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {featureSets.items.map((feature) => (
            <div
              key={feature.title}
              className="group p-8 bg-[#111111] rounded-2xl border border-[#2a2a2a] hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

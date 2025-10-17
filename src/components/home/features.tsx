"use client";

import { useLocale } from "next-intl";

export function HomeFeatures() {
  const locale = useLocale();

  const features =
    locale === "en"
      ? [
          {
            icon: "✨",
            title: "Text-to-image",
            description: "Describe your vision and let AI render it in seconds.",
          },
          {
            icon: "🖼️",
            title: "Image-to-image",
            description: "Upload a reference photo and generate refined variations.",
          },
          {
            icon: "🎨",
            title: "Diverse styles",
            description: "Realism, anime, 3D, illustration—switch styles instantly.",
          },
          {
            icon: "⚡",
            title: "Fast results",
            description: "Average generation time between 10–30 seconds.",
          },
          {
            icon: "🎯",
            title: "Precise control",
            description: "Thoughtful prompt handling delivers outputs that match intent.",
          },
          {
            icon: "💎",
            title: "High resolution",
            description: "Export crisp 4K imagery packed with detail.",
          },
        ]
      : [
          {
            icon: "✨",
            title: "文生图",
            description: "输入文字描述，AI 自动生成精美图片",
          },
          {
            icon: "🖼️",
            title: "图生图",
            description: "上传参考图片，基于图片生成新作品",
          },
          {
            icon: "🎨",
            title: "多种风格",
            description: "支持写实、动漫、3D、插画等多种艺术风格",
          },
          {
            icon: "⚡",
            title: "快速生成",
            description: "平均 10-30 秒即可完成图片生成",
          },
          {
            icon: "🎯",
            title: "精准控制",
            description: "提示词理解准确，生成结果高度符合预期",
          },
          {
            icon: "💎",
            title: "高清画质",
            description: "支持 4K 超高清输出，细节丰富",
          },
        ];

  const copy =
    locale === "en"
      ? {
          heading: "Powerful RiverFlow Features",
          description: "Let RiverFlow AI accelerate your creative flow and unlock new directions.",
          stats: [
            { value: "20+", label: "Style presets" },
            { value: "4K", label: "Ultra HD output" },
            { value: "10s", label: "Average render time" },
            { value: "∞", label: "Creative possibilities" },
          ],
        }
      : {
          heading: "RiverFlow 强大功能",
          description: "让 RiverFlow AI 成为你的创作助手，释放无限创意可能",
          stats: [
            { value: "20+", label: "艺术风格" },
            { value: "4K", label: "超高清画质" },
            { value: "10s", label: "平均生成时间" },
            { value: "∞", label: "创作可能" },
          ],
        };

  return (
    <section className="bg-[#0a0a0a] py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {copy.heading}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            {copy.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[#2a2a2a] bg-[#111111] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/50"
            >
              <div className="mb-4 text-5xl transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 border-t border-[#2a2a2a] pt-12">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
            {copy.stats.map((stat) => (
              <div key={stat.label}>
                <div className="mb-2 text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

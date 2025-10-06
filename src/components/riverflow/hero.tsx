"use client";

import { useLocale } from "next-intl";

export function RiverFlowHero() {
  const locale = useLocale();

  const copy =
    locale === "en"
      ? {
          badge: "Coming soon",
          headingLine1: "Experience",
          headingLine2: "RiverFlow",
          subtitle:
            "The next-generation AI image model with sharper detail, faster renders, and precise control.",
          primaryCta: "Join the waitlist",
          secondaryCta: "Explore features",
          stats: [
            { value: "10s", label: "Average render time" },
            { value: "4K", label: "Ultra HD quality" },
            { value: "98%", label: "Prompt accuracy" },
          ],
        }
      : {
          badge: "即将推出",
          headingLine1: "体验",
          headingLine2: "RiverFlow",
          subtitle: "下一代 AI 图片生成模型，更高画质，更快速度，更精准控制",
          primaryCta: "抢先体验",
          secondaryCta: "了解更多",
          stats: [
            { value: "10s", label: "平均生成时间" },
            { value: "4K", label: "超高清画质" },
            { value: "98%", label: "提示词准确率" },
          ],
        };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8 animate-fade-in">
            <span className="text-sm text-blue-400 font-medium">{copy.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
            <span className="block">{copy.headingLine1}</span>
            <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              {copy.headingLine2}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {copy.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#subscribe"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              {copy.primaryCta}
            </a>
            <a
              href="#features"
              className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold rounded-xl border border-[#3a3a3a] transition-all duration-200 hover:-translate-y-0.5"
            >
              {copy.secondaryCta}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {copy.stats.map((item, index) => (
              <div
                key={item.label}
                className={index === 1 ? "text-center border-x border-[#2a2a2a]" : "text-center"}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

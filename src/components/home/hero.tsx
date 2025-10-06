"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

export function HomeHero() {
  const locale = useLocale();
  const copy =
    locale === "en"
      ? {
          badge: "Powered by RiverFlow",
          titleLine1: "Experience ",
          titleHighlight: "RiverFlow",
          titleLine2: " AI Image Generation",
          subtitle:
            "Create stunning visuals with cutting-edge AI models tuned for speed and fidelity.",
          subtitleNote: "Supports text-to-image and image-to-image workflows",
          primaryCta: "Start creating",
          secondaryCta: "Learn about RiverFlow",
          stats: [
            { value: "2", label: "Models available" },
            { value: "5", label: "Free credits" },
            { value: "∞", label: "Creative possibilities" },
          ],
        }
      : {
          badge: "Powered by RiverFlow",
          titleLine1: "体验 ",
          titleHighlight: "RiverFlow",
          titleLine2: " AI 图片生成",
          subtitle: "使用先进的 AI 技术，将你的创意转化为精美图片",
          subtitleNote: "支持文生图和图生图功能",
          primaryCta: "开始创作",
          secondaryCta: "了解 RiverFlow",
          stats: [
            { value: "2", label: "可用模型" },
            { value: "5", label: "免费积分" },
            { value: "∞", label: "无限可能" },
          ],
        };

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-600/10 via-blue-600/5 to-transparent" />

      {/* Animated background dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-20 top-20 h-64 w-64 animate-pulse rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-purple-600/10 blur-3xl delay-1000" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-block animate-fade-in rounded-full border border-blue-600/20 bg-blue-600/10 px-4 py-2">
            <span className="text-sm font-medium text-blue-400">{copy.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="animate-slide-up text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            {copy.titleLine1}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              {copy.titleHighlight}
            </span>
            <br />
            {copy.titleLine2}
          </h1>

          {/* Subtitle */}
          <p
            className="animate-slide-up mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-400 md:text-2xl"
            style={{ animationDelay: "0.1s" }}
          >
            {copy.subtitle}
            <br />
            <span className="text-gray-500">{copy.subtitleNote}</span>
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-slide-up mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/text-to-image"
              className="group flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/40"
            >
              <span>{copy.primaryCta}</span>
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/riverflow"
              className="rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] px-8 py-4 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a2a2a]"
            >
              {copy.secondaryCta}
            </Link>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in mx-auto grid max-w-2xl grid-cols-3 gap-8 border-t border-[#2a2a2a] pt-8"
            style={{ animationDelay: "0.3s" }}
          >
            {copy.stats.map((item) => (
              <div key={item.label} className="text-center">
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

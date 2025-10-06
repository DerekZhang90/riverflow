"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

export function HomeCTA() {
  const locale = useLocale();
  const copy =
    locale === "en"
      ? {
          heading: "Ready to create?",
          highlight:
            "Sign up to claim 5 free credits and generate your first masterpieces in minutes.",
          highlightNote: "No credit card required—start instantly",
          primaryCta: "Create for free",
          secondaryCta: "View pricing",
          trustBadges: [
            "No credit card required",
            "5 free credits",
            "Cancel anytime",
          ],
          tiles: [
            {
              href: "/riverflow",
              emoji: "🚀",
              title: "RiverFlow model",
              description: "Preview our flagship model coming soon.",
            },
            {
              href: "/dashboard",
              emoji: "📊",
              title: "My creations",
              description: "Review history and manage credits.",
            },
            {
              href: "/pricing",
              emoji: "💎",
              title: "Pricing plans",
              description: "Find the plan that fits your workflow.",
            },
          ],
        }
      : {
          heading: "准备好开始创作了吗？",
          highlight: "注册即可获得 5 免费积分，几分钟内生成属于你的杰作",
          highlightNote: "无需信用卡，立即开始创作",
          primaryCta: "免费开始创作",
          secondaryCta: "查看定价",
          trustBadges: ["无需信用卡", "5 免费积分", "随时取消"],
          tiles: [
            {
              href: "/riverflow",
              emoji: "🚀",
              title: "RiverFlow 模型",
              description: "了解即将推出的旗舰模型",
            },
            {
              href: "/dashboard",
              emoji: "📊",
              title: "我的作品",
              description: "查看生成历史和管理积分",
            },
            {
              href: "/pricing",
              emoji: "💎",
              title: "定价方案",
              description: "选择适合你的订阅计划",
            },
          ],
        };

  return (
    <section className="bg-gradient-to-b from-[#111111] to-[#0a0a0a] py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Main CTA Card */}
          <div className="relative overflow-hidden rounded-3xl border border-blue-600/30 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-12">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/grid.svg')" }} />
            <div className="absolute right-0 top-0 h-96 w-96 animate-pulse rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 animate-pulse rounded-full bg-purple-600/20 blur-3xl delay-1000" />

            <div className="relative z-10 text-center">
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                {copy.heading}
              </h2>

              <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
                {copy.highlight}
                <br />
                <span className="text-gray-400">{copy.highlightNote}</span>
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/text-to-image"
                  className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-gray-900 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-2xl"
                >
                  <span>{copy.primaryCta}</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <Link
                  href="/pricing"
                  className="rounded-xl border-2 border-white/30 px-8 py-4 font-semibold text-white transition-all duration-200 hover:border-white/50 hover:bg-white/10"
                >
                  {copy.secondaryCta}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 border-t border-white/10 pt-8">
                <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                  {copy.trustBadges.map((badge) => (
                    <div key={badge} className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Links */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {copy.tiles.map((tile) => (
              <Link
                key={tile.title}
                href={tile.href}
                className="group rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 text-center transition-all hover:-translate-y-1 hover:border-blue-600/50 hover:bg-[#2a2a2a]"
              >
                <div className="mb-2 text-3xl">{tile.emoji}</div>
                <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-blue-400">
                  {tile.title}
                </h3>
                <p className="text-sm text-gray-400">{tile.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

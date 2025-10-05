import Link from "next/link";
import { useLocale } from "next-intl";

export function HomeModels() {
  const locale = useLocale();

  const models =
    locale === "en"
      ? [
          {
            id: 2,
            name: "Seedream 4.0",
            description: "High-fidelity image generation with flexible resolutions.",
            credit: 2,
            href: "/text-to-image?model=seedream-4",
            features: ["4K quality", "Fast rendering", "Diverse styles"],
            gradient: "from-blue-500 to-cyan-500",
            available: true,
          },
          {
            id: 3,
            name: "Nano Banana",
            description: "Lightning-fast results ideal for rapid prototyping.",
            credit: 2,
            href: "/text-to-image?model=nano-banana",
            features: ["Ultra fast", "Creative exploration", "Experiment friendly"],
            gradient: "from-purple-500 to-pink-500",
            available: true,
          },
        ]
      : [
          {
            id: 2,
            name: "Seedream 4.0",
            description: "高质量图片生成，支持文生图和图生图",
            credit: 2,
            href: "/text-to-image?model=seedream-4",
            features: ["4K 高清", "快速生成", "风格多样"],
            gradient: "from-blue-500 to-cyan-500",
            available: true,
          },
          {
            id: 3,
            name: "Nano Banana",
            description: "快速生成，适合快速原型和创意探索",
            credit: 2,
            href: "/text-to-image?model=nano-banana",
            features: ["超快速度", "创意探索", "实验友好"],
            gradient: "from-purple-500 to-pink-500",
            available: true,
          },
        ];

  const copy =
    locale === "en"
      ? {
          heading: "Available models",
          description:
            "Choose the AI engine that suits your workflow—each delivers a distinct look and speed profile.",
          availableLabel: "Available",
          creditsLabel: "Credits / image",
          ctaLabel: "Start now",
          comingSoonBadge: "Coming soon",
          comingSoonTitle: "RiverFlow model",
          comingSoonDescription:
            "Next-generation image synthesis with higher fidelity, faster inference, and precise controls.",
          comingSoonPrimary: "Learn more",
          comingSoonSecondary: "Get notified",
        }
      : {
          heading: "当前可用模型",
          description: "选择适合你的 AI 模型开始创作，每个模型都有独特的风格和特点",
          availableLabel: "可用",
          creditsLabel: "积分/张",
          ctaLabel: "开始使用",
          comingSoonBadge: "即将推出",
          comingSoonTitle: "RiverFlow 模型",
          comingSoonDescription: "下一代 AI 图片生成技术，更高画质，更快速度，更精准控制",
          comingSoonPrimary: "了解更多",
          comingSoonSecondary: "订阅通知",
        };

  return (
    <section className="bg-gradient-to-b from-[#0a0a0a] to-[#111111] py-24">
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

        {/* Models Grid */}
        <div className="mx-auto mb-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {models.map((model) => (
            <Link
              key={model.id}
              href={model.href}
              className="group relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/50"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${model.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-2 text-2xl font-bold text-white transition-colors group-hover:text-blue-400">
                      {model.name}
                    </h3>
                    {model.available && (
                      <span className="inline-block rounded-full bg-green-600/20 px-3 py-1 text-xs text-green-400">
                        {copy.availableLabel}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{model.credit}</div>
                    <div className="text-xs text-gray-500">{copy.creditsLabel}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-6 text-gray-400">{model.description}</p>

                {/* Features */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {model.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-1 text-sm text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex items-center text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="mr-2 text-sm font-medium">{copy.ctaLabel}</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* RiverFlow Preview */}
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-blue-600/20 bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-8">
            {/* Animated background */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-600/5 to-purple-600/5" />

            <div className="relative z-10 text-center">
              <div className="mb-4 inline-block rounded-full border border-blue-600/30 bg-blue-600/20 px-4 py-2">
                <span className="text-sm font-medium text-blue-400">{copy.comingSoonBadge}</span>
              </div>

              <h3 className="mb-3 text-3xl font-bold text-white">
                {copy.comingSoonTitle}
              </h3>

              <p className="mx-auto mb-6 max-w-2xl text-gray-400">
                {copy.comingSoonDescription}
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/riverflow"
                  className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
                >
                  {copy.comingSoonPrimary}
                </Link>
                <Link
                  href="/riverflow#subscribe"
                  className="rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2a2a2a]"
                >
                  {copy.comingSoonSecondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

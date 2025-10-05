import Link from 'next/link';

export function HomeModels() {
  const models = [
    {
      id: 2,
      name: 'Seedream 4.0',
      description: '高质量图片生成，支持文生图和图生图',
      credit: 2,
      href: '/text-to-image?model=seedream-4',
      features: ['4K 高清', '快速生成', '风格多样'],
      gradient: 'from-blue-500 to-cyan-500',
      available: true,
    },
    {
      id: 3,
      name: 'Nano Banana',
      description: '快速生成，适合快速原型和创意探索',
      credit: 2,
      href: '/text-to-image?model=nano-banana',
      features: ['超快速度', '创意探索', '实验友好'],
      gradient: 'from-purple-500 to-pink-500',
      available: true,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#111111]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            当前可用模型
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            选择适合你的 AI 模型开始创作，每个模型都有独特的风格和特点
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {models.map((model) => (
            <Link
              key={model.id}
              href={model.href}
              className="group relative p-8 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] hover:border-blue-600/50 transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${model.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {model.name}
                    </h3>
                    {model.available && (
                      <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                        可用
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{model.credit}</div>
                    <div className="text-xs text-gray-500">积分/张</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-6">
                  {model.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {model.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#0a0a0a] text-gray-300 text-sm rounded-lg border border-[#2a2a2a]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium mr-2">开始使用</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* RiverFlow Preview */}
        <div className="max-w-5xl mx-auto">
          <div className="relative p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-600/20 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 animate-pulse" />

            <div className="relative z-10 text-center">
              <div className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-600/30 rounded-full mb-4">
                <span className="text-sm text-blue-400 font-medium">即将推出</span>
              </div>

              <h3 className="text-3xl font-bold text-white mb-3">
                RiverFlow 模型
              </h3>

              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                下一代 AI 图片生成技术，更高画质，更快速度，更精准控制
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/riverflow"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                >
                  了解更多
                </Link>
                <Link
                  href="/riverflow#subscribe"
                  className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-medium rounded-xl border border-[#3a3a3a] transition-colors"
                >
                  订阅通知
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

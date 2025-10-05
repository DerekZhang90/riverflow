export function RiverFlowHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8 animate-fade-in">
            <span className="text-sm text-blue-400 font-medium">即将推出</span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
            <span className="block">体验</span>
            <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              RiverFlow
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            下一代 AI 图片生成模型，更高画质，更快速度，更精准控制
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#subscribe"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              抢先体验
            </a>
            <a
              href="#features"
              className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold rounded-xl border border-[#3a3a3a] transition-all duration-200 hover:-translate-y-0.5"
            >
              了解更多
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10s</div>
              <div className="text-sm text-gray-500">平均生成时间</div>
            </div>
            <div className="text-center border-x border-[#2a2a2a]">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">4K</div>
              <div className="text-sm text-gray-500">超高清画质</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-sm text-gray-500">提示词准确率</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

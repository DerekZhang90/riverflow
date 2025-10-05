import Link from 'next/link';

export function HomeHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-blue-600/5 to-transparent pointer-events-none" />

      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8 animate-fade-in">
            <span className="text-sm text-blue-400 font-medium">Powered by RiverFlow</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight animate-slide-up">
            体验{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              RiverFlow
            </span>
            <br />
            AI 图片生成
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            使用先进的 AI 技术，将你的创意转化为精美图片
            <br />
            <span className="text-gray-500">支持文生图和图生图功能</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/text-to-image"
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>开始创作</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/riverflow"
              className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold rounded-xl border border-[#3a3a3a] transition-all duration-200 hover:-translate-y-0.5"
            >
              了解 RiverFlow
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-[#2a2a2a] animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">2</div>
              <div className="text-sm text-gray-500">可用模型</div>
            </div>
            <div className="text-center border-x border-[#2a2a2a]">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">20</div>
              <div className="text-sm text-gray-500">免费积分</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-sm text-gray-500">无限可能</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

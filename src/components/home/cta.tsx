import Link from 'next/link';

export function HomeCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="relative p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl border border-blue-600/30 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                准备好开始创作了吗？
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                注册即可获得 <span className="text-blue-400 font-bold">20 免费积分</span>
                <br />
                <span className="text-gray-400">无需信用卡，立即开始创作</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/text-to-image"
                  className="group px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>免费开始创作</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <Link
                  href="/pricing"
                  className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-200"
                >
                  查看定价
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>无需信用卡</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>20 免费积分</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>随时取消</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Links */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Link
              href="/riverflow"
              className="p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl border border-[#2a2a2a] hover:border-blue-600/50 transition-all text-center group"
            >
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                RiverFlow 模型
              </h3>
              <p className="text-sm text-gray-400">
                了解即将推出的旗舰模型
              </p>
            </Link>

            <Link
              href="/dashboard"
              className="p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl border border-[#2a2a2a] hover:border-blue-600/50 transition-all text-center group"
            >
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                我的作品
              </h3>
              <p className="text-sm text-gray-400">
                查看生成历史和管理积分
              </p>
            </Link>

            <Link
              href="/pricing"
              className="p-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-xl border border-[#2a2a2a] hover:border-blue-600/50 transition-all text-center group"
            >
              <div className="text-3xl mb-2">💎</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                定价方案
              </h3>
              <p className="text-sm text-gray-400">
                选择适合你的订阅计划
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

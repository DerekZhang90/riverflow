export function RiverFlowGallery() {
  // 占位图片数据
  const placeholderImages = [
    { id: 1, title: '未来城市' },
    { id: 2, title: '梦幻森林' },
    { id: 3, title: '赛博朋克' },
    { id: 4, title: '水墨山水' },
    { id: 5, title: '抽象艺术' },
    { id: 6, title: '科幻场景' },
  ];

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            RiverFlow 生成效果预览
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            以下是 RiverFlow 模型的部分生成示例（开发中）
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {placeholderImages.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-[#2a2a2a] overflow-hidden hover:border-blue-600/50 transition-all duration-300"
            >
              {/* Placeholder Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-gray-500 font-medium">{item.title}</span>
                <span className="text-xs text-gray-600 mt-1">Coming Soon</span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-medium mb-1">{item.title}</p>
                  <p className="text-sm text-gray-400">RiverFlow 模型生成</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-6">
            想看更多精彩作品？订阅邮件获取最新更新
          </p>
          <a
            href="#subscribe"
            className="inline-block px-8 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold rounded-xl border border-[#3a3a3a] transition-all duration-200 hover:-translate-y-0.5"
          >
            订阅更新
          </a>
        </div>
      </div>
    </section>
  );
}

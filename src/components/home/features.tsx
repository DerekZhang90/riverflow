export function HomeFeatures() {
  const features = [
    {
      icon: '✨',
      title: '文生图',
      description: '输入文字描述，AI 自动生成精美图片',
    },
    {
      icon: '🖼️',
      title: '图生图',
      description: '上传参考图片，基于图片生成新作品',
    },
    {
      icon: '🎨',
      title: '多种风格',
      description: '支持写实、动漫、3D、插画等多种艺术风格',
    },
    {
      icon: '⚡',
      title: '快速生成',
      description: '平均 10-30 秒即可完成图片生成',
    },
    {
      icon: '🎯',
      title: '精准控制',
      description: '提示词理解准确，生成结果高度符合预期',
    },
    {
      icon: '💎',
      title: '高清画质',
      description: '支持 4K 超高清输出，细节丰富',
    },
  ];

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            强大的功能
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            让 AI 成为你的创作助手，释放无限创意可能
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-[#111111] rounded-2xl border border-[#2a2a2a] hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 pt-12 border-t border-[#2a2a2a]">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">20+</div>
              <div className="text-sm text-gray-500">艺术风格</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">4K</div>
              <div className="text-sm text-gray-500">超高清画质</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">10s</div>
              <div className="text-sm text-gray-500">平均生成时间</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">∞</div>
              <div className="text-sm text-gray-500">创作可能</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

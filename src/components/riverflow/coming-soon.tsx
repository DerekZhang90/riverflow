'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function RiverFlowComingSoon() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success('🎉 订阅成功！我们会在 RiverFlow 上线时第一时间通知你');
        setEmail('');
      } else {
        const data = await res.json();
        toast.error(data.error || '订阅失败，请稍后再试');
      }
    } catch (error) {
      toast.error('订阅失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="subscribe" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#111111]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-full mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-400 font-medium">开发中</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            RiverFlow 即将上线
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            成为首批体验者，获得 <span className="text-blue-400 font-semibold">100 免费积分</span> 和早鸟专属优惠
          </p>

          {/* Email Subscribe Form */}
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入你的邮箱"
                required
                className="flex-1 px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                {loading ? '订阅中...' : '立即订阅'}
              </button>
            </div>
          </form>

          {/* Privacy Notice */}
          <p className="text-sm text-gray-500">
            我们尊重你的隐私，不会向第三方分享你的邮箱地址
          </p>

          {/* Benefits */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
              <div className="text-2xl mb-2">🎁</div>
              <h3 className="text-white font-semibold mb-1">免费积分</h3>
              <p className="text-sm text-gray-400">首批用户获得 100 免费积分</p>
            </div>
            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="text-white font-semibold mb-1">早鸟优惠</h3>
              <p className="text-sm text-gray-400">专属 5 折订阅优惠</p>
            </div>
            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-white font-semibold mb-1">优先访问</h3>
              <p className="text-sm text-gray-400">提前 7 天体验新功能</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

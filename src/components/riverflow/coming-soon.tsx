'use client';

import { useLocale } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export function RiverFlowComingSoon() {
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const isEnglish = locale === 'en';

  const copy = isEnglish
    ? {
        badge: 'In development',
        title: 'RiverFlow is almost here',
        description:
          'Join the early-access list to receive 5 free credits and exclusive launch perks.',
        emailPlaceholder: 'Enter your email',
        submitIdle: 'Notify me',
        submitLoading: 'Subscribing...',
        privacy: 'We respect your privacy. No spam—unsubscribe anytime.',
        benefits: [
          { icon: '🎁', title: 'Free credits', description: 'Early adopters receive 5 free credits.' },
          { icon: '🏷️', title: 'Launch discount', description: 'Receive an exclusive 50% subscription offer.' },
          { icon: '⚡', title: 'Priority access', description: 'Preview new features 7 days before public release.' },
        ],
        toastInvalid: 'Please enter a valid email address.',
        toastSuccess: '🎉 Subscribed! We will email you as soon as RiverFlow launches.',
        toastError: 'Subscription failed. Please try again later.',
        toastNetwork: 'Network error. Please check your connection and retry.',
      }
    : {
        badge: '开发中',
        title: 'RiverFlow 即将上线',
        description: '成为首批体验者，获得 5 免费积分和早鸟专属优惠。',
        emailPlaceholder: '输入你的邮箱',
        submitIdle: '立即订阅',
        submitLoading: '订阅中...',
        privacy: '我们尊重你的隐私，不会向第三方分享你的邮箱地址',
        benefits: [
          { icon: '🎁', title: '免费积分', description: '首批用户获得 5 免费积分' },
          { icon: '🏷️', title: '早鸟优惠', description: '专属 5 折订阅优惠' },
          { icon: '⚡', title: '优先访问', description: '提前 7 天体验新功能' },
        ],
        toastInvalid: '请输入有效的邮箱地址',
        toastSuccess: '🎉 订阅成功！我们会在 RiverFlow 上线时第一时间通知你',
        toastError: '订阅失败，请稍后再试',
        toastNetwork: '订阅失败，请检查网络连接',
      };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error(copy.toastInvalid);
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
        toast.success(copy.toastSuccess);
        setEmail('');
      } else {
        const data = await res.json();
        toast.error(data.error || copy.toastError);
      }
    } catch (error) {
      toast.error(copy.toastNetwork);
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
            <span className="text-sm text-blue-400 font-medium">{copy.badge}</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {copy.title}
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {copy.description}
          </p>

          {/* Email Subscribe Form */}
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.emailPlaceholder}
                required
                className="flex-1 px-5 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                {loading ? copy.submitLoading : copy.submitIdle}
              </button>
            </div>
          </form>

          {/* Privacy Notice */}
          <p className="text-sm text-gray-500">{copy.privacy}</p>

          {/* Benefits */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
            {copy.benefits.map((benefit) => (
              <div key={benefit.title} className="p-6 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
                <div className="text-2xl mb-2">{benefit.icon}</div>
                <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

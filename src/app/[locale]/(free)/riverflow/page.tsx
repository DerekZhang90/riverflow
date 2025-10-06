import { Metadata } from 'next';
import { RiverFlowHero } from '@/components/riverflow/hero';
import { RiverFlowFeatures } from '@/components/riverflow/features';
import { RiverFlowComingSoon } from '@/components/riverflow/coming-soon';

export const metadata: Metadata = {
  title: 'RiverFlow - 下一代 AI 图片生成模型 | RiverFlow.art',
  description: 'RiverFlow 是一款革命性的 AI 图片生成模型，即将推出。订阅以获取第一时间上线通知。',
  keywords: 'RiverFlow, AI 图片生成, 人工智能, 图像生成, AI art',
  openGraph: {
    title: 'RiverFlow - 下一代 AI 图片生成模型',
    description: '革命性的 AI 图片生成技术，即将改变创作方式',
    url: 'https://riverflow.art/riverflow',
    siteName: 'RiverFlow.art',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RiverFlow - 下一代 AI 图片生成模型',
    description: '革命性的 AI 图片生成技术，即将改变创作方式',
  },
};

export default function RiverFlowPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <RiverFlowHero />
      <RiverFlowFeatures />
      <RiverFlowComingSoon />
    </div>
  );
}

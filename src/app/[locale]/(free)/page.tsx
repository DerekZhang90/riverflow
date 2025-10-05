import { Metadata } from 'next';
import Link from 'next/link';
import { HomeHero } from '@/components/home/hero';
import { HomeModels } from '@/components/home/models';
import { HomeFeatures } from '@/components/home/features';
import { HomeCTA } from '@/components/home/cta';

export const metadata: Metadata = {
  title: 'RiverFlow.art - AI 图片生成平台',
  description: '体验 RiverFlow AI 图片生成技术，使用 Seedream 4.0 和 Nano Banana 模型创作精美图片。支持文生图和图生图功能。',
  keywords: 'RiverFlow, AI 图片生成, Seedream, Nano Banana, 文生图, 图生图, AI art',
  openGraph: {
    title: 'RiverFlow.art - AI 图片生成平台',
    description: '体验下一代 AI 图片生成技术',
    url: 'https://riverflow.art',
    siteName: 'RiverFlow.art',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <HomeHero />

      {/* Available Models */}
      <HomeModels />

      {/* Features */}
      <HomeFeatures />

      {/* CTA Section */}
      <HomeCTA />
    </main>
  );
}

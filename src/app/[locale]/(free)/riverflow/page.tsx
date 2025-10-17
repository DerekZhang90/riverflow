import { Metadata } from 'next';
import { RiverFlowHero } from '@/components/riverflow/hero';
import { RiverFlowFeatures } from '@/components/riverflow/features';
import { RiverFlowComingSoon } from '@/components/riverflow/coming-soon';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEnglish = locale === 'en';

  if (isEnglish) {
    return {
      title: 'RiverFlow - Next-Generation AI Image Model | RiverFlow.art AI Technology',
      description: 'Discover RiverFlow, the revolutionary next-generation AI image generation model. Experience RiverFlow AI technology with 4K ultra HD quality, 10-second rendering, and 98% prompt accuracy. Join the RiverFlow waitlist for exclusive early access to RiverFlow AI creation tools.',
      keywords: 'RiverFlow, RiverFlow AI, RiverFlow model, AI image generation, RiverFlow technology, next-gen AI, RiverFlow.art, 4K AI images, fast AI rendering, AI image model',
      openGraph: {
        title: 'RiverFlow - Next-Generation AI Image Model',
        description: 'Revolutionary RiverFlow AI image generation technology coming soon. Experience RiverFlow with 10s rendering and 4K quality.',
        url: 'https://riverflow.art/riverflow',
        siteName: 'RiverFlow.art',
        locale: 'en_US',
        type: 'website',
        images: [
          {
            url: 'https://riverflow.art/og-image-riverflow.jpg',
            width: 1200,
            height: 630,
            alt: 'RiverFlow AI Next-Generation Image Model',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'RiverFlow - Next-Gen AI Image Model',
        description: 'Revolutionary RiverFlow AI technology coming soon',
        images: ['https://riverflow.art/og-image-riverflow.jpg'],
      },
      alternates: {
        canonical: 'https://riverflow.art/riverflow',
        languages: {
          'en': 'https://riverflow.art/riverflow',
          'zh': 'https://riverflow.art/zh/riverflow',
        },
      },
    };
  } else {
    // Chinese version
    return {
      title: 'RiverFlow - 下一代 AI 图片生成模型 | RiverFlow.art AI 技术',
      description: '探索 RiverFlow，革命性的下一代 AI 图片生成模型。体验 RiverFlow AI 技术：4K 超高清画质、10 秒快速渲染、98% 提示词准确率。加入 RiverFlow 候补名单，抢先体验 RiverFlow AI 创作工具。',
      keywords: 'RiverFlow, RiverFlow AI, RiverFlow 模型, AI 图片生成, RiverFlow 技术, 下一代 AI, RiverFlow.art, 4K AI 图片, 快速 AI 渲染, AI 图像模型',
      openGraph: {
        title: 'RiverFlow - 下一代 AI 图片生成模型',
        description: '革命性的 RiverFlow AI 图片生成技术即将推出。体验 RiverFlow 10 秒渲染和 4K 画质。',
        url: 'https://riverflow.art/zh/riverflow',
        siteName: 'RiverFlow.art',
        locale: 'zh_CN',
        type: 'website',
        images: [
          {
            url: 'https://riverflow.art/og-image-riverflow.jpg',
            width: 1200,
            height: 630,
            alt: 'RiverFlow AI 下一代图片生成模型',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'RiverFlow - 下一代 AI 图片模型',
        description: '革命性的 RiverFlow AI 技术即将推出',
        images: ['https://riverflow.art/og-image-riverflow.jpg'],
      },
      alternates: {
        canonical: 'https://riverflow.art/zh/riverflow',
        languages: {
          'en': 'https://riverflow.art/riverflow',
          'zh': 'https://riverflow.art/zh/riverflow',
        },
      },
    };
  }
}

export default function RiverFlowPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <RiverFlowHero />
      <RiverFlowFeatures />
      <RiverFlowComingSoon />
    </div>
  );
}

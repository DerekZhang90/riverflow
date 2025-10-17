import { Metadata } from 'next';
import Link from 'next/link';
import { HomeHero } from '@/components/home/hero';
import { HomeModels } from '@/components/home/models';
import { HomeFeatures } from '@/components/home/features';
import { HomeCTA } from '@/components/home/cta';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEnglish = locale === 'en';

  if (isEnglish) {
    return {
      title: 'RiverFlow.art - Professional AI Image Generator | RiverFlow AI Creation Platform',
      description: 'RiverFlow.art is the leading AI image generation platform powered by RiverFlow technology. Experience RiverFlow AI with Seedream 4.0 and Nano Banana models. Create stunning images with RiverFlow text-to-image and image-to-image features. Start your RiverFlow journey today.',
      keywords: 'RiverFlow, RiverFlow.art, RiverFlow AI, AI image generator, RiverFlow model, RiverFlow technology, Seedream, Nano Banana, text to image, image to image, AI art, AI creation platform',
      openGraph: {
        title: 'RiverFlow.art - Professional AI Image Generator Platform',
        description: 'Experience next-generation RiverFlow AI image generation technology. Create stunning visuals with RiverFlow powered models.',
        url: 'https://riverflow.art',
        siteName: 'RiverFlow.art',
        locale: 'en_US',
        type: 'website',
        images: [
          {
            url: 'https://riverflow.art/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'RiverFlow.art AI Image Generator Platform',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'RiverFlow.art - AI Image Generator',
        description: 'Experience RiverFlow AI image generation technology',
        images: ['https://riverflow.art/og-image.jpg'],
      },
      alternates: {
        canonical: 'https://riverflow.art',
        languages: {
          'en': 'https://riverflow.art',
          'zh': 'https://riverflow.art/zh',
        },
      },
    };
  } else {
    // Chinese version
    return {
      title: 'RiverFlow.art - 专业 AI 图片生成平台 | RiverFlow AI 创作工具',
      description: 'RiverFlow.art 是领先的 AI 图片生成平台，采用 RiverFlow 技术驱动。体验 RiverFlow AI 与 Seedream 4.0、Nano Banana 模型的完美结合。使用 RiverFlow 文生图、图生图功能创作精美图片。立即开启您的 RiverFlow 创作之旅。',
      keywords: 'RiverFlow, RiverFlow.art, RiverFlow AI, AI 图片生成, RiverFlow 模型, RiverFlow 技术, Seedream, Nano Banana, 文生图, 图生图, AI art, AI 创作平台',
      openGraph: {
        title: 'RiverFlow.art - 专业 AI 图片生成平台',
        description: '体验下一代 RiverFlow AI 图片生成技术。使用 RiverFlow 驱动的模型创作精美视觉作品。',
        url: 'https://riverflow.art/zh',
        siteName: 'RiverFlow.art',
        locale: 'zh_CN',
        type: 'website',
        images: [
          {
            url: 'https://riverflow.art/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'RiverFlow.art AI 图片生成平台',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'RiverFlow.art - AI 图片生成器',
        description: '体验 RiverFlow AI 图片生成技术',
        images: ['https://riverflow.art/og-image.jpg'],
      },
      alternates: {
        canonical: 'https://riverflow.art/zh',
        languages: {
          'en': 'https://riverflow.art',
          'zh': 'https://riverflow.art/zh',
        },
      },
    };
  }
}

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

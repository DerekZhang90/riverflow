import "../globals.css";
import { Providers } from "@/app/[locale]/providers";
import { AppContextProvider } from "@/contexts/app";
import { NextAuthSessionProvider } from "@/providers/session";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";


export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const isEnglish = locale === 'en';

  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "RiverFlow.art",
    "alternateName": "RiverFlow AI Image Generator",
    "url": "https://riverflow.art",
    "logo": "https://riverflow.art/logo.jpeg",
    "description": isEnglish
      ? "RiverFlow.art is a professional AI image generation platform powered by RiverFlow technology. Create stunning images with Seedream 4.0 and Nano Banana models."
      : "RiverFlow.art 是专业的 AI 图片生成平台，采用 RiverFlow 技术驱动。使用 Seedream 4.0 和 Nano Banana 模型创作精美图片。",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": isEnglish ? "5 free credits for new users" : "新用户免费获得 5 积分"
    },
    "featureList": [
      "RiverFlow AI Technology",
      "Seedream 4.0 Text-to-Image",
      "Nano Banana Image-to-Image",
      "4K Ultra HD Output",
      "10-Second Fast Rendering",
      "Multi-language Support"
    ],
    "creator": {
      "@type": "Organization",
      "name": "RiverFlow.art",
      "url": "https://riverflow.art"
    }
  };

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/logo.jpeg" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>

      <body>
        <AppContextProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <NextAuthSessionProvider>
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
            </NextAuthSessionProvider>
          </Providers>
        </AppContextProvider>
      </body>
    </html>
  );
}

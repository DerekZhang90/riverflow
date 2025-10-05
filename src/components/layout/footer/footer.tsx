import React from "react";
import { Divider, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { getDomain } from "@/config/domain";

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("Footer");

  const domain = getDomain();

  const footerNavigation = {
    supportOptions: [
      {
        name: "RiverFlow.art",
        href: `${domain}/${locale}`,
      },
    ],
    multiLanguage: [{ name: "English", href: domain }],

    legal: [
      { name: t("legal.item.item1"), href: "/legal/privacy-policy" },
      { name: t("legal.item.item2"), href: "/legal/terms-of-service" },
      { name: "Partners", href: "/partners" },
    ],
    social: [
      {
        name: "Facebook",
        href: "#",
        icon: "fontisto:facebook",
      },
      {
        name: "Instagram",
        href: "#",
        icon: "fontisto:instagram",
      },
      {
        name: "Twitter",
        href: "#",
        icon: "fontisto:twitter",
      },
      {
        name: "GitHub",
        href: "#",
        icon: "fontisto:github",
      },
    ],
  };

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-[#2a2a2a]">
      <div className="max-w-7xl w-full px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-24 mx-auto">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* 左侧：品牌信息 */}
          <div className="space-y-8 md:pr-8">
            <div className="flex items-center justify-center xl:justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold text-white">
                RiverFlow<span className="text-blue-400">.art</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 text-center xl:text-left leading-relaxed">
              RiverFlow.art 是一个领先的 AI 图片生成平台，使用先进的人工智能技术创作精美图片。
            </p>
            {/* 社交媒体图标 */}
            <div className="flex gap-4 justify-center xl:justify-start">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 bg-[#1a1a1a] hover:bg-blue-600/20 border border-[#2a2a2a] hover:border-blue-600/50 rounded-lg flex items-center justify-center transition-all duration-300"
                  aria-label={item.name}
                >
                  <Icon icon={item.icon} className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                </a>
              ))}
            </div>
          </div>

          {/* 右侧：导航链接 */}
          <div className="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-4 md:gap-8">
              {/* 功能特性 */}
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-center xl:text-left text-white mb-6">
                  {t("recommend.title")}
                </h3>
                <ul className="space-y-4">
                  {footerNavigation.supportOptions.map((item) => (
                    <li key={item.name} className="text-center xl:text-left">
                      <Link
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        href={item.href}
                        size="sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 多语言 */}
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-center xl:text-left text-white mb-6">
                  {t("multiLanguage.title")}
                </h3>
                <ul className="space-y-4">
                  {footerNavigation.multiLanguage.map((item) => (
                    <li key={item.name} className="text-center xl:text-left">
                      <Link
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        href={item.href}
                        size="sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 法律信息 */}
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-center xl:text-left text-white mb-6">
                  {t("legal.title")}
                </h3>
                <ul className="space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name} className="text-center xl:text-left">
                      <Link
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        href={item.href}
                        size="sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 联系方式 */}
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-center xl:text-left text-white mb-6">
                  {t("contact.title")}
                </h3>
                <ul className="space-y-4">
                  <li className="text-center xl:text-left">
                    <Link
                      href={`mailto:support@${domain.replace("https://", "")}`}
                      className="text-gray-400 hover:text-blue-400 text-sm transition-colors flex items-center justify-center xl:justify-start gap-2"
                    >
                      <Icon icon="mdi:email" className="w-4 h-4" />
                      <span>support@{domain.replace("https://", "")}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Divider className="mt-16 sm:mt-20 lg:mt-24 bg-[#2a2a2a]" />

        {/* 版权信息 */}
        <div className="flex justify-center pt-8">
          <p className="text-sm text-gray-500">
            &copy; 2025 RiverFlow.art. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

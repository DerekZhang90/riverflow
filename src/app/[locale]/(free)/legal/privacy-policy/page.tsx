"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

const supportEmail = "zhangshaopu1990@gmail.com";

type LegalSection = {
  heading: string;
  body?: string[];
  items?: { title: string; description: string }[];
  linkLabel?: string;
};

type PrivacyContent = {
  title: string;
  updatedLabel: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const PRIVACY_CONTENT: Record<"en" | "zh", PrivacyContent> = {
  en: {
    title: "Privacy Policy",
    updatedLabel: "Last updated",
    updated: "October 2024",
    intro:
      "RiverFlow.art (the “Service”) provides AI-powered image and video generation. This policy explains what information we collect, how we use it, and the choices you have while using RiverFlow.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We collect the minimum data required to operate RiverFlow and keep your account secure.",
        ],
        items: [
          {
            title: "Account & authentication",
            description:
              "Name, email address, and OAuth profile data supplied during sign-in. Your password is never stored by RiverFlow; Google OAuth handles authentication.",
          },
          {
            title: "Billing",
            description:
              "Creem.io processes subscription payments on our behalf. We never see or store full card numbers.",
          },
          {
            title: "Generated content",
            description:
              "Prompts, configuration choices, and output metadata are saved to help you review past work. Source assets are uploaded to Cloudflare R2 and stored as final results so you can re-download them.",
          },
          {
            title: "Usage analytics",
            description:
              "Basic logs such as IP address, device type, and pages visited help us improve reliability and prevent abuse. We do not run third-party advertising trackers.",
          },
        ],
      },
      {
        heading: "How we use your data",
        body: [
          "Your information enables us to operate RiverFlow, deliver requested generations, provide customer support, and communicate critical updates (for example, credit balance or security notices). We never sell your personal data.",
        ],
      },
      {
        heading: "Where your data lives",
        body: [
          "Uploads and final outputs are stored in Cloudflare R2 (with geo-redundant backups). Replicate and other model providers receive only the data needed to execute the model you choose. Metrics and logs are hosted on AWS infrastructure located in the United States.",
        ],
      },
      {
        heading: "Third-party processors",
        body: [
          "We rely on vetted partners to operate the Service. Each processor handles data under contract and may have its own privacy terms:",
        ],
        items: [
          {
            title: "Creem.io",
            description: "manages subscription billing and secure checkout.",
          },
          {
            title: "Google OAuth",
            description: "provides secure authentication.",
          },
          {
            title: "Replicate & model vendors",
            description: "generate images or videos based on your prompts.",
          },
          {
            title: "Cloudflare R2 / AWS",
            description: "store generated results and temporary assets.",
          },
        ],
      },
      {
        heading: "Retention & deletion",
        body: [
          "Generated results remain in your library until you delete them. If you close your account, we erase personal data and associated media within 30 days unless we must retain it for legal, accounting, or security obligations.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You may update account details, delete outputs, or request a copy of your data at any time. Email us at ",
        ],
        linkLabel: supportEmail,
      },
      {
        heading: "Security",
        body: [
          "We employ HTTPS everywhere, scoped API tokens, role-based access controls, and continuous monitoring. Despite these safeguards, no online service can guarantee absolute security, so please keep your credentials confidential.",
        ],
      },
      {
        heading: "Children",
        body: [
          "RiverFlow is not intended for individuals under 13 years old (or the age of majority where you live). We do not knowingly collect data from children.",
        ],
      },
      {
        heading: "Changes",
        body: [
          "We will post updates to this policy on this page and adjust the \"Last updated\" date. Material changes will be announced inside the product or via email.",
        ],
      },
    ],
  },
  zh: {
    title: "隐私政策",
    updatedLabel: "最后更新",
    updated: "2024 年 10 月",
    intro:
      "RiverFlow.art（以下简称“本服务”）提供 AI 图像与视频生成功能。本政策说明我们收集哪些数据、如何使用这些数据以及您在使用 RiverFlow 时拥有的权利。",
    sections: [
      {
        heading: "我们收集的信息",
        body: [
          "我们仅收集运行 RiverFlow 所需的最少数据，并用于保障账户安全。",
        ],
        items: [
          {
            title: "账户与身份验证",
            description:
              "您在登录时提供的姓名、邮箱及 OAuth 资料。密码由 Google OAuth 负责验证，我们不会存储您的密码。",
          },
          {
            title: "账单信息",
            description:
              "订阅和付款由 Creem.io 代为处理，我们不会接触或保存您的完整银行卡信息。",
          },
          {
            title: "生成内容",
            description:
              "提示词、模型配置及生成结果的元数据会被保存，方便您回看历史记录。源素材和输出文件存储在 Cloudflare R2 中，以便随时重新下载。",
          },
          {
            title: "使用数据",
            description:
              "我们会记录 IP、设备类型、访问页面等基础日志，用于改进服务稳定性与防止滥用，不接入第三方广告追踪。",
          },
        ],
      },
      {
        heading: "我们如何使用这些信息",
        body: [
          "这些数据用于运行 RiverFlow、交付生成结果、提供客服支持，并在必要时向您发送积分或安全相关通知。我们绝不会出售您的个人信息。",
        ],
      },
      {
        heading: "数据存储位置",
        body: [
          "上传文件及最终输出存储在 Cloudflare R2（具备多地备份）。您选择的模型供应商（如 Replicate）仅会接收到执行该模型所需的数据。日志与监控托管在位于美国的 AWS 基础设施上。",
        ],
      },
      {
        heading: "第三方处理方",
        body: [
          "我们会与经过审核的合作伙伴协作，所有伙伴均签订数据处理协议：",
        ],
        items: [
          { title: "Creem.io", description: "负责订阅支付与结算。" },
          { title: "Google OAuth", description: "提供安全的身份验证。" },
          { title: "Replicate 等模型供应商", description: "根据您的提示词生成内容。" },
          { title: "Cloudflare R2 / AWS", description: "存储生成结果与临时素材。" },
        ],
      },
      {
        heading: "数据保留与删除",
        body: [
          "生成结果会保留在您的作品库中，直到您主动删除。若您注销账户，我们将在 30 天内删除个人数据及相关媒体（除非法律、财务或安全原因需要保留）。",
        ],
      },
      {
        heading: "您的权利",
        body: [
          "您可随时更新账户信息、删除历史作品或向我们申请导出数据。请发送邮件至 ",
        ],
        linkLabel: supportEmail,
      },
      {
        heading: "安全措施",
        body: [
          "我们采用全站 HTTPS、限权 API 令牌、基于角色的访问控制以及持续监控等措施。尽管如此，任何在线服务都无法保证绝对安全，请妥善保管您的登录凭证。",
        ],
      },
      {
        heading: "未成年人",
        body: [
          "RiverFlow 不面向 13 岁以下（或您所在地法定成年年龄以下）人士使用，我们也不会主动收集儿童信息。",
        ],
      },
      {
        heading: "政策变更",
        body: [
          "若本政策发生重大调整，我们会在此页面更新并同步通知用户。继续使用本服务即表示您接受更新后的条款。",
        ],
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  const locale = useLocale();
  const copy = PRIVACY_CONTENT[locale === "zh" ? "zh" : "en"];

  const renderItems = (items?: { title: string; description: string }[]) => {
    if (!items) return null;
    return (
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.title} className="flex gap-3 text-sm text-slate-300">
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500/80" />
            <div>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-1 leading-relaxed text-slate-300">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main className="min-h-screen w-full bg-[#05070f] py-20 px-4 text-slate-200">
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1221]/95 via-[#070b14]/95 to-[#05070f]/95 p-8 shadow-[0_0_60px_rgba(15,23,42,0.55)] sm:p-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 right-[-10%] h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-[-30%] left-[-20%] h-72 w-72 rounded-full bg-purple-500/15 blur-[140px]" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300/70">
            {copy.updatedLabel}: {copy.updated}
          </p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300">
            {copy.intro}
          </p>
        </header>

        <div className="space-y-10">
          {copy.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                {section.heading}
              </h2>
              {section.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-slate-300"
                >
                  {paragraph}
                  {section.linkLabel && paragraph.includes("邮件") && (
                    <>
                      <Link
                        href={`mailto:${supportEmail}`}
                        className="text-blue-300 underline decoration-dotted underline-offset-4"
                      >
                        {section.linkLabel}
                      </Link>
                      。
                    </>
                  )}
                  {section.linkLabel &&
                    paragraph.includes("Email us at ") && (
                      <>
                        <Link
                          href={`mailto:${supportEmail}`}
                          className="text-blue-300 underline decoration-dotted underline-offset-4"
                        >
                          {section.linkLabel}
                        </Link>
                        .
                      </>
                    )}
                </p>
              ))}
              {renderItems(section.items)}
            </section>
          ))}
        </div>

        <footer className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
          <p className="text-sm text-slate-200">
            {locale === "zh"
              ? "如需访问、导出或删除您的数据，请发送邮件至"
              : "For any privacy requests, reach out at"}{" "}
            <Link
              href={`mailto:${supportEmail}`}
              className="text-blue-300 underline decoration-dotted underline-offset-4"
            >
              {supportEmail}
            </Link>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}

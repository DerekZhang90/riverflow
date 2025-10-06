"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

const supportEmail = "zhangshaopu1990@gmail.com";

type LegalSection = {
  heading: string;
  body?: string[];
  items?: { title: string; description: string }[];
  linkLabel?: string;
};

type TermsContent = {
  title: string;
  effectiveLabel: string;
  effective: string;
  intro: string;
  sections: LegalSection[];
};

const TERMS_CONTENT: Record<"en" | "zh", TermsContent> = {
  en: {
    title: "Terms of Service",
    effectiveLabel: "Effective date",
    effective: "October 2024",
    intro:
      "These Terms describe the relationship between you (“User”) and RiverFlow.art regarding the use of our AI image and video generation platform (the “Service”). By creating an account or using the Service you agree to be bound by these Terms.",
    sections: [
      {
        heading: "Account & eligibility",
        body: [
          "You must be at least 13 years old (or the age of digital consent where you live) and capable of entering into a binding agreement. You are responsible for the security of your account and for all activity that occurs under it.",
        ],
      },
      {
        heading: "Credits, billing & subscriptions",
        items: [
          {
            title: "Credit consumption",
            description:
              "Each generated image or video deducts one credit unless a model explicitly states otherwise. Credits are tied to your plan and reset based on the billing interval.",
          },
          {
            title: "Billing",
            description:
              "Stripe processes all payments securely. Subscription renewals are charged automatically until you cancel. Cancelled plans remain active until the end of the current billing period.",
          },
          {
            title: "Refunds",
            description:
              "Payments are non-refundable except where required by applicable law. Contact us if you believe a charge was made in error.",
          },
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "You agree not to use the Service to violate any law, impersonate others, create deceptive media without disclosure, generate malicious code, or attempt to extract the underlying models or infrastructure. We may suspend access if we detect abuse or excessive automated traffic.",
        ],
      },
      {
        heading: "Generated content & ownership",
        body: [
          "You keep ownership of prompts, uploads, and outputs you create. You grant RiverFlow a limited licence to process that material for the sole purpose of delivering the Service and improving safety. You are solely responsible for ensuring that your prompts and results comply with applicable intellectual property and publicity laws.",
        ],
      },
      {
        heading: "Service changes",
        body: [
          "We may modify or discontinue features, models, or pricing at any time. We will provide notice for material changes that significantly impact your paid plan. We do not guarantee uninterrupted availability or permanent storage of outputs.",
        ],
      },
      {
        heading: "Third-party services",
        body: [
          "Generation relies on external providers such as Replicate, Stripe, Google OAuth, and Cloudflare R2. Their respective terms control your relationship with them. We are not responsible for outages or data loss caused by those providers.",
        ],
      },
      {
        heading: "Disclaimers & limitation of liability",
        body: [
          "The Service is provided “as is” without warranties of any kind. To the maximum extent permitted by law, RiverFlow is not liable for indirect, incidental, or consequential damages, and our total liability is limited to the fees you paid in the preceding 12 months.",
        ],
      },
      {
        heading: "Termination",
        body: [
          "You may stop using RiverFlow at any time. We may suspend or terminate access if you violate these Terms or misuse the Service. Upon termination we may delete your data in accordance with our Privacy Policy.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These Terms are governed by the laws of Singapore. Disputes will be resolved through good-faith negotiation, followed by arbitration in Singapore if necessary. BY USING THE SERVICE YOU WAIVE THE RIGHT TO PARTICIPATE IN CLASS ACTIONS AGAINST RIVERFLOW.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Questions about these Terms may be sent to ",
        ],
        linkLabel: supportEmail,
      },
    ],
  },
  zh: {
    title: "服务条款",
    effectiveLabel: "生效日期",
    effective: "2024 年 10 月",
    intro:
      "本条款适用于您（“用户”）与 RiverFlow.art 之间关于使用本 AI 图像 / 视频生成平台（“本服务”）的约定。创建账户或实际使用本服务即表示您同意并遵守本条款。",
    sections: [
      {
        heading: "账户与资格",
        body: [
          "您必须年满 13 岁（或所在地允许使用数字服务的法定年龄），并具备签署合同的能力。您需自行保管账户安全，对账户下的一切操作负责。",
        ],
      },
      {
        heading: "积分、计费与订阅",
        items: [
          {
            title: "积分扣除",
            description:
              "除非模型另有说明，每生成一张图片或一个视频扣除 1 积分。积分与您的订阅计划绑定，并按计费周期重置。",
          },
          {
            title: "付款",
            description:
              "所有付款均由 Stripe 安全处理。订阅会自动续费，直到您取消为止。取消后服务会持续至当前计费周期结束。",
          },
          {
            title: "退款政策",
            description:
              "除非相关法律另有要求，所有付款不予退款。如您认为扣款有误，请与我们联系。",
          },
        ],
      },
      {
        heading: "合规与禁止行为",
        body: [
          "请勿将本服务用于违法违规、冒充他人、生成未披露的深度伪造、传播恶意代码或尝试逆向工程模型。若我们发现滥用或异常流量，有权限制或终止您的访问。",
        ],
      },
      {
        heading: "生成内容与所有权",
        body: [
          "您的提示词、上传素材及生成结果归您所有。您授予 RiverFlow 限定许可，仅用于提供和改进本服务。您需自行确保内容符合适用的知识产权、肖像权及其他法律要求。",
        ],
      },
      {
        heading: "服务变更",
        body: [
          "我们可能随时调整或下线某些功能、模型或价格。如变更对您的付费计划产生重大影响，我们会提前通知。我们不承诺服务始终可用，也不保证长期存储所有结果。",
        ],
      },
      {
        heading: "第三方服务",
        body: [
          "本服务依赖 Replicate、Stripe、Google OAuth、Cloudflare R2 等第三方提供支撑。这些服务可能适用各自的条款，我们不对其故障或造成的数据丢失负责。",
        ],
      },
      {
        heading: "免责声明与责任限制",
        body: [
          "本服务按“现状”提供，不附带任何明示或默示的保证。在法律允许的最大范围内，RiverFlow 不对任何间接、附带或衍生损失承担责任，且总赔偿责任不超过您在前 12 个月内支付的费用。",
        ],
      },
      {
        heading: "终止",
        body: [
          "您可随时停止使用本服务。如您违反本条款或滥用本服务，我们有权暂停或终止您的访问。终止后我们可根据隐私政策删除相关数据。",
        ],
      },
      {
        heading: "适用法律",
        body: [
          "本条款受新加坡法律管辖。若发生争议，双方应先友好协商，未果则提交新加坡仲裁解决。使用本服务即表示您放弃针对 RiverFlow 发起集体诉讼的权利。",
        ],
      },
      {
        heading: "联系方式",
        body: [
          "如对条款有任何疑问，请发送邮件至 ",
        ],
        linkLabel: supportEmail,
      },
    ],
  },
};

export default function TermsOfServicePage() {
  const locale = useLocale();
  const copy = TERMS_CONTENT[locale === "zh" ? "zh" : "en"];

  const renderItems = (items?: { title: string; description: string }[]) => {
    if (!items) return null;
    return (
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.title} className="flex gap-3 text-sm text-slate-300">
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500/80" />
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
          <div className="absolute -top-28 left-[-15%] h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-[-35%] right-[-20%] h-72 w-72 rounded-full bg-blue-500/15 blur-[140px]" />
        </div>

        <header className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300/70">
            {copy.effectiveLabel}: {copy.effective}
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
                    paragraph.includes("Questions about these Terms") && (
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
      </div>
    </main>
  );
}

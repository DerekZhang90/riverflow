import Price from "@/components/price/app";
import { getMetadata } from "@/components/seo/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(params?.locale || "", "Pricing.seo", "pricing");
}

export default function PricingPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center bg-[#05070f] px-4 pb-24 pt-28 md:px-6 md:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
        <div className="absolute left-[10%] top-[-15%] h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute right-[5%] bottom-[-20%] h-80 w-80 rounded-full bg-indigo-500/15 blur-[160px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
        <Price />
      </div>
    </main>
  );
}

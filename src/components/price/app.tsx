"use client";

import type { Key } from "react";
import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Link,
  Tab,
  Tabs,
} from "@heroui/react";
import { cn } from "@heroui/react";

import type { Tier } from "@/components/price/pricing-types";
import { FrequencyEnum } from "@/components/price/pricing-types";
import { frequencies, tiers } from "@/components/price/pricing-tiers";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formatCurrency = (value: number) => {
  const hasDecimals = Math.round(value * 100) % 100 !== 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
};

type PriceDetails = {
  displayPrice: string;
  strikePrice?: string;
  subCopy: string;
  savingsPercent?: number;
};

const getPriceDetails = (
  tier: Tier,
  frequency: FrequencyEnum
): PriceDetails => {
  const monthlyAmount = tier.amount[FrequencyEnum.Monthly] / 100;
  const yearlyTotal = tier.amount[FrequencyEnum.Yearly] / 100;

  if (frequency === FrequencyEnum.Monthly) {
    return {
      displayPrice: formatCurrency(monthlyAmount),
      subCopy: "Billed monthly, cancel anytime",
    };
  }

  const monthlyEquivalent = yearlyTotal / 12;
  const savingsPercent = monthlyAmount
    ? Math.round((1 - monthlyEquivalent / monthlyAmount) * 100)
    : undefined;

  return {
    displayPrice: formatCurrency(monthlyEquivalent),
    strikePrice: formatCurrency(monthlyAmount),
    subCopy: `${formatCurrency(yearlyTotal)} billed yearly`,
    savingsPercent,
  };
};

const defaultFrequency =
  frequencies.find((frequency) => frequency.key === FrequencyEnum.Yearly) ??
  frequencies[0];

export default function Pricing() {
  const [selectedFrequency, setSelectedFrequency] = useState(defaultFrequency);
  const { user } = useAppContext();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const router = useRouter();

  const onFrequencyChange = (selectedKey: Key) => {
    const nextFrequency = frequencies.find((f) => f.key === selectedKey);

    if (nextFrequency) {
      setSelectedFrequency(nextFrequency);
    }
  };

  const handleCheckout = async (productId: string) => {
    try {
      setLoadingProductId(productId);

      const params = {
        product_id: productId,
        user_id: user?.uuid,
        user_email: user?.email,
      };

      const response = await fetch("/api/creem/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error("Please sign in to purchase a plan.");
        router.push("/api/auth/signin");
        return;
      }

      if (response.status === 500) {
        const errorMessage = data.error || "Checkout failed. Please try again.";
        toast.error(errorMessage);
        return;
      }

      if (!data || !data.checkout_url) {
        toast.error("Invalid response from server");
        return;
      }

      window.location.href = data.checkout_url;
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again later.");
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0f1d] via-[#070910] to-black px-6 py-12 shadow-[0_0_60px_rgba(15,23,42,0.45)] sm:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-15%] h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute bottom-[-40%] left-[-20%] h-96 w-96 rounded-full bg-purple-500/20 blur-[130px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center">
        <Chip
          size="sm"
          variant="flat"
          className="border border-blue-500/40 bg-blue-500/10 text-blue-200"
        >
          Pricing made for creative flow
        </Chip>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Choose the RiverFlow plan that fits your workflow
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-400 md:text-lg">
            Unlock consistent image and video generations with predictable credit
            allowances and fast Creem-powered billing.
          </p>
        </div>

        <Tabs
          className="mt-2"
          classNames={{
            tabList:
              "rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur-xl",
            cursor:
              "rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
            tab: "rounded-full text-xs font-medium uppercase tracking-wide md:text-sm",
            tabContent:
              "px-3 py-1 text-[11px] text-slate-300 data-[selected=true]:text-white md:px-4 md:py-2",
          }}
          radius="full"
          selectedKey={selectedFrequency.key}
          onSelectionChange={onFrequencyChange}
        >
          <Tab
            key={FrequencyEnum.Yearly}
            title={
              <div className="flex items-center gap-2">
                <span>Pay yearly</span>
                <Chip
                  size="sm"
                  color="secondary"
                  variant="flat"
                  className="border border-blue-400/40 bg-blue-500/10 text-[10px] uppercase tracking-wide text-blue-200"
                >
                  Save more
                </Chip>
              </div>
            }
          />
          <Tab key={FrequencyEnum.Monthly} title="Pay monthly" />
        </Tabs>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tiers.map((tier) => {
            const productId = tier.creem_product_id?.[selectedFrequency.key];
            const priceDetails = getPriceDetails(tier, selectedFrequency.key);
            const features = tier.features?.[selectedFrequency.key] ?? [];
            const isComingSoon = tier.buttonText === "Coming Soon";

            return (
              <Card
                key={tier.key}
                shadow="none"
                className={cn(
                  "relative h-full border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl transition-all duration-200",
                  tier.mostPopular
                    ? "border-blue-500/60 shadow-[0_0_45px_rgba(37,99,235,0.45)]"
                    : "hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_20px_50px_-12px_rgba(30,64,175,0.35)]"
                )}
              >
                {tier.mostPopular ? (
                  <Chip
                    size="sm"
                    color="secondary"
                    variant="solid"
                    className="absolute right-4 top-4 bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  >
                    Most popular
                  </Chip>
                ) : null}

                <CardHeader
                  className={cn(
                    "flex flex-col items-start gap-3 pb-4",
                    tier.mostPopular ? "pt-14" : "pt-8"
                  )}
                >
                  <div className="flex w-full flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">
                      {tier.title}
                    </h3>
                    {selectedFrequency.key === FrequencyEnum.Yearly &&
                    priceDetails.savingsPercent ? (
                      <Chip
                        size="sm"
                        variant="flat"
                        className="border border-green-400/40 bg-green-500/10 text-[11px] font-semibold uppercase tracking-wide text-green-200"
                      >
                        Save {priceDetails.savingsPercent}%
                      </Chip>
                    ) : null}
                  </div>
                  {tier.description ? (
                    <p className="text-sm text-slate-400">{tier.description}</p>
                  ) : null}
                </CardHeader>

                <CardBody className="flex flex-1 flex-col gap-6">
                  <div className="flex flex-col gap-2 text-left">
                    <div className="flex flex-wrap items-baseline gap-3">
                      {priceDetails.strikePrice ? (
                        <span className="text-sm font-medium text-slate-500 line-through">
                          {priceDetails.strikePrice}
                          <span className="ml-1 text-[11px] uppercase text-slate-500">
                            /mo
                          </span>
                        </span>
                      ) : null}

                      <span className="text-4xl font-semibold text-white md:text-5xl">
                        {priceDetails.displayPrice}
                      </span>
                      <span className="text-sm text-slate-400 uppercase tracking-wide">
                        /mo
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{priceDetails.subCopy}</p>
                  </div>

                  <ul className="flex flex-1 flex-col gap-3 text-left">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-200"
                      >
                        <Icon
                          className="mt-0.5 text-blue-400"
                          icon="solar:verified-check-bold"
                          width={20}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>

                <CardFooter className="mt-auto">
                  <Button
                    fullWidth
                    as={Link}
                    href={tier.href}
                    isDisabled={isComingSoon || !productId}
                    isLoading={productId ? loadingProductId === productId : false}
                    className={cn(
                      "h-12 w-full rounded-xl border border-white/10 text-base font-semibold transition-all duration-200",
                      isComingSoon || !productId
                        ? "cursor-not-allowed bg-white/5 text-slate-500"
                        : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-blue-500/20 hover:brightness-110"
                    )}
                    onPress={() => {
                      if (isComingSoon) {
                        toast.info("This plan is launching soon.");
                        return;
                      }

                      if (!productId) {
                        toast.error("Checkout unavailable for this plan yet.");
                        return;
                      }

                      handleCheckout(productId);
                    }}
                  >
                    {isComingSoon
                      ? "Coming soon"
                      : selectedFrequency.key === FrequencyEnum.Yearly
                      ? "Start yearly plan"
                      : "Start monthly plan"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

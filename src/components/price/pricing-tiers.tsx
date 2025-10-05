import type { Frequency, Tier } from "./pricing-types";

import { FrequencyEnum, TiersEnum } from "./pricing-types";

export const frequencies: Array<Frequency> = [
  {
    key: FrequencyEnum.Monthly,
    label: "Pay Monthly",
    priceSuffix: "per month",
  },
  { key: FrequencyEnum.Yearly, label: "Pay Yearly", priceSuffix: "per month" },
  {
    key: FrequencyEnum.OneTime,
    label: "Pay One Time",
    priceSuffix: "one time",
  },
];

export const tiers: Array<Tier> = [
  {
    key: TiersEnum.Basic,
    id: {
      [FrequencyEnum.Monthly]: 2,
      [FrequencyEnum.Yearly]: 5,
      [FrequencyEnum.OneTime]: 1,
    },
    creem_product_id: {
      [FrequencyEnum.Monthly]: process.env.NEXT_PUBLIC_CREEM_BASIC_MONTHLY_ID || "prod_5TLtrKUp7537Jgtrx5s1uP",
      [FrequencyEnum.Yearly]: process.env.NEXT_PUBLIC_CREEM_BASIC_YEARLY_ID || "prod_5m2LBexHimUQ3RvI4mk4Ez",
    },
    amount: {
      [FrequencyEnum.Monthly]: 990,    // $9.90
      [FrequencyEnum.Yearly]: 9900,    // $99.00
      [FrequencyEnum.OneTime]: 990,    // $9.90
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Basic",
    price: {
      yearly: "$99",
      monthly: "$9.9",
      onetime: "$9.9",
    },
    previousPrice: {
      yearly: "",
      monthly: "",
      onetime: "",
    },
    href: "#",
    featured: false,
    mostPopular: false,
    description: "For starters and hobbyists exploring AI image generation",
    features: {
      yearly: ["3600 credits per year", "300 credits/month average", "All AI models", "R2 cloud storage", "Email support"],
      monthly: [
        "300 credits per month",
        "~300 images",
        "All AI models",
        "R2 cloud storage",
        "Email support",
      ],
      onetime: [
        "300 credits one time",
        "~300 images",
        "All AI models",
        "R2 cloud storage",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Standard,
    id: {
      [FrequencyEnum.Yearly]: 6,
      [FrequencyEnum.Monthly]: 3,
      [FrequencyEnum.OneTime]: 9,
    },
    creem_product_id: {
      [FrequencyEnum.Monthly]: process.env.NEXT_PUBLIC_CREEM_STANDARD_MONTHLY_ID || "prod_gGpwNNaqQTBzfCBYmjdfq",
      [FrequencyEnum.Yearly]: process.env.NEXT_PUBLIC_CREEM_STANDARD_YEARLY_ID || "prod_43iHTRN9qITBvfcnj9cvWO",
    },
    amount: {
      [FrequencyEnum.Yearly]: 19900,   // $199.00
      [FrequencyEnum.Monthly]: 1990,   // $19.90
      [FrequencyEnum.OneTime]: 1990,   // $19.90
    },
    interval: {
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Standard",
    description: "For enthusiasts who create regularly",
    href: "#",
    mostPopular: true,
    price: {
      yearly: "$199",
      monthly: "$19.9",
      onetime: "$19.9",
    },
    previousPrice: {
      yearly: "",
      monthly: "",
      onetime: "",
    },
    featured: false,
    features: {
      yearly: ["8400 credits per year", "700 credits/month average", "All AI models", "R2 cloud storage", "Priority email support"],
      monthly: [
        "700 credits per month",
        "~700 images",
        "All AI models",
        "R2 cloud storage",
        "Priority email support",
      ],
      onetime: [
        "700 credits one time",
        "~700 images",
        "All AI models",
        "R2 cloud storage",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Premium,
    id: {
      [FrequencyEnum.Yearly]: 8,
      [FrequencyEnum.Monthly]: 4,
      [FrequencyEnum.OneTime]: 11,
    },
    creem_product_id: {
      [FrequencyEnum.Monthly]: process.env.NEXT_PUBLIC_CREEM_PREMIUM_MONTHLY_ID || "prod_7Rj7nmIGlKFOo8j5KLxztc",
      [FrequencyEnum.Yearly]: process.env.NEXT_PUBLIC_CREEM_PREMIUM_YEARLY_ID || "prod_3XSyInvwVn7MRQguyO0kga",
    },
    amount: {
      [FrequencyEnum.Yearly]: 39900,   // $399.00
      [FrequencyEnum.Monthly]: 3990,   // $39.90
      [FrequencyEnum.OneTime]: 3990,   // $39.90
    },
    interval: {
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Premium",
    href: "#",
    featured: true,
    mostPopular: false,
    description: "For professionals and power users",
    price: {
      yearly: "$399",
      monthly: "$39.9",
      onetime: "$39.9",
    },
    previousPrice: {
      yearly: "",
      monthly: "",
      onetime: "",
    },
    priceSuffix: "",
    features: {
      yearly: ["19200 credits per year", "1600 credits/month average", "All AI models", "R2 cloud storage", "Priority support", "Best value - 32% cheaper than official"],
      monthly: [
        "1600 credits per month",
        "~1600 images",
        "All AI models",
        "R2 cloud storage",
        "Priority support",
      ],
      onetime: [
        "1600 credits one time",
        "~1600 images",
        "All AI models",
        "R2 cloud storage",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "secondary",
    buttonVariant: "solid",
  },
];

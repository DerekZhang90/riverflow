import type { Frequency, Tier } from "./pricing-types";

import { FrequencyEnum, TiersEnum } from "./pricing-types";

export const frequencies: Array<Frequency> = [
  {
    key: FrequencyEnum.Monthly,
    label: "Pay Monthly",
    priceSuffix: "per month",
  },
  {
    key: FrequencyEnum.Yearly,
    label: "Pay Yearly",
    priceSuffix: "per month (billed yearly)",
  },
];

export const tiers: Array<Tier> = [
  {
    key: TiersEnum.Basic,
    id: {
      [FrequencyEnum.Monthly]: 2,
      [FrequencyEnum.Yearly]: 5,
    },
    creem_product_id: {
      [FrequencyEnum.Monthly]: process.env.NEXT_PUBLIC_CREEM_BASIC_MONTHLY_ID || "prod_5TLtrKUp7537Jgtrx5s1uP",
      [FrequencyEnum.Yearly]: process.env.NEXT_PUBLIC_CREEM_BASIC_YEARLY_ID || "prod_5m2LBexHimUQ3RvI4mk4Ez",
    },
    amount: {
      [FrequencyEnum.Monthly]: 990,    // $9.90
      [FrequencyEnum.Yearly]: 9900,    // $99.00 billed yearly
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "year",
    },
    title: "Basic",
    href: "#",
    featured: false,
    mostPopular: false,
    description: "For starters and hobbyists exploring AI image generation",
    features: {
      [FrequencyEnum.Yearly]: ["3600 credits / year", "300 credits average per month", "All AI models", "Cloud storage", "Email support"],
      [FrequencyEnum.Monthly]: [
        "300 credits per month",
        "~300 images",
        "All AI models",
        "Cloud storage",
        "Email support",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Standard,
    id: {
      [FrequencyEnum.Monthly]: 3,
      [FrequencyEnum.Yearly]: 6,
    },
    creem_product_id: {
      [FrequencyEnum.Monthly]: process.env.NEXT_PUBLIC_CREEM_STANDARD_MONTHLY_ID || "prod_gGpwNNaqQTBzfCBYmjdfq",
      [FrequencyEnum.Yearly]: process.env.NEXT_PUBLIC_CREEM_STANDARD_YEARLY_ID || "prod_43iHTRN9qITBvfcnj9cvWO",
    },
    amount: {
      [FrequencyEnum.Monthly]: 1990,   // $19.90
      [FrequencyEnum.Yearly]: 19900,   // $199.00 billed yearly
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "year",
    },
    title: "Standard",
    description: "For enthusiasts who create regularly",
    href: "#",
    mostPopular: true,
    featured: false,
    features: {
      [FrequencyEnum.Yearly]: ["8400 credits / year", "700 credits average per month", "All AI models", "Cloud storage", "Priority email support"],
      [FrequencyEnum.Monthly]: [
        "700 credits per month",
        "~700 images",
        "All AI models",
        "Cloud storage",
        "Priority email support",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Premium,
    id: {
      [FrequencyEnum.Monthly]: 4,
      [FrequencyEnum.Yearly]: 8,
    },
    creem_product_id: {
      [FrequencyEnum.Monthly]: process.env.NEXT_PUBLIC_CREEM_PREMIUM_MONTHLY_ID || "prod_7Rj7nmIGlKFOo8j5KLxztc",
      [FrequencyEnum.Yearly]: process.env.NEXT_PUBLIC_CREEM_PREMIUM_YEARLY_ID || "prod_3XSyInvwVn7MRQguyO0kga",
    },
    amount: {
      [FrequencyEnum.Monthly]: 3990,   // $39.90
      [FrequencyEnum.Yearly]: 39900,   // $399.00 billed yearly
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "year",
    },
    title: "Premium",
    href: "#",
    featured: true,
    mostPopular: false,
    description: "For professionals and power users",
    priceSuffix: "",
    features: {
      [FrequencyEnum.Yearly]: ["19200 credits / year", "1600 credits average per month", "All AI models", "Cloud storage", "Priority support", "Best value - 32% cheaper than official"],
      [FrequencyEnum.Monthly]: [
        "1600 credits per month",
        "~1600 images",
        "All AI models",
        "Cloud storage",
        "Priority support",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "secondary",
    buttonVariant: "solid",
  },
];

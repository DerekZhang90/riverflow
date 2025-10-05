import type { ButtonProps } from "@heroui/react";

export enum FrequencyEnum {
  Yearly = "yearly",
  Monthly = "monthly",
}

export enum TiersEnum {
  Basic = "basic",
  Standard = "standard",
  Premium = "premium",
}

export type Frequency = {
  key: FrequencyEnum;
  label: string;
  priceSuffix: string;
};

export type Tier = {
  key: TiersEnum;
  id: {
    [FrequencyEnum.Yearly]: number;
    [FrequencyEnum.Monthly]: number;
  };
  creem_product_id?: {
    [FrequencyEnum.Yearly]?: string;
    [FrequencyEnum.Monthly]?: string;
  };
  amount: {
    [FrequencyEnum.Yearly]: number;
    [FrequencyEnum.Monthly]: number;
  };
  interval: {
    [FrequencyEnum.Yearly]: string;
    [FrequencyEnum.Monthly]: string;
  };
  title: string;
  priceSuffix?: string;
  href: string;
  description?: string;
  mostPopular?: boolean;
  featured?: boolean;
  features?: {
    [key in FrequencyEnum]: string[];
  };
  badge?: string;
  highlight?: string;
  buttonText: string;
  buttonColor?: ButtonProps["color"];
  buttonVariant: ButtonProps["variant"];
};

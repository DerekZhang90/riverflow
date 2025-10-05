import { NextResponse } from "next/server";
import axios from "axios";

// 产品 ID 到 metadata 的映射
const PRODUCT_METADATA: Record<string, { plan_id: string; credits: string; interval: string }> = {
  // Basic
  [process.env.CREEM_BASIC_MONTHLY_ID!]: { plan_id: "2", credits: "300", interval: "month" },
  [process.env.CREEM_BASIC_YEARLY_ID!]: { plan_id: "5", credits: "3600", interval: "year" },
  // Standard
  [process.env.CREEM_STANDARD_MONTHLY_ID!]: { plan_id: "3", credits: "700", interval: "month" },
  [process.env.CREEM_STANDARD_YEARLY_ID!]: { plan_id: "6", credits: "8400", interval: "year" },
  // Premium
  [process.env.CREEM_PREMIUM_MONTHLY_ID!]: { plan_id: "4", credits: "1600", interval: "month" },
  [process.env.CREEM_PREMIUM_YEARLY_ID!]: { plan_id: "8", credits: "19200", interval: "year" },
};

export async function POST(request: Request) {
  const { product_id, user_id, user_email } = await request.json();

  if (!product_id || !user_id || !user_email) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const productMeta = PRODUCT_METADATA[product_id];
  if (!productMeta) {
    return NextResponse.json(
      { error: "Invalid product ID" },
      { status: 400 }
    );
  }

  if (!process.env.CREEM_API_KEY) {
    return NextResponse.json(
      { error: "Creem API key not configured" },
      { status: 500 }
    );
  }

  try {
    console.log(`Creating Creem checkout for user ${user_id}, product ${product_id}`);

    const response = await axios.post(
      "https://api.creem.io/v1/checkouts",
      {
        product_id,
        customer: {
          email: user_email,
        },
        metadata: {
          project: "riverflow",
          user_id,
          plan_id: productMeta.plan_id,
          credits: productMeta.credits,
          interval: productMeta.interval,
        },
        success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?payment=success`,
      },
      {
        headers: {
          "x-api-key": process.env.CREEM_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Checkout created: ${response.data.checkout_url}`);

    return NextResponse.json({
      checkout_url: response.data.checkout_url,
      checkout_id: response.data.id,
    });
  } catch (error: any) {
    console.error("Creem checkout error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error.response?.data?.message || error.message
      },
      { status: 500 }
    );
  }
}

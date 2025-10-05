import { NextResponse } from "next/server";
import crypto from "crypto";
import { pool } from "@/backend/config/db";

// 验证 Creem webhook 签名
function verifySignature(payload: string, signature: string): boolean {
  if (!process.env.CREEM_WEBHOOK_SECRET) {
    console.error("CREEM_WEBHOOK_SECRET not configured");
    return false;
  }

  const computedSignature = crypto
    .createHmac("sha256", process.env.CREEM_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return computedSignature === signature;
}

export async function POST(request: Request) {
  const signature = request.headers.get("creem-signature");
  const rawBody = await request.text();

  // 验证签名
  if (!signature || !verifySignature(rawBody, signature)) {
    console.error("❌ Invalid Creem webhook signature");
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  const event = JSON.parse(rawBody);
  console.log(`📨 Creem webhook event: ${event.type}`);

  try {
    // 检查是否是 RiverFlow 项目的事件
    const project = event.data.product?.metadata?.project ||
                    event.data.subscription?.metadata?.project;

    if (project && project !== "riverflow") {
      console.log(`⏭️  Skipping event for project: ${project}`);
      return NextResponse.json({ received: true });
    }

    switch (event.type) {
      case "subscription.active":
      case "subscription.paid": {
        await handleSubscriptionPaid(event);
        break;
      }

      case "subscription.canceled": {
        await handleSubscriptionCanceled(event);
        break;
      }

      case "subscription.expired": {
        await handleSubscriptionExpired(event);
        break;
      }

      case "checkout.completed": {
        await handleCheckoutCompleted(event);
        break;
      }

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// 处理订阅支付成功
async function handleSubscriptionPaid(event: any) {
  const subscription = event.data.subscription;
  const customer = event.data.customer;
  const transaction = event.data.transaction;
  const product = event.data.product;

  const userId = subscription.metadata?.user_id;
  const planId = subscription.metadata?.plan_id || product.metadata?.plan_id;
  const credits = parseInt(subscription.metadata?.credits || product.metadata?.credits || "0");
  const interval = subscription.metadata?.interval || product.metadata?.interval || "month";

  if (!userId || !planId) {
    console.error("❌ Missing user_id or plan_id in metadata");
    return;
  }

  console.log(`💰 Processing subscription payment for user ${userId}`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. 更新或创建 user_subscriptions 记录
    const subscriptionResult = await client.query(
      `INSERT INTO user_subscriptions (
        user_id, stripe_subscription_id, stripe_customer_id,
        plan_id, status, current_period_start, current_period_end,
        cancel_at_period_end, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      ON CONFLICT (stripe_subscription_id)
      DO UPDATE SET
        status = $5,
        current_period_start = $6,
        current_period_end = $7,
        updated_at = NOW()
      RETURNING id`,
      [
        userId,
        subscription.id,
        customer.id,
        parseInt(planId),
        "active",
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        false,
      ]
    );

    const subscriptionId = subscriptionResult.rows[0].id;

    // 2. 更新 credit_usage
    await client.query(
      `INSERT INTO credit_usage (
        user_id, user_subscriptions_id, used_count,
        period_start, period_end, is_subscription_active,
        period_remain_count, created_at, updated_at
      ) VALUES ($1, $2, 0, $3, $4, true, $5, NOW(), NOW())
      ON CONFLICT (user_id, user_subscriptions_id)
      DO UPDATE SET
        period_start = $3,
        period_end = $4,
        period_remain_count = $5,
        used_count = 0,
        is_subscription_active = true,
        updated_at = NOW()`,
      [
        userId,
        subscriptionId,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        credits,
      ]
    );

    // 3. 记录支付历史
    await client.query(
      `INSERT INTO payment_history (
        user_id, user_subscriptions_id, amount, currency,
        status, payment_intent, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        userId,
        subscriptionId,
        transaction.amount / 100, // Creem 返回的是分
        transaction.currency.toUpperCase(),
        "succeeded",
        transaction.id,
      ]
    );

    await client.query("COMMIT");
    console.log(`✅ Subscription activated: ${credits} credits for user ${userId}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// 处理订阅取消
async function handleSubscriptionCanceled(event: any) {
  const subscription = event.data.subscription;
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error("❌ Missing user_id in metadata");
    return;
  }

  console.log(`❌ Canceling subscription for user ${userId}`);

  await pool.query(
    `UPDATE user_subscriptions
     SET status = 'canceled',
         cancel_at_period_end = true,
         updated_at = NOW()
     WHERE stripe_subscription_id = $1`,
    [subscription.id]
  );

  console.log(`✅ Subscription canceled for user ${userId}`);
}

// 处理订阅过期
async function handleSubscriptionExpired(event: any) {
  const subscription = event.data.subscription;
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error("❌ Missing user_id in metadata");
    return;
  }

  console.log(`⏱️  Subscription expired for user ${userId}`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 更新订阅状态
    await client.query(
      `UPDATE user_subscriptions
       SET status = 'expired', updated_at = NOW()
       WHERE stripe_subscription_id = $1`,
      [subscription.id]
    );

    // 停用积分
    await client.query(
      `UPDATE credit_usage
       SET is_subscription_active = false,
           period_remain_count = 0,
           updated_at = NOW()
       WHERE user_id = $1
         AND user_subscriptions_id = (
           SELECT id FROM user_subscriptions
           WHERE stripe_subscription_id = $2
         )`,
      [userId, subscription.id]
    );

    await client.query("COMMIT");
    console.log(`✅ Subscription expired and credits deactivated for user ${userId}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// 处理一次性支付完成（如果将来支持一次性积分包）
async function handleCheckoutCompleted(event: any) {
  const checkout = event.data.checkout;
  const product = event.data.product;

  // 检查是否是订阅类型，订阅由 subscription.paid 处理
  if (product.billing_type === "recurring") {
    console.log("ℹ️  Subscription checkout, handled by subscription.paid event");
    return;
  }

  // 一次性支付逻辑（未来扩展）
  console.log(`💰 One-time checkout completed: ${checkout.id}`);
}

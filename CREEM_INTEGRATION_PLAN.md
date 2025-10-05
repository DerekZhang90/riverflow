# Creem.io 集成方案

**版本**: v1.0
**日期**: 2025-10-05
**状态**: 设计阶段

---

## 📋 Creem.io vs Stripe 对比

| 功能 | Stripe | Creem.io | 差异 |
|------|--------|----------|------|
| **Webhook 事件** | `customer.subscription.created/updated/deleted` | `subscription.active/paid/canceled/expired` | 事件名称不同 |
| **签名验证** | Stripe-Signature header | creem-signature header (HMAC-SHA256) | 验证方式相似 |
| **Checkout** | Session API | `/v1/checkouts` API | API 端点不同 |
| **产品创建** | Dashboard + API | Dashboard + API | 相似 |
| **客户门户** | 需要自建或用 Stripe Portal | 内置 Customer Portal | Creem 更简单 |

---

## 🔑 关键 Webhook 事件映射

### Creem.io 订阅事件 → 应用逻辑

| Creem Event | 触发时机 | 应用处理 | 对应的 Stripe 事件 |
|-------------|---------|---------|-------------------|
| `subscription.active` | 新订阅创建 | 创建 user_subscriptions 记录 | `customer.subscription.created` |
| `subscription.paid` | 订阅支付成功 | 更新 credit_usage, payment_history | `invoice.payment_succeeded` |
| `subscription.canceled` | 订阅取消 | 更新订阅状态为取消 | `customer.subscription.deleted` |
| `subscription.expired` | 订阅过期(未续费) | 停用订阅,清空积分 | `customer.subscription.deleted` |
| `subscription.update` | 订阅修改 | 更新订阅信息 | `customer.subscription.updated` |
| `checkout.completed` | 一次性支付完成 | 添加一次性积分 | `checkout.session.completed` |

---

## 🏗️ 集成架构

### 1. 产品配置 (Creem Dashboard)

需要在 Creem.io 创建 6 个订阅产品:

```
Basic 月付:
  - name: "Basic Monthly"
  - price: 990 (分,即 $9.90)
  - currency: "USD"
  - billing_type: "recurring"
  - billing_period: "every-month"
  - metadata: { plan_id: "2", credits: "300" }

Basic 年付:
  - name: "Basic Yearly"
  - price: 9900 ($99.00)
  - billing_period: "every-year"
  - metadata: { plan_id: "5", credits: "3600" }

Standard 月付:
  - name: "Standard Monthly"
  - price: 1990 ($19.90)
  - billing_period: "every-month"
  - metadata: { plan_id: "3", credits: "700" }

Standard 年付:
  - name: "Standard Yearly"
  - price: 19900 ($199.00)
  - billing_period: "every-year"
  - metadata: { plan_id: "6", credits: "8400" }

Premium 月付:
  - name: "Premium Monthly"
  - price: 3990 ($39.90)
  - billing_period: "every-month"
  - metadata: { plan_id: "4", credits: "1600" }

Premium 年付:
  - name: "Premium Yearly"
  - price: 39900 ($399.00)
  - billing_period: "every-year"
  - metadata: { plan_id: "8", credits: "19200" }
```

### 2. 环境变量配置

```env
# Creem.io 配置
CREEM_API_KEY="creem_your_api_key_here"
CREEM_WEBHOOK_SECRET="your_webhook_secret_here"
NEXT_PUBLIC_CREEM_PUBLISHABLE_KEY="creem_pk_your_publishable_key" # 如果需要

# 产品 ID (从 Creem Dashboard 获取)
CREEM_BASIC_MONTHLY_ID="prod_xxx"
CREEM_BASIC_YEARLY_ID="prod_xxx"
CREEM_STANDARD_MONTHLY_ID="prod_xxx"
CREEM_STANDARD_YEARLY_ID="prod_xxx"
CREEM_PREMIUM_MONTHLY_ID="prod_xxx"
CREEM_PREMIUM_YEARLY_ID="prod_xxx"
```

### 3. API 路由实现

#### 3.1 创建 Checkout Session

**文件**: `src/app/api/creem/create-checkout/route.ts`

```typescript
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const { product_id, user_id, user_email } = await request.json();

  try {
    const response = await axios.post(
      "https://api.creem.io/v1/checkouts",
      {
        product_id,
        customer: {
          email: user_email,
        },
        metadata: {
          user_id, // 用于 webhook 关联用户
        },
        success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?payment=success`,
      },
      {
        headers: {
          "x-api-key": process.env.CREEM_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      checkout_url: response.data.checkout_url,
    });
  } catch (error: any) {
    console.error("Creem checkout error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
```

#### 3.2 Webhook 处理

**文件**: `src/app/api/webhook/creem/route.ts`

```typescript
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createOrUpdateSubscription } from "@/backend/service/user_subscriptions";
import { updateCreditUsage } from "@/backend/service/credit_usage";
import { createPaymentHistory } from "@/backend/service/payment_history";

// 验证 webhook 签名
function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.CREEM_WEBHOOK_SECRET!;
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return computedSignature === signature;
}

export async function POST(request: Request) {
  const signature = request.headers.get("creem-signature");
  const rawBody = await request.text();

  if (!signature || !verifySignature(rawBody, signature)) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  const event = JSON.parse(rawBody);
  console.log("Creem webhook event:", event.type);

  try {
    switch (event.type) {
      case "subscription.active":
      case "subscription.paid": {
        // 订阅创建或支付成功
        const subscription = event.data.subscription;
        const customer = event.data.customer;
        const transaction = event.data.transaction;
        const product = event.data.product;

        const userId = subscription.metadata?.user_id;
        const planId = product.metadata?.plan_id;
        const credits = parseInt(product.metadata?.credits || "0");

        if (!userId || !planId) {
          console.error("Missing user_id or plan_id in metadata");
          break;
        }

        // 1. 更新或创建订阅记录
        await createOrUpdateSubscription({
          user_id: userId,
          subscription_id: subscription.id,
          plan_id: parseInt(planId),
          status: "active",
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
          cancel_at_period_end: false,
        });

        // 2. 更新积分
        await updateCreditUsage({
          user_id: userId,
          subscription_id: subscription.id,
          period_start: new Date(subscription.current_period_start * 1000),
          period_end: new Date(subscription.current_period_end * 1000),
          period_remain_count: credits,
          used_count: 0,
          is_subscription_active: true,
        });

        // 3. 记录支付历史
        await createPaymentHistory({
          user_id: userId,
          subscription_id: subscription.id,
          amount: transaction.amount / 100, // Creem 返回的是分
          currency: transaction.currency,
          status: "succeeded",
          payment_intent: transaction.id,
          created_at: new Date(transaction.created_at * 1000),
        });

        console.log(`✅ Subscription activated for user ${userId}`);
        break;
      }

      case "subscription.canceled": {
        // 订阅取消
        const subscription = event.data.subscription;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          await createOrUpdateSubscription({
            user_id: userId,
            subscription_id: subscription.id,
            status: "canceled",
            cancel_at_period_end: true,
          });

          console.log(`❌ Subscription canceled for user ${userId}`);
        }
        break;
      }

      case "subscription.expired": {
        // 订阅过期
        const subscription = event.data.subscription;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          await createOrUpdateSubscription({
            user_id: userId,
            subscription_id: subscription.id,
            status: "expired",
          });

          await updateCreditUsage({
            user_id: userId,
            is_subscription_active: false,
            period_remain_count: 0,
          });

          console.log(`⏱️ Subscription expired for user ${userId}`);
        }
        break;
      }

      case "checkout.completed": {
        // 一次性支付完成
        const checkout = event.data.checkout;
        const product = event.data.product;
        const userId = checkout.metadata?.user_id;
        const credits = parseInt(product.metadata?.credits || "0");

        if (userId && product.billing_type === "onetime") {
          // 一次性积分包,添加到现有积分
          await updateCreditUsage({
            user_id: userId,
            period_remain_count: credits, // 增加积分
          });

          console.log(`💰 One-time purchase: ${credits} credits for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### 4. 前端集成

#### 4.1 更新价格组件

**文件**: `src/components/price/pricing-button.tsx`

```typescript
"use client";

import { Button } from "@nextui-org/react";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PricingButtonProps {
  productId: string; // Creem product ID
  planName: string;
  price: string;
}

export default function PricingButton({ productId, planName, price }: PricingButtonProps) {
  const { user } = useAppContext();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/creem/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_id: user.uuid,
          user_email: user.email,
        }),
      });

      const data = await response.json();

      if (data.checkout_url) {
        // 重定向到 Creem 支付页面
        window.location.href = data.checkout_url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <Button
      color="primary"
      size="lg"
      onClick={handleSubscribe}
    >
      Subscribe to {planName} - {price}
    </Button>
  );
}
```

#### 4.2 更新 pricing-tiers.tsx

需要将 Creem product IDs 添加到配置中:

```typescript
// 在 tiers 数组中添加 creem_product_id
export const tiers: Array<Tier> = [
  {
    key: TiersEnum.Basic,
    creem_product_id: {
      [FrequencyEnum.Monthly]: process.env.NEXT_PUBLIC_CREEM_BASIC_MONTHLY_ID,
      [FrequencyEnum.Yearly]: process.env.NEXT_PUBLIC_CREEM_BASIC_YEARLY_ID,
    },
    // ... 其他配置
  },
  // ... Standard, Premium
];
```

---

## ✅ 实施步骤

### 阶段 1: 准备工作 (30分钟)
1. [ ] 在 Creem.io 注册账号
2. [ ] 获取 API Key 和 Webhook Secret
3. [ ] 在 Creem Dashboard 创建 6 个订阅产品
4. [ ] 记录所有 product IDs

### 阶段 2: 后端开发 (2-3小时)
1. [ ] 创建 `/api/creem/create-checkout` 路由
2. [ ] 创建 `/api/webhook/creem` 路由
3. [ ] 实现 webhook 签名验证
4. [ ] 实现订阅事件处理逻辑
5. [ ] 更新 subscription 和 credit service 函数

### 阶段 3: 前端开发 (1-2小时)
1. [ ] 创建 PricingButton 组件
2. [ ] 更新 pricing-tiers.tsx 添加 Creem product IDs
3. [ ] 测试支付流程

### 阶段 4: 测试 (1-2小时)
1. [ ] 使用 Creem Test Mode 测试订阅创建
2. [ ] 测试 webhook 接收和处理
3. [ ] 验证积分正确分配
4. [ ] 测试订阅取消流程

### 阶段 5: 上线 (30分钟)
1. [ ] 切换到 Production Mode
2. [ ] 更新生产环境 Webhook URL
3. [ ] 监控支付和 webhook 日志

---

## 🔧 关键配置项

### Webhook URL 设置
```
开发环境: https://your-ngrok-url.ngrok.io/api/webhook/creem
生产环境: https://yoursite.com/api/webhook/creem
```

### Success URL 配置
```
https://yoursite.com/dashboard?payment=success
```

### Metadata 字段
```json
{
  "user_id": "用户UUID",
  "plan_id": "数据库中的 plan ID",
  "credits": "积分数量"
}
```

---

## 📊 数据库更新

无需修改现有数据库结构！只需更新 subscription_plans 表添加 Creem product IDs:

```sql
-- 添加 creem_product_id 列
ALTER TABLE subscription_plans ADD COLUMN creem_product_id VARCHAR(255);

-- 更新产品 ID (从 Creem Dashboard 获取后填入)
UPDATE subscription_plans SET creem_product_id = 'prod_xxx' WHERE id = 2;  -- Basic 月付
UPDATE subscription_plans SET creem_product_id = 'prod_xxx' WHERE id = 5;  -- Basic 年付
-- ... 其他套餐
```

---

## 🎯 优势

1. ✅ **更简单的集成** - Creem API 比 Stripe 更直观
2. ✅ **内置客户门户** - 无需自建订阅管理页面
3. ✅ **更低的费用** - Creem 手续费可能更低
4. ✅ **清晰的 webhook 事件** - 事件类型更明确

---

**下一步**: 等待您在 Creem.io 创建账号和产品后,我们开始实现集成代码。

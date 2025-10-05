# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server at http://localhost:3000

# Production
npm run build        # Build for production
npm run build:prod   # Build with NODE_ENV=production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Sitemap
npm run postbuild    # Generate sitemap (runs automatically after build)
```

## Database Setup

Initialize the PostgreSQL database:
```bash
psql -U your_username -d your_database -f src/backend/sql/init.sql
```

## Architecture

### Stack Overview
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **Database**: PostgreSQL with pg driver (connection pooling in [src/backend/config/db.ts](src/backend/config/db.ts))
- **Auth**: NextAuth.js with Google OAuth
- **AI Providers**:
  - **Yunwu.ai** - Primary API provider (proxy for Replicate and Fal.ai)
    - Seedream 4.0 via Replicate endpoint
    - Nano Banana via Fal.ai endpoint
- **Storage**: AWS S3 / Cloudflare R2
- **Payments**: Stripe with webhooks
- **i18n**: next-intl (default: English)

### Key Architectural Patterns

**Three-Tier Architecture:**
1. **Frontend**: Next.js App Router pages in `src/app/[locale]`
2. **API Layer**: Next.js API routes in `src/app/api`
3. **Backend Layer**: Business logic separated into:
   - `src/backend/models/` - Database operations
   - `src/backend/service/` - Business logic (calls models)
   - `src/backend/type/` - Type definitions and enums

**Important**: Always call service layer from API routes, never call models directly.

### Credit System

The application uses a credit-based system for AI generation:
- New users get 5 free credits on first login (see [src/backend/service/credit_usage.ts:14-25](src/backend/service/credit_usage.ts))
- Each AI effect costs different credits (defined in `effect` table)
- Credits are tracked per billing period in `credit_usage` table
- Subscription users get monthly/yearly credit refreshes
- One-time purchases add credits to existing balance

**Credit Check Flow:**
1. Before any generation, API checks credits via `checkCreditUsageByUserId()`
2. Returns specific error codes: -1 (not initialized), -2 (no subscription/insufficient), -3 (monthly limit exceeded)
3. After successful generation, credits are deducted

### Webhook Handling

**Replicate Webhook** ([src/app/api/webhook/replicate/route.ts](src/app/api/webhook/replicate/route.ts)):
- Receives AI generation status updates
- Updates `effect_result` table with results
- Handles file storage to R2/S3
- Configured via `REPLICATE_URL` environment variable

**Stripe Webhook** ([src/app/api/webhook/stripe/route.ts](src/app/api/webhook/stripe/route.ts)):
- Handles subscription lifecycle events
- Key events:
  - `checkout.session.completed` - One-time purchases (plan IDs: 1, 9, 11)
  - `customer.subscription.updated` - Subscription creation/renewal
  - `customer.subscription.deleted` - Cancellations
- All events must have `metadata.project = "ai-video-generator"`
- Updates three tables: `user_subscriptions`, `credit_usage`, `payment_history`

### AI Generation Flow

**Current Implementation (Yunwu.ai):**

1. User selects AI model and generation mode (text-to-image or image-to-image)
2. User configures parameters and submits generation request to one of:
   - `/api/predictions/seedream-text-to-image` - Seedream 4.0 文生图
   - `/api/predictions/seedream-image-to-image` - Seedream 4.0 图生图
   - `/api/predictions/nanobanana-text-to-image` - Nano Banana 文生图
   - `/api/predictions/nanobanana-image-to-image` - Nano Banana 图生图
3. System validates user authentication and checks credit balance
4. Creates task via Yunwu.ai API (either Replicate or Fal.ai endpoint)
5. Saves initial `effect_result` record with status "pending", storage_type "yunwu"
6. Frontend polls corresponding query endpoint every 2 seconds:
   - `/api/predictions/seedream/[predictionId]` - Queries via Replicate-compatible API
   - `/api/predictions/nanobanana/[requestId]` - Queries via Fal.ai-compatible API
7. When task completes, frontend calls `/api/effect_result/update` with result URLs (string or array)
8. **R2 Storage Pipeline**:
   - Backend receives Yunwu temporary URLs (valid for limited time)
   - Downloads images from Yunwu CDN
   - Uploads to Cloudflare R2 for permanent storage
   - Single image: stores R2 URL as string in `effect_result.url`
   - Multiple images: stores JSON array `["url1","url2",...]` in `effect_result.url`
9. Credits are deducted from user's balance
10. Frontend displays results in multi-image grid layout (supports 1-15 images)

**Seedream 4.0 Parameters:**
- `prompt`: Text description (required)
- `size`: 1K/2K/4K resolution (default: 2K)
- `aspect_ratio`: 1:1, 4:3, 3:2, 16:9, 21:9, 3:4, 2:3, 9:16, or "match_input_image" for img2img
- `sequential_image_generation`: "disabled" or "auto" for multi-image generation
- `max_images`: 1-15 (only when sequential_image_generation = "auto")
- `image_input`: Array of image URLs for image-to-image mode

**Nano Banana Parameters:**
- `prompt`: Text description (required)
- `num_images`: 1-4 (default: 1)
- `output_format`: "jpeg" or "png" (default: "jpeg")
- `aspect_ratio`: 1:1, 4:3, 3:2, 2:3, 5:4, 4:5, 3:4, 16:9, 9:16, 21:9
- `sync_mode`: false (always async)
- `image_urls`: Array of image URLs for image-to-image mode

### Database Schema

Core tables:
- `users` - User profiles and OAuth data
- `credit_usage` - Per-user credit tracking with billing periods
- `user_subscriptions` - Stripe subscription management
- `subscription_plans` - Available pricing plans
- `payment_history` - All transactions
- `effect` - Available AI models/effects (Seedream 4.0, Nano Banana)
- `effect_result` - Generation history and results (storage_type: "yunwu")

### Environment Variables

Required for development:
```
POSTGRES_URL              # PostgreSQL connection string
NEXTAUTH_SECRET          # NextAuth encryption key
NEXTAUTH_URL             # Application URL
GOOGLE_CLIENT_ID         # Google OAuth
GOOGLE_CLIENT_SECRET     # Google OAuth
YUNWU_API_TOKEN          # Yunwu.ai API token (for Seedream & Nano Banana)
STRIPE_SECRET_KEY        # Stripe private key
STRIPE_WEBHOOK_SECRET    # Stripe webhook signing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Stripe public key

# Cloudflare R2 Storage (for permanent image storage)
R2_BUCKET_NAME           # R2 bucket name (e.g., "ai-image-generator")
R2_ACCESS_KEY_ID         # R2 API access key
R2_SECRET_ACCESS_KEY     # R2 API secret key
R2_ENDPOINT              # R2 public URL (e.g., "https://pub-xxxxx.r2.dev")
R2_ACCOUNT_ID            # Cloudflare account ID

NEXT_PUBLIC_DOMAIN       # Public domain (for webhooks, optional in dev)
```

**R2 Storage Setup**: See [R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md) for detailed configuration instructions.

### Internationalization

- Locale-based routing: all pages under `src/app/[locale]`
- Translation files in `messages/` (e.g., `messages/en.json`)
- Use `next-intl` for all user-facing strings
- Default locale: English

### Important Configuration

**Image/Video Domains** ([next.config.mjs](next.config.mjs)):
- Next.js is configured to allow images/videos from:
  - `replicate.com` and `replicate.delivery` (Seedream 4.0 results)
  - `fal.media` (Nano Banana results)
- Add new domains to `remotePatterns` when needed

### UI Components

**Multi-Image Grid Layout** ([src/components/replicate/text-to-image/img-output.tsx](src/components/replicate/text-to-image/img-output.tsx)):
- Responsive grid layout (1-4 columns based on image count)
- Click to preview full-size image in modal
- Individual download buttons + batch download for multiple images
- Numbered labels (#1, #2, etc.) for multi-image results
- Hover effects and smooth animations

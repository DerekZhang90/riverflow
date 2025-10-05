-- ============================================
-- RiverFlow.art 数据库重置脚本
-- 用于删除旧表并重新创建新表结构
-- ============================================

-- 第一步：删除所有旧表（按依赖关系逆序删除）
-- 使用 CASCADE 会自动删除所有依赖的外键约束

DROP TABLE IF EXISTS email_subscribers CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS payment_history CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS effect_result CASCADE;
DROP TABLE IF EXISTS effect CASCADE;
DROP TABLE IF EXISTS credit_usage CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 第二步：重新创建所有表

-- 用户表：存储用户基本信息和登录相关数据
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid text NOT NULL,
  email text NOT NULL,
  nickname text NOT NULL,
  avatar_url text NOT NULL,
  locale text NULL,
  signin_type text NULL,
  signin_ip text NULL,
  signin_provider text NULL,
  signin_openid text NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  update_time timestamp with time zone NULL
);

-- 积分使用记录表
CREATE TABLE credit_usage (
  id SERIAL PRIMARY KEY,
  user_id text NOT NULL,
  user_subscriptions_id integer NOT NULL,
  used_count integer NOT NULL,
  period_start timestamp with time zone NOT NULL,
  period_end timestamp with time zone NOT NULL,
  is_subscription_active boolean NOT NULL,
  period_remain_count integer NULL,
  created_at timestamp with time zone NULL,
  updated_at timestamp with time zone NULL
);

-- AI 模型配置表
CREATE TABLE effect (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  type integer NOT NULL,
  des text NULL,
  platform text NOT NULL,
  link text NOT NULL,
  api text NOT NULL,
  is_open integer NOT NULL,
  link_name text NOT NULL,
  credit real NOT NULL,
  model text NULL,
  version text NULL,
  pre_prompt text NULL,
  created_at timestamp with time zone NULL
);

-- 插入 RiverFlow 项目的 AI 模型配置
INSERT INTO effect (id, name, type, des, platform, link, api, is_open, link_name, credit, model, version, pre_prompt, created_at) VALUES
(1, 'RiverFlow', 1, 'RiverFlow 下一代 AI 图片生成模型，极致画质，快速生成', 'custom', 'https://riverflow.art', 'riverflow-v1', 0, 'riverflow', 3, 'riverflow-v1', '1.0', NULL, NOW()),
(2, 'Seedream 4.0', 1, '高质量图片生成，支持文生图和图生图', 'replicate', 'https://replicate.com/seedream/4.0', 'seedream/4.0', 1, 'seedream-4', 2, 'seedream/4.0', '4.0', NULL, NOW()),
(3, 'Nano Banana', 1, '快速生成，适合快速原型和创意探索', 'replicate', 'https://replicate.com/nanobanana/latest', 'nanobanana/latest', 1, 'nano-banana', 2, 'nanobanana/latest', '1.0', NULL, NOW());

-- 生成结果表
CREATE TABLE effect_result (
  id SERIAL PRIMARY KEY,
  result_id character varying(127) NULL,
  original_id character varying(127) NULL,
  user_id text NOT NULL,
  effect_id integer NOT NULL,
  effect_name character varying(100) NULL,
  prompt text NULL,
  url text NULL,
  status text NULL,
  original_url character varying(255) NULL,
  storage_type character varying(16) NULL,
  running_time real NULL,
  credit integer NOT NULL,
  request_params text NULL,
  created_at timestamp with time zone NULL,
  updated_at timestamp with time zone NULL
);

-- 支付历史表
CREATE TABLE payment_history (
  id SERIAL PRIMARY KEY,
  user_id text NOT NULL,
  stripe_payment_intent_id character varying(100) NULL,
  amount numeric(10,2) NOT NULL,
  currency character varying(3) NOT NULL,
  status character varying(50) NOT NULL,
  stripe_subscription_id text NULL,
  stripe_customer_id text NULL,
  stripe_price_id text NULL,
  subscription_plans_id bigint NULL,
  created_at timestamp with time zone NULL
);

-- 订阅计划表
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name character varying(100) NOT NULL,
  interval character varying(20) NOT NULL,
  price numeric(10,2) NOT NULL,
  currency character varying(3) NOT NULL,
  credit_per_interval integer NOT NULL,
  stripe_price_id character varying(100) NOT NULL,
  is_active boolean NULL,
  created_at timestamp with time zone NULL,
  updated_at timestamp with time zone NULL
);

-- 用户订阅表
CREATE TABLE user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id text NOT NULL,
  stripe_price_id text NOT NULL,
  stripe_subscription_id character varying(100) NOT NULL,
  stripe_customer_id character varying(100) NOT NULL,
  subscription_plans_id bigint NULL,
  status character varying(50) NOT NULL,
  current_period_start timestamp with time zone NOT NULL,
  current_period_end timestamp with time zone NOT NULL,
  cancel_at_period_end boolean NULL,
  canceled_at timestamp with time zone NULL,
  cancellation_reason text NULL,
  ends_at timestamp with time zone NULL,
  created_at timestamp with time zone NULL,
  updated_at timestamp with time zone NULL
);

-- 邮箱订阅表（新增）
CREATE TABLE email_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE NULL
);

-- 创建索引
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_subscribed ON email_subscribers(subscribed);

-- 完成提示
SELECT 'Database reset completed successfully! All tables have been recreated.' as status;

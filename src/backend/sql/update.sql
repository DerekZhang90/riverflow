-- ============================================
-- RiverFlow.art 数据库增量更新脚本
-- 仅更新 effect 表和添加 email_subscribers 表
-- 保留其他表的现有数据
-- ============================================

-- 第一步：清空并更新 effect 表
TRUNCATE TABLE effect RESTART IDENTITY CASCADE;

-- 插入 RiverFlow 项目的 AI 模型配置
INSERT INTO effect (id, name, type, des, platform, link, api, is_open, link_name, credit, model, version, pre_prompt, created_at) VALUES
(1, 'RiverFlow', 1, 'RiverFlow 下一代 AI 图片生成模型，极致画质，快速生成', 'custom', 'https://riverflow.art', 'riverflow-v1', 0, 'riverflow', 3, 'riverflow-v1', '1.0', NULL, NOW()),
(2, 'Seedream 4.0', 1, '高质量图片生成，支持文生图和图生图', 'replicate', 'https://replicate.com/seedream/4.0', 'seedream/4.0', 1, 'seedream-4', 2, 'seedream/4.0', '4.0', NULL, NOW()),
(3, 'Nano Banana', 1, '快速生成，适合快速原型和创意探索', 'replicate', 'https://replicate.com/nanobanana/latest', 'nanobanana/latest', 1, 'nano-banana', 2, 'nanobanana/latest', '1.0', NULL, NOW());

-- 第二步：创建 email_subscribers 表（如果不存在）
CREATE TABLE IF NOT EXISTS email_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE NULL
);

-- 创建索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed ON email_subscribers(subscribed);

-- 完成提示
SELECT 'Incremental update completed successfully!' as status;
SELECT COUNT(*) as effect_count FROM effect;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

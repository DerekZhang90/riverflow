-- 定价更新 SQL 脚本
-- 日期: 2025-10-04
-- 用途: 更新订阅价格为梯度定价方案

-- ============================================
-- 第一步: 更新 subscription_plans 表价格
-- ============================================

-- Basic 套餐
UPDATE subscription_plans SET
  price = 9.90,
  credit_per_interval = 300,
  updated_at = NOW()
WHERE id = 2;  -- Basic 月付

UPDATE subscription_plans SET
  price = 99.00,
  credit_per_interval = 3600,
  updated_at = NOW()
WHERE id = 5;  -- Basic 年付

UPDATE subscription_plans SET
  price = 9.90,
  credit_per_interval = 300,
  updated_at = NOW()
WHERE id = 1;  -- Basic 一次性

-- Standard 套餐
UPDATE subscription_plans SET
  price = 19.90,
  credit_per_interval = 700,
  updated_at = NOW()
WHERE id = 3;  -- Standard 月付

UPDATE subscription_plans SET
  price = 199.00,
  credit_per_interval = 8400,
  updated_at = NOW()
WHERE id = 6;  -- Standard 年付

UPDATE subscription_plans SET
  price = 19.90,
  credit_per_interval = 700,
  updated_at = NOW()
WHERE id = 9;  -- Standard 一次性

-- Premium 套餐
UPDATE subscription_plans SET
  price = 39.90,
  credit_per_interval = 1600,
  updated_at = NOW()
WHERE id = 4;  -- Premium 月付

UPDATE subscription_plans SET
  price = 399.00,
  credit_per_interval = 19200,
  updated_at = NOW()
WHERE id = 8;  -- Premium 年付

UPDATE subscription_plans SET
  price = 39.90,
  credit_per_interval = 1600,
  updated_at = NOW()
WHERE id = 11;  -- Premium 一次性

-- ============================================
-- 第二步: 更新 effect 表积分配置
-- ============================================

-- 统一设置为 1 积分 = 1 图
UPDATE effect SET credit = 1 WHERE id = 2;  -- Seedream 4.0
UPDATE effect SET credit = 1 WHERE id = 3;  -- Nano Banana

-- 禁用旧模型
UPDATE effect SET is_open = 0 WHERE id = 1;  -- RiverFlow (暂时关闭)

-- ============================================
-- 验证更新结果
-- ============================================

-- 查看 subscription_plans 更新结果
SELECT id, name, interval, price, credit_per_interval, updated_at
FROM subscription_plans
ORDER BY id;

-- 查看 effect 更新结果
SELECT id, name, credit, is_open
FROM effect
ORDER BY id;

-- ============================================
-- 预期结果
-- ============================================

/*
subscription_plans 表应该显示:

id | name     | interval | price  | credit_per_interval
---|----------|----------|--------|-------------------
1  | Basic    | month    | 9.90   | 300
2  | Basic    | month    | 9.90   | 300
3  | Standard | month    | 19.90  | 700
4  | Premium  | month    | 39.90  | 1600
5  | Basic    | year     | 99.00  | 3600
6  | Standard | year     | 199.00 | 8400
8  | Premium  | year     | 399.00 | 19200
9  | Standard | month    | 19.90  | 700
11 | Premium  | month    | 39.90  | 1600

effect 表应该显示:

id | name           | credit | is_open
---|----------------|--------|--------
1  | RiverFlow      | -      | 0 (关闭)
2  | Seedream 4.0   | 1      | 1 (开启)
3  | Nano Banana    | 1      | 1 (开启)
*/

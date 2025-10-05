-- 修复积分配置 SQL 脚本
-- 日期: 2025-10-05
-- 用途: 统一所有模型积分为 1，更新 platform 为 yunwu

-- ============================================
-- 第一步: 更新所有 effect 表积分为 1
-- ============================================

-- 统一设置为 1 积分 = 1 图 (更新所有记录)
UPDATE effect SET credit = 1 WHERE id IN (2, 3, 4, 5);

-- 或者更新所有启用的模型
-- UPDATE effect SET credit = 1 WHERE is_open = 1;

-- ============================================
-- 第二步: 更新 platform 为 yunwu (可选，仅为保持一致性)
-- ============================================

-- 将所有云雾 API 相关的模型 platform 更新为 yunwu
UPDATE effect SET platform = 'yunwu' WHERE id IN (2, 3, 4, 5);

-- ============================================
-- 验证更新结果
-- ============================================

-- 查看 effect 更新结果
SELECT id, name, platform, credit, is_open, link_name
FROM effect
ORDER BY id;

-- ============================================
-- 预期结果
-- ============================================

/*
effect 表应该显示:

id | name                      | platform | credit | is_open | link_name
---|---------------------------|----------|--------|---------|-------------------
2  | Seedream V4 Text-to-Image | yunwu    | 1      | 1       | seedream-text-to-image
3  | Seedream V4 Edit          | yunwu    | 1      | 1       | seedream-image-to-image
4  | Nano Banana               | yunwu    | 1      | 1       | nanobanana-text-to-image
5  | Nano Banana Edit          | yunwu    | 1      | 1       | nanobanana-image-to-image

所有模型积分统一为 1
所有模型 platform 统一为 yunwu
*/

# 下一步开发计划

**最后更新**: 2025-10-04

---

## ⚠️ 重要通知

**本项目已切换到快速上线路线!**

所有上线前的详细计划已迁移到专门文档,请查看:

📖 **[LAUNCH_PLAN.md](LAUNCH_PLAN.md)** - 上线前完整计划 (必读!)

---

## 📚 相关文档导航

| 文档 | 用途 | 优先级 |
|------|------|--------|
| **[LAUNCH_PLAN.md](LAUNCH_PLAN.md)** | 上线前完整计划 (5个阶段) | ⭐⭐⭐ 必读 |
| **[PRICING_FINAL.md](PRICING_FINAL.md)** | 最终订阅价格方案 (已确认) | ⭐⭐⭐ 已确认 |
| **[CREDIT_SYSTEM_DESIGN.md](CREDIT_SYSTEM_DESIGN.md)** | 积分系统设计 (1积分=1图) | ⭐⭐⭐ 已确认 |
| **[I18N_IMPLEMENTATION.md](I18N_IMPLEMENTATION.md)** | 国际化实施计划 | ⭐⭐⭐ 高优先级 |
| **[R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md)** | R2 存储配置指南 | ⭐ 已完成 |
| **[CLAUDE.md](CLAUDE.md)** | 技术架构文档 | ⭐⭐ 开发参考 |

---

## 🎯 当前状态

✅ **已完成核心功能**:
- Seedream 4.0 和 Nano Banana 图片生成
- 文生图和图生图模式
- 多图网格展示 (最多15张)
- Cloudflare R2 永久存储
- 用户认证 (Google OAuth)

⏳ **准备上线**:
- 清理技术债务
- 积分系统优化
- 订阅价格配置
- 国际化 (英文为主)

---

## 🚀 快速上线路线

### 阶段 1: 清理技术债务 (30分钟)
删除 KIE.AI 相关代码和文件

### 阶段 2: 积分系统 (2-3小时)
设计和检查积分扣除逻辑

### 阶段 3: 订阅价格 (2-3小时)
设计套餐和配置支付平台

### 阶段 4: Creem.io 支付 (3-4小时)
集成 Creem.io 支付系统

### 阶段 5: 国际化 (4-5小时)
默认英文,支持中英文切换

**预计总时间**: 15-20小时

详细计划见 → **[LAUNCH_PLAN.md](LAUNCH_PLAN.md)**

---

## 📞 已确认的决策

✅ **订阅价格方案**: [PRICING_FINAL.md](PRICING_FINAL.md)
   - 梯度定价: Basic ($9.9/300积分) → Standard ($19.9/700积分) → Premium ($39.9/1600积分)
   - 年付额外折扣 14-16%

✅ **积分规则**: [CREDIT_SYSTEM_DESIGN.md](CREDIT_SYSTEM_DESIGN.md)
   - 极简规则: 1 积分 = 1 张图 (任何模型,任何模式)
   - 组图按张计费
   - 积分按订阅周期重置 (月付按月,年付按年)

✅ **支付平台**: Creem.io
   - 等待用户提供文档后集成

---

**准备好了吗?让我们开始吧!** 🚀

请告诉我从哪个阶段开始执行!

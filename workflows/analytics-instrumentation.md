---
name: analytics-instrumentation
description: 埋点与收入对账实战规范。GA4 / Stripe / 广告归因的字段对账设计
when_to_use: 产品上线前埋点；付费转化分析；Stripe/Paddle 接入；A/B 测试归因
inputs: [产品业务对象, 支付提供商, 广告渠道]
outputs: [埋点字段规范, 对账主键, 验证报表]
related: [/workflows/landing-page-assets]
stage: workflow
status: 来自 idea-business 实战沉淀
---

# 埋点与收入对账工作流

这套工作流用于产品上线、增长分析、付费转化分析前的埋点设计。核心目标不是“多埋点”，而是让分析事件、支付账本、广告来源、实验版本可以被可靠对账。

## 快速参考

一行版：先定义业务对象 ID，再让 GA4、支付系统、广告 URL、后端订单记录共享同一组关联字段，最后用对账报表验证事件收入和真实收款是否一致。

## 适用场景

| 场景 | 为什么需要 |
| --- | --- |
| Landing Page / MVP 上线 | 避免后续只能看到流量，看不到真实转化来源 |
| Stripe / Paddle / Lemon Squeezy 接入 | 把支付账本和分析事件接起来 |
| Growth / Ads 分析 | 区分 GA4 事件收入和支付确认收入 |
| A/B test / 定价实验 | 能追踪哪个变体真正带来付款 |

## Phase 1：定义对账主键

| 字段 | 进入哪里 | 用途 |
| --- | --- | --- |
| `order_id` | 后端订单、GA4、支付 metadata | 内部业务订单主键 |
| `transaction_id` | GA4 purchase event | GA4 电商事件主键，优先等于 `order_id` |
| `payment_intent_id` | 后端订单、支付 metadata、可选 GA4 event param | 对 Stripe PaymentIntent 做账本对账 |
| `user_id` 或匿名 `visitor_id` | 分析事件、后端订单 | 漏斗归因；不要把 PII 明文写入分析系统 |
| `session_id` | 分析事件、落地页日志 | 连接访问、点击、checkout intent |

规则：

- 先生成内部 `order_id`，再创建支付对象。
- GA4 `transaction_id` 使用稳定业务 ID，不使用页面临时 ID。
- 支付 metadata 写入 `order_id` 和必要归因字段。
- 不把邮箱、姓名、完整地址、卡信息写入分析事件或公开报告。

## Phase 2：采集归因上下文

| 字段 | 来源 | 写入位置 |
| --- | --- | --- |
| `utm_source` | URL query | checkout intent、order、payment metadata |
| `utm_medium` | URL query | checkout intent、order、payment metadata |
| `utm_campaign` | URL query | checkout intent、order、payment metadata |
| `landing_page` | 当前页面路径 | checkout intent、order、payment metadata |
| `experiment_id` | 实验系统 | checkout intent、order、payment metadata |
| `variant_id` | 实验系统 | checkout intent、order、payment metadata |
| `market` | 产品显式选择、价格区、locale、服务端 Geo 之一 | order、payment metadata |

市场字段必须有来源说明。优先级建议：

1. 用户显式选择的国家/市场。
2. 订单或账单国家。
3. 服务端 Geo 推断。
4. 浏览器 locale。

低置信来源不能覆盖高置信来源。支付币种和结算币种只能作为线索，不能直接当作客户市场。

## Phase 3：发送分析事件

| 事件 | 必填字段 | 注意事项 |
| --- | --- | --- |
| `view_item` 或 `view_offer` | `offer_id`, `landing_page`, `market`, `experiment_id` | 用于衡量页面曝光 |
| `begin_checkout` | `order_id`, `price_id`, `currency`, `value`, `utm_*` | 表示结账意图，不代表付款 |
| `purchase` | `transaction_id`, `currency`, `value`, `items` | 只能在支付成功后发出 |

GA4 的 `purchaseRevenue` 是分析事件收入，不是支付账本。只有能和支付系统按 `order_id` 或 `payment_intent_id` 对上，才可以升级为确认收入。

## Phase 4：写入支付 metadata

Stripe PaymentIntent metadata 建议包含：

```json
{
  "order_id": "ord_...",
  "market": "US",
  "landing_page": "/love-test",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "compatibility_test_ca",
  "experiment_id": "pricing_v1",
  "variant_id": "price_299"
}
```

要求：

- metadata 字段短、稳定、枚举化。
- 只放归因和对账字段，不放 PII。
- 支付成功 webhook 更新内部订单状态。
- webhook 成功后再发送或确认 `purchase` 事件。

## Phase 5：对账检查

每次增长分析前先跑对账：

| 检查 | 通过标准 |
| --- | --- |
| GA4 purchase count vs 支付成功数 | 差异在可解释范围内 |
| GA4 purchase value vs 支付账本金额 | 货币和退款口径清楚 |
| unknown market 支付占比 | 低于业务可接受阈值 |
| purchase 缺 `transaction_id` | 0 或接近 0 |
| Stripe metadata 缺 `order_id` | 0 |

如果这些检查失败，增长报告只能标记为 `needs_validation` 或 `research_only`，不能给出强执行建议。

## Agent 分工

| 角色 | 默认引擎 | 职责 |
| --- | --- | --- |
| 执行器 | Claude Code | 实现埋点、支付 metadata、webhook、事件发送 |
| 校验器 | Codex | 检查事件口径、隐私风险、对账字段、测试覆盖 |
| Judge | Codex 或独立审查 Agent | 判断数据是否足够支持增长结论 |

原则：Claude Code 负责主要实现；Codex 不做同一路径上的重复实现，主要做对抗式 review、证据边界检查、测试补洞和最终质量判断。

## 常见反模式

| 反模式 | 后果 |
| --- | --- |
| 只看 GA4 revenue | 把分析事件误当成真实收款 |
| 用支付币种推断市场 | CNY/USD/HKD 等货币不能可靠代表客户市场 |
| purchase 在支付前发送 | 虚增购买事件 |
| 支付 metadata 没有 `order_id` | 后续无法对账 |
| 把邮箱写入分析事件 | 产生隐私和合规风险 |
| 每个模块各自定义字段 | 增长、广告、产品分析无法合并 |

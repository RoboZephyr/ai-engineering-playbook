---
name: visual-engineering-index
description: Visual Engineering 板块总览。AI 生成视觉前端的方法论集，含五个核心方法论 + 应用场景索引
when_to_use: 首次进入视觉工程板块；判断哪个方法论页适合当前任务
inputs: []
outputs: [完整方法论地图]
related: [/harness/, /workflows/, /skills/design]
stage: index
---

# Visual Engineering

**触发条件**：你要让 AI 生成任何视觉前端产物——Landing Page、产品 UI、Dashboard、演示稿、营销素材——并且希望避免"一眼 AI 生成"的廉价感。

**核心问题**：AI 默认会做出泛紫色渐变、玻璃拟态、嵌套卡片、居中三栏、italic-serif hero——所有 AI 工具站都长一样。本板块沉淀**避免 AI slop 的工程化方法**，不是审美教程。

## 五个核心方法论 {#five-pillars}

每条都可以独立使用，组合在一起是完整的视觉工程流水线：

| # | 方法论 | 解决什么 | 何时用 |
|---|--------|----------|--------|
| 1 | [输入文档分层](./input-docs.md) | 把"给谁看"和"长什么样"拆成 `PRODUCT.md` + `DESIGN.md` 两层 | 任何视觉项目开头 |
| 2 | [Visual Kit](./visual-kit.md) | Refero 折叠 + brand_voice 派生 + 三个 dial 锁强度 | 已有 brief，要定视觉语言 |
| 3 | [反模式清单](./anti-patterns.md) | 4 维度反模式 + 7 条 AI 微指纹 reject 清单 | 写 anti_patterns 字段 / critique 阶段 |
| 4 | [设计审查](./design-critique.md) | 渲染后对照清单做事后审查 | 页面已渲染，要发布前过一遍 |
| 5 | brand_voice 派生 style_name | 不从固定主题库挑，每个产品有独有视觉立场 | 见 [Visual Kit](./visual-kit.md#brand-voice-derive) |

## 应用场景 {#applications}

::: tip 方法论与应用的关系
本板块沉淀的是**通用方法论**（输入文档分层、Visual Kit、反模式、AI 微指纹、设计审查），单独使用每条都成立。

**应用层验证情况**：
- ✅ [Landing Page 素材生成](../workflows/landing-page-assets.md) Phase 1-6 流程已在 idea-business 项目实战使用
- ⚠️ 本板块这套新形式（PRODUCT.md/DESIGN.md 分层 + 三 dial + brand_voice 派生）是这次抽象提炼的，**端到端组合用法还在沉淀**

具体应用（Landing Page / Dashboard / 演示稿）先用这 5 个方法论做单独决策，不要套一个"完整流程"。
:::

| 场景 | 状态 | 注意事项 |
|------|------|---------|
| Landing Page | 待沉淀 | 视觉语言 ≠ Dashboard：首屏构图 / 转化路径 / 传播感是落地页专属 |
| Dashboard / 控制台 | 待沉淀 | 信息密度高、有工作流路径；不要套用 Refero 落地页 token |
| 演示稿 / Slides | 待沉淀 | — |
| 营销素材 / 海报 | 待沉淀 | — |

::: tip 跨场景边界
Refero 抽取的是落地页/品牌站视觉，不要拿去做 Dashboard 主题。同理 Landing Page 视觉规则不要直接用到内部工具上。
:::

## 与其他板块的关系 {#relations}

```text
Harness Engineering   →   Agent 工作环境的方法论（CLAUDE.md / 日志 / 知识管理）
Skills 技能库         →   横向 AI 编码 Skill 评测
Visual Engineering    →   视觉前端美学方法论（本板块）
Workflows 场景工作流  →   具体场景流水线（如代码审查、TDD、产品需求书）
```

## 给 AI 读者的提示 {#for-ai}

本板块所有页面都遵循：

- 每页 frontmatter 含 `when_to_use` / `inputs` / `outputs` / `related`
- 每页开头 3 行明确触发条件
- 表格 / 清单 > 散文
- 锚点显式（`{#stable-id}`）
- 关键定义每页重申，不依赖跨页阅读

如果你是 AI agent，按 `when_to_use` 字段快速判断当前任务是否需要读这页，不要每次都读全文。

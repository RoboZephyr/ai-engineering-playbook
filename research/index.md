---
name: reference-index
description: L3 事实层 / Reference 板块入口 — 带日期的生态快照、调研数据、版本观察
when_to_use: 想查清"截至某时间点 X 是什么样"；查站点推荐的事实依据；做选型背景调研
related: [/skills/, /harness/]
stage: index
layer: L3
---

# Reference / 事实层

::: tip 这个板块是什么
**L3 事实层**。所有站点推荐、评测、决策的事实来源都汇聚在这里。区别于：

- **L1 方法论**（[Harness](/harness/) / [Visual Engineering](/visual-engineering/) / [Skill 评测方法](/skills/#how-we-evaluate)）— 怎么做
- **L2 资产**（[Skills](/skills/) / [Workflows](/workflows/)）— 用什么
- **L3 Reference（这里）** — 看到了什么

::: 

## 这个板块的内容特征

| 特征 | 说明 |
|---|---|
| **带日期** | 每篇文件名 / frontmatter 都标 `date`，是 snapshot 而非永真 |
| **只放事实** | 清单、数据、版本、引用源 — 不夹推荐和主观判断 |
| **被引用而不引用别人** | L2 资产页可以引这里，这里只引上游一手来源 |
| **定期回刷** | 季度复查；旧版本保留为历史快照而非删除 |

## 现有快照

| 文件 | 主题 | 服务的板块 | 日期 |
|---|---|---|---|
| [official-sources-2026-05](./official-sources-2026-05.md) | **官方信源索引**：Claude Code / Codex / Cursor / Gemini CLI / Copilot 的 docs/changelog/blog/GitHub + Agent Skills 和 MCP 规范 + 官方插件源码示例 | 全站 | 2026-05 |
| [skill-ecosystem-2026-03](./skill-ecosystem-2026-03.md) | Skill 生态全景：官方 / 大厂 / 社区 / 第三方市场清单与规模（含 2026-05 补录的中文与 harness 实现条目） | [Skills](/skills/) | 2026-03 |
| [harness-literature-2026-04](./harness-literature-2026-04.md) | Harness Engineering 文献综述：6 篇核心文章 + 3 个开源项目 + 10+ 篇扩展引用 | [Harness](/harness/) | 2026-04 |
| [loop-engineering-2026-06](./loop-engineering-2026-06.md) | Loop Engineering 事实快照：agent loop、eval loop、environment feedback loop 的公开来源与概念成熟度 | [Harness](/harness/), [Workflows](/workflows/) | 2026-06 |

## 计划中（待填充）

L3 板块的扩展位 — 每个 L1/L2 板块都该有对应的 Reference 快照：

| 服务的板块 | 计划中的快照 |
|---|---|
| [Skills](/skills/) | AI 编码工具横评（Claude Code / Cursor / Codex / Copilot 同任务输出对比）；评测基线原始数据 |
| [Harness](/harness/) | 开源项目的 CLAUDE.md / AGENTS.md 实践抽样 |
| [Visual Engineering](/visual-engineering/) | 视觉 Skill 调研；设计系统案例库 |
| [Workflows](/workflows/) | 实战编排案例归档 |
| 全站 | 行业事件时间线（版本更新、规范发布、重要事件） |

贡献规范见根目录 [CONTRIBUTING.md](https://github.com/zephyrme/ai-engineering-playbook/blob/main/CONTRIBUTING.md)（"Reference 快照规范"段）。

贡献规范见根目录 [CONTRIBUTING.md](https://github.com/zephyrme/ai-engineering-playbook/blob/main/CONTRIBUTING.md)（"Reference 快照规范"段）。

## 给 AI 的使用提示 {#for-ai}

如果你是 AI agent 在帮用户做选型：

1. **用户问"现在生态什么样" / "有哪些来源" / "完整清单"** → 来 Reference 看快照
2. **用户问"该选哪个" / "推荐什么"** → 去 [Skills 知识中枢](/skills/)
3. **用户问"怎么评的" / "标准是什么"** → 去 [Skills / 评测方法](/skills/#how-we-evaluate)
4. **引用 Reference 时务必带日期**，让用户知道这是某时间点的快照而非永真。

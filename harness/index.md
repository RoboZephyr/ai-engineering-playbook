---
name: harness-index
description: Harness Engineering 板块总览。Agent 工作环境设计方法论（前馈/后馈/记忆三职责 + 时间/空间/交互三维度）
when_to_use: 想了解 Harness 是什么、本板块覆盖什么内容、从哪个子页开始读
related: [./init-methodology, ./context-design, ./loop-engineering, ./logging, ./knowledge-system, ./llm-wiki, ./self-evolution]
stage: index
---

# Harness Engineering

> 人类的核心工作从写代码转向了**设计 Agent 的工作环境**。Harness Engineering 就是这门新学科。

## 什么是 Harness

**Agent = Model + Harness.** Model 是大脑，Harness 是它工作的一切环境：文档、约束、工具、日志、记忆、反馈循环。

一个好的 Harness 做三件事：

| 职责 | 说明 | 类比 |
|------|------|------|
| **前馈 (Guide)** | 在 agent 行动前预防错误 | 架构文档、约束规则、参考案例 |
| **后馈 (Sensor)** | 在 agent 行动后检测问题 | Linter、测试、LLM-as-Judge |
| **记忆 (Memory)** | 跨会话保持上下文和知识 | Decision Records、Solution 库、日志 |

这些职责在运行时表现为一个个可设计的闭环：目标 → 上下文 → 动作 → 观测 → 评估 → 修正 → 沉淀。见 [Loop Engineering](./loop-engineering)。

## 三个扩展维度

2026 年三大 AI 厂各探索了一个维度：

### 时间维度 (Temporal) — Anthropic

**问题**：Agent 连续工作数小时，如何保持方向和质量？

**方案**：Planner / Generator / Evaluator 三角色分离。每个角色有清晰的职责边界，通过文件 artifact 传递状态。

**关键洞察**：把"做事的 agent"和"评判的 agent"分开，是质量最强的杠杆。

### 空间维度 (Spatial) — Cursor

**问题**：数百个 Agent 并行，如何获得线性吞吐增长？

**方案**：递归 Planner-Worker 层级。Worker 在隔离的 repo 副本上工作，互不感知。信息只向上流动。

**关键洞察**：架构选择（monolith vs modular）直接影响 agent 并行效率。

### 交互维度 (Interaction) — OpenAI

**问题**：3 人团队如何管理 1500+ PR？

**方案**：Symphony 守护进程，把 ticket 自动转为 agent 任务。Agent 自带观测栈、自验证、自提 PR。

**关键洞察**：从"写 prompt 触发"进化到"写 ticket 改状态"。

## 核心共识

跨所有文章和实践，行业已达成 7 条共识：

1. **改 Harness > 换 Model** — Harness 的改进对所有模型同时生效
2. **约束 > 指令** — 可执行的确定性规则比模糊指导有效
3. **< 60 秒反馈循环** — Build/Test/Lint 必须快到 agent 能高效迭代
4. **四层记忆** — Agent config + Git history + Progress log + Structured state
5. **渐进式加载** — 永远不要把所有信息塞进 context，按需读取
6. **失败驱动改进** — 每个 agent 错误都应变成 harness 改进
7. **验证分层** — 确定性检查（快/廉价）在前，推理性检查（慢/语义）在后

## 本节内容

| 页面 | 内容 | 适合谁 |
|------|------|--------|
| [Init 方法论](./init-methodology) | **核心** — 任何项目的 Harness 初始化流程 | 新项目启动时 |
| [设计思想](./architecture-patterns) | 从多模块实战沉淀出的抽象 harness 架构原则 | 初始化复杂项目时 |
| [Context 设计](./context-design) | CLAUDE.md / AGENTS.md 设计指南 | 写配置文件时 |
| [Loop Engineering](./loop-engineering) | AI Agent 迭代闭环：目标、状态、动作、观测、评估、修正、沉淀 | 设计 workflow 或诊断 AI 协作效率时 |
| [日志系统](./logging) | 可观测 + 可修复的日志架构 | 搭建 pipeline 时 |
| [知识管理](./knowledge-system) | Decision / Solution / Plan / Playbook | 积累经验时 |
| [LLM Wiki / Agent 知识库](./llm-wiki) | compile-not-retrieve 本质 + raw/wiki/schema 三层 + PKM 根基 + 检索/memory 选型 | 设计 agent 可读知识库时 |
| [自进化](./self-evolution) | 自修复 + 自迭代 + 衰减检测 | 系统成熟后 |
| [模板库](./templates) | 所有文档模板，可直接复制 | 随时参考 |

## 适用范围

本方法论适用于使用以下工具的项目：

- **Claude Code** (Anthropic) — CLAUDE.md + Skills + Hooks
- **Codex** (OpenAI) — AGENTS.md + Workflows
- **Cursor** (Anysphere) — .cursorrules + Composer
- **通用 LLM Agent** — 任何基于 prompt + tool 的 agent 系统

核心原则是通用的，具体实现按工具调整。

## 事实依据

本板块的方法论推荐基于 L3 事实层：

- [Harness 文献快照 2026-04](../research/harness-literature-2026-04.md) — 6 篇核心文章 + 3 个开源项目 + 10+ 篇扩展引用
- [Loop Engineering 调研快照 2026-06](../research/loop-engineering-2026-06.md) — agent loop / eval loop / environment feedback loop 相关来源
- [LLM Wiki / PKM 系统快照 2026-06](../research/llm-wiki-pkm-systems-2026-06.md) — LLM Wiki 范式定义、PKM/RAG/agent memory 系统事实与来源

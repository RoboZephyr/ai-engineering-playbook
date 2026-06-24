---
name: loop-engineering-2026-06
description: Loop Engineering 来源笔记（2026-06）— 公开来源、时间线、关键事实与待验证问题
when_to_use: 查 Loop Engineering 概念来源；核对方法论页的事实依据；回刷 2026-06 之后的新材料
related: [/harness/loop-engineering, /harness/, /workflows/]
stage: reference
layer: L3
date: 2026-06-24
snapshot: true
---

# Loop Engineering 来源笔记（2026-06）

::: tip 这是 L3 事实层
本页记录截至 **2026-06-24** 能核对到的公开来源和事实。学习材料见 [Loop Engineering](/harness/loop-engineering)。
:::

> 初次调研: 2026-06-14 | 增量回刷: 2026-06-24

## 时间线

| 日期 | 来源 | 事实 |
|---|---|---|
| 2024-12-19 | Anthropic, Building effective agents | 区分 workflow 与 agent，并描述 evaluator-optimizer 循环。 |
| 2026-05-12 | OpenAI Cookbook, Agent Improvement Loop | 用 traces、人类反馈、模型反馈、evals 和 Codex handoff 构建 agent harness 改进闭环。 |
| 2026-06-04 | arXiv, The End of Software Engineering | 把 agentic engineering 描述为 autonomous iterative loop，并列出 context drift、error propagation、verification fidelity 等限制。 |
| 2026-06-07 | Addy Osmani, Loop Engineering | 直接使用 `Loop Engineering` 作为标题，提出 automation、worktrees、skills、plugins/connectors、sub-agents、memory 等构件。 |
| 2026-06-10 | arXiv, AI Workflow Store v3 | 批评 on-the-fly loop 缺少传统软件工程的设计、测试、评估和发布纪律。 |
| 2026-06-11 | arXiv, EurekAgent | 提出 agent environment engineering，关注 permissions、artifacts、budget、human-in-the-loop。 |
| 2026-06-20 | Business Insider | 将 `Loop Engineering` 作为 AI 工具趋势报道，引用 Boris Cherny、Peter Steinberger、Claire Vo、Addy Osmani。 |
| 2026-06-21 | arXiv, RigorBench | 提出用执行轨迹评价 autonomous coding agents 的工程过程纪律。 |
| 2026-06-21 | arXiv, GAIE | 提出受监管领域 agentic code generation 的三层人类监督模型。 |

## 主要来源

### Addy Osmani: Loop Engineering

**链接**: [addyosmani.com/blog/loop-engineering](https://addyosmani.com/blog/loop-engineering/)

**日期**: 2026-06-07。

**关键事实**:
- 文章把 Loop Engineering 描述为设计一个替人 prompt agent 的系统。
- 文中说 loop 位于 harness 之上：harness 是单个 agent 的工作环境，loop 带有时间节律、helper agents 和外部状态。
- 文中列出五个组成件：automations、worktrees、skills、plugins/connectors、sub-agents，并补充第六项 memory。
- 文中把 Codex 与 Claude Code 都映射到这组能力上。
- 文中强调 maker/checker 分离、token 成本、理解债务和人工判断。

### Business Insider: 术语传播

**链接**: [Forget prompt engineering: 'Loop engineering' is all the rage now](https://www.businessinsider.com/what-are-loops-ai-engineering-tips-2026-6)

**日期**: 2026-06-20。

**关键事实**:
- 报道把 `Loop Engineering` 描述为 AI 开发中的新趋势。
- 报道引用 Boris Cherny 关于“agent prompts Claude”的说法，以及 Peter Steinberger 关于“designing loops that prompt your agents”的说法。
- 报道把 loops 定义为 recurring systems：让 agent 不需要用户每一步手动 prompt 也能围绕任务继续工作。
- 报道提到 `/goal` 这类持续到任务完成的命令形态。
- 报道把成本和 token 消耗列为主要风险。

### OpenAI Codex Automations

**链接**: [Automations - Codex app](https://developers.openai.com/codex/app/automations)

**日期**: 文档快照截至 2026-06-24。

**关键事实**:
- Codex Automations 支持 recurring background tasks。
- 有发现的运行进入 Triage inbox；没有发现的任务可自动归档。
- Git 仓库中可选择在本地项目或新 worktree 中运行 automation。
- Automations 可与 skills、plugins 组合。
- 文档提醒 unattended automations 继承 sandbox 设置，full access 会增加风险。

### OpenAI Codex Skills

**链接**: [Agent Skills - Codex](https://developers.openai.com/codex/skills)

**日期**: 文档快照截至 2026-06-24。

**关键事实**:
- Skills 被定义为可复用 workflow 的 authoring format。
- Skill 用 progressive disclosure 管理上下文：初始只给名称、描述和路径，触发后再读取完整 `SKILL.md`。
- Skill 可以显式调用，也可以按 description 隐式匹配。
- Plugins 是可安装分发单元，skills 是 workflow authoring format。

### OpenAI Codex Subagents

**链接**: [Subagents - Codex](https://developers.openai.com/codex/subagents)

**日期**: 文档快照截至 2026-06-24。

**关键事实**:
- Codex 支持并行启动专用 subagents，再汇总结果。
- 适合代码库探索、多步骤 feature plan、PR 多维审查等高并行任务。
- 文档说明 subagent workflows 消耗更多 tokens。
- Subagents 继承当前 sandbox policy，并可为 custom agent 设置不同配置。

### OpenAI Cookbook: Agent Improvement Loop

**链接**: [Build an Agent Improvement Loop with Traces, Evals, and Codex](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop)

**日期**: 2026-05-12。

**关键事实**:
- Cookbook 构建一个 agent improvement flywheel。
- 输入包括 traces、人类反馈、模型反馈和 eval results。
- 产物包括 Promptfoo eval suite、validation gate、HALO optimization pass 和 Codex handoff。
- 文中把 harness 定义为围绕模型的完整 contract，包括 instructions、tools、routing、output requirements 和 validation checks。
- 文中强调 traces 记录发生了什么，feedback 说明什么重要，evals 让期望可复用。

### OpenAI Cookbook: Iterative Repair Loops

**链接**: [Build iterative repair loops with Codex](https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex)

**日期**: 文档快照截至 2026-06-24。

**关键事实**:
- Cookbook 把 closed-loop agent workflow 描述为：agent 产出、验证，再用反馈改进下一轮。
- 示例任务是文档可靠性：发现、修复、验证过期或损坏的 API / SDK 示例。
- 三个阶段是 Review、Repair、Validate。
- 文中明确说 validation closes the loop，剩余问题成为下一轮 repair input。
- 结论强调判断和证明分离后，agentic maintenance 更容易审查和运营。

### Anthropic: Building Effective Agents

**链接**: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

**日期**: 2024-12-19。

**关键事实**:
- Anthropic 区分 workflow 与 agent。
- Workflow 由预定义代码路径编排 LLM 和工具；agent 由 LLM 动态决定流程和工具使用。
- Evaluator-optimizer 模式由一个 LLM 生成，另一个 LLM 评估并反馈。
- 文章建议从简单方案开始，只有复杂度被结果证明时再引入多步 agentic system。

### HumanLayer: 12-Factor Agents

**链接**: [github.com/humanlayer/12-factor-agents](https://github.com/humanlayer/12-factor-agents)

**日期**: 仓库快照截至 2026-06-24。

**关键事实**:
- 指南把 agent 描述为循环：LLM 决定下一步，确定性代码执行工具调用，结果追加回 context，重复直到完成。
- 指南强调工程师要拥有 context window、control flow、execution state 和 business state。
- 与 loop 直接相关的 factor 包括暂停/恢复、human tool call、错误压缩进 context、小而专注的 agent、stateless reducer。

### Evaluation-Driven Iteration

**链接**: [When Generic Prompt Improvements Hurt](https://arxiv.org/abs/2601.22025)

**日期**: v1 2026-01-29；v2 2026-06-09。

**关键事实**:
- 论文指出 LLM 应用输出对 prompt 与模型改动敏感。
- 论文提出 Minimum Viable Evaluation Suite（MVES）。
- 实验发现通用 prompt 规则不一定单调提升结果，某些场景会回归。
- 结论支持把 prompt / workflow 改动纳入评测驱动迭代。

### AI Workflow Store

**链接**: [Engineering Robustness into Personal Agents with the AI Workflow Store](https://arxiv.org/abs/2605.10907)

**日期**: v1 2026-05-11；v3 2026-06-10。

**关键事实**:
- 论文把当前主流 agent 模式称为 `on-the-fly loop`。
- 作者认为这种模式绕过了传统软件工程中的迭代设计、严格测试、对抗评估、分阶段部署等过程。
- 论文主张把严格工程过程整合进 agentic loop，形成生产级 hardened workflows。

### EurekAgent

**链接**: [EurekAgent: Agent Environment Engineering is All You Need For Autonomous Scientific Discovery](https://arxiv.org/abs/2606.13662)

**日期**: 2026-06-11。

**关键事实**:
- 论文提出 agent environment engineering。
- 四个维度是 permissions engineering、artifact engineering、budget engineering、human-in-the-loop engineering。
- 论文关注如何通过环境设计放大开放探索、artifact 管理、多 agent 协作，并抑制 reward hacking 和高摩擦人工监督。

### METR: AI Productivity Study

**链接**: [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://arxiv.org/abs/2507.09089)

**日期**: 2025-07-12。

**关键事实**:
- METR 对 16 名熟悉成熟开源项目的开发者和 246 个任务做随机对照试验。
- 参与者预期 AI 节省 24% 时间，任务后仍估计节省 20%。
- 实测 AI 使完成时间增加 19%。
- 对 loop 的含义：不能只凭体感判断效率，必须测量。

### RigorBench

**链接**: [RigorBench: Benchmarking Engineering Process Discipline in Autonomous AI Coding Agents](https://arxiv.org/abs/2606.22678)

**日期**: 2026-06-21。

**关键事实**:
- 论文认为 outcome-only benchmark 不足以评估 autonomous coding agents。
- RigorBench 评价五个维度：Planning Fidelity、Verification Coverage、Recovery Efficiency、Abstention Quality、Atomic Transition Integrity。
- 论文使用完整执行轨迹评分，包括计划、文件修改、测试调用、错误恢复、token 消耗、时间顺序等。
- 论文报告结构化纪律使过程质量分数平均提升 41%，下游结果正确性提升 17%。

### GAIE

**链接**: [Governed AI-Assisted Engineering](https://arxiv.org/abs/2606.22484)

**日期**: 2026-06-21。

**关键事实**:
- 论文关注受监管领域中的 agentic code generation 治理。
- GAIE 提出三层人类监督：human-in-the-loop、human-over-the-loop、automated-with-monitoring。
- Oversight Classification Model 按监管影响、客户接近度、可逆性和数据敏感度路由任务。
- 每一层定义合规审计所需 evidence artifacts。

## 稳定事实

| 事实 | 来源 |
|---|---|
| `Loop Engineering` 已有明确命名来源，但仍处于早期传播阶段。 | Addy Osmani、Business Insider |
| 产品能力正在补齐 loop 构件：automation、worktrees、skills、connectors、subagents、memory。 | OpenAI Codex docs、Addy Osmani |
| 生成与验证分离是反复出现的结构。 | Anthropic、OpenAI repair loop、Addy Osmani |
| 高质量 loop 需要可验证反馈，而不是 agent 自我确认。 | Anthropic、OpenAI repair loop、METR |
| 长循环风险包括 context drift、错误传播、成本、人工注意力瓶颈和理解债务。 | Agentic Engineering、Addy Osmani、METR |
| 过程纪律开始成为 agent 评价对象。 | RigorBench |
| 高风险场景需要分层人类监督和审计证据。 | GAIE |

## 待验证问题

1. `Loop Engineering` 是否会成为稳定术语，还是被 `agentic engineering`、`environment engineering`、`harness engineering` 吸收。
2. RigorBench 的过程纪律评分能否在真实项目中稳定复现。
3. Codex / Claude Code 的 automations 是否会成为日常默认工作形态，还是主要用于高频维护任务。
4. 对文档站、Skill 评测、workflow 编排这类知识库工作，最小有效 loop 指标应包含哪些。
5. 多 agent loop 的 token 成本和人类 review 带宽如何建模。


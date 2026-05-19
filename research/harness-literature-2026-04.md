---
name: harness-literature-2026-04
description: Harness Engineering 文献调研快照（2026-04）— 核心文章、开源项目、引用源
when_to_use: 查 Harness 概念的来龙去脉与参考源；为 Harness 方法论页提供事实依据；做扩展研究
related: [/harness/, /harness/init-methodology]
stage: reference
layer: L3
date: 2026-04-08
snapshot: true
---

# Harness 文献调研快照（2026-04）

::: tip 这是 L3 事实层快照
**只放文献综述和引用源**，本站对 Harness 方法论的推荐（[Harness 板块](/harness/)）以此为事实依据。

下次回刷建议：每半年复查一次（Harness 领域文献节奏较慢）。
:::

> 调研时间: 2026-04-08 | 覆盖: 6 篇核心文章 + 3 个开源项目 + 10+ 篇扩展引用

本报告综合了 2025-2026 年 Harness Engineering 领域的关键文献，按主题组织而非按来源罗列。

---

## 一、核心文献摘要

### 1.1 Anthropic: Effective Context Engineering for AI Agents

**核心观点**: Context engineering 是"精心策划每一步进入模型有限注意力预算的信息"。

关键概念：
- **Context Rot**: 随着 context window 中 token 数增加，模型准确召回信息的能力下降（transformer 的 quadratic attention 特性）
- **Right Altitude**: 系统提示的粒度平衡 — 不要硬编码脆弱逻辑，也不要给模糊的高级指导
- **Just-in-time Context**: 保持轻量标识符（文件路径、query），运行时动态加载数据
- **Compaction**: 对话接近 context 极限时，让模型总结保留"架构决策、未解决 bug、实现细节"，丢弃冗余工具输出
- **Sub-Agent Architecture**: 专用子 agent 深度探索，只返回精炼摘要（1000-2000 tokens）

**对我们的启发**: `CLAUDE.md` 应该是目录（指针），不是百科全书。重信息按需加载。

::: details 原文链接
[anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
:::

### 1.2 Anthropic: Harness Design for Long-Running Apps

**核心观点**: 三角色架构（Planner / Generator / Evaluator）解决长时间 agent 运行的方向偏移和质量退化。

关键机制：
- **Judge/Fix 分离**: "把做事的 agent 和评判的 agent 分开是最强的质量杠杆"
- **Sprint Contract**: Generator 和 Evaluator 在实施前协商"什么算完成"，防止错位
- **Context Reset**: 不用对话压缩，而是通过文件 artifact 做结构化交接，每个 session 有干净的 context
- **Active Testing**: Evaluator 用 Playwright MCP 实际操作应用，不是静态打分
- **Harness 组件衰减**: 每个组件是对模型能力边界的假设，假设会随模型升级衰减。应定期压力测试并退休过时组件

**数据**: 20 分钟单 agent ($9) vs 6 小时 harness ($200) — harness 版本捕获了单 agent 遗漏的多小时复杂度。

**对我们的启发**: `/critique` 和 `/audit` 的 Judge/Fix 分离是正确的。需要加入 Sprint Contract（生成前定义验收标准）。

::: details 原文链接
[anthropic.com/engineering/harness-design-long-running-apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
:::

### 1.3 OpenAI: Harness Engineering (Symphony + Codex)

**核心观点**: 3 人团队 5 个月合并 1500+ PR，零人类手写代码。关键不是模型，是环境设计。

关键实践：
- **AGENTS.md 是目录**: 短文件（< 60 行），指向 `docs/` 目录中的详细文档
- **Doc-gardening Agent**: 定期扫描陈旧文档并自动提 fix-up PR
- **Sub-60-second Build Loop**: 硬约束 — 超过 60 秒就强制拆分架构，而非容忍慢构建
- **Ghost Libraries**: 软件以高保真 spec 分发，agent 从 spec 实现，第二个 agent 对比上游审查，循环直到收敛。消除依赖地狱
- **Symphony**: Elixir/BEAM 守护进程，把项目管理工具的 ticket 自动转为 agent 任务。每个 agent session 隔离，完成后产出 Proof of Work（CI 结果、walkthrough）
- **Local-first Observability**: Agent 自己启动观测组件（Victoria Logs/Metrics/Traces），反转了传统的观测设置方式

**数据**: ~10 亿 tokens/天，约 $2-3K 日成本。瓶颈是人类注意力，不是算力。

**对我们的启发**: `CLAUDE.md` 应该像 AGENTS.md 一样做目录。日志系统要从第一天就有。

::: details 参考来源
原文 openai.com/index/harness-engineering/ (403)，内容来自 Latent Space podcast 转述和多个二手来源综合。
:::

### 1.4 Yage.ai: Harness Engineering 三维扩展框架

**核心观点**: 统一框架理解三大厂的方向 — 时间扩展（Anthropic）、空间扩展（Cursor）、交互扩展（OpenAI）。

关键分析：
- **四条基础共识**: 环境设计 > 写代码、知识版本化到仓库、约束 > 指令、纠错比等待便宜
- **维度间依赖**: 空间扩展会放大时间问题（多个并行 agent 各自漂移 = 漂移 × 并行数）
- **前提链**: 交互扩展依赖于成熟的时间和空间扩展
- **模型适配**: 不同角色对模型有不同要求，同一 harness 组件在模型升级后可能需要调整

**对我们的启发**: 我们目前在时间维度（单次 pipeline 运行），未来可能需要空间扩展（并行生成多个页面）。

::: details 原文链接
[yage.ai/share/harness-engineering-scalability-20260330.html](https://yage.ai/share/harness-engineering-scalability-20260330.html)
:::

### 1.5 Yage.ai: Context Infrastructure

**核心观点**: Context 质量决定输出深度。LLM 默认输出共识（consensus），只有注入个人判断框架（bias）才能产生有深度的非共识输出。

三层 Context 系统：
- **L1 大量积累**: 收集行为数据 — 对话记录、决策日志、修正历史
- **L2 分层提炼**: L1 Observer（日扫描）→ L2 Reflector（周去重）→ L3 Axiom（稳定原则提取）
- **L3 按需加载**: 按任务类型加载 context 子集，防止 context 稀释

CPU 缓存类比：
```
L1 cache → AGENTS.md / CLAUDE.md (每次对话都加载)
L2 cache → Skill 库索引 (按需检索)
L3 cache → 具体 Skill 文件 (激活时加载)
```

**关键洞察**: 提炼不是提取事实（"你偏好 TypeScript"），而是提取原则（"你怎么权衡可维护性和性能"）。

**对我们的启发**: 日志系统的三层设计（L1 实时 / L2 汇总 / L3 洞察）直接来自这个 context infrastructure 思路。

::: details 原文链接
[yage.ai/context-infrastructure.html](https://yage.ai/context-infrastructure.html)
:::

### 1.6 Martin Fowler: Harness Engineering for Coding Agent Users

**核心观点**: 用控制理论框架分析 Harness — Guides（前馈控制）和 Sensors（反馈控制）。

关键框架：
- **Guides (前馈)**: 在 agent 行动前预防 — LSP、架构文档、bootstrap 脚本
- **Sensors (后馈)**: 在 agent 行动后检测 — linter、测试、AI code review
- **Computational Sensors**: 快速确定性检查（类型检查、lint）
- **Inferential Sensors**: 慢速语义检查（LLM-as-Judge）
- **三类调节目标**: Maintainability（最成熟）、Architecture Fitness（中等）、Behavior（最欠缺）
- **Ashby's Law**: 调节器的多样性必须 >= 被调节系统的多样性。约束到已定义的拓扑可降低多样性，使全面 harness 成为可能

**对我们的启发**: 把我们的约束分为 Guide（预防性文档/规则）和 Sensor（检测性 hook/test），分别设计。

---

## 二、开源项目分析

### 2.1 AutoAgent (kevinrgu/autoagent)

**定位**: 自动优化 agent 配置的框架。

**核心机制**: `program.md`（人类写的元指令）→ meta-agent 修改 `agent.py`（harness 代码）→ benchmark 评分 → 接受/拒绝。

**启发**: 节点级自动优化的参考实现。每个节点有评分标准和 hill-climbing 接受逻辑。

### 2.2 AutoResearch (karpathy/autoresearch)

**定位**: AI 自主进行 ML 实验。

**核心机制**: 固定 5 分钟训练预算 → agent 修改 `train.py` → 评估 val_bpb → 保留/丢弃。~12 次实验/小时。

**启发**: 固定预算 + 明确评分指标 = 可靠的自动迭代。我们的 Quality Score 可以扮演类似角色。

### 2.3 Compound Engineering Plugin (EveryInc)

**定位**: AI 编码的复合工程插件。

**核心机制**: `Brainstorm → Plan → Work → Review → Compound → Repeat`。每个循环积累可复用知识。

**启发**: Solution 积累机制。`/ce:compound` 显式记录学到的模式，供后续使用。

---

## 三、扩展引用

### 来自 Addy Osmani: Self-Improving Coding Agents

四通道持久记忆：
1. **AGENTS.md** (语义记忆) — 模式、约定、踩过的坑、风格偏好
2. **Git commit history** — agent 运行 `git log` 和 `git diff` 理解变更
3. **Progress log** (progress.txt) — 每个周期的时间顺序记录（通过/失败状态 + 错误信息）
4. **Task state** (prd.json) — 结构化 JSON 追踪任务状态，可从崩溃中恢复

Correction Loop: Observation → Correction → Documentation → Inheritance。成功标准："stop repeating myself"。

### 来自 ADR Pattern for Claude Code (7tonshark)

- 存储在 `adr/` 目录，顺序编号
- CLAUDE.md 列出所有 ADR 并包含指令："Check ADRs first before significant modifications"
- 创建 `.claude/commands/adr.md` 作为 slash command
- 关键好处：保持 CLAUDE.md < 2KB，详细指导放在独立的按需文件中

### 来自 Agent Decision Records (AgDR)

扩展传统 ADR 专用于 AI agent：
- YAML frontmatter: id, timestamp, agent, model, trigger, status
- Y-Statement: "In the context of [X], facing [Y], I decided [Z] to achieve [W], accepting [T]."
- 创建门槛：库选择、架构模式、约定 → 写。变量命名、格式化 → 不写。

### 来自 HumanLayer: Skill Issue

- CLAUDE.md/AGENTS.md 保持 < 60 行（ETH Zurich 研究：LLM 生成的 config 反而降低性能且增加 20%+ 成本）
- Skills 作为渐进式暴露机制（activated = loaded as user message）
- Sub-agents 作为 context 防火墙（parent 只看 prompt + 最终结果）
- Hooks: 每次 agent 停止后跑 formatter + typecheck，成功静默退出，失败 exit code 2 重新激活 agent
- Back-pressure: 吞掉通过的测试输出，只展示失败

---

## 四、行业争论

### "Big Model vs Big Harness" 之争

| 阵营 | 代表人物 | 观点 |
|------|----------|------|
| **Thin Harness** | Boris Cherny (Anthropic), Noam Brown | 最薄的 wrapper 胜出；更好的模型会消除 harness 需求 |
| **Thick Harness** | Jerry Liu (LlamaIndex), Pi team | "Model Harness is Everything"；只改 harness 就能同时提升 15 个 LLM 的编码能力 |
| **当前共识** | 2026 年会议 track | Harness engineering 已成为独立学科，但最佳 harness 随模型升级应逐步简化 |

**我们的立场**: Harness 组件是对模型能力边界的假设。假设会衰减。好的 harness 系统包含自我简化机制。

---

## 五、关键数据点

| 指标 | 来源 | 数据 |
|------|------|------|
| 单 agent vs harness 质量差 | Anthropic | $9/20min vs $200/6hr，harness 版本远超 |
| 日均 token 消耗 | OpenAI Symphony | ~10 亿 tokens/天，~$2-3K |
| 团队效率 | OpenAI | 3 人 5 月 1500+ PR（3.5 PR/人/天，后期 5-10/天）|
| Cursor 峰值吞吐 | Cursor | ~1000 commits/小时 |
| Agent config 过长的代价 | ETH Zurich | LLM 生成的长 config 降低性能，增加 20%+ 成本 |
| Observability 开销 | 各平台 | AgentOps +12%, Langfuse +15%，可接受 |

---

## 六、综合结论

### 已确认的原则（高信心）

1. **Harness 的核心是环境设计，不是代码编写**
2. **Config 文件要短（< 60 行），做目录不做百科**
3. **Judge/Fix 分离是质量最强的杠杆**
4. **约束要可自动执行（hooks/linters），不只是文字提醒**
5. **日志从第一天就要有，没有日志一切改进都是盲的**
6. **失败驱动学习 — 每个错误变成 harness 改进**
7. **Context 分层加载（L1/L2/L3），永远不要全部塞进去**

### 待验证的观点（中等信心）

1. **Sprint Contract 前置**是否对短任务（< 1 分钟）有意义
2. **Ghost Libraries**（spec-driven implementation）是否适用于前端组件
3. **Harness 衰减检测**的自动化程度能做到多高

### 我们独有的洞察

1. **节点反馈 vs 整体日志是两层不同的系统** — 节点优化（如 AutoAgent）处理单步，日志系统提供全局视角
2. **Solution 积累是被动的自进化** — 不需要复杂的 meta-agent，只要每次失败都记录修复方案
3. **生成式 pipeline 比通用编码 agent 更需要 harness** — 因为输出质量难以用类型检查/测试覆盖，必须有 LLM-as-Judge

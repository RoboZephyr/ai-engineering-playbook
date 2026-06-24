---
name: loop-engineering
description: Loop Engineering 学习材料。理解并设计 AI Agent 的持续工作闭环：触发、状态、行动、验证、修正、记忆和监督
when_to_use: 学习 Loop Engineering；把 AI 协作从一次性 prompt 升级为可复盘、可验证、可持续运行的工作系统；设计 agent workflow
inputs: [任务目标, 重复场景, 验收标准, 工具能力, 日志, 失败案例]
outputs: [Loop 设计图, 验证策略, 过程指标, 记忆机制, 监督边界]
related: [./context-design, ./logging, ./knowledge-system, ./self-evolution, ../workflows/tdd-cycle, ../research/loop-engineering-2026-06]
stage: method
---

# Loop Engineering

> 2026-06-24 学习版：从“写 prompt 让 agent 做事”，转向“设计一个系统，让系统持续 prompt、调度、验证和修正 agent”。

## 一句话理解

**Loop Engineering 是设计 AI Agent 持续工作的闭环。**

Prompt Engineering 关注一次模型调用怎么写；Loop Engineering 关注一个任务如何被反复触发、分发、执行、验证、修正，并把结果沉淀到下一轮。

最小结构：

```
Trigger -> Goal -> State -> Action -> Observation -> Evaluation -> Correction -> Memory
```

它的关键不是“让 AI 多跑几轮”，而是让每一轮都有：

| 要素 | 问题 |
|---|---|
| Trigger | 什么时候启动？手动、定时、事件触发，还是直到目标完成？ |
| Goal | 这轮要达成什么？什么算完成？ |
| State | 当前进度、已尝试方案、阻塞点保存在哪里？ |
| Action | agent 可以做哪些动作？读、写、跑测试、发 PR、调 API？ |
| Observation | 环境返回什么事实？测试、截图、trace、CI、用户反馈？ |
| Evaluation | 谁判断结果？确定性检查、独立 agent、人审，还是组合？ |
| Correction | 不达标时怎么改？重试、换策略、回滚、升级给人？ |
| Memory | 这轮学到什么？写入日志、ADR、Solution、Skill 还是 issue？ |

## 为什么现在突然重要

过去我们和 coding agent 的交互大多是：

```
人写 prompt -> agent 做一轮 -> 人看结果 -> 人继续 prompt
```

这很像人在手动推动一个工具。Agent 能力变强后，瓶颈变成了人类注意力：你要不断发现任务、补上下文、判断结果、催它继续。

Loop Engineering 把人从“每一步 prompt 的操作者”移到“工作系统的设计者”：

```
人设计 loop -> loop 发现任务 -> 分发给 agent -> 验证结果 -> 记录状态 -> 下一轮继续
```

这不是完全自动化，也不是放弃判断。相反，人的工作变成定义边界：哪些可以自动跑，哪些必须停下来让人看。

## 和已有概念的关系

| 概念 | 关注点 | 和 Loop Engineering 的关系 |
|---|---|---|
| Prompt Engineering | 单次指令怎么写 | Prompt 是 loop 中的一次动作输入 |
| Context Engineering | 每一步给模型看什么 | Context 是 loop 的输入控制层 |
| Harness Engineering | agent 的工具、约束、日志、环境 | Harness 是单个 agent 的工作环境；loop 调度 harness 反复工作 |
| Workflow | 某类任务的标准流程 | Workflow 通常由一个或多个 loop 组成 |
| Agentic Engineering | 长周期、多 agent、产品级交付 | Loop Engineering 是其中的基础能力 |

## 六个工程构件

一个能长期运转的 loop，通常需要六个构件。

| 构件 | 作用 | 典型实现 |
|---|---|---|
| Automation | 让 loop 按节律或事件启动 | cron、Codex Automations、GitHub Actions、scheduled task |
| Isolation | 并行 agent 不互相踩文件 | `git worktree`、临时分支、独立 checkout |
| Skills | 把项目知识和标准流程外置 | `SKILL.md`、review skill、triage skill、repair skill |
| Connectors | 让 loop 接触真实工作系统 | MCP、GitHub、Linear、Slack、数据库、监控系统 |
| Sub-agents | 分工、并行和交叉检查 | explorer、implementer、reviewer、security reviewer |
| Memory | 保存跨轮状态和经验 | Markdown state、issue board、日志、ADR、Solution |

缺少这些构件时，loop 会退化成一次性 prompt：每轮重新解释、重新猜上下文、无法恢复，也很难知道到底有没有变好。

## 四种常见 Loop

### 1. Goal Loop

目标驱动，直到停止条件成立。

```
Set goal -> Act -> Check stop condition -> Continue or stop
```

适合：
- 修一个明确 bug
- 完成一个小功能
- 让测试或 lint 变绿

关键点：
- 停止条件必须可验证，例如“`npm test` 通过”比“修好这个问题”可靠。
- 最好让独立 evaluator 判断是否完成，而不是让实现 agent 自评。

### 2. Repair Loop

反馈驱动，上一轮验证结果成为下一轮修复输入。

```
Review -> Repair -> Validate -> Repair again if needed
```

适合：
- 修文档中过期示例
- 修 failing tests
- 修 UI 截图中的明显问题
- 修 API 调用、类型错误、格式错误

关键点：
- Review 和 Repair 分离。
- Validate 必须运行真实检查。
- 每一轮只修验证反馈里的具体问题，避免无边界重写。

### 3. Triage Loop

时间或事件驱动，定期发现可处理任务。

```
Wake up -> Scan signals -> Create findings -> Route work -> Archive if nothing matters
```

适合：
- 每天看 CI 失败
- 每天总结最近 commit
- 定期扫描文档断链
- 定期发现最近引入的 bug

关键点：
- 没有发现时自动归档，避免噪音。
- 有发现时进入 inbox 或 issue board，而不是直接乱改。
- 高频任务要控制成本和权限。

### 4. Improvement Loop

系统改进驱动，用历史运行数据反过来改 harness。

```
Trace -> Feedback -> Eval -> Diagnose -> Harness change -> Re-run
```

适合：
- 改进一个长期使用的 agent workflow
- 把人工反馈变成 regression eval
- 从失败日志中提炼新的 Skill / Solution

关键点：
- traces 记录发生了什么。
- feedback 说明什么重要。
- evals 把期望变成可复用检查。
- harness change 必须能被下一轮验证。

## 设计原则

### 1. 先写停止条件

没有停止条件的 loop 不是自治，是失控。

至少定义四件事：

| 条件 | 例子 |
|---|---|
| 成功 | 相关测试通过、截图无阻塞问题、文档链接检查通过 |
| 失败 | 同一错误连续出现 2 次、缺少必要权限、输入事实不足 |
| 预算 | 最多 3 轮、最多 30 分钟、最多指定 token 成本 |
| 升级 | 涉及生产数据、支付、安全、合规时必须人审 |

### 2. 让环境提供事实

Agent 自己说“我完成了”不算事实。

| 场景 | 更可信的 sensor |
|---|---|
| 代码 | 测试、类型检查、lint、构建、CI |
| UI | 浏览器截图、交互结果、可访问性树、视觉审查 |
| 文档 | 链接检查、frontmatter、来源引用、构建结果 |
| 数据 | 可复现脚本、原始数据、校验公式 |
| Agent 工作流 | trace、耗时、轮数、失败率、人工介入次数 |

### 3. Maker 和 Checker 分离

写代码的 agent 往往会宽容自己的结果。更稳的结构是：

```
Maker -> Artifact -> Checker -> Feedback -> Fixer -> Re-check
```

Checker 可以是：
- 确定性工具：测试、lint、schema、截图对比
- 独立 sub-agent：代码审查、安全审查、事实审查
- 人：高风险变更、产品判断、模糊需求

### 4. 评价过程，而不只评价结果

两个 agent 都能让测试通过，但质量可能完全不同。

好的 loop 应该观察过程纪律：

| 维度 | 要看什么 |
|---|---|
| Planning Fidelity | 是否先拆解任务，执行是否和计划对齐 |
| Verification Coverage | 是否为需求补验证，而不是只改实现 |
| Recovery Efficiency | 失败后是否换策略，还是重复同一种试错 |
| Abstention Quality | 遇到不可能或模糊任务时是否知道停下或提问 |
| Atomic Transition Integrity | 中间状态是否保持可构建、可回滚、可审查 |

这也是 RigorBench 这类新 benchmark 的核心：不只看 agent 最后做出了什么，也看它怎么做到的。

### 5. 状态放在上下文之外

Loop 长了以后，context 会漂移。不要把所有历史都塞进模型上下文。

更好的方式：
- 当前轮只带目标、验收标准、最近失败和关键约束
- 长历史放在日志、state file、issue board、ADR、Solution
- 下一轮通过路径和检索加载必要部分

一句话：**模型会忘，repo / logs / board 不会忘。**

### 6. 自动化越强，监督越要分层

不是所有 loop 都应该自动合并、自动发布。

| 风险 | 推荐监督 |
|---|---|
| 内部文档、低风险清理 | automated-with-monitoring |
| 客户可见代码、主要功能 | human-over-the-loop，自动执行但人审结果 |
| 支付、安全、隐私、合规 | human-in-the-loop，关键步骤前必须批准 |

## 反模式

| 反模式 | 表现 | 修正 |
|---|---|---|
| Blind retry | 失败后只让 agent 再试一次 | 给错误分类、换策略规则和最大轮数 |
| Self-approval | agent 自己写、自己宣布通过 | 加确定性 sensor 或独立 checker |
| Infinite autonomy | 没有停止条件和预算 | 先定义成功、失败、预算、升级 |
| Context hoarding | 每轮都带完整历史 | 压缩状态，长信息外置 |
| Tool soup | 给 agent 一堆工具但无边界 | 按 loop 阶段限制工具和权限 |
| Metric theater | 只统计 token 或代码行数 | 统计完成率、返工率、人工介入、缺陷逃逸 |
| Cognitive surrender | 人不再理解 loop 产物 | 保留 review 节点，定期读 diff 和决策记录 |

## 我们怎么用它学习

对这个知识库，最适合先做三个轻量 loop，而不是上来做全自动 agent 工厂。

### Loop A: 文档质量维护

目标：定期发现文档站中的结构问题。

最小闭环：

```
定期构建 -> 检查 broken links/frontmatter/sidebar -> 生成 findings -> 人审 -> 修复 -> 记录常见问题
```

适合沉淀：
- 文档贡献规范
- sidebar 更新检查
- Reference 快照日期检查

### Loop B: Skill 评测更新

目标：定期检查某个 Skill 领域是否有新来源、新工具、新版本。

最小闭环：

```
选择领域 -> 搜索官方/一手来源 -> 更新 research 快照 -> 判断是否影响 skills 页 -> 构建验证
```

适合沉淀：
- L3 快照更新节奏
- 来源可信度规则
- 不重复描述规则

### Loop C: Workflow 可执行性复盘

目标：看现有 workflow 是否真的能指导 agent 完成任务。

最小闭环：

```
挑一个 workflow -> 用真实任务跑一遍 -> 记录卡点 -> 更新步骤/注意事项 -> 再跑构建
```

适合沉淀：
- Workflow 的 Phase 是否过细或过粗
- 哪些步骤需要 sensor
- 哪些地方需要人审

## 学习路径

### 第 1 遍：建立直觉

读完这页，只记住一句话：

**Loop Engineering = 让任务自己被触发、执行、验证、修正和记住。**

### 第 2 遍：画一个你正在做的 loop

选一个真实场景，不要抽象：

- “让 agent 修一个 bug”
- “让 agent 每天看 CI”
- “让 agent 更新一篇调研”
- “让 agent 审一个 PR”

画出：

```
触发 -> 目标 -> 输入状态 -> agent 动作 -> 外部反馈 -> 是否继续 -> 记到哪里
```

### 第 3 遍：补一个 sensor

不要先追求全自动。先补一个真实反馈：

- 文档：`npm run docs:build`
- 代码：相关测试
- UI：浏览器截图
- 调研：来源列表和日期
- Review：独立 reviewer agent 或人审

### 第 4 遍：补一个 memory

把“这次学到了什么”放到上下文之外：

- 失败修复：Solution
- 长期取舍：ADR
- 重复流程：Playbook / Workflow
- 指标趋势：日志

### 第 5 遍：决定自动化边界

问三个问题：

1. 这个 loop 跑错了会造成什么损失？
2. 哪些步骤可以自动做，哪些必须人看？
3. 如果连续失败，它怎么停下来？

## 判断一个 Loop 是否成熟

| 等级 | 特征 |
|---|---|
| Level 0: Manual Prompt | 人每一步都要写 prompt 和判断 |
| Level 1: Repeatable Loop | 有固定步骤、停止条件和基础验证 |
| Level 2: Observable Loop | 有日志、trace、成本、失败原因 |
| Level 3: Repairable Loop | 能根据验证反馈修正，避免重复试错 |
| Level 4: Improving Loop | 能把历史反馈转成 eval、Skill、Solution 或 harness 改进 |
| Level 5: Governed Loop | 有权限、风险分层、审计证据和自动化边界 |

多数个人和小团队先做到 Level 2-3 就已经很有价值。Level 5 是高风险、生产级或受监管场景才需要。

## 阅读来源

这页的方法论基于 [Loop Engineering 调研快照 2026-06](../research/loop-engineering-2026-06.md)。

建议按这个顺序读：

1. [Addy Osmani: Loop Engineering](https://addyosmani.com/blog/loop-engineering/) — 直接解释这个术语和六个构件。
2. [OpenAI: Build iterative repair loops with Codex](https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex) — 看 Review / Repair / Validate 具体闭环。
3. [OpenAI: Build an Agent Improvement Loop with Traces, Evals, and Codex](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop) — 看 trace + feedback + eval 如何变成 harness 改进。
4. [RigorBench](https://arxiv.org/abs/2606.22678) — 理解为什么要评价过程纪律。
5. [Business Insider 报道](https://www.businessinsider.com/what-are-loops-ai-engineering-tips-2026-6) — 看术语如何进入更大众的 AI 工具讨论。


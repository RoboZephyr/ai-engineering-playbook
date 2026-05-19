---
name: harness-init
description: 新项目 Harness 初始化的完整流程。从零开始搭建 Agent 工作环境的可复制方法
when_to_use: 启动新项目；现有项目 Harness 不完整要补足；想知道从零如何搭建
inputs: [项目类型, 团队规模, 技术栈]
outputs: [CLAUDE.md/AGENTS.md, 目录结构, 工具清单, 日志框架]
related: [./architecture-patterns, ./context-design, ./templates]
stage: method
---

# Harness Init 方法论

> 任何新项目的第一步不是写代码，而是设计 Agent 的工作环境。
>
> 本方法论提供一套可复制的流程，从零开始初始化一个完整的 Harness 系统。

## 适用场景

- 新项目启动（greenfield）
- 已有项目引入 AI agent 协作
- 重构现有 CLAUDE.md / AGENTS.md
- 为团队建立 agent 工程规范

## 总览：5 个阶段

```
Phase 1: Foundation    → CLAUDE.md + 目录结构 + 基础约束
Phase 2: Observability → 日志系统 + 运行记录
Phase 3: Knowledge     → Decision Records + Solution 库
Phase 4: Quality       → Hooks + Linters + Judge/Fix 循环
Phase 5: Evolution     → 自修复 + 自迭代 + 衰减检测
```

每个阶段独立可用，不必一次性全部完成。Phase 1 是必做的起点，后续按需渐进。

---

## Phase 1: Foundation（基础层）

**目标**: Agent 从第一次对话就知道项目是什么、怎么工作、有什么约束。

### Step 1.1: 创建 Config 文件

根据你使用的工具选择：

| 工具 | 文件 | 角色 |
|------|------|------|
| Claude Code | `CLAUDE.md` | Agent 每次对话都读取的核心指令 |
| Codex | `AGENTS.md` | 等同于 CLAUDE.md |
| Cursor | `.cursorrules` | 等同于 CLAUDE.md |
| 通用 | `AGENTS.md` + `CLAUDE.md` | 两者都写，最大兼容 |

**关键原则**:

::: warning Config 文件是目录，不是百科
保持 < 60 行。详细信息放在 `docs/` 目录，Config 文件只放指针。

ETH Zurich 研究证实：过长的 agent config 反而降低性能、增加 20%+ 成本。
:::

Config 文件的结构：

```markdown
# 项目名

## 是什么
一句话描述项目。

## 常用命令
最多 6-8 个最常用的 CLI 命令，每个带简短说明。

## 架构
3-5 行描述核心模块和依赖关系。详见 docs/architecture.md。

## 约束
5-10 条最重要的硬性规则（可自动验证的优先）。

## 重要文档
- [架构决策](docs/harness/decisions/) — 修改前先查
- [已知方案](docs/harness/solutions/) — 遇到问题先查
- [操作手册](docs/harness/playbooks/) — 常见流程参考
```

详细模板见 [模板库 — CLAUDE.md 模板](./templates#claudemd-模板)。

### Step 1.2: 创建 Harness 目录结构

```bash
mkdir -p docs/harness/{decisions,solutions,plans,playbooks,logs/runs,metrics}
```

```
docs/harness/
├── HARNESS.md              ← Harness 系统说明（给 agent 读的 entry point）
├── decisions/              ← ADR: 架构决策记录
├── solutions/              ← 失败→修复的知识积累
├── plans/                  ← 实施计划 (active / completed)
│   ├── active/
│   └── completed/
├── playbooks/              ← 操作手册
├── logs/                   ← 运行日志
│   ├── schema.md           ← 日志格式定义
│   └── runs/               ← JSONL 日志文件
└── metrics/                ← 质量趋势
    └── quality-tracker.jsonl
```

### Step 1.3: 写 HARNESS.md（给 Agent 的入口）

这个文件告诉 Agent："这个项目有 harness 系统，你应该怎么使用它"。

```markdown
# Harness System

本项目使用结构化的 harness 系统管理知识和质量。

## 使用规则

1. **修改架构前** → 先查 `decisions/` 是否已有相关 ADR
2. **遇到错误时** → 先查 `solutions/` 是否已有修复方案
3. **开始复杂任务前** → 在 `plans/active/` 创建计划，定义验收标准
4. **修复新问题后** → 在 `solutions/` 记录修复方案
5. **做出重要决策后** → 在 `decisions/` 创建 ADR

## 目录说明

- `decisions/` — 架构决策记录（ADR），编号递增
- `solutions/` — 问题→修复方案的知识库
- `plans/` — 活跃和已完成的实施计划
- `playbooks/` — 标准操作流程
- `logs/` — Pipeline 运行日志
- `metrics/` — 质量趋势数据
```

### Step 1.4: 写第一批 Decision Records

把已有的隐式决策显式化。新项目至少写 3-5 个 ADR：

- 技术栈选择（为什么用这个框架）
- 代码组织方式（目录结构的设计理由）
- 最重要的约束（为什么有这条规则）

模板见 [模板库 — ADR 模板](./templates#adr-模板)。

### Step 1.5: 提交 Foundation

```bash
git add CLAUDE.md docs/harness/
git commit -m "init: harness foundation — CLAUDE.md + harness directory structure"
```

::: tip Phase 1 的验收标准
- [ ] CLAUDE.md < 60 行，每条指令可操作
- [ ] `docs/harness/` 目录结构存在
- [ ] HARNESS.md 告诉 agent 如何使用 harness 系统
- [ ] 至少 3 个 ADR 记录已有决策
- [ ] Agent 首次对话能正确理解项目并遵守约束
:::

---

## Phase 2: Observability（可观测层）

**目标**: 每次有意义的 agent 操作都留下结构化记录，为后续的自修复和自进化提供数据基础。

### Step 2.1: 定义日志 Schema

在 `docs/harness/logs/schema.md` 中定义日志格式。详见 [日志系统](./logging)。

核心原则：

- **三级日志**: L1 Phase 级（实时）→ L2 Run 级（汇总）→ L3 趋势级（洞察）
- **结构化**: JSONL 格式，每行一条记录，可 grep/jq 查询
- **关键字段**: 时间戳、phase、状态、耗时、成本、错误类型

### Step 2.2: 在 Pipeline 关键节点埋点

确定你的 pipeline 有哪些关键节点，在每个节点的入口和出口记录日志：

```
节点入口 → 记录: 时间戳 + 输入参数摘要
节点出口 → 记录: 耗时 + 输出摘要 + 状态(成功/失败) + 成本
```

最小埋点清单：
- [ ] 每次 LLM 调用: model, token 数, 延迟, 是否命中缓存
- [ ] 每次外部 API 调用: 端点, 状态码, 延迟
- [ ] 每次质量评分: 分数, 分项, 是否通过
- [ ] 每次错误: 类型, 消息, 是否可重试

### Step 2.3: 实现 Quality Tracker

每次 pipeline 完成，追加一行到 `metrics/quality-tracker.jsonl`：

```jsonl
{"date":"2026-04-08","topic":"ai-code-review","score":72,"duration":45200,"cost":0.12,"iterations":2}
```

这个文件是长期积累的，用于发现质量趋势。

::: tip Phase 2 的验收标准
- [ ] Pipeline 每次运行产生 JSONL 日志
- [ ] 日志包含每个 phase 的耗时和状态
- [ ] LLM 调用有 token 计数和成本追踪
- [ ] quality-tracker.jsonl 每次运行追加一行
:::

---

## Phase 3: Knowledge（知识层）

**目标**: 建立持续积累的知识系统，让每次失败都变成未来的优势。

### Step 3.1: Solution 积累机制

**触发条件**: 每当修复一个新类型的问题后。

**流程**:
1. 问题被发现和修复
2. 在 `solutions/` 创建记录: Symptoms → Root Cause → Solution → Prevention
3. HARNESS.md 中的指令确保 agent 遇到问题时先搜索 solutions/

**关键**: Solution 从真实故障产生，永远不要预设。模板见 [模板库](./templates#solution-模板)。

### Step 3.2: Plan 前置机制

**触发条件**: 开始任何需要 > 30 分钟的任务前。

**流程**:
1. 在 `plans/active/` 创建计划文件
2. 定义 **Acceptance Criteria（验收标准）** — Sprint Contract
3. 分解为步骤，每步有明确的完成定义
4. 完成后移到 `plans/completed/`

### Step 3.3: Playbook 标准化

把重复出现的操作流程写成 Playbook：

- 新功能开发流程
- 质量救援流程（score < 阈值怎么办）
- API 故障处理流程
- 发版检查清单

Playbook 是给 agent 和人类共用的操作手册。

::: tip Phase 3 的验收标准
- [ ] 至少 3 个 Solution 记录（来自真实故障）
- [ ] 复杂任务有前置 Plan + 验收标准
- [ ] 至少 1 个 Playbook 覆盖最常见的操作流程
- [ ] Agent 遇到问题时会先搜索 solutions/
:::

---

## Phase 4: Quality（质量层）

**目标**: 把文字约束变成可自动执行的检查。

### Step 4.1: Hooks / Pre-commit 配置

把最重要的约束编码为自动检查：

**Claude Code Hooks** (`.claude/settings.json`):
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "your-validation-script.sh $TOOL_FILE",
          "timeout": 10
        }]
      }
    ]
  }
}
```

**原则**:
- 快速检查（< 10s）放 pre-commit / PostToolUse
- 慢速检查（LLM-as-Judge）放 post-merge 或手动触发
- 成功静默退出（exit 0），失败返回错误信息（exit 2）让 agent 自动修复
- 吞掉通过的输出，只展示失败（back-pressure 原则）

### Step 4.2: Judge/Fix 分离

如果你的 pipeline 有质量评估环节：

```
Judge (只读, 不改代码)     Fix (只改代码, 不评分)
  评分 → 问题列表            根据问题列表修复
  绝不自己修复               绝不自己评分
```

Never self-judge: 一个 agent 对自己的输出评分会过度自信。

### Step 4.3: 约束验证

对 `decisions/` 中的每个 ADR，检查是否有对应的自动验证：

| ADR | 约束 | 验证方式 |
|-----|------|----------|
| 001-tech-stack | 使用 TypeScript | `tsconfig.json` 存在 + build 通过 |
| 002-no-banned-fonts | 不使用 Inter/Roboto | grep BANNED_FONTS 在 CSS/TSX 中 |
| 003-judge-fix-separation | Judge 不改代码 | Skill 文件中无 Edit/Write 工具 |

至少 50% 的约束应该有自动验证，否则约束会逐渐失效。

::: tip Phase 4 的验收标准
- [ ] 至少 3 条约束有自动验证（hook/linter/CI）
- [ ] 快检查 < 10s，慢检查标记为可选
- [ ] Judge/Fix 分离（如果有质量评估环节）
- [ ] 成功静默，失败才报错
:::

---

## Phase 5: Evolution（进化层）

**目标**: Harness 系统自我改进，而非只靠人工维护。

### Step 5.1: 自修复（Failure → Solution → Auto-Apply）

```
Pipeline 失败
  → 搜索 solutions/ 匹配已知方案
    → 找到匹配 → 自动应用修复 → 重试
    → 未找到匹配 → 记录新问题 → 人工介入 → 事后写 solution
```

随着 Solution 库积累，自修复比例逐渐上升。

### Step 5.2: 自迭代（Log Analysis → Improvement Proposals）

周期性（每周或每 N 次运行后）分析日志：

- **性能退化**: 某个 phase 的平均耗时显著上升
- **成本异常**: token 消耗突然增加
- **质量趋势**: 分数在下降还是上升
- **重复失败**: 同一类错误反复出现但没有 solution

分析结果 → 提出改进建议 → 新 ADR 或新 Solution 或调参。

### Step 5.3: 衰减检测（Harness Component Retirement）

Harness 的每个组件是对模型能力边界的假设。模型升级后：

- 某些约束可能不再需要（模型已经自己能做到）
- 某些 workaround 可能变得有害（限制了更强模型的能力）

**检测方法**:
1. 定期在无约束环境下运行相同任务
2. 对比有约束 vs 无约束的质量分
3. 如果无约束版本同样好或更好 → 考虑退休该约束
4. 在 ADR 中标记 `status: deprecated` 并说明原因

::: tip Phase 5 的验收标准
- [ ] Pipeline 失败时自动搜索 solutions/ 匹配
- [ ] 有周期性的日志分析机制（手动或自动）
- [ ] 至少一次衰减检测实验
:::

---

## 快速启动清单

如果你只有 30 分钟，至少做完这些：

```bash
# 1. 创建目录
mkdir -p docs/harness/{decisions,solutions,plans/active,plans/completed,playbooks,logs/runs,metrics}

# 2. 创建 CLAUDE.md（< 60 行）

# 3. 创建 HARNESS.md（告诉 agent 如何使用 harness）

# 4. 写 3 个初始 ADR（技术栈、目录结构、最重要的约束）

# 5. 提交
git add CLAUDE.md docs/harness/
git commit -m "init: harness foundation"
```

如果你有半天，完成 Phase 1 + Phase 2。

如果你有一周，完成全部 5 个 Phase。

---

## 检查矩阵

| 维度 | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|------|---------|---------|---------|---------|---------|
| Agent 知道项目是什么 | CLAUDE.md | — | — | — | — |
| Agent 知道约束是什么 | 约束列表 | — | ADR | 自动验证 | 衰减检测 |
| 运行有记录 | — | 日志 | — | — | 日志分析 |
| 错误有方案 | — | — | Solutions | — | 自修复 |
| 复杂任务有计划 | — | — | Plans | — | — |
| 操作有标准流程 | — | — | Playbooks | — | — |
| 约束可自动执行 | — | — | — | Hooks | — |
| 质量可追踪 | — | Tracker | — | Judge/Fix | 趋势分析 |
| 系统可自我改进 | — | — | — | — | 全部 |

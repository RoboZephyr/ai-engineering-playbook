---
name: templates
description: 文档模板库。CLAUDE.md / PRD / ADR / Solution / Plan / Playbook 等可复制模板
when_to_use: 需要新建任何标准文档；想知道项目里某类文档应该长什么样
inputs: [文档类型]
outputs: [可复制的 markdown 模板]
related: [./init-methodology, ./context-design, ./knowledge-system]
stage: reference
---

# 模板库

> 所有模板可直接复制使用。LLM 引用时读取对应 section 即可。

---

## CLAUDE.md 模板

适用于 Claude Code 项目。

````markdown
# [项目名]

## Overview
[一句话描述项目和核心技术栈]

## Commands
```bash
[cmd1]    # [说明]
[cmd2]    # [说明]
[cmd3]    # [说明]
```

## Architecture
[3-5 行核心模块说明]
详见 docs/architecture.md

## Constraints
- [可验证的硬性规则 1]
- [可验证的硬性规则 2]
- [可验证的硬性规则 3]

## Key Docs
- [Architecture Decisions](docs/harness/decisions/) — 修改前先查
- [Known Solutions](docs/harness/solutions/) — 遇到问题先查
- [Playbooks](docs/harness/playbooks/) — 标准流程参考

## Harness
本项目使用 harness 知识管理系统，详见 docs/harness/HARNESS.md
````

**检查项**: 总行数 < 60，每条指令可操作，无文件清单，无 API 文档。

---

## AGENTS.md 模板

适用于 OpenAI Codex 项目，或同时支持多个 agent 工具。

````markdown
# [项目名]

## Quick Start
```bash
[安装命令]
[启动命令]
[测试命令]
```

## Architecture
[核心模块图或 3-5 行说明]

## Rules
- [硬性规则 1]
- [硬性规则 2]

## Documentation
- `docs/architecture.md` — 系统架构
- `docs/harness/` — 知识管理系统
- `docs/harness/decisions/` — 架构决策记录
- `docs/harness/solutions/` — 已知问题修复方案

## Sub-directory Guides
每个主要目录有自己的 AGENTS.md 提供局部指导。
````

---

## HARNESS.md 模板

放在 `docs/harness/HARNESS.md`，是 agent 进入 harness 系统的入口。

````markdown
# Harness System

本项目使用结构化的 harness 系统管理知识和质量。

## 使用规则

1. **修改架构前** → 先搜索 `decisions/` 是否已有相关 ADR
2. **遇到错误时** → 先搜索 `solutions/` 是否有匹配的已知方案
3. **开始复杂任务前** → 在 `plans/active/` 创建计划，定义验收标准
4. **修复新问题后** → 在 `solutions/` 创建新记录
5. **做出重要决策后** → 在 `decisions/` 创建新 ADR

## 目录结构

```
docs/harness/
├── decisions/     — 架构决策记录 (ADR)，编号递增
├── solutions/     — 问题→修复方案知识库
├── plans/         — 实施计划 (active / completed)
├── playbooks/     — 标准操作流程
├── logs/          — Pipeline 运行日志 (JSONL)
└── metrics/       — 质量趋势追踪数据
```

## 创建指南

- ADR: 库选择、架构模式、命名约定 → 用 [ADR 模板]
- Solution: 修复花费 >15min 的新问题 → 用 [Solution 模板]
- Plan: 预估 >30min 的任务 → 用 [Plan 模板]
- Playbook: 重复 3+ 次的操作流程 → 用 [Playbook 模板]
````

---

## ADR 模板

Architecture Decision Record。

````markdown
---
id: ADR-[NNN]
date: [YYYY-MM-DD]
status: [proposed | accepted | deprecated | superseded by ADR-XXX]
trigger: [什么触发了这个决策]
---

# [NNN]: [决策标题]

## Context
[背景：面临什么情况，有什么约束]

## Decision
[决策内容：选择了什么，怎么做]

## Y-Statement
In the context of **[situation]**,
facing **[concern]**,
I decided **[decision]**
to achieve **[goal]**,
accepting **[tradeoff]**.

## Alternatives Considered
1. **[方案 A]** — [为什么没选: 缺点]
2. **[方案 B]** — [为什么没选: 缺点]

## Consequences
- [正面后果 1]
- [正面后果 2]
- [负面后果/代价 1]

## Verification
- [ ] [可自动验证的检查 1]
- [ ] [可自动验证的检查 2]
````

---

## Solution 模板

问题→修复方案记录。

````markdown
---
problem: [一句话描述问题]
first-seen: [YYYY-MM-DD]
frequency: [发生频率估计]
severity: [P0-critical | P1-blocks | P2-degrades | P3-cosmetic]
---

# [Solution 标题]

## Symptoms
[怎么发现这个问题的 — 给搜索匹配用]
- [症状 1]
- [症状 2]

## Root Cause
[为什么会发生]

## Solution
[修复步骤，具体到可直接执行]
1. [步骤 1]
2. [步骤 2]
3. [步骤 3]

## Prevention
[如何防止再次发生]
- [预防措施 1]
- [预防措施 2]

## Related
- [相关 ADR 或其他 Solution 的链接]
````

---

## Plan 模板

实施计划，带 Sprint Contract。

````markdown
---
status: [active | completed | abandoned]
created: [YYYY-MM-DD]
completed: [YYYY-MM-DD，完成后填写]
---

# Plan: [计划标题]

## Goal
[一句话描述目标]

## Acceptance Criteria (Sprint Contract)
- [ ] [可验证的完成条件 1]
- [ ] [可验证的完成条件 2]
- [ ] [可验证的完成条件 3]

## Phases
### Phase 1: [阶段名]
- [ ] [任务 1]
- [ ] [任务 2]

### Phase 2: [阶段名]
- [ ] [任务 3]
- [ ] [任务 4]

## Out of Scope
[明确不做的事情]

## Actual Results
[完成后填写: 实际结果 vs 预期]
````

---

## Playbook 模板

标准操作流程。

````markdown
# Playbook: [流程名]

## 触发条件
[什么时候执行这个流程]

## 前置条件
- [需要什么环境/工具/数据]

## 步骤

### 1. [步骤名]
[具体动作]
```bash
[可执行的命令，如果有的话]
```

**失败时**: [如果这步失败了怎么办]

### 2. [步骤名]
[具体动作]

**如果 [条件 A]**: 执行 [方案 A]
**如果 [条件 B]**: 执行 [方案 B]

### 3. [步骤名]
[具体动作]

## 完成标志
- [怎么确认流程成功完成]
````

---

## 日志 Schema 模板

放在 `docs/harness/logs/schema.md`。

````markdown
# 日志 Schema

## Phase Log (L1)
每次 pipeline phase 执行产生一条。格式: JSONL。

```json
{
  "runId": "uuid",
  "phase": "research | kit | content | judge | fix | assets",
  "status": "success | failed | skipped",
  "startTime": "ISO 8601",
  "duration": 12300,
  "input": { "summary": "1-2 sentence" },
  "output": {
    "summary": "1-2 sentence",
    "metrics": { "key": 0 }
  },
  "error": {
    "type": "api_error | quality_failure | timeout | validation",
    "message": "error details",
    "retryable": true,
    "solutionMatched": "solution-filename.md"
  },
  "llmCalls": [{
    "model": "model-name",
    "purpose": "content_gen | judge | site_analysis",
    "inputTokens": 1200,
    "outputTokens": 3400,
    "latency": 8200,
    "cached": false
  }]
}
```

## Run Summary (L2)
每次 pipeline 完成追加到 quality-tracker.jsonl。

```json
{
  "runId": "uuid",
  "date": "YYYY-MM-DD",
  "topic": "string",
  "outcome": "success | partial | failed",
  "qualityScore": 72,
  "duration": 45200,
  "cost": { "tokens": 4600, "usd": 0.12 },
  "iterations": 2,
  "config": {
    "mode": "explore | refine | replicate",
    "model": "model-name",
    "preset": "preset-name"
  },
  "autoRepaired": false,
  "solutionUsed": null,
  "phases": {
    "research": { "duration": 8200, "status": "success" },
    "content": { "duration": 15400, "status": "success" }
  }
}
```

## 存储位置
- L1: `docs/harness/logs/runs/<date>-<topic>.jsonl`
- L2: `docs/harness/metrics/quality-tracker.jsonl`
- L3: 手动分析产出，放在 `docs/harness/metrics/` 下
````

---

## Harness Init 快速脚本

一键初始化 harness 目录结构。

```bash
#!/bin/bash
# harness-init.sh — 在项目根目录运行

set -e

echo "Initializing harness system..."

# 创建目录结构
mkdir -p docs/harness/{decisions,solutions,plans/active,plans/completed,playbooks,logs/runs,metrics}

# 创建 HARNESS.md
cat > docs/harness/HARNESS.md << 'HARNESS_EOF'
# Harness System

本项目使用结构化的 harness 系统管理知识和质量。

## 使用规则

1. **修改架构前** → 先搜索 `decisions/` 是否已有相关 ADR
2. **遇到错误时** → 先搜索 `solutions/` 是否有匹配的已知方案
3. **开始复杂任务前** → 在 `plans/active/` 创建计划
4. **修复新问题后** → 在 `solutions/` 创建新记录
5. **做出重要决策后** → 在 `decisions/` 创建新 ADR

## 目录

- `decisions/` — 架构决策记录 (ADR)
- `solutions/` — 问题修复方案
- `plans/` — 实施计划
- `playbooks/` — 标准操作流程
- `logs/` — 运行日志
- `metrics/` — 质量追踪
HARNESS_EOF

# 创建日志 schema
cat > docs/harness/logs/schema.md << 'SCHEMA_EOF'
# Log Schema
See playbook documentation for format details.
SCHEMA_EOF

# 创建空的 quality tracker
touch docs/harness/metrics/quality-tracker.jsonl

# 创建 .gitkeep 保持空目录
for dir in decisions solutions plans/active plans/completed playbooks logs/runs; do
  touch "docs/harness/$dir/.gitkeep"
done

echo "Harness initialized at docs/harness/"
echo "Next steps:"
echo "  1. Write CLAUDE.md (< 60 lines)"
echo "  2. Create 3-5 initial ADRs in docs/harness/decisions/"
echo "  3. Add harness pointer to CLAUDE.md"
```

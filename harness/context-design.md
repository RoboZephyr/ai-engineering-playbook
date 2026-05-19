---
name: context-design
description: CLAUDE.md / AGENTS.md 设计指南。Agent 每次对话的 L1 cache 怎么写
when_to_use: 写或修改项目根目录 CLAUDE.md / AGENTS.md；判断要把什么放进 Context、什么不放
inputs: [项目约束, 团队规范, 技术栈, 已踩过的坑]
outputs: [CLAUDE.md / AGENTS.md / .cursorrules]
related: [./init-methodology, ./templates, ./architecture-patterns]
stage: method
---

# Context 设计指南

> CLAUDE.md / AGENTS.md 是 agent 每次对话的 L1 cache。写好这个文件，等于给 agent 装上了正确的思维框架。

## 核心原则

### 1. 目录，不是百科

```
❌ 错误: 把所有信息塞进 CLAUDE.md（200+ 行）
✅ 正确: CLAUDE.md 是目录（< 60 行），详细信息在 docs/ 里按需加载
```

**为什么**: Context window 是有限资源。每多一个 token 都会稀释其他 token 的注意力（context rot）。CLAUDE.md 每次对话都会被完整加载，所以必须精简。

**数据支持**: ETH Zurich 研究发现 LLM 生成的长 config 文件反而降低性能，增加 20%+ 成本。HumanLayer 建议 < 60 行。

### 2. 约束优先于指导

```
❌ 弱指导: "请尽量写简洁的代码"
✅ 强约束: "函数体不超过 30 行。超过就拆分。"

❌ 弱指导: "注意代码安全性"
✅ 强约束: "所有用户输入必须经过 zod schema 验证。未验证的输入不得传入数据库查询。"
```

约束是可验证的（agent 或 hook 可以检查是否遵守），指导是不可验证的。

### 3. Right Altitude（正确粒度）

```
❌ 太高: "写好代码"
❌ 太低: "第 47 行应该用 const 不用 let"
✅ 正确: "优先使用 const，只在确实需要重新赋值时用 let"
```

太高 → agent 不知道怎么做。太低 → 硬编码脆弱逻辑，换个场景就失效。

---

## CLAUDE.md 设计

### 结构模板

```markdown
# 项目名

## Overview
一句话描述项目是什么、用什么技术栈。

## Commands
6-8 个最常用命令，每个一行:
- `pnpm dev` — 开发服务器
- `pnpm build` — 生产构建
- `pnpm test` — 运行测试
- `pnpm lint` — 代码检查

## Architecture
3-5 行描述核心模块。画个 ASCII 图如果有帮助。
详细架构图见 docs/architecture.md。

## Constraints
硬性规则，每条可验证:
- 不使用 any 类型，使用 unknown + type guard
- 每个 API endpoint 必须有 zod input validation
- 不直接操作 DOM，使用 React refs

## Key Docs
修改前必查的文档:
- [Architecture Decisions](docs/harness/decisions/) — 重要决策的来龙去脉
- [Known Solutions](docs/harness/solutions/) — 已知问题的修复方案
- [Playbooks](docs/harness/playbooks/) — 标准操作流程

## Harness
本项目使用 harness 系统，详见 docs/harness/HARNESS.md。
```

### 每个 Section 的写作准则

| Section | 字数上限 | 写什么 | 不写什么 |
|---------|----------|--------|----------|
| Overview | 2-3 行 | 项目定位 + 核心技术栈 | 历史背景、团队结构 |
| Commands | 6-8 条 | 最常用的 CLI 命令 | 所有可能的命令、env 配置详情 |
| Architecture | 5-10 行 | 核心模块 + 依赖关系 | 实现细节、代码路径 |
| Constraints | 5-10 条 | 可验证的硬性规则 | 最佳实践、风格偏好（放 ADR） |
| Key Docs | 3-5 个 | 指向详细文档的指针 | 文档内容本身 |

### 反模式

::: danger 常见错误
**1. 文件清单**
```markdown
## Files
- src/app/page.tsx — 首页
- src/lib/utils.ts — 工具函数
- src/components/button.tsx — 按钮组件
... (50+ 行文件列表)
```
Agent 有 Glob 和 Grep 工具，不需要你列文件。这些信息会快速过时且浪费 context。

**2. 完整 API 文档**
```markdown
## API
### POST /api/users
Body: { name: string, email: string }
Response: { id: number, name: string, ... }
... (100+ 行 API 文档)
```
Agent 可以读代码获取 API 定义。把这些放在 docs/api.md 或 OpenAPI spec 里。

**3. 冗长的风格指南**
```markdown
## Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Use trailing commas
- ...
```
这些应该在 `.eslintrc` / `.prettierrc` 里自动执行，不需要在 CLAUDE.md 里写。

**4. 复制粘贴的教程内容**
把 Next.js 或 React 的使用教程放进 CLAUDE.md。Agent 已经知道这些框架。
:::

---

## AGENTS.md 设计

AGENTS.md 是 OpenAI Codex 的等效物。如果你的项目同时支持 Claude Code 和 Codex，两个文件都写。

### 与 CLAUDE.md 的区别

| 维度 | CLAUDE.md | AGENTS.md |
|------|-----------|-----------|
| 消费者 | Claude Code | Codex, 其他通用 agent |
| 生态 | Skills, Hooks, Memory | Workflows, Ghost Libraries |
| 特色 | 支持 `.claude/skills/` 指令 | 支持 `docs/` 目录扫描 |
| 共同点 | 都应该短、做目录、放约束 | 同左 |

### 结构差异

AGENTS.md 更强调：
- `docs/` 目录作为知识系统的入口（Codex 会扫描）
- 每个 `docs/` 子目录有自己的 AGENTS.md 做局部说明
- 跨模块的约束放根目录，模块内的约束放模块目录

```
AGENTS.md                    ← 全局入口
docs/
├── AGENTS.md                ← docs 目录说明
├── architecture.md
├── harness/
│   ├── AGENTS.md            ← harness 子系统说明
│   ├── decisions/
│   └── solutions/
src/
├── api/
│   └── AGENTS.md            ← API 模块约束
└── components/
    └── AGENTS.md            ← 组件模块约束
```

---

## Context 分层架构

仿照 CPU 缓存层级设计 context 加载策略：

```
┌─────────────────────────────────────────────┐
│  L1: Always Loaded (每次对话)                 │
│  CLAUDE.md / AGENTS.md (< 60 行)            │
│  → 项目概述、核心命令、硬约束、文档指针        │
│  加载时机: 对话开始                            │
│  容量: < 2KB                                  │
├─────────────────────────────────────────────┤
│  L2: On-Demand Index (按需检索)               │
│  HARNESS.md, Skills 索引, docs/ 目录结构      │
│  → Agent 知道去哪找信息                        │
│  加载时机: Agent 需要深入某个领域时             │
│  容量: < 10KB per file                        │
├─────────────────────────────────────────────┤
│  L3: Deep Reference (深度参考)                │
│  ADR 具体内容, Solution 详情, Playbook 步骤   │
│  → 完整的指导和历史上下文                      │
│  加载时机: Agent 决定执行某个操作时             │
│  容量: 无限，但每次只加载需要的部分             │
└─────────────────────────────────────────────┘
```

### 加载策略

```
Agent 收到任务
  → 读 CLAUDE.md (L1, 自动)
  → 任务涉及架构修改?
    → 读 HARNESS.md (L2)
    → 搜索 decisions/ (L2 → L3)
    → 读相关 ADR (L3)
  → 任务遇到错误?
    → 搜索 solutions/ (L2 → L3)
    → 读匹配的 solution (L3)
  → 任务需要标准流程?
    → 读对应 playbook (L3)
```

关键：Agent 应该**知道去哪找信息**（L1 告诉它），而不是**把信息都记住**。

---

## Skill 与 CLAUDE.md 的职责边界

项目中约束的载体不止 CLAUDE.md 一个。Skill、代码、Hooks 都能承载约束，且各有优势。在写入 CLAUDE.md 之前，先确认该约束是否已由其他载体覆盖。

### 唯一来源测试

写入 CLAUDE.md 之前问：

> **"这条规则在某个 skill / hook / 代码约束里已经存在了吗？"**

- **已存在** → 不写。Skill 加载时自动进入 context，CLAUDE.md 重复它只浪费 instruction budget 并制造不同步风险。
- **不存在，且每次交互都需要** → 写入 root CLAUDE.md。
- **不存在，只在特定场景需要** → 写入对应 skill 或 docs/ 按需加载。

### 约束载体优先级

在 pipeline / skill 驱动的项目中：

```
1. Skill — 执行约束的权威来源（prompt protocol、quality rules、judge criteria）
2. 代码 — 确定性约束（TypeScript types、ESLint rules、schema validation）
3. Hooks — 自动触发的检查（pre-commit、PostToolUse）
4. CLAUDE.md — 仅放上述都不覆盖的、每次交互都需要的规则
```

CLAUDE.md 是兜底，不是首选。如果一条约束能通过 skill 或代码强制执行，就不应该依赖 CLAUDE.md 的"请求式"约束。

### Child CLAUDE.md 的适用边界

子目录 CLAUDE.md 在进入对应目录时自动加载，能精确投递 context。但需注意与 skill 的重叠：

**适用**: 大型代码库中有目录级约束且没有 skill 覆盖的场景（如 `src/api/CLAUDE.md` 声明安全规则）。

**不适用**: Skill 驱动的 pipeline 项目——如果 skill 已经告诉 agent 读哪些文件、遵守什么规则，child CLAUDE.md 大概率是重复。两份来源不同步时产生指令冲突。

判断标准：**追踪实际执行路径**——从编排脚本到 skill 到代码，看每一步的约束从哪来。如果全链路都有 skill 覆盖，child CLAUDE.md 就是多余的。

---

## 多 Repo Harness 治理

当系统由 hub + 多个子项目组成时（独立 repo 各自部署），CLAUDE.md 治理需要额外机制。

### 常见问题

1. **上行断裂**: Hub 看不到子项目状态（活跃度、CLAUDE.md 质量、skill 覆盖率），决策缺乏数据
2. **下行不一致**: 各子项目对 harness 规则的遵守程度参差不齐
3. **instruction budget 浪费**: 在每个子项目 CLAUDE.md 列完整 ADR 清单，大部分 ADR 与当次交互无关

### 解决模式

**指针 + 按需 skill**，替代 always-on 治理段：

```markdown
## Harness
本模块受 [hub-name] harness 治理。
架构决策、skill 设计、pipeline 变更前 → /harness-check
详见 ../docs/harness/HARNESS.md
```

`/harness-check` skill 在需要时读取 `docs/harness/decisions/`，列出与当前任务相关的 ADR，输出约束清单。日常交互不加载。

**上行可见性**: Hub 维护一个模块健康检查脚本，扫描子项目目录输出关键指标（commit 活跃度、CLAUDE.md 行数、治理段存在性等）。做 harness 决策前先看实际状态，避免脱离现实的顶层设计。

---

## 维护节奏

| 频率 | 动作 |
|------|------|
| 每次对话后 | 如果发现 CLAUDE.md 有误导，立即修正 |
| 每周 | 检查 CLAUDE.md 是否仍然 < 60 行，是否有冗余 |
| 模型升级后 | 测试约束是否仍然必要（衰减检测） |
| 每月 | 审视 docs/ 目录结构是否还合理 |

::: tip Doc-gardening
OpenAI 的实践：运行一个定期 agent 扫描文档陈旧程度，自动提修复 PR。

可以用 Claude Code 的 scheduled triggers 实现类似效果。
:::

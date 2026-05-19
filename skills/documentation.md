---
name: documentation-skills
description: 文档工具 Skills 评测。doc-coauthoring / ADR / 文档协作
when_to_use: 选文档 Skill；要写 PRD / 技术方案 / ADR；多轮迭代长文档
related: [./, /workflows/product-spec, /workflows/tech-architecture]
stage: domain
---

# 文档工具 Skills

> 文档协作、ADR（架构决策记录）、API 文档、代码注释生成相关的 AI 编码 Skills。

## 速查表

| Skill | 来源 | 优先级 | 安装命令 | 适用技术栈 |
|-------|------|--------|---------|-----------|
| **doc-coauthoring** | Anthropic 官方 | **必装** | `npx skills add anthropics/claude-code --skill doc-coauthoring` | 全平台 |
| **documentation-and-adrs** | addyosmani/agent-skills | **必装** | `npx skills add addyosmani/agent-skills --skill documentation-and-adrs` | 全平台 |
| **doc-updater** | everything-claude-code | **推荐** | `npx skills add affaan-m/everything-claude-code --skill doc-updater` | 全平台 |

---

## 必装

### doc-coauthoring — 三阶段文档协作

- **来源**: [Anthropic 官方 Skills](https://github.com/anthropics/claude-code)
- **安装**: `npx skills add anthropics/claude-code --skill doc-coauthoring`
- **维护者**: Anthropic

#### 核心能力

doc-coauthoring 将文档写作拆为三个阶段，确保 AI 先理解上下文再动笔：

| 阶段 | 作用 | 说明 |
|------|------|------|
| **Context Transfer** | 用户传递背景、目标、受众、约束 | AI 通过提问确保理解完整 |
| **Draft** | AI 生成初稿 | 基于充分上下文，不是凭空想象 |
| **Refine** | 迭代润色 | 用户反馈 → AI 修改 → 直到满意 |

#### 我们的评价

大部分 AI 写文档的失败是因为上下文不足——AI 不知道写给谁看、为什么写、有什么约束。doc-coauthoring 的 Context Transfer 阶段强制解决了这个问题。

**最佳使用场景：**
- PRD / 技术方案 / 设计文档编写
- 项目提案 / RFC 起草
- 任何需要多轮迭代的长文档

**注意事项：** 不适合短文档（README 的一个段落不需要三阶段流程）。

---

### documentation-and-adrs — ADR 编写与文档规范

- **来源**: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- **安装**: `npx skills add addyosmani/agent-skills --skill documentation-and-adrs`
- **维护者**: Addy Osmani（Google Chrome 团队）

#### 核心能力

| 能力 | 说明 |
|------|------|
| **ADR 模板** | Context → Decision → Consequences 标准格式 |
| **决策追溯** | 记录「为什么这样做」而不只是「做了什么」 |
| **状态管理** | Proposed / Accepted / Deprecated / Superseded |
| **文档规范** | README、CHANGELOG、API 文档的写作标准 |

#### 我们的评价

ADR 是技术团队最被忽视的实践之一。六个月后回头看代码，最常问的问题是「当时为什么选这个方案」。documentation-and-adrs 提供了结构化的方式记录这些决策，让未来的自己（和队友）不用猜。

**最佳使用场景：**
- 技术选型决策记录
- 架构重构的理由记录
- 任何「为什么不用 X」需要被记住的时刻

**ADR 模板参考：**

```markdown
# ADR-NNN: [决策标题]

## Status
Accepted

## Context
[什么情况下需要做这个决策？有什么约束？]

## Decision
[决策内容是什么？]

## Consequences
### 正面
- ...

### 负面
- ...

### 风险
- ...
```

---

## 推荐

### doc-updater — 文档自动更新

- **来源**: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- **安装**: `npx skills add affaan-m/everything-claude-code --skill doc-updater`
- **维护者**: Affaan M

#### 核心能力

| 能力 | 说明 |
|------|------|
| **Codemap 生成** | 自动生成代码结构地图 |
| **README 更新** | 根据代码变更更新 README |
| **文档同步** | 确保文档与代码保持一致 |

#### 我们的评价

解决了一个永恒问题：代码改了但文档没更新。适合集成到 CI 流程中，每次 merge 后自动检查文档是否过期。

**最佳使用场景：** 代码重构后的文档更新、新模块添加后的结构文档更新。

---

## 文档类型与 Skill 选择

| 文档类型 | 推荐 Skill | 说明 |
|---------|-----------|------|
| PRD / 技术方案 | doc-coauthoring | 需要充分上下文传递的长文档 |
| ADR | documentation-and-adrs | 结构化决策记录 |
| README | doc-updater | 自动化更新 |
| API 文档 | 代码注释 + 工具生成 | TypeDoc / Swagger / GoDoc |
| CHANGELOG | git log + doc-updater | 基于 commit 历史生成 |
| 内部 Wiki | doc-coauthoring | 三阶段协作保证质量 |

---

## 推荐工作流

### 技术文档编写流程

```
1. 上下文传递
   └─ /doc-coauthoring (Context Transfer) → 明确受众、目标、约束

2. 初稿生成
   └─ /doc-coauthoring (Draft) → 生成结构化初稿

3. 决策记录
   └─ /documentation-and-adrs → 关键决策写成 ADR

4. 迭代润色
   └─ /doc-coauthoring (Refine) → 根据反馈修改

5. 持续维护
   └─ /doc-updater → 代码变更后自动更新
```

## 相关资源

- [doc-coauthoring](https://github.com/anthropics/claude-code) — Anthropic 官方三阶段文档协作 Skill
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — documentation-and-adrs Skill
- [ADR GitHub](https://adr.github.io/) — ADR 方法论和工具集
- [产品需求书编写流程](../workflows/product-spec.md) — PRD 编写场景
- [技术架构设计流程](../workflows/tech-architecture.md) — 架构文档编写场景

---
name: tech-architecture
description: 技术架构设计流程。从 PRD 到可实施架构的 AI Skill 编排（含技术选型、ADR、任务拆解）
when_to_use: PRD 完成后做技术方案；新项目技术选型；现有系统重构；要输出架构文档 + 故事拆解
inputs: [PRD, 团队约束, 现有技术栈]
outputs: [架构文档, ADR, 任务拆解列表]
skills_used: [spec-driven-development, planning-and-task-breakdown, writing-plans, plan, documentation-and-adrs, doc-coauthoring]
related: [./product-spec, /harness/templates, /harness/context-design]
stage: workflow
---

# 技术架构设计流程

> 从 PRD 到可实施的架构方案：技术选型、系统设计、任务拆解的 Skill 编排参考。强调「源驱动决策」——每个技术选型必须引用官方文档，不靠 LLM 记忆。

## 适用场景

- PRD 完成后，进入技术方案设计阶段
- 新项目技术选型（语言、框架、数据库、部署方式）
- 现有系统的架构重构或重大技术升级
- 需要输出架构文档 + 故事拆解给开发团队

## 核心理念

| 理念 | 说明 |
|------|------|
| **Source-Driven** | 每个技术选型必须引用官方文档或权威基准，不接受「我知道 X 框架很好」 |
| **Spec → Plan → Code** | 严格顺序：先理解需求 → 再设计架构 → 再拆任务 → 最后写代码，不允许跳步 |
| **故事粒度** | 每个 story 对应一个可独立测试、可独立交付的功能切片 |
| **架构即文档** | 架构决策写成 ADR（Architecture Decision Record），不是口头约定 |

## 前置准备

| Skill | 来源 | 安装方式 | 说明 |
|-------|------|---------|------|
| **spec-driven-development** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `npx skills add addyosmani/agent-skills --skill spec-driven-development` | 需求驱动开发：先读 spec 再动手 |
| **planning-and-task-breakdown** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `npx skills add addyosmani/agent-skills --skill planning-and-task-breakdown` | 任务拆解和依赖分析 |
| **writing-plans** | superpowers | 预装（Claude Code 插件） | 多步骤任务的结构化计划 |
| **plan** | [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | `npx skills add affaan-m/everything-claude-code --skill plan` | 需求重述 → 风险评估 → 分步计划 |
| **documentation-and-adrs** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `npx skills add addyosmani/agent-skills --skill documentation-and-adrs` | ADR 编写和文档规范 |
| **doc-coauthoring** | [Anthropic 官方](https://github.com/anthropics/claude-code) | `npx skills add anthropics/claude-code --skill doc-coauthoring` | 三阶段文档协作 |

::: tip context7 — 源驱动的关键工具
安装 [context7 MCP Server](https://github.com/upstash/context7) 后，架构设计中的每个技术选型可以直接查询最新官方文档，而不是依赖 LLM 训练数据中可能过时的信息。这是「源驱动决策」的基础设施。
:::

## 完整流程

### Phase 1: Spec 理解 — 需求对齐

确保对 PRD 有完整准确的理解，而不是读了个大概就开始设计。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 1.1 | `/spec-driven-development` | 系统性阅读 PRD：提取核心目标、用户故事、约束条件 | 输出需求摘要，确认理解无误 |
| 1.2 | 约束识别 | 列出硬约束（预算、时间线、团队技能、合规要求） | 约束决定技术边界 |
| 1.3 | 质量属性 | 明确非功能需求（性能、可用性、安全性、可扩展性） | 不同质量属性导向不同架构 |

---

### Phase 2: 技术选型 — Source-Driven Decision

每个选型决策必须有据可查。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 2.1 | 候选方案 | 列出每个技术决策点的 2-3 个候选方案 | 语言、框架、数据库、部署、认证方案等 |
| 2.2 | context7 查询 | 查询每个候选方案的官方文档，获取最新特性和限制 | 不依赖 LLM 记忆，用 context7 获取一手信息 |
| 2.3 | 对比分析 | 按 PRD 约束对比候选方案，输出决策矩阵 | 维度：学习成本、生态成熟度、性能、社区活跃度 |
| 2.4 | ADR 编写 | 用 `/documentation-and-adrs` 记录每个关键决策 | 格式：Context → Decision → Consequences |

**技术选型决策矩阵模板：**

```markdown
| 维度 | 方案 A | 方案 B | 方案 C |
|------|--------|--------|--------|
| 学习成本 | ... | ... | ... |
| 生态成熟度 | ... | ... | ... |
| 性能基准 | ... | ... | ... |
| 社区活跃度 | ... | ... | ... |
| 与现有栈兼容 | ... | ... | ... |
| **结论** | | **选定** ✅ | |
| **来源** | [链接] | [链接] | [链接] |
```

---

### Phase 3: 系统设计 — 架构蓝图

把选型决策组装成完整的系统架构。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 3.1 | `/plan` | 输出系统组件图：模块划分、接口定义、数据流 | 先画大图再填细节 |
| 3.2 | 接口设计 | 定义模块间的 API 契约（输入/输出类型） | TypeScript interface 或 JSON Schema |
| 3.3 | 数据模型 | 设计核心数据结构和存储方案 | ER 图或表结构 |
| 3.4 | 风险评估 | 识别技术风险 + 缓解策略 | 重点关注：性能瓶颈、第三方依赖、数据一致性 |

**系统设计输出结构：**

```markdown
## 架构概述
[一句话描述架构风格和核心决策]

## 组件图
[模块划分 + 模块间关系]

## 接口定义
[关键 API 的 Request/Response 类型]

## 数据模型
[核心 Entity 及其关系]

## 技术栈总结
| 层 | 选型 | 理由 | 来源 |
|----|------|------|------|
| 前端 | ... | ... | [链接] |
| 后端 | ... | ... | [链接] |
| 数据库 | ... | ... | [链接] |
| 部署 | ... | ... | [链接] |

## 风险登记
| 风险 | 概率 | 影响 | 缓解策略 |
|------|------|------|---------|
| ... | High/Med/Low | ... | ... |
```

---

### Phase 4: 任务拆解 — Story Decomposition

把架构设计拆成可独立实施的开发任务。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 4.1 | `/planning-and-task-breakdown` | 把系统设计拆解为 User Story 粒度的任务 | 每个 story 可独立测试 |
| 4.2 | 依赖分析 | 标注 story 间的依赖关系和执行顺序 | 识别关键路径 |
| 4.3 | 文件映射 | 每个 story 对应的文件变更列表 | 方便并行开发和 code review |
| 4.4 | 验收标准 | 每个 story 附上可执行的验收标准 | 验收标准 = 测试用例的自然语言版本 |

**Story 拆解模板：**

```markdown
### Story 1: [标题]
- **依赖**: 无 / Story N
- **文件**: `src/xxx.ts`, `src/yyy.ts`
- **验收标准**:
  - [ ] 当 X 时，应该 Y
  - [ ] 错误场景：当 Z 时，应该返回 W
- **预估复杂度**: S / M / L
```

---

### Phase 5: 架构 Review — 独立评审

在新会话中对架构做对抗性审查。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 5.1 | `/writing-plans` | 结构化检查：计划是否覆盖所有 PRD 需求 | 交叉检查 PRD ↔ 架构 |
| 5.2 | 独立 Review | 在新会话中审查架构文档（不看设计过程） | 审查者只看产出物，不看推理过程 |
| 5.3 | 可行性挑战 | 重点检查：选型是否合理？接口是否完整？故事是否可独立交付？ | 带着「这能落地吗」的心态审查 |

**架构 Review 检查清单：**
- [ ] 每个技术选型有官方文档链接支撑
- [ ] 接口定义覆盖了所有 PRD 中的用户故事
- [ ] 数据模型支持所有查询场景
- [ ] 没有 story 的依赖链超过 3 层
- [ ] 风险登记不为空

## 快速参考

```
/spec-driven-development → context7 查询 → /plan → /planning-and-task-breakdown → /documentation-and-adrs → 独立 Review
```

## 涉及的 Skills

- → [Skills 总览](../skills/)（API 设计、数据库选型相关 Skill 集）
- → [文档工具 Skills](../skills/documentation.md)（ADR 编写）
- → [产品需求书编写流程](./product-spec.md)（上游输入）
- → [TDD 开发流程](./tdd-cycle.md)（架构完成后的下一步）

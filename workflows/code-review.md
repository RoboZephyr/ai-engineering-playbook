---
name: code-review
description: PR 审查和代码质量把关流程。审查者只读不改，修复者只改不审的 Skill 编排
when_to_use: PR/MR 审查；重构后回归检查；功能开发后的自我审查；跨团队 review 规范化
inputs: [PR diff, 代码上下文]
outputs: [审查报告（Blocker/Warning/Nit 分级）, 修复建议]
skills_used: [code-review-and-quality, code-simplification, code-reviewer, requesting-code-review, receiving-code-review]
related: [/skills/code-quality, ./tdd-cycle]
stage: workflow
---

# 代码审查流程

> PR 审查和代码质量把关的 Skill 编排参考。核心原则：**审查者只读不改，修复者只改不审**——避免同一个人/会话既当裁判又当运动员。

## 适用场景

- PR / MR 代码审查
- 重构后的质量回归检查
- 功能开发完成后的自我审查
- 跨团队 code review 规范化

## 核心理念

| 理念 | 说明 |
|------|------|
| **Judge/Fix 分离** | 审查和修复在不同会话中进行，避免自我合理化 |
| **多维度覆盖** | 不只看逻辑正确性，还看安全、性能、可维护性、测试覆盖 |
| **置信度过滤** | 只报告高置信度的问题，不做「可能有问题」的噪音式 review |
| **Fix-First** | 审查意见不是「你应该改成 X」，而是「这里有问题，理由是 Y」 |

## 前置准备

| Skill | 来源 | 安装方式 | 说明 |
|-------|------|---------|------|
| **code-review-and-quality** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `npx skills add addyosmani/agent-skills --skill code-review-and-quality` | 生产级代码审查 |
| **code-simplification** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `npx skills add addyosmani/agent-skills --skill code-simplification` | 代码简化和可读性优化 |
| **code-review** | [code-review](https://github.com/anthropics/skills) | `npx skills add --skill code-review` | PR 审查 Skill |
| **requesting-code-review** | superpowers | 预装（Claude Code 插件） | 完成任务后请求审查 |
| **receiving-code-review** | superpowers | 预装（Claude Code 插件） | 收到审查反馈后的处理流程 |
| **code-reviewer** | [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | `npx skills add affaan-m/everything-claude-code --skill code-reviewer` | 多维度代码审查 Agent |

::: tip 审查与修复的分离
最有效的 AI 代码审查方式是在**独立会话**中进行。审查者不应看到代码编写过程，只看到最终产出。这避免了「理解作者意图后合理化问题」的偏差。
:::

## 完整流程

### Phase 1: 变更理解 — 知道审什么

先搞清楚这次变更的范围和目的，再开始审查。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 1.1 | `git diff` | 查看完整变更范围 | 了解涉及哪些文件和模块 |
| 1.2 | PR 描述 | 阅读 PR 描述，理解变更目的 | 没有 PR 描述的不审 |
| 1.3 | 关联上下文 | 查看相关 issue、PRD、设计文档 | 确保理解「为什么改」 |

---

### Phase 2: 多维度审查 — 分层扫描

从快到慢，分层审查代码变更。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 2.1 | 静态分析 | Lint + Type Check（自动化门禁） | 应在 CI 中自动运行 |
| 2.2 | `/code-review-and-quality` | 逻辑正确性、边界条件、错误处理 | 聚焦高置信度问题 |
| 2.3 | 安全审查 | 检查注入、XSS、敏感数据泄露、认证绕过 | 涉及用户输入的代码必查 |
| 2.4 | 性能审查 | N+1 查询、不必要的渲染、内存泄漏 | 涉及数据库或循环的代码必查 |
| 2.5 | 测试审查 | 新增代码是否有对应测试？测试质量如何？ | 没有测试的功能代码 = 审查不通过 |

**审查维度权重参考：**

| 维度 | 权重 | 关注点 |
|------|------|--------|
| 正确性 | 30% | 逻辑错误、边界条件、竞态条件 |
| 安全性 | 25% | 注入、XSS、权限、敏感数据 |
| 可维护性 | 20% | 命名、结构、重复、耦合度 |
| 性能 | 15% | 查询效率、渲染性能、资源使用 |
| 测试覆盖 | 10% | 有无测试、测试质量、边界覆盖 |

---

### Phase 3: 反馈输出 — 结构化意见

审查意见应该是结构化的，不是散文。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 3.1 | 分级标注 | 每条意见标注严重级别：Blocker / Warning / Nit | Blocker 必须修复，Nit 可忽略 |
| 3.2 | 定位准确 | 指出具体文件和行号 | 不要说「某处可能有问题」 |
| 3.3 | 说明理由 | 解释**为什么**是问题，不只是「改成 X」 | 帮助作者理解，而不是服从 |

**审查意见模板：**

```markdown
### [Blocker] SQL 注入风险 — `src/api/users.ts:42`
**问题**: 用户输入直接拼接到 SQL 查询中
**理由**: 攻击者可通过构造恶意输入执行任意 SQL
**建议**: 使用参数化查询
```

---

### Phase 4: 修复 — 在独立会话中处理

收到审查反馈后，在新会话中处理。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 4.1 | `/receiving-code-review` | 理解每条反馈，区分有效建议和误判 | 不要盲目接受所有意见 |
| 4.2 | 逐条处理 | Blocker 必须修复；Warning 评估后决定；Nit 可选 | 修复后运行测试确认 |
| 4.3 | `/code-simplification` | 如果 review 指出可读性问题，简化相关代码 | 只改被指出的部分，不要顺手重构 |
| 4.4 | 重新提交 | 修复后 push，请求 re-review | 只 review 新改动，不重复审查已通过部分 |

## 快速参考

```
审查方（独立会话）:
git diff → /code-review-and-quality → 输出结构化意见

修复方（独立会话）:
/receiving-code-review → 逐条修复 → 运行测试 → 重新提交
```

## 涉及的 Skills

- → [代码质量 Skills](../skills/code-quality.md)
- → [TDD 开发流程](./tdd-cycle.md)（确保测试覆盖后再审查）

---
name: code-quality-skills
description: 代码质量 Skills 评测。Code review / 重构 / Lint / 编码标准
when_to_use: 选 PR review Skill；要做代码简化；找编码规范
related: [./, /workflows/code-review]
stage: domain
---

# 代码质量 Skills

> 代码审查、重构、Lint、编码标准相关的 AI 编码 Skills。

## 速查表

| Skill | 来源 | 优先级 | 安装命令 | 适用技术栈 |
|-------|------|--------|---------|-----------|
| **code-review-and-quality** | addyosmani/agent-skills | **必装** | `npx skills add addyosmani/agent-skills --skill code-review-and-quality` | 全语言 |
| **code-simplification** | addyosmani/agent-skills | **推荐** | `npx skills add addyosmani/agent-skills --skill code-simplification` | 全语言 |
| **code-review** | code-review 插件 | **推荐** | `npx skills add --skill code-review` | 全语言 |
| **coding-standards** | everything-claude-code | 视情况 | `npx skills add affaan-m/everything-claude-code --skill coding-standards` | TS / JS / React |
| **code-reviewer** | everything-claude-code | 视情况 | `npx skills add affaan-m/everything-claude-code --skill code-reviewer` | 全语言 |
| **requesting-code-review** | superpowers | **推荐** | 预装（Claude Code 插件） | 全语言 |
| **receiving-code-review** | superpowers | **推荐** | 预装（Claude Code 插件） | 全语言 |

---

## 必装

### code-review-and-quality — 生产级代码审查

- **来源**: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- **安装**: `npx skills add addyosmani/agent-skills --skill code-review-and-quality`
- **维护者**: Addy Osmani（Google Chrome 团队）

#### 核心能力

| 能力 | 说明 |
|------|------|
| **多维度审查** | 正确性、安全性、性能、可维护性、测试覆盖 |
| **置信度过滤** | 只报告高置信度问题，减少噪音 |
| **严重级分层** | Blocker / Warning / Nit 三级分类 |
| **Fix 建议** | 每个问题附带具体的修复建议 |

#### 我们的评价

所有 code review Skill 中信噪比最高的一个。它不会给你 50 条「建议改成 X」的意见——它只报告真正重要的问题，每条都有明确的理由和修复路径。

**最佳使用场景：** PR 审查、功能完成后的自查、重构后的回归审查。

**注意事项：** 这个 Skill 是「审查者」角色——只读不改。收到审查结果后，应在独立会话中进行修复。

---

## 推荐

### code-simplification — 代码简化和可读性

- **来源**: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- **安装**: `npx skills add addyosmani/agent-skills --skill code-simplification`
- **维护者**: Addy Osmani

#### 核心能力

| 能力 | 说明 |
|------|------|
| **重复检测** | 识别可提取的重复代码 |
| **命名优化** | 变量/函数命名的可读性改善 |
| **结构简化** | 减少嵌套层级、简化条件逻辑 |
| **死代码清理** | 识别和移除未使用的代码 |

#### 我们的评价

code-simplification 是 code-review-and-quality 的自然补充：review 发现问题，simplification 提供具体的简化方案。适合「测试全绿但代码不够整洁」的场景。

**最佳使用场景：** TDD 完成后的 Refactor 阶段、Legacy 代码整理、code review 后的修复。

---

### code-review — PR 审查 Skill

- **来源**: code-review 插件
- **安装**: `npx skills add --skill code-review`

#### 核心能力

专注于 PR 审查场景，自动获取 git diff 并进行结构化审查。比 addyosmani 版更聚焦于 PR 工作流（有 PR 描述解析、commit 历史分析等）。

#### 我们的评价

如果你的 review 工作主要是 PR 审查（而非通用代码质量检查），这个 Skill 的 PR 集成更好。与 addyosmani/code-review-and-quality 的区别：后者更通用，前者更聚焦 PR。

---

### requesting-code-review / receiving-code-review — 审查工作流

- **来源**: superpowers 插件
- **安装**: 预装（Claude Code superpowers 插件）

#### 核心能力

| Skill | 作用 |
|-------|------|
| **requesting-code-review** | 完成任务后自动请求审查，确保审查维度覆盖完整 |
| **receiving-code-review** | 收到审查反馈后的结构化处理：理解 → 分类 → 修复 → 验证 |

#### 我们的评价

这两个 Skill 的价值在于**流程**而非审查能力。它们确保：
1. 每次完成任务后都经过审查（不遗漏）
2. 收到反馈后有结构化的处理流程（不盲目接受也不全部忽略）

**最佳使用场景：** 与 code-review-and-quality 搭配使用，形成完整的 request → review → fix 闭环。

---

## 视情况

### coding-standards — TypeScript/React 编码标准

- **来源**: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- **安装**: `npx skills add affaan-m/everything-claude-code --skill coding-standards`

提供 TypeScript、JavaScript、React、Node.js 的编码标准和最佳实践。如果你的项目已有 ESLint 配置和团队规范，这个 Skill 可能是重复的。适合新项目初始化时确立编码标准。

::: warning 技术栈限制
主要针对 TypeScript/React 生态。Go、Python、Rust 项目请参考对应的语言 Skill（如 everything-claude-code:golang-patterns、python-patterns 等）。
:::

---

### code-reviewer — 多维度代码审查 Agent

- **来源**: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- **安装**: `npx skills add affaan-m/everything-claude-code --skill code-reviewer`

以 Agent 形式运行的代码审查器，自动检查 bug、逻辑错误、安全漏洞、代码质量。与 addyosmani/code-review-and-quality 功能重叠，但以 Agent 子任务的形式运行，适合作为 CI 步骤。

---

## 推荐工作流

完整流程详见 → [代码审查流程](../workflows/code-review.md)

```
1. 完成开发
   └─ /requesting-code-review → 自动触发审查

2. 独立审查（新会话）
   └─ /code-review-and-quality → 多维度扫描 → 结构化意见

3. 修复（新会话）
   └─ /receiving-code-review → 分类处理反馈
   └─ /code-simplification   → 简化被指出的复杂代码

4. Re-review
   └─ 只审查新改动部分
```

## 相关资源

- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — code-review-and-quality、code-simplification Skill
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code) — coding-standards、code-reviewer Skill
- [代码审查流程](../workflows/code-review.md) — 完整审查工作流编排

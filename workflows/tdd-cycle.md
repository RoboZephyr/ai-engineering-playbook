---
name: tdd-cycle
description: TDD 开发流程。Red → Green → Refactor 三步循环的 AI Skill 编排
when_to_use: 写新功能；修 bug（先用测试复现）；重构（确保覆盖再改结构）；目标 80%+ 覆盖率
inputs: [需求描述, 现有测试套件]
outputs: [测试用例, 实现代码, 覆盖率报告]
skills_used: [test-driven-development, tdd-workflow, webapp-testing, incremental-implementation]
related: [/skills/testing, ./code-review]
stage: workflow
---

# TDD 开发流程

> 测试驱动开发的 Skill 编排参考。核心纪律：**先写测试，再写实现，最后重构**——Red → Green → Refactor 循环。

## 适用场景

- 新功能开发（先定义预期行为，再实现）
- Bug 修复（先用测试复现 bug，再修复）
- 重构（先确保测试覆盖，再改结构）
- 需要 80%+ 测试覆盖率的项目

## 核心理念

| 理念 | 说明 |
|------|------|
| **Red → Green → Refactor** | 先写失败的测试（Red）→ 写最少代码让测试通过（Green）→ 清理代码（Refactor） |
| **测试即文档** | 测试用例描述了系统的预期行为，比注释更可靠 |
| **小步前进** | 每次只实现一个 story，通过后再做下一个 |
| **分层验证** | Level 1 Lint/Type → Level 2 单元测试 → Level 3 集成测试 → Level 4 E2E |

## 前置准备

| Skill | 来源 | 安装方式 | 说明 |
|-------|------|---------|------|
| **test-driven-development** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `npx skills add addyosmani/agent-skills --skill test-driven-development` | TDD 方法论 + 测试策略 |
| **incremental-implementation** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `npx skills add addyosmani/agent-skills --skill incremental-implementation` | 渐进式实现，每步可验证 |
| **tdd** | [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | `npx skills add affaan-m/everything-claude-code --skill tdd` | 强制 TDD 工作流 + 80% 覆盖率要求 |
| **tdd-workflow** | [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | `npx skills add affaan-m/everything-claude-code --skill tdd-workflow` | 含单元、集成、E2E 全层覆盖 |
| **test-driven-development** | superpowers | 预装（Claude Code 插件） | 实现前先写测试的强制流程 |
| **webapp-testing** | [Anthropic 官方](https://github.com/anthropics/claude-code) | `npx skills add anthropics/claude-code --skill webapp-testing` | Playwright E2E 测试工具包 |

::: tip 选择建议
- **轻量场景**：只装 `addyosmani/test-driven-development` + `superpowers:test-driven-development` 即可
- **严格场景**：加装 `everything-claude-code:tdd-workflow` 获得全层覆盖强制
- **E2E 需求**：加装 `webapp-testing` 获得 Playwright 浏览器测试能力
:::

## 完整流程

### Phase 1: 测试规划 — 定义预期行为

先想清楚「什么算成功」，再动手写代码。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 1.1 | `/test-driven-development` | 根据 story 验收标准，设计测试用例 | 每个验收标准 → 至少一个测试 |
| 1.2 | 接口脚手架 | 定义函数签名和类型（不写实现） | `export function xxx(): ReturnType { throw new Error('not implemented') }` |
| 1.3 | 写失败测试 | 用测试框架写出测试用例，运行确认全部 Red | 测试应该能编译但运行失败 |

---

### Phase 2: 实现 — 最少代码通过测试

目标是 Green，不是完美代码。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 2.1 | `/incremental-implementation` | 逐个测试实现，每次只关注一个测试用例 | 写最简单的能让测试通过的代码 |
| 2.2 | 运行测试 | 确认当前 story 的所有测试通过 | 不要一次性实现全部 |
| 2.3 | 运行全量测试 | 确认没有破坏已有测试 | 回归检查 |

---

### Phase 3: 质量验证 — 分层检查

从快到慢、从便宜到昂贵，分层验证代码质量。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 3.1 | Lint + Type Check | 静态分析：eslint / tsc / ruff / clippy / go vet | 秒级反馈，最先运行 |
| 3.2 | 单元测试 | 当前 story 的单元测试 | 覆盖核心逻辑分支 |
| 3.3 | 集成测试 | 模块间交互测试 | 数据库、API 调用等 |
| 3.4 | `/webapp-testing` | E2E 浏览器测试（如果是 Web 应用） | Playwright 截图 + 交互验证 |

**分层验证原则：**

```
Level 1: Lint + Type (秒级)     → 每次保存运行
Level 2: 单元测试 (秒~分级)     → 每次 story 完成运行
Level 3: 集成测试 (分级)        → 每个 checkpoint 运行
Level 4: E2E 测试 (分钟级)      → 发布前运行
```

---

### Phase 4: Refactor — 清理代码

测试全绿后，安全地改善代码结构。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 4.1 | 重复检测 | 找出 Phase 2 中为了快速通过测试而产生的重复代码 | 三行以上重复就值得提取 |
| 4.2 | 重构 | 提取函数、消除重复、改善命名 | 每次小改动后运行测试，确认仍然 Green |
| 4.3 | Checkpoint | 确认所有测试通过后提交 | 一个 story 一个 commit |

---

### Phase 5: 下一个 Story — 循环

回到 Phase 1，开始下一个 story 的 TDD 循环。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 5.1 | 全量测试 | 在开始新 story 前确认所有已有测试通过 | 干净的起点 |
| 5.2 | 覆盖率检查 | 检查当前覆盖率是否 ≥ 80% | 低于阈值时优先补测试 |
| 5.3 | 回到 Phase 1 | 开始下一个 story 的测试规划 | 循环直到所有 story 完成 |

## 快速参考

```
Per story:
/test-driven-development → 写失败测试 → /incremental-implementation → 运行测试 → 重构 → commit

全流程:
Story 1 TDD → Story 2 TDD → ... → 全量测试 → 覆盖率检查 → 发布
```

## 常见技术栈的测试命令

| 技术栈 | 测试框架 | 运行命令 | 覆盖率命令 |
|--------|---------|---------|-----------|
| TypeScript | Vitest | `npx vitest run` | `npx vitest run --coverage` |
| Go | go test | `go test ./...` | `go test -cover ./...` |
| Python | pytest | `pytest` | `pytest --cov` |
| Rust | cargo test | `cargo test` | `cargo tarpaulin` |
| Java | JUnit 5 | `mvn test` | `mvn jacoco:report` |

## 涉及的 Skills

- → [测试 Skills](../skills/testing.md)
- → [代码质量 Skills](../skills/code-quality.md)
- → [技术架构设计流程](./tech-architecture.md)（上游输入：story 列表）
- → [代码审查流程](./code-review.md)（TDD 完成后的审查）

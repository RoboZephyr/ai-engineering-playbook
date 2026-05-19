---
name: testing-skills
description: 测试 Skills 评测。TDD / E2E / 覆盖率 / 回归测试相关
when_to_use: 选 TDD Skill；选 E2E Skill（Playwright）；想知道几个 TDD 实现的差异
related: [./, /workflows/tdd-cycle]
stage: domain
---

# 测试 Skills

> TDD、E2E、覆盖率、回归测试相关的 AI 编码 Skills。

## 速查表

| Skill | 来源 | 优先级 | 安装命令 | 适用技术栈 |
|-------|------|--------|---------|-----------|
| **test-driven-development** | addyosmani/agent-skills | **必装** | `npx skills add addyosmani/agent-skills --skill test-driven-development` | 全语言 |
| **tdd-workflow** | everything-claude-code | **推荐** | `npx skills add affaan-m/everything-claude-code --skill tdd-workflow` | 全语言 |
| **webapp-testing** | Anthropic 官方 | **推荐** | `npx skills add anthropics/claude-code --skill webapp-testing` | Web (Playwright) |
| **test-driven-development** | superpowers | **推荐** | 预装（Claude Code 插件） | 全语言 |
| **tdd** | everything-claude-code | 视情况 | `npx skills add affaan-m/everything-claude-code --skill tdd` | 全语言 |
| **incremental-implementation** | addyosmani/agent-skills | 视情况 | `npx skills add addyosmani/agent-skills --skill incremental-implementation` | 全语言 |
| **e2e** | everything-claude-code | 视情况 | `npx skills add affaan-m/everything-claude-code --skill e2e` | Web (Playwright) |

---

## 必装

### test-driven-development (addyosmani) — TDD 方法论核心

- **来源**: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- **安装**: `npx skills add addyosmani/agent-skills --skill test-driven-development`
- **维护者**: Addy Osmani（Google Chrome 团队）

#### 核心能力

| 能力 | 说明 |
|------|------|
| **Red-Green-Refactor** | 强制执行 TDD 三步循环 |
| **测试策略** | 单元 / 集成 / E2E 的分层策略和覆盖目标 |
| **边界条件** | 引导覆盖 null、空值、极端输入等边界 |
| **Mock 策略** | 何时 mock、何时用真实依赖的决策框架 |

#### 我们的评价

这是所有 TDD Skill 中最平衡的一个——不过度教条（不会要求 100% 覆盖率），也不过度宽松（确保关键路径有测试）。适合大部分项目。

**最佳使用场景：** 所有新功能开发。安装后 AI 会在写代码前自动先写测试。

**注意事项：** 这个 Skill 提供方法论指导，不提供具体的测试框架命令。需要搭配具体的测试框架（Vitest/pytest/go test）使用。

---

## 推荐

### tdd-workflow — 全层覆盖 + 80% 覆盖率强制

- **来源**: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- **安装**: `npx skills add affaan-m/everything-claude-code --skill tdd-workflow`
- **维护者**: Affaan M

#### 核心能力

| 能力 | 说明 |
|------|------|
| **覆盖率强制** | 要求 80%+ 代码覆盖率，低于阈值不允许提交 |
| **全层覆盖** | 单元 + 集成 + E2E 三层测试要求 |
| **测试模板** | 提供各语言的测试脚手架模板 |
| **覆盖率报告** | 自动生成覆盖率报告和未覆盖区域列表 |

#### 我们的评价

比 addyosmani 版更严格，适合对质量要求高的项目。80% 的覆盖率阈值是合理的平衡点——追求 100% 通常 ROI 不高。

**最佳使用场景：** 核心业务逻辑、支付相关、安全敏感的代码。

**注意事项：** 与 addyosmani/test-driven-development 有重叠。两者二选一即可，或者用 addyosmani 做日常开发，tdd-workflow 做关键模块。

#### 推荐搭配

| 场景 | 搭配 Skill |
|------|-----------|
| 新功能 TDD | addyosmani/test-driven-development（方法论） + tdd-workflow（执行） |
| Web E2E | webapp-testing（Playwright 浏览器测试） |
| 重构保障 | addyosmani/incremental-implementation（小步验证） |

---

### webapp-testing — Playwright 浏览器测试

- **来源**: [Anthropic 官方 Skills](https://github.com/anthropics/claude-code)
- **安装**: `npx skills add anthropics/claude-code --skill webapp-testing`
- **维护者**: Anthropic

#### 核心能力

| 能力 | 说明 |
|------|------|
| **Playwright 集成** | 浏览器自动化测试（Chrome/Firefox/WebKit） |
| **截图对比** | 页面截图 + 视觉回归检测 |
| **交互测试** | 模拟用户点击、输入、导航 |
| **日志捕获** | 浏览器 console.log 和网络请求抓取 |

#### 我们的评价

Web 项目 E2E 测试的标准选择。Playwright 是目前最稳定的浏览器自动化框架，Anthropic 官方 Skill 的集成质量有保障。

**最佳使用场景：** Web 应用的端到端测试、Landing Page 的视觉回归测试、用户交互流程验证。

::: danger 平台限制
仅适用于 Web 项目。iOS 测试请使用 XCTest，移动端 E2E 请使用 Detox 或 Appium。
:::

---

### test-driven-development (superpowers) — 实现前强制写测试

- **来源**: superpowers 插件
- **安装**: 预装（Claude Code superpowers 插件）
- **维护者**: superpowers 社区

#### 核心能力

作为 Claude Code 插件的一部分，superpowers:test-driven-development 的优势在于**流程强制**——它在 AI 准备写实现代码时自动触发，要求先写测试。不是事后补测试，而是代码生成流程中的硬门禁。

#### 我们的评价

如果你使用 Claude Code + superpowers 插件，这个 Skill 自动生效，无需额外安装。它与 addyosmani/test-driven-development 的方法论指导互补。

---

## 视情况

### tdd — 轻量 TDD 强制

- **来源**: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- **安装**: `npx skills add affaan-m/everything-claude-code --skill tdd`

与 tdd-workflow 相比更轻量，只强制 TDD 流程不要求全层覆盖。适合小型项目或快速原型。

---

### incremental-implementation — 渐进式实现

- **来源**: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- **安装**: `npx skills add addyosmani/agent-skills --skill incremental-implementation`

不是测试 Skill，但与 TDD 紧密配合：确保每次只实现一个测试用例，小步前进，每步可验证。适合复杂功能的分步实现。

---

### e2e — E2E 测试生成与运行

- **来源**: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- **安装**: `npx skills add affaan-m/everything-claude-code --skill e2e`

Playwright E2E 测试的生成、运行和产物管理。与 webapp-testing 功能重叠，但增加了截图/视频上传和 flaky test quarantine。

---

## 推荐工作流

完整流程详见 → [TDD 开发流程](../workflows/tdd-cycle.md)

```
1. 测试规划
   └─ /test-driven-development → 定义测试用例

2. Red → Green
   └─ 写失败测试 → /incremental-implementation → 通过测试

3. 质量验证
   └─ Lint + Type → 单元测试 → 集成测试 → /webapp-testing (E2E)

4. Refactor
   └─ 清理代码 → 运行全量测试 → commit
```

## 相关资源

- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — test-driven-development Skill
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code) — tdd-workflow、e2e Skill
- [webapp-testing](https://github.com/anthropics/claude-code) — Anthropic 官方 Playwright 测试 Skill
- [TDD 开发流程](../workflows/tdd-cycle.md) — 完整 TDD 工作流编排

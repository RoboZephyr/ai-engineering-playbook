---
name: workflows-index
description: 场景工作流总览。按主题分组：产品/架构 · 开发与测试 · Landing Page · 代码审查
when_to_use: 找特定场景的 Skill 编排流程；判断从哪个工作流开始；想知道工作流和 Skills 的关系
related: [/visual-engineering/, /skills/, /harness/]
stage: index
---

# 场景工作流概览

> 不同开发场景下的 Skill 编排参考。每个工作流定义了一个从头到尾的有序流程，告诉你在什么阶段该用什么 Skill。

## 工作流一览

### 产品 / 架构

| 工作流 | 适用场景 | 核心 Skills | 状态 |
|--------|---------|------------|------|
| [产品需求书编写](./product-spec.md) | PRD / 需求规格撰写 | 产品文档模板 | 已完成 |
| [技术架构设计](./tech-architecture.md) | 系统架构、技术选型、ADR 决策 | 架构文档模板 | 已完成 |
| [埋点与收入对账](./analytics-instrumentation.md) | 埋点规划、数据校验、收入对账 | 数据 schema、对账脚本 | 已完成 |

### 开发与测试

| 工作流 | 适用场景 | 核心 Skills | 状态 |
|--------|---------|------------|------|
| [TDD 开发](./tdd-cycle.md) | 测试驱动开发（Red → Green → Refactor） | TDD workflow, test-engineer | 已完成 |
| [Web 功能开发](./web-feature-dev.md) | Web 前端新功能/页面/组件 | frontend-design, Impeccable, ui-skills | 已完成 |
| [iOS 功能开发](./ios-feature-dev.md) | iOS 应用新功能/界面 | swiftui-pro, swiftui-expert-skill | 已完成 |

### Landing Page 应用场景

> 通用视觉方法论在 [Visual Engineering](../visual-engineering/) 板块。Landing Page 应用层保留素材生成流程——**沉淀自 `idea-business/landing-page` 实战**。

| 工作流 | 适用场景 | 状态 |
|--------|---------|------|
| [Landing Page 素材生成](./landing-page-assets.md) | Phase 1-6 三层管线（视觉素材 → 内容 → 渲染） | 已用于实际项目 |

### 代码审查

| 工作流 | 适用场景 | 核心 Skills | 状态 |
|--------|---------|------------|------|
| [代码审查](./code-review.md) | PR / MR 审查、Judge/Fix 分离 | code-review, simplify | 已完成 |

## 工作流与 Skills 的关系

```
场景需求
  ↓
选择工作流 → 按 Phase 顺序执行
  ↓
每个 Phase 使用特定的 Skills
  ↓
产出高质量结果
```

工作流是 Skills 的**编排层** — 它不创造新能力，而是将已有 Skills 按最佳实践组合起来。

## 如何使用工作流

1. 根据场景选择对应的工作流
2. 按"前置准备"安装所需 Skills
3. 按 Phase 顺序执行，每个 Phase 包含具体的命令和动作
4. 每页底部都有"快速参考"一行版，适合熟练后使用

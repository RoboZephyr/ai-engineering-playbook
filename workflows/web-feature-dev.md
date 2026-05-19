---
name: web-feature-dev
description: Web 前端功能开发流程。UI 搭建 → 视觉增强 → 质量把关 → 润色的 Skill 编排
when_to_use: Web 新功能/页面/组件；React/Vue/HTML 项目；不适用于 iOS
inputs: [设计稿/需求, 现有组件库]
outputs: [实现代码, 视觉验证, 质量审查报告]
skills_used: [frontend-design, Impeccable, ui-skills]
related: [/skills/frontend, /visual-engineering/, ./ios-feature-dev]
stage: workflow
---

# Web 前端功能开发流程

> 从设计到发布的 Web 前端功能开发 Skill 编排参考。按有序的 Phase 调用一系列 Skills，逐步完成 UI 搭建、视觉增强、质量把关和最终润色。

::: warning 仅限 Web 项目
本工作流中的所有 Skills 均为 Web 前端专属。**请勿用于 iOS 项目**，iOS 请参考 [iOS 功能开发流程](./ios-feature-dev.md)。
:::

## 适用场景

- 全新 Web 页面 / 落地页开发
- 可复用 UI 组件库搭建
- 现有页面的视觉升级与体验优化
- Design System 对齐与规范化
- 前端功能从 0 到 1 的完整交付

## 前置准备

开始之前，请确保已安装以下 Skills:

| Skill | 安装方式 | 说明 |
|-------|---------|------|
| **Impeccable** | [Impeccable 安装指南](https://github.com/peterqliu/impeccable) | 设计上下文收集，首次使用需运行 `/teach-impeccable` |
| **ui-skills** | `npx skills add ibelick/ui-skills --all` | 包含 baseline-ui、colorize、typeset、animate、delight、normalize、polish、harden 等 |
| **frontend-design** | `npx skills add --skill frontend-design` | 生成初始 UI 骨架 |

::: tip 首次使用
第一次进入项目时需要运行 `/teach-impeccable` 来收集设计上下文（品牌色、字体、间距等）。后续同一项目中可跳过此步。
:::

## 完整流程

### Phase 1: 设计与规划

收集设计意图、品牌规范和技术约束，为后续所有 Phase 奠定基础。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 1.1 | `/teach-impeccable` | 收集设计上下文（品牌色、字体、间距、组件风格） | 仅首次使用，后续同项目可跳过 |

---

### Phase 2: UI 骨架搭建

快速生成功能性 UI 结构，统一基础样式规范。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 2.1 | `/frontend-design` | 根据需求描述生成初始 UI，包含布局、组件结构 | 可指定 design depth 控制细节程度 |
| 2.2 | `/baseline-ui` | 统一 spacing、typography、Tailwind 约定 | 确保骨架阶段的一致性 |

---

### Phase 3: 视觉增强

在骨架基础上逐层叠加视觉效果，顺序不可随意调换。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 3.1 | `/colorize` | 策略性引入色彩，建立视觉层次 | 遵循 Impeccable 中定义的品牌色 |
| 3.2 | `/typeset` | 优化字体选择、字号层级、行高 | 确保可读性与视觉节奏 |
| 3.3 | `/animate` | 添加有目的的动效（过渡、微交互） | 动效应服务于用户理解，非纯装饰 |
| 3.4 | `/delight` | 注入令人愉悦的细节（hover 效果、加载动画等） | 最后一层视觉润色 |

---

### Phase 4: 质量把关

从 UX、无障碍、性能、响应式四个维度审查，发现并修复问题。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 4.1 | `/critique` | 基于 Nielsen 十大启发式原则进行 UX 审查 | 产出改进建议清单 |
| 4.2 | `/audit` | 无障碍 (a11y) + 性能 + 响应式综合检查 | 覆盖 Lighthouse 关注的核心指标 |
| 4.3 | `/fixing-accessibility` | 修复键盘导航、ARIA 标签、焦点管理、语义化 HTML | 根据 /audit 产出的问题逐一修复 |
| 4.4 | `/fixing-motion-performance` | 优化动画性能（GPU 加速、减少重排） | 根据 /audit 产出的性能问题修复 |

---

### Phase 5: 最终润色

对齐设计系统、进行最终打磨、加固边缘场景。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 5.1 | `/normalize` | 对齐 Design System token（颜色、间距、圆角等） | 确保与团队设计规范一致 |
| 5.2 | `/polish` | 最终的 production-grade 打磨 | 像素级细节、边缘对齐、一致性 |
| 5.3 | `/harden` | 错误处理 + i18n + 边缘场景兜底 | 空状态、加载失败、超长文本等 |

## 快速参考

熟练后可使用一行版快速执行核心流程:

```
/frontend-design → /baseline-ui → /colorize → /typeset → /animate → /critique → /audit → /polish
```

## 涉及的 Skills

- → [设计系统 Skills](../skills/design.md)
- → [iOS 开发 Skills](../skills/ios.md)（对比参考，**请勿在 Web 项目中使用**）
- → [Skill 生态快照 2026-03](../research/skill-ecosystem-2026-03.md)

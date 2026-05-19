---
name: frontend-skills
description: Web 前端 AI 编码 Skills 评测。UI/UX、排版配色、响应式、无障碍、动效相关工具
when_to_use: Web 项目选前端 Skill；要让 AI 写出有设计品质的界面；找 Tailwind/React/Vue 相关工具
related: [./design, /visual-engineering/, ./code-quality]
stage: domain
---

# Web 前端 AI 编码 Skills

> UI/UX 设计、排版配色、响应式布局、无障碍、动效——让 AI 写出有设计品质的前端界面。

## 速查表

| Skill | 来源 | 优先级 | 安装命令 | 适用技术栈 |
|-------|------|--------|---------|-----------|
| **frontend-design** | Anthropic 官方 | **必装** | `npx skills add anthropics/claude-code --skill frontend-design` | React / Vue / HTML / 所有 Web |
| **Impeccable** | pbakaus/impeccable | **推荐** | `npx skills add pbakaus/impeccable` | Web (Tailwind / CSS) |
| **ui-skills** | ibelick/ui-skills | **推荐** | `npx skills add ibelick/ui-skills` | Web (Tailwind / CSS / ARIA) |
| **UI/UX Pro Max** | nextlevelbuilder | **推荐** | 手动安装（复制 SKILL.md） | 全平台 |
| **Vercel Agent Skills** | vercel-labs | 视情况 | `npx skills add vercel-labs/agent-skills` | React / Next.js |
| **frontend-ui-engineering** | addyosmani/agent-skills | 视情况 | `npx skills add addyosmani/agent-skills` | Web 通用 |

::: warning Web Only 警告
**Impeccable** 和 **ibelick/ui-skills** 仅适用于 Web 项目！它们硬编码了 CSS animations、Tailwind、ARIA 等 Web 专有技术。**不要**在 iOS/SwiftUI 或其他非 Web 项目中使用。
:::

---

## 必装

### frontend-design — Anthropic 官方前端设计 Skill

- **来源**: [anthropics/claude-code — frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)
- **安装**: `npx skills add anthropics/claude-code --skill frontend-design`
- **维护者**: Anthropic 官方

#### 核心能力

frontend-design 从四个设计维度约束 AI 的审美输出，是所有 Web 前端 Skill 中最基础、最通用的一个：

| 维度 | 关键内容 |
|------|---------|
| **Typography（排版）** | 按场景推荐字体组合；提供清晰的字号层级和行高规则 |
| **Color & Theme（配色与主题）** | 可感知的色彩对比度要求、暗色/亮色模式指南 |
| **Motion（动效）** | 有意义的过渡动画，避免为了动而动 |
| **Backgrounds（背景）** | 纹理、渐变、图层叠加的最佳实践 |

#### 按风格推荐字体

| 风格 | 推荐字体 |
|------|---------|
| Code / Tech | JetBrains Mono, Fira Code, IBM Plex Mono |
| Editorial / Magazine | Playfair Display, Crimson Pro, Lora |
| Startup / SaaS | Clash Display, Satoshi, General Sans |
| Corporate / Enterprise | Inter (限定场景), IBM Plex Sans |

#### 反模式（Anti-patterns）

以下是 frontend-design 明确标记为应避免的"AI 审美陷阱"：

- **滥用 Inter / Roboto / Arial** — 全世界的 AI 项目都在用，毫无辨识度
- **紫色渐变** — 已成为 AI 生成界面的刻板印象
- **极简动画或零动画** — 缺乏微交互让界面死气沉沉

#### 使用姿势

```
# 新建页面时
请用 frontend-design 标准设计这个 Landing Page，要有独特的排版和微交互

# 审查设计时
请检查当前页面是否符合 frontend-design 的反模式清单
```

#### 适用性评价

| 项目 | 评分 |
|------|------|
| Web 项目（React/Vue/HTML） | ★★★★★ |
| 跨平台（Electron/Tauri） | ★★★★☆ |
| 移动端（React Native） | ★★★☆☆ |
| iOS/SwiftUI 原生 | ★★☆☆☆（概念可借鉴，但不直接适用） |

---

## 推荐

### Impeccable — 20 条设计命令覆盖全生命周期

- **来源**: [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | [impeccable.style](https://impeccable.style)
- **安装**: `npx skills add pbakaus/impeccable`
- **维护者**: Paul Bakaus（Google DevRel 前负责人）

#### 核心能力

Impeccable 是当前最全面的 Web UI 设计 Skill。它提供 **20 个 slash command**，覆盖从审计到精修的完整设计生命周期，横跨 **7 大设计领域**：

| 领域 | 覆盖内容 |
|------|---------|
| **Typography** | 字体选择、字号梯度、行高、字间距 |
| **Color** | 基于 OKLCH 色彩空间的配色系统 |
| **Spacing** | 间距节奏、留白系统 |
| **Motion** | CSS 过渡、关键帧动画 |
| **Interaction** | 悬停、焦点、点击反馈 |
| **Responsive** | 响应式断点、流式布局 |
| **UX Copy** | 按钮文案、提示文字、微文案 |

#### 关键命令

| 命令 | 用途 |
|------|------|
| `/teach-impeccable` | 向 Claude 注入全部设计知识 |
| `/audit` | 全面审计当前 UI 的设计质量 |
| `/critique` | 针对性批评设计薄弱环节 |
| `/normalize` | 统一不一致的设计元素 |
| `/polish` | 精修细节，提升整体品质感 |
| `/colorize` | 优化配色方案（基于 OKLCH） |
| `/typeset` | 优化排版系统 |
| `/animate` | 添加有意义的动效 |
| `/delight` | 增加令人愉悦的微交互 |

#### 反模式机制

Impeccable 内置了明确的反模式排除列表：
- 过度使用的字体（同 frontend-design 的警告）
- 彩色背景上的灰色文字（对比度不足）
- 过度嵌套的卡片布局（视觉层级混乱）

#### 与 frontend-design 的关系

两者互补而非替代。frontend-design 提供宏观设计理念和约束，Impeccable 提供精细的执行命令。推荐同时安装，在 `CLAUDE.md` 中嵌入 frontend-design 的核心 prompt，用 Impeccable 的命令做具体操作。

::: danger 平台限制
Impeccable 仅适用于 Web 项目。它硬编码了 CSS animations、Tailwind class、ARIA 属性等 Web 技术。iOS/SwiftUI/Flutter 项目请勿使用。
:::

---

### ibelick/ui-skills — 4 个聚焦型 UI 修复 Skill

- **来源**: [ibelick/ui-skills](https://github.com/ibelick/ui-skills) | [ui-skills.com](https://www.ui-skills.com/)
- **安装**: `npx skills add ibelick/ui-skills`
- **维护者**: Julien Thibeaut

#### 核心能力

与 Impeccable 的"大而全"不同，ui-skills 走的是"小而精"路线。它只提供 4 个高度聚焦的 Skill：

| 命令 | 用途 | 典型场景 |
|------|------|---------|
| `/baseline-ui` | 建立 UI 基线标准 | 项目初期、设计系统搭建 |
| `/fixing-accessibility` | 修复无障碍问题 | WCAG 合规、屏幕阅读器适配 |
| `/fixing-motion-performance` | 修复动画性能问题 | 卡顿动画、GPU 加速优化 |
| `/fixing-metadata` | 修复 meta 标签 | SEO、Open Graph、Twitter Card |

#### 适用场景

ui-skills 非常适合作为"修补型"工具配合 frontend-design 使用：
- 项目已经跑起来了，但无障碍评分低 → `/fixing-accessibility`
- 动画在低端设备上卡顿 → `/fixing-motion-performance`
- 分享链接没有预览卡片 → `/fixing-metadata`

::: danger 平台限制
同 Impeccable，ui-skills 仅适用于 Web 项目（Tailwind、CSS、ARIA）。
:::

---

### UI/UX Pro Max Skill — 海量规则的"百科全书式"Skill

- **来源**: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- **安装**: 手动安装（复制 SKILL.md 到项目 `.claude/skills/` 目录）

#### 核心能力

这是一个"暴力美学"型 Skill，用规模取胜：

| 维度 | 数量 |
|------|------|
| 行业专属推理规则 | 161 条 |
| UI 风格预设 | 67 个 |
| 配色方案 | 161 套 |
| Google Font 配对 | 57 组 |
| 图表类型 | 25 种 |
| UX 设计准则 | 99 条 |

#### 使用建议

- **优点**: 覆盖面极广，特别适合快速原型；行业预设（医疗、金融、教育等）很实用
- **缺点**: 规则数量庞大，会占用较多 context window；部分规则之间可能冲突
- **推荐用法**: 按需取用，而非全量加载。将需要的行业预设单独提取到 `CLAUDE.md` 中

---

## 视情况

### Vercel Agent Skills — Next.js 生态最佳实践

- **来源**: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- **安装**: `npx skills add vercel-labs/agent-skills`

#### 包含内容

| 模块 | 规则数 | 内容 |
|------|--------|------|
| Web Design Guidelines | 100+ 条 | 布局、排版、配色、响应式最佳实践 |
| React Best Practices | 57 条 | 性能优化、hooks 使用、渲染策略 |
| Composition Patterns | 若干 | 组件架构、复合组件、slot 模式 |

#### 适用场景

- 使用 **Next.js** 或 **Vercel** 平台的项目
- 需要 React 性能优化指导
- 项目架构设计阶段

#### 局限性

- 强绑定 React/Next.js 生态，Vue/Svelte 项目不适用
- 设计规则偏保守（Vercel 风格），不适合个性化设计需求

---

### addyosmani/agent-skills — 生产级工程 Skill 集合

- **来源**: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- **安装**: `npx skills add addyosmani/agent-skills`
- **维护者**: Addy Osmani（Google Chrome 团队）

#### 前端相关 Skill

该仓库包含 **19 个生产级工程 Skill**，其中前端相关的主要是 `frontend-ui-engineering`：

- Web 性能优化（Core Web Vitals）
- 组件设计模式
- 打包与构建优化
- 浏览器兼容性处理

#### 适用场景

- 大型 Web 应用的性能调优
- 需要遵循 Google 最佳实践的团队
- 已有设计系统、需要工程侧优化

---

## 推荐工作流

完整流程详见 [Web 前端功能开发流程](../workflows/web-feature-dev.md)。

### Skills 组合使用顺序

```
/frontend-design → /baseline-ui → /audit → /polish
```

### 详细流程

```
1. 项目启动
   └─ /teach-impeccable  → 收集设计上下文和偏好

2. UI 骨架搭建
   └─ /frontend-design   → 生成有设计深度的初始界面
   └─ /baseline-ui       → 统一间距、排版和 Tailwind 约定

3. 视觉增强
   └─ /colorize          → 策略性引入色彩
   └─ /typeset           → 优化排版选择
   └─ /animate           → 添加有目的的动效
   └─ /delight           → 添加愉悦感细节

4. 质量把关
   └─ /critique          → Nielsen 可用性启发式评审
   └─ /audit             → 可访问性 + 性能 + 响应式检查
   └─ /fixing-accessibility    → 修复可访问性问题
   └─ /fixing-motion-performance → 优化动效性能

5. 发布准备
   └─ /normalize         → 与设计系统对齐
   └─ /polish            → 最终润色
   └─ /harden            → 错误处理和 i18n
```

### 八大提示词技巧

| 技巧 | 说明 | 示例 |
|------|------|------|
| **Context Layering** | 先堆叠项目背景、架构、技术栈 | "我们使用 React + Tailwind CSS，设计语言是极简主义..." |
| **Role Assignment** | 赋予 AI 设计师角色 | "Act as a senior design engineer with impeccable taste" |
| **Constraint Anchoring** | 明确禁止项 | "禁止使用 Inter 字体、紫色渐变、通用卡片布局" |
| **Stepwise Prompting** | 拆分为顺序步骤 | "第一步先做布局骨架，第二步加排版，第三步加动效" |
| **Comparative Prompting** | 请求多方案比较 | "给我三种不同美学风格的方案，分析各自权衡" |
| **Chain-of-Thought** | 先解释策略再生成 | "先描述你的设计思路和选择理由，然后生成代码" |
| **Pattern Extension** | 提供现有代码约定 | "以下是我们现有的组件风格，请按此约定扩展" |
| **Error-Forward** | 直接喂入错误信息 | 复制报错直接贴入对话 |

---

## 配套动效组件库参考

以下组件库常与上述 Skill 配合使用，供选型参考：

| 库 | 定位 | 特点 |
|----|------|------|
| [shadcn/ui](https://ui.shadcn.com/) | 基础组件 | 可复制粘贴、高度可定制、Radix 底层 |
| [Aceternity UI](https://ui.aceternity.com/) | 动效组件 | 华丽的 3D 和视差效果，适合 Landing Page |
| [Magic UI](https://magicui.design/) | 装饰组件 | 炫酷交互元素 |
| [Motion](https://motion.dev/) | 动画引擎 | 原 framer-motion，已支持 vanilla JS |
| [Hover.dev](https://www.hover.dev/) | 悬停效果 | 专注 hover 交互 |
| [Animata](https://animata.design/) | 动画片段 | 可复制的动画组件集合 |

---

## 相关资源

- [frontend-design SKILL.md 原文](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) — Anthropic 官方 Skill 定义
- [impeccable.style](https://impeccable.style) — Impeccable 官方文档
- [ui-skills.com](https://www.ui-skills.com/) — ibelick/ui-skills 官方站点
- [Skills 知识中枢](./) — 概念、选型决策、评测方法
- [Skill 生态快照 2026-03](../research/skill-ecosystem-2026-03.md) — L3 事实层完整清单

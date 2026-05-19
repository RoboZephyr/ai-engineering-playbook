---
name: design-skills
description: 设计系统 Skills 评测。Design Token / 主题 / 品牌规范 / 视觉资产生成相关 AI 编码工具
when_to_use: 给项目选设计 Skill；建设 Design Token；做品牌一致性；视觉资产生成需求
related: [./frontend, /visual-engineering/, /visual-engineering/anti-patterns]
stage: domain
---

# 设计系统 Skills

> Design Token、主题系统、品牌规范、视觉资产生成相关的 AI 编码 Skills。

## 速查表

| Skill | 来源 | 优先级 | 安装命令 | 适用技术栈 |
|-------|------|--------|---------|-----------|
| **theme-factory** | Anthropic 官方 | **必装** | `npx skills add anthropics/claude-code --skill theme-factory` | 全平台 |
| **brand-guidelines** | Anthropic 官方 | **推荐** | `npx skills add anthropics/claude-code --skill brand-guidelines` | 全平台 |
| **canvas-design** | Anthropic 官方 | **推荐** | `npx skills add anthropics/claude-code --skill canvas-design` | PNG / PDF 输出 |
| **frontend-design** | Anthropic 官方 | **推荐** | `npx skills add anthropics/claude-code --skill frontend-design` | Web |
| **Impeccable** | pbakaus/impeccable | 视情况 | `npx skills add pbakaus/impeccable` | Web (Tailwind / CSS) |

::: tip 与前端 Skills 的关系
本页聚焦**设计系统层面**（Token、主题、品牌、视觉资产）。具体的 Web UI 实现（排版、动效、无障碍）请参考 [前端开发 Skills](./frontend.md)。两者互补：设计系统定义「是什么」，前端 Skills 负责「怎么做」。
:::

---

## 必装

### theme-factory — 10 套预设主题 + 自定义主题生成

- **来源**: [Anthropic 官方 Skills](https://github.com/anthropics/claude-code)
- **安装**: `npx skills add anthropics/claude-code --skill theme-factory`
- **维护者**: Anthropic

#### 核心能力

theme-factory 提供一套完整的主题工具包，可以给任何产出物（Slide、文档、HTML 页面、报告）套用统一视觉风格：

| 能力 | 说明 |
|------|------|
| **10 套预设主题** | 覆盖常见风格：极简、科技、商务、创意、暗黑等 |
| **自定义主题生成** | 从品牌色 / 参考图片 / 文字描述生成完整主题 |
| **Design Token 输出** | 颜色、字体、间距、圆角、阴影等 Token 体系 |
| **跨格式适用** | 同一主题可应用于 Slides、Docs、HTML、PDF |

#### 使用姿势

```
# 用预设主题
请用 theme-factory 的「科技」主题美化这个 Landing Page

# 自定义主题
请根据品牌色 #2563EB 生成一套完整的 Design Token，包含 light/dark 两种模式
```

#### 我们的评价

theme-factory 解决了一个核心问题：**AI 生成内容的视觉一致性**。没有它，每次生成的页面/文档风格都不一样。有了它，先确定主题 Token，再生成内容，视觉一致性有保障。

**最佳使用场景：** 项目初期确定设计语言、批量生成品牌一致的内容、从竞品参考中提取设计系统。

#### Landing Page 使用边界

Landing Page 可以吸收 theme-factory 的「先确定风格约束，再生成页面」方法，但不应该直接把完整 Design Token / 组件系统套到落地页上。

落地页更适合使用薄一层的 `Visual Kit`：

```text
style_name
rationale
palette
typography
hero_composition
layout_principle
motion
anti_patterns
```

原因是：Landing Page 首先追求首屏冲击力、截图传播感、转化清晰度和可信表达；如果直接走完整设计系统，AI 很容易把页面做成 dashboard、console、workbench 或 SaaS 组件堆叠。这样的页面看起来“结构完整”，但不像强落地页。

更好的做法是：

```text
Skeleton 层先固定页面传播结构
Visual Kit 控制视觉语言
Content 层控制 proof / narrative / CTA
Page Render 层负责实现和响应式
```

也就是说，theme-factory 适合提供方法和约束意识；具体到 Landing Page，应先选宣传页骨架，再把主题能力收窄成落地页专用的 Visual Kit，而不是完整 UI 主题包。

这不代表放弃参考站点和动效。参考站点仍然用于提炼首屏构图、色彩张力、字体气质和动效节奏；`motion` 也应该保留在 Visual Kit 中。只是它们都服务于落地页表达，不扩展成完整 Design System 或复杂交互规范。

经验上，AI 很容易把 Landing Page 做成「左文案 + 右抽象图形」或「居中标题 + 三张功能卡」。这类反模式见 [Visual Engineering / 反模式清单](../visual-engineering/anti-patterns.md)。

---

## 推荐

### brand-guidelines — 品牌视觉规范应用

- **来源**: [Anthropic 官方 Skills](https://github.com/anthropics/claude-code)
- **安装**: `npx skills add anthropics/claude-code --skill brand-guidelines`
- **维护者**: Anthropic

#### 核心能力

| 能力 | 说明 |
|------|------|
| **品牌色系** | 主色、辅助色、功能色的使用规范 |
| **排版规范** | 标题/正文/说明文字的字体、字号、行高 |
| **间距体系** | 统一的 spacing scale（4px / 8px 基数） |
| **使用约束** | 明确禁止事项（如颜色误用、字体混搭限制） |

#### 我们的评价

brand-guidelines 的核心价值是**约束**而非生成。它告诉 AI「不要做什么」比「做什么」更重要。搭配 theme-factory 使用效果最好：theme-factory 生成 Token，brand-guidelines 确保 Token 被正确使用。

**最佳使用场景：** 团队协作时确保品牌一致性、Review 已有设计是否偏离品牌规范。

---

### canvas-design — 静态视觉设计生成

- **来源**: [Anthropic 官方 Skills](https://github.com/anthropics/claude-code)
- **安装**: `npx skills add anthropics/claude-code --skill canvas-design`
- **维护者**: Anthropic

#### 核心能力

| 能力 | 说明 |
|------|------|
| **海报 / 封面设计** | 根据主题生成 PNG/PDF 视觉设计 |
| **数据可视化** | 图表、信息图的视觉设计 |
| **设计哲学** | 内置版式、构图、色彩理论 |
| **原创输出** | 每次生成独特设计，不是套模板 |

#### 我们的评价

canvas-design 适合非代码类的视觉需求：产品 Demo 截图美化、社交媒体图片、演示文稿配图。不要用它来做 UI 界面设计——那是 frontend-design 的领域。

**最佳使用场景：** Marketing 素材、社交媒体封面、演示文稿中的插图。

---

### frontend-design — 前端设计原则与反模式

- **来源**: [Anthropic 官方 Skills](https://github.com/anthropics/claude-code)
- **安装**: `npx skills add anthropics/claude-code --skill frontend-design`
- **维护者**: Anthropic

详细评测见 → [前端开发 Skills](./frontend.md#frontend-design-anthropic-官方前端设计-skill)

在设计系统语境下，frontend-design 的价值在于：
- 提供**反模式清单**（禁用 Inter/Roboto、禁用紫色渐变等），避免 AI 生成千篇一律的界面
- 按风格推荐**字体组合**，可作为 Design Token 中字体选型的参考
- 定义 Typography、Color、Motion、Background 四个维度的设计约束

---

## 视情况

### Impeccable — Web 专属设计命令集

- **来源**: [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- **安装**: `npx skills add pbakaus/impeccable`

详细评测见 → [前端开发 Skills](./frontend.md#impeccable-20-条设计命令覆盖全生命周期)

在设计系统语境下，Impeccable 的 `/normalize` 命令特别有价值——它可以将不一致的 CSS 对齐到统一的 Design Token 体系。但注意：**仅适用于 Web 项目**（CSS/Tailwind）。

::: danger 平台限制
Impeccable 仅适用于 Web 项目。iOS / Flutter / 桌面应用请勿使用。
:::

---

## 反模式 / AI 微指纹（已迁移）

AI 生成视觉的反模式清单和 AI 微指纹 reject 项已经整合到 **Visual Engineering** 板块作为通用方法论。

→ [Visual Engineering / 反模式清单](../visual-engineering/anti-patterns.md)（4 维度反模式 + 7 条 AI 微指纹）
→ [Visual Engineering / 设计审查](../visual-engineering/design-critique.md)（事后审查工作流）

最高频违规摘要：

- **视觉味**：紫色渐变 / 玻璃拟态 / 嵌套卡片 / 低对比文本
- **AI 微指纹**：italic-serif hero / eyebrow chip / "from X to Y" 句式 / emoji 标题
- **构图**：居中三栏 / CTA 不在首屏
- **文案**：unlock / supercharge / revolutionize buzzword

---

## 设计系统搭建参考流程

完整 Web 项目流程详见 → [Web 前端功能开发流程](../workflows/web-feature-dev.md)

### 通用设计系统初始化流程

无论技术栈，搭建设计系统的逻辑顺序是：

```
1. 确定品牌基础
   └─ /brand-guidelines   → 品牌色、字体、间距的约束规范
   └─ /theme-factory      → 生成完整 Design Token 体系

2. 定义组件规范
   └─ /frontend-design    → 组件设计约束和反模式

3. 应用与审查
   └─ /normalize          → 对齐已有代码到 Token 体系（Web）
   └─ /critique           → 审查设计一致性（Web）
```

## 相关资源

- [theme-factory](https://github.com/anthropics/claude-code) — Anthropic 官方主题工具 Skill
- [brand-guidelines](https://github.com/anthropics/claude-code) — Anthropic 品牌风格 Skill
- [Design Tokens W3C 规范](https://design-tokens.github.io/community-group/format/) — Design Token 格式标准
- [前端开发 Skills](./frontend.md) — Web UI 实现相关 Skills

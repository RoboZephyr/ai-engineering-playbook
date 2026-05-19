---
name: visual-kit
description: Visual Kit 字段定义 + 三个量化 dial + Refero 折叠路径 + brand_voice 派生 style_name
when_to_use: 已有 PRODUCT.md 和 Skeleton（如适用），需要定义这个项目的视觉语言
inputs: [PRODUCT.md.brand_voice, 可选 Refero DESIGN.md, 可选 Skeleton]
outputs: [DESIGN.md / kit.json]
related: [./input-docs, ./anti-patterns, ./design-critique]
stage: method
---

# Visual Kit：视觉语言定义

**触发条件**：PRODUCT.md 已确定 brand_voice 和 anti_references，需要产出这个项目专属的视觉规范。

**核心动作**：从 brand_voice 派生 style_name，配三个 dial 锁强度，明确反模式。

## Visual Kit 是什么 {#what}

**视觉语言层，不是设计系统**。区别：

| Visual Kit | Design System |
|------------|---------------|
| 约束首屏视觉、构图气质、主视觉锚点、色彩张力 | 定义表单、表格、抽屉、状态组件、暗色模式 |
| 5-10 个字段 | 数百个 token |
| 每个项目一份独有 | 跨项目通用组件库 |
| 几小时定下来 | 几周/几月维护 |

Refero、Impeccable、本项目都属于「Visual Kit 侧」工具——**不要拿来做 dashboard 主题**。

## 字段表 {#fields}

| 字段 | 作用 | 不应承担 |
|------|------|----------|
| `style_name` | 命名本项目专属视觉方向 | 不命名产品平台类型 |
| `rationale` | 解释为什么适合本产品 | 不写完整营销策略 |
| `palette` | 色彩张力和页面气质 | 不扩成 light/dark 全 token |
| `typography` | 标题 / 正文 / 等宽字体气质 | 不定义全组件字号表 |
| `hero_composition` | 首屏构图和记忆点 | 不描述后台 UI surface |
| `layout_principle` | 页面节奏和分区方式 | 不定义组件库布局 |
| `motion` | 动效语气和强度（语义） | 不做交互系统 |
| `anti_patterns` | 显式禁止项 | 不泛泛写「不要丑」 |
| `design_variance` (1-10) | 布局实验度：1=居中保守，10=非对称张力 | 不替代 `hero_composition` 描述 |
| `motion_intensity` (1-10) | 动效强度：1=几乎无，10=滚动视差/磁吸/3D | 不替代 `motion` 描述 |
| `visual_density` (1-10) | 信息密度：1=留白海报，10=高密度证明墙 | 不替代 `layout_principle` |

## brand_voice 派生 style_name {#brand-voice-derive}

**主路径**。不要从固定主题库挑名字，从 PRODUCT.md.brand_voice 倒推。

```text
PRODUCT.md.brand_voice
  ↓
派生 DESIGN.md.style_name（这个产品独有的视觉立场）
  ↓
配合 design_variance / motion_intensity / visual_density 锁强度
```

### 派生示例

| brand_voice | 派生 style_name 方向 | 典型 dial 设置 | 不应派生成 |
|-------------|---------------------|---------------|-----------|
| 克制、安静、专业 | 编辑感证明页 / 高对比留白 | variance: 3, motion: 2, density: 4 | 玻璃拟态 / 紫色渐变 |
| 激进、增长、转化 | 直效广告版式 / 证明墙 | variance: 5, motion: 4, density: 8 | 极简留白 / Quiet luxury |
| 戏剧化、电影感 | 沉浸视觉舞台 / 大背景 hero | variance: 7, motion: 7, density: 3 | 居中三卡片 |
| 技术、开发者、机制清楚 | Centered Artifact + 网格 | variance: 4, motion: 3, density: 6 | 抽象 3D 图形 |
| 创意、手工、灵动 | 拼贴工作室 / 不对称版式 | variance: 9, motion: 5, density: 5 | dashboard 风 |

### 为什么不用固定主题库

[Impeccable v3.0.6](https://impeccable.style/) 报告过的失败模式：

> 固定 aesthetic lane 名单会让模型收敛到同样 3 个方向。

模型不会真的探索整个主题空间，反复选 `cinematic product scene` 和 `editorial founder letter` 这种相对安全的方向，让不同产品趋同。

**所以**：`style_name` 应该每个项目都不同，是从产品独有 brand_voice 推出来的。

## 三个 dial 的作用 {#dials}

描述性字段（`palette: 深紫冷灰`）告诉 AI **方向**，dial 告诉 AI **强度**。两者搭配输出更稳。

dial 思路来自 [taste-skill](https://github.com/leonxlnx/taste-skill) 的三参数，本项目收窄到视觉前端语境。

### 典型 dial 组合

```yaml
# 高端 B2B 工具
design_variance: 3
motion_intensity: 2
visual_density: 5

# 创作者产品发布页
design_variance: 7
motion_intensity: 7
visual_density: 3

# 增长广告页
design_variance: 5
motion_intensity: 3
visual_density: 8

# 极简 ToC 转化页
design_variance: 2
motion_intensity: 1
visual_density: 2
```

## Refero 折叠路径（可选）{#refero-fold}

如果需要从真实产品参考起步：

```text
1. 在 Refero (https://styles.refero.design/) 按 mood / palette / typography 检索 2-3 个候选
2. 导出候选的 DESIGN.md（Refero 提供的通用版本）
3. 折叠为本项目 Visual Kit：丢掉组件 token，保留视觉语言
4. 用 PRODUCT.md.brand_voice 校验 style_name 派生方向是否一致
```

### Refero DESIGN.md → 本项目 DESIGN.md 折叠规则

| Refero DESIGN.md 字段 | 折叠规则 |
|----------------------|----------|
| 全套色阶（50-900） | 保留 2-3 个主张力色，删其余 |
| 全字号表 | 只保留 H1 / H2 / body / mono 气质 |
| 组件 token（按钮 / 表单 / 卡片状态） | **全删** |
| 暗色模式定义 | **全删**（如果项目不需要） |
| layout grid 规范 | 收窄为一句构图原则 |
| — | **补**: `hero_composition` / `anti_patterns` / dial（Refero 没有的字段） |

## 灵感参考方向（不是 lane） {#inspiration-pool}

如果 brand_voice 派生卡住，可以参考这些已有方向**激发**思考（注意：**只作为灵感，不作为默认选项**）：

```text
高对比发布海报 / 编辑型创始人信 / 电影感产品场景 / 精密蓝图式落地页
粗粝增长证明墙 / 安静高级证明页 / 手工拼贴工作室 / 极简转化页
```

不要让 AI 在这 8 个里挑——让它基于 brand_voice 派生新的、本产品独有的 style_name。

## 强 Visual Kit 的判断边界 {#quality-bar}

外部调研给出一致的判断标准：

- [NN/g: F-Shaped Pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) — 设计必须主动引导视线
- [NN/g: The Fold Manifesto](https://www.nngroup.com/articles/page-fold-manifesto/) — 首屏要有承诺感
- [CXL: High Converting Landing Page](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/) — 清晰价值主张、明确 CTA、视觉层级、可信证明
- [web.dev: CLS](https://web.dev/articles/cls) / [INP](https://web.dev/articles/inp) — 视觉稳定性

合起来：**强 Visual Kit 必须同时满足首屏承诺、视觉层级、转化清晰、可信证明和实现稳定**。

## 给 AI 的执行提示 {#for-ai}

1. 先读 PRODUCT.md.brand_voice，**不要直接挑主题名字**。
2. 派生 style_name 时要写出一个本项目独有的名字，不要复用 "editorial founder letter" 这种现成词。
3. 三个 dial 必须显式给出 1-10 的数字，不能用形容词替代。
4. anti_patterns 字段必须显式列出，至少包含 [反模式清单](./anti-patterns.md) 的高频项。
5. 输出 DESIGN.md 后，跑一次 [设计审查](./design-critique.md) 验证。

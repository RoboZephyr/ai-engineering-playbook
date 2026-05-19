---
name: landing-page-assets
description: Landing Page 素材生成完整管线。三层（视觉素材 → 结构化内容 → 页面渲染）+ Phase 1-6 执行步骤
when_to_use: 要给一个 Landing Page 项目生成 Hero 图/视频/内容；想知道 AI 生图/生视频/组装的标准流程
inputs: [主题描述, 可选：参考站点 URL, 可选：用户素材]
outputs: [kit.json, content.json, hero.png, hero-video.mp4, 渲染 HTML]
related: [/visual-engineering/, /visual-engineering/visual-kit]
application: landing-page
status: 已用于实际项目（idea-business/landing-page），效果可用
---

::: tip 已沉淀自实际项目
本流程沉淀自 `idea-business/landing-page` 的实际素材生成实战。视觉语言层（Visual Kit / brand_voice 派生 / 反模式）的方法论在 [Visual Engineering](../visual-engineering/) 板块——那些是新提炼的，还在沉淀中。
:::

# Landing Page 素材生成流程

> 从主题到可部署的落地页，通过三层管线（视觉素材 → 结构化内容 → 页面渲染）逐步生成高质量 Landing Page。核心思路：**先图片后视频、先内容后组装**，每层都有独立的质量门控。

::: tip 通用模式
本工作流描述的"先生图 → 再生视频 → 最后组装"是一个通用的 AI 素材生成模式，不限于特定项目。任何需要 AI 生成视觉资产的场景都可以参考此编排。
:::

## 适用场景

- 产品 Landing Page 的视觉素材批量生成
- 营销页面的 Hero 背景图 + 循环视频制作
- 品牌视觉资产（色板、字体、动效参数）的自动化提取与生成
- 需要从参考站点逆向提取设计风格的项目

## 核心管线概览

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Visual Kit（视觉素材）                              │
│  参考站点分析 → 色板/字体 → AI 生图 → AI 生视频 → kit.json    │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Content（结构化内容）                                │
│  Web 调研 → LLM 生成 → 质量评分 → 验证 → 素材映射 → 组装      │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Page Render（页面渲染）                              │
│  Content JSON + Kit JSON → React 组件 → 静态 HTML             │
└─────────────────────────────────────────────────────────────┘
```

三层解耦，每层可独立运行、独立迭代。Layer 1 产出的 `kit.json` 和 Layer 2 产出的 `content.json` 是 Layer 3 的输入。

## 前置准备

| 依赖 | 用途 | 备注 |
|------|------|------|
| **AI 图片生成服务** | Hero 背景图生成 | Kling AI（主）/ OpenAI DALL-E / gpt-image（备） |
| **AI 视频生成服务** | 图片转循环视频 | Kling AI image-to-video |
| **LLM 服务** | 内容生成、质量评分 | Claude / Gemini 等 |
| **Web 搜索 API** | 竞品调研、关键词分析 | 用于 Content 层的 Research 步骤 |

## 完整流程

### Phase 1: 设计规格提取

从参考站点或预设中提取视觉规格，建立统一的设计 Token。

| 步骤 | 动作 | 产出 | 备注 |
|------|------|------|------|
| 1.1 | **分析参考站点** — 抓取目标 URL，提取主色、辅色、字体、动效风格 | 色板 + 字体 + 动效强度 | 无参考站点则使用预设模板（如 `dark-tech`） |
| 1.2 | **合并品牌色** — 用户指定色 > 参考站点 > 预设默认值 | 最终 `ColorPalette` | 三级优先级覆盖 |
| 1.3 | **确定排版** — heading/body 字体、字重、字间距 | `Typography` 配置 | 同样遵循参考站点 > 预设的优先级 |
| 1.4 | **动效参数** — scroll reveal、text reveal、粒子效果等 | `Animation` 配置 | 强度分级：subtle / moderate / energetic |

---

### Phase 2: Hero 图片生成

核心原则：**先拿到静态图，再考虑动态化**。图片是一切视觉资产的基础。

| 步骤 | 动作 | 产出 | 备注 |
|------|------|------|------|
| 2.1 | **检查用户素材** — 用户已提供截图/设计稿？直接使用 | `hero.png` (user-provided) | 跳过生成，节省成本和时间 |
| 2.2 | **构建 Prompt** — 结合主题、风格描述、负面提示词 | 图片生成 Prompt | 关键：明确禁止文字/水印/logo |
| 2.3 | **调用图片生成 API** — Kling text-to-image（主）或 OpenAI（备） | `hero.png` (1920x1080) | 支持多候选生成 + 择优 |
| 2.4 | **质量检查** — 确认无文字残留、构图合理、风格匹配 | 通过/重试 | 失败则调整 Prompt 重试 |

::: warning Prompt 要点
图片生成的 Prompt 必须包含负面约束：`No text, no words, no letters, no watermarks, no logos`。AI 图片生成模型容易在画面中渲染出无意义文字，这是最常见的质量问题。
:::

---

### Phase 3: Hero 视频生成（Image-to-Video）

在静态图基础上生成 5-10 秒的无缝循环背景视频。**必须在 Phase 2 完成后执行**。

| 步骤 | 动作 | 产出 | 备注 |
|------|------|------|------|
| 3.1 | **构建视频 Prompt** — 描述期望的运动方式（慢速漂移、视差、粒子流动） | 视频生成 Prompt | 强调 seamless loop + slow motion |
| 3.2 | **调用 image-to-video API** — 以 hero.png 为输入，Kling 生成动画 | `hero-video.mp4` (5-10s) | 比 text-to-video 质量更稳定，因为有图片锚定 |
| 3.3 | **验证循环性** — 检查首尾帧过渡是否平滑 | 通过/重试 | 循环不平滑需要调整 Prompt 中的运动描述 |

::: tip 为什么用 image-to-video 而不是 text-to-video？
- **一致性**：以已确认的静态图为锚点，视频风格不会偏离
- **可控性**：构图、色调已在图片阶段确定，视频只负责"动起来"
- **成功率**：比纯文本生成视频的质量更稳定
- **可降级**：视频生成失败时，静态图仍然可用作 fallback
:::

---

### Phase 4: 辅助素材处理

处理 Feature 图片、Logo 等辅助视觉资产。

| 步骤 | 动作 | 产出 | 备注 |
|------|------|------|------|
| 4.1 | **Feature 图片** — 复制/处理用户提供的功能截图 | `feature-1.png` ... `feature-N.png` | 可选：AI 生成统一风格的插图 |
| 4.2 | **Logo 处理** — 复制品牌 Logo | `logo.svg` / `logo.png` | 保持原始格式 |
| 4.3 | **组装 Visual Kit** — 汇总所有视觉资产和设计参数 | `kit.json` | 包含 colors、typography、hero、animation、layout |

---

### Phase 5: 内容生成与质量把控

独立于视觉素材的内容管线，可与 Phase 1-4 并行执行。

| 步骤 | 动作 | 产出 | 备注 |
|------|------|------|------|
| 5.1 | **Web 调研** — 搜索引擎 + 竞品页面抓取 + People Also Ask | 调研数据包 | 为 LLM 提供领域上下文 |
| 5.2 | **LLM 内容生成** — 基于调研数据生成结构化 Landing Page 内容 | `LandingPageData` JSON | 包含 Hero 文案、Features、Stats、FAQ、Testimonials、CTA |
| 5.3 | **质量评分** — 5 维度打分（关键词相关性、结构、文案、转化、SEO） | 总分 + 分级 | 低于 60 分自动重新生成 |
| 5.4 | **结构验证** — 字数限制、必填字段、格式检查 | 验证报告 | errors + warnings |
| 5.5 | **素材映射** — 将 kit.json 中的图片/视频路径映射到内容 JSON | 完整 `content.json` | Hero image/video、Feature images |

---

### Phase 6: 页面组装与部署

将 Visual Kit + Content 组装为最终页面。

| 步骤 | 动作 | 产出 | 备注 |
|------|------|------|------|
| 6.1 | **渲染页面** — Content JSON + Kit JSON → React 组件 → HTML | 静态页面 | 组件包括 Hero（gradient/image/video 三种模式）、Bento Features、Stats 等 |
| 6.2 | **视觉检查** — 浏览器中验证实际渲染效果 | 通过/修正 | 重点检查：视频自动播放、移动端适配、动效流畅度 |
| 6.3 | **性能审计** — Lighthouse / Core Web Vitals | 审计报告 | 视频资源需要 lazy load，图片需要压缩 |

## 关键设计决策

### 为什么三层解耦？

| 决策 | 理由 |
|------|------|
| 素材与内容分离 | 素材生成耗时长（图片 30s-2min，视频 2-5min），与内容生成并行可大幅缩短总时间 |
| Kit JSON 作为中间产物 | 可复用：同一套视觉素材可搭配不同内容；可替换：换一组素材不影响内容 |
| 质量门控内置在管线中 | 每层有独立的 Judge，不合格自动重试，避免到最后才发现问题 |

### 图片生成的 Provider 选择

| Provider | 优势 | 劣势 | 适用场景 |
|----------|------|------|----------|
| **Kling AI** | 图片质量高、支持 image-to-video 一站式 | 需要单独申请 API | 生产环境首选 |
| **OpenAI (DALL-E / gpt-image)** | 接入简单、prompt 理解力强 | 不支持 image-to-video | 快速原型 / fallback |

### Prompt 工程要点

```
# 图片 Prompt 模板
{style} style, {subject_description}.
High quality, professional, suitable for website hero background.
No text, no words, no letters, no watermarks.

# 视频 Prompt 模板  
Subtle cinematic motion, slow camera drift, gentle parallax.
{scene_description}. Seamless loop, smooth transitions.

# 负面 Prompt（图片）
text, watermark, letters, words, logos, low quality, blurry

# 负面 Prompt（视频）
text, watermark, UI elements, faces, human, fast motion, flicker, shaky, low quality
```

## 快速参考

熟练后的一行版执行顺序：

```
分析参考站点 → 提取色板/字体 → 生成 Hero 图 → 图转视频 → 组装 kit.json
                                                        ↕ 并行
                              Web 调研 → LLM 生成内容 → 质量评分 → 验证
                                                                    ↓
                                            素材映射（kit + content）→ 渲染页面
```

## 涉及的能力

- → [设计系统 Skills](../skills/design.md)（canvas-design、theme-factory、brand-guidelines）
- → [前端开发 Skills](../skills/frontend.md)（frontend-design 用于页面骨架）
- → [Web 功能开发流程](./web-feature-dev.md)（页面渲染阶段的质量把关）

---
name: anti-patterns
description: AI 生成视觉前端的反模式清单 + 7 条 AI 微指纹 reject 项
when_to_use: 写 anti_patterns 字段；critique 阶段对照检查；做事后审查 reject 判断
inputs: [渲染页 / 截图 / DESIGN.md]
outputs: [violations 清单]
related: [./visual-kit, ./design-critique, ./input-docs]
stage: method
---

# 反模式清单：AI 生成视觉的常见坑

**触发条件**：你在写 DESIGN.md.anti_patterns 字段，或在做事后审查需要对照清单逐项核查。

**核心动作**：每条反模式都给出「为什么禁」和「替代方案」，方便 AI 在生成时就避开。

清单综合 [frontend-design](https://github.com/anthropics/skills) 反模式条款 + [Impeccable](https://impeccable.style/) 25 条 AI slop + 本项目在实际跑视觉任务时观察到的偏差。

## 视觉味反模式 {#visual-vibe}

| 反模式 | 为什么禁 | 替代方案 |
|--------|----------|----------|
| 泛紫色 / 蓝紫 AI 渐变 | 已成 AI 生成图标志，廉价感 | 单色高饱和 + 大留白；或冷暖对撞 |
| 玻璃拟态浮卡 (Glassmorphism) | 2020 流行过的模板，现在等于"我没设计" | 实色卡片 + 边界精确阴影；或干脆无卡片 |
| 嵌套卡片（卡片里又是卡片） | 信息层级失控，视线无法聚焦 | 分组用留白和细分割线，不要靠卡片 |
| 低对比度浅灰文本 | 可读性差，看起来像没写完 | 正文最低 #444 on #fff；标题用纯黑或品牌主色 |
| 字体用 Inter / Roboto / SF Pro 默认 | 一眼 AI、一眼模板 | 按 brand_voice 派生字体气质，见 Visual Kit |

## 构图反模式 {#composition}

| 反模式 | 为什么禁 | 替代方案 |
|--------|----------|----------|
| 居中标题 + 三张功能卡 + 假 logo wall | AI 默认骨架，零差异化 | 选具体骨架（Immersive Media / Centered Artifact 等） |
| 左文案 + 右抽象 3D 图形 | 抽象图形和产品机制无关 | 右侧放真实 product artifact / workflow / 输出截图 |
| Dashboard / Console / Workbench Hero | 落地页变后台 UI，丧失传播感 | 除非产品本身是后台，否则禁用 |
| CTA 出现在第二屏 | 用户看不到下一步 | CTA 必须在首屏可视区内 |
| Hero 没有产品锚点（纯氛围背景） | 用户不知道这是卖什么 | 背景视觉必须解释产品，或前景压 product artifact |

## 文案反模式 {#copy}

| 反模式 | 为什么禁 | 替代方案 |
|--------|----------|----------|
| "Unlock / Supercharge / Revolutionize" 开头 | 通用营销 buzzword，零信息量 | 具体动词 + 具体对象："Cut your X by Y%" |
| 空泛形容词堆砌（"powerful, intelligent, seamless"） | 不能验证 = 不可信 | 数字、对照、客户身份 |
| Stats 凑数（"10x faster, 99% uptime, $0"） | 三个数字摆一排 = AI 生成感 | 一个强 proof 配一段证据，少而具体 |
| "from prompts to production" 句式 | LLM 默认产出的对仗结构 | 单句直陈，不要 X to Y |

## 性能与可信反模式 {#performance-trust}

| 反模式 | 为什么禁 | 替代方案 |
|--------|----------|----------|
| 首屏 Hero 视频 > 3MB 未压缩 | CLS / LCP 崩盘 | 视频 lazy load + poster 占位 + ≤2MB |
| 字体闪烁 (FOUT/FOIT) | 首屏跳动直接破坏第一印象 | `font-display: swap` + preload 关键字重 |
| 客户 logo 没授权或一眼是免费素材 | 信任反作用 | 没真实客户不如不放 |

## AI 微指纹反模式 {#ai-fingerprints}

::: danger 这是最难发现的一档
这些不是"丑"，而是"一眼 AI 生成"。模型默认会反复用这几个零件，加进 anti_patterns **显式禁掉**。

来源：[Impeccable v3.0.6](https://impeccable.style/) 教训。
:::

| 微指纹 | 长什么样 | 为什么算指纹 |
|--------|----------|--------------|
| Italic-serif hero H1 | 大斜体衬线标题（通常配 Inter 正文） | AI 默认"高级感"配方，所有 AI 工具站都长这样 |
| Eyebrow chip / Now-in-beta 胶囊 | H1 上方一个小圆角标签：`New` / `Now in beta` / 小 emoji | AI 自动加的"装饰位"，没传播价值 |
| Emoji 装饰在 section 标题前 | 每个 section 标题前一个表情 | 一眼 AI 生成内容 |
| "—— made by AI" 浮签 | 右下角小标签 `Built with [产品]` | 模板站标志 |
| Hero 副标题用 "from prompts to production" 句式 | 三段式 "from X to Y" 大量出现 | LLM 默认对仗结构 |
| 单色品牌主色 + 5% 透明度大圆球作背景 | 模糊大色块背景装饰 | 替代真正构图的偷懒选项 |
| 居中三栏 "How it works" 配 1️⃣ 2️⃣ 3️⃣ emoji | 三个序号 emoji 配抽象图标 | AI 默认信息架构 |

**判断阈值**：命中 2 个以上微指纹，需要回炉重生成。

## Critique 检查清单 {#critique-checklist}

跑完页面对照逐项过：

```text
□ 视觉味：紫色渐变 / 玻璃拟态 / 嵌套卡片 / 低对比文本？
□ 构图：退化成"居中 + 三卡片"模板？
□ Hero：背景解释产品？CTA 首屏可见？
□ 文案：unlock / supercharge / revolutionize / from X to Y？
□ Proof：数字具体可验证？logo 真实客户？
□ 性能：Hero 视频压缩？字体 swap？
□ AI 微指纹：italic-serif H1？eyebrow chip？emoji 标题？
□ 截图测试：3 秒能否看懂 offer？10 秒能否记住一个画面？
```

完整审查管线见 → [设计审查](./design-critique.md)。

## 给 AI 的执行提示 {#for-ai}

1. **生成时**：在 prompt 里复述本清单的"视觉味 + 构图 + AI 微指纹"三档，告诉模型禁用。
2. **审查时**：截图 + 让另一个 AI session（不是生成方）对照本清单逐项给 ✓/✗。
3. **不要"减少使用"**：anti_patterns 是二元判断，要么不出现，要么算违规。
4. **不要自圆其说**：发现违规直接重做，不要在文案里解释"为什么这次玻璃拟态是合理的"。

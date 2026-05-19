---
name: input-docs
description: PRODUCT.md + DESIGN.md 输入文档分层，把"产品语境"和"视觉执行"拆成两个独立文档
when_to_use: 开始任何视觉项目前；需要给 AI 一份稳定的 brief；想避免每次实验改视觉就要重审品牌
inputs: [产品 brief, 受众, 品牌定位, 反参考站点]
outputs: [PRODUCT.md, DESIGN.md]
related: [./visual-kit, ./anti-patterns]
stage: foundation
---

# 输入文档分层：PRODUCT.md + DESIGN.md

**触发条件**：你要给 AI 一份稳定的视觉任务 brief，希望 brand 决策和视觉决策不混在一起。

**核心动作**：拆成两份独立文档。慢变量在 PRODUCT.md，快变量在 DESIGN.md。

思路参考 [Impeccable](https://impeccable.style/) 的策略层设计，本项目收窄到视觉前端语境。

## 两层职责 {#two-layers}

| 文档 | 内容 | 谁写 | 何时改 | 变化频率 |
|------|------|------|--------|----------|
| `PRODUCT.md` | 受众、品牌定位、核心承诺、反参考站点、不做什么 | 产品方 / 创始人 | brief 阶段定，整轮实验不变 | **慢变量**（一个产品一次） |
| `DESIGN.md` | Visual Kit（style_name / palette / typography / hero_composition / dial / anti_patterns） | 设计 / AI 协作 | 每轮 Visual Kit 探针可变 | **快变量**（每次实验可换） |

## 为什么必须分两层 {#why-split}

如果合在一起：
- 每次改视觉要重新审品牌
- 每次审品牌会顺手动视觉
- 实验图的"Visual Kit 探针"无法只动视觉不污染品牌

分开后：
- 改 `DESIGN.md` = 换一套视觉语言（每次实验）
- 改 `PRODUCT.md` = 重新定义产品（罕见）
- 同一份 PRODUCT.md 可以并存多个 DESIGN.md 候选

## PRODUCT.md 字段 {#product-md-fields}

```yaml
audience:           # 给谁看（具体角色、痛点、入口场景）
core_promise:       # 一句话承诺，必须可验证
brand_voice:        # 用什么语气说话（克制 / 激进 / 编辑 / 技术 / 戏剧化）
anti_references:    # 不想长成什么样（具体 URL + 原因）
do_not:             # 明确不做什么承诺、不展示什么功能
```

### 最有用的字段是 `anti_references` {#anti-references}

AI 默认按"通用 SaaS 模板"生成。**告诉它「不要长成 X」比「请像 Y」效果好得多**。

每条 anti_reference 必须配原因：

```yaml
anti_references:
  - url: https://example-saas.com
    why: 居中 hero + 三张功能卡 + 假 logo wall，我们要避开这套通用模板
  - url: https://another.com
    why: dashboard 风格 hero，我们是 creator 产品不是 B2B 工具
  - url: https://generic-ai-tool.com
    why: italic-serif hero + eyebrow chip 是 AI 微指纹（见反模式清单）
```

## DESIGN.md 字段 {#design-md-fields}

```yaml
style_name:          # 派生自 PRODUCT.md.brand_voice，不从固定库挑
rationale:           # 为什么这个 style_name 适合本产品
palette:             # 主张力色（2-3 个），不要全套色阶
typography:          # 标题 / 正文 / 等宽字体气质
hero_composition:    # 首屏构图原则
layout_principle:    # 页面节奏
motion:              # 动效语气
design_variance:     # 1-10，布局张力
motion_intensity:    # 1-10，动效强度
visual_density:      # 1-10，信息密度
anti_patterns:       # 显式禁止项（含 AI 微指纹）
```

字段完整定义见 [Visual Kit](./visual-kit.md)。

## 派生规则：PRODUCT → DESIGN {#derivation}

`style_name` 必须从 `PRODUCT.md.brand_voice` 派生，不能从固定主题库挑。完整派生规则见 [Visual Kit § brand_voice 派生](./visual-kit.md#brand-voice-derive)。

简表：

| brand_voice | 派生方向 | 不应派生成 |
|-------------|---------|-----------|
| 克制、安静、专业 | 编辑感证明页 / 高对比留白 | 玻璃拟态 / 紫色渐变 |
| 激进、增长、转化 | 直效广告版式 / 证明墙 | 极简留白 / Quiet luxury |
| 戏剧化、电影感 | 沉浸视觉舞台 / 大背景 hero | 居中三卡片 |
| 技术、机制清楚 | Centered Artifact + 网格 | 抽象 3D 图形 |

## 文件存放约定 {#file-location}

```
project-root/
├── PRODUCT.md          # 产品方写，整个项目一份
├── DESIGN.md           # 当前主推的视觉版本
└── design-experiments/
    ├── DESIGN.v1.md    # 历史版本
    └── DESIGN.v2.md
```

DESIGN.md 可以有多个候选版本并存，PRODUCT.md 永远只有一份。

## 给 AI 的执行提示 {#for-ai}

如果你是 AI agent：

1. 开始视觉任务前，先读项目根目录的 `PRODUCT.md`。没有 PRODUCT.md 就先生成一份草稿和用户确认。
2. 读 `DESIGN.md` 作为本轮视觉执行规范。
3. 不要在 PRODUCT.md 里写 palette / typography（那是 DESIGN.md 的事）。
4. 不要在 DESIGN.md 里写受众 / 品牌承诺（那是 PRODUCT.md 的事）。
5. anti_references 是优先级最高的输入——AI 倾向于忽略禁止项，要反复对照。

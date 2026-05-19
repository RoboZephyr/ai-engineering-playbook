---
name: design-critique
description: 渲染后页面的事后审查工作流。对照反模式清单 + PRODUCT.md / DESIGN.md + 人审三维度
when_to_use: 页面已渲染；发布前审查；多视觉变体横向比较；现有线上页"为什么不转化"诊断
inputs: [渲染页 URL, PRODUCT.md, DESIGN.md, anti_patterns 清单]
outputs: [audit.json, 修改清单（P0/P1/P2）]
related: [./anti-patterns, ./visual-kit, ./input-docs]
stage: method
---

# 设计审查工作流（Design Critique）

**触发条件**：页面已经渲染出来，需要做发布前审查、横向比较或诊断为什么不转化。

**核心动作**：自动反模式扫描 + 对照 PRODUCT.md / DESIGN.md 检查执行 + 人审三维度 + 修改清单分优先级。

思路参考 [Impeccable](https://impeccable.style/) 的 `/audit` `/critique` `/polish` 三命令。

## 为什么需要独立审查流程 {#why-separate}

不应该让生成 Visual Kit 的同一 AI session 自评。原因：

| 偏差 | 表现 |
|------|------|
| **自圆其说** | "我用紫色渐变是因为它代表创新" |
| **完整性偏见** | "字段齐全 = 好"，但其实落地难看 |
| **审美趋同** | 生成方和评分方都基于同一训练数据，会一致偏向相同 AI slop |

把审查拆出来：审查 prompt 独立、可单独迭代、不影响生成管线、一份报告驱动多轮修改。

## 三阶段管线 {#pipeline}

```text
Phase 1: 自动反模式扫描（AI + 截图）
   ↓
Phase 2: 人审三维度（冲击 / 可信 / 转化）
   ↓
Phase 3: 修改清单 + 优先级
```

## Phase 1: 自动反模式扫描 {#phase-1}

用浏览器自动化拍截图，让独立 AI session 对照反模式清单逐项过。

| 步骤 | 动作 | 产出 |
|------|------|------|
| 1.1 | 浏览器打开目标 URL（推荐 claude-in-chrome MCP） | 截图基础工具就绪 |
| 1.2 | 拍桌面首屏 + 桌面长截图 + 移动首屏 + 移动长截图 | `desktop.png` / `mobile.png` / `full-desktop.png` / `full-mobile.png` |
| 1.3 | 让独立 AI session 对照 [反模式清单](./anti-patterns.md) 逐项检查 | `audit.json` 每条标 ✓/✗ + 证据 |
| 1.4 | 抓控制台错误 / 网络失败 | `console_errors.json` |
| 1.5 | 跑 Lighthouse / 性能审计 | `lighthouse.json`（关注 LCP / CLS） |

### Phase 1 Prompt 模板

```text
你是设计审查员，不是生成者。

任务：对照以下反模式清单，逐项检查这个页面的截图。

[反模式清单 - 粘贴 anti-patterns.md 的核心表格]

要求：
1. 只报告确实违反的，不要为了凑数。
2. 每个违反都要给出截图位置坐标。
3. 不要建议怎么改，只报告问题。

输出 JSON：
{
  "violations": [
    {
      "category": "视觉味 | 构图 | 文案 | 性能 | AI微指纹",
      "rule": "具体哪一条反模式",
      "evidence": "在截图什么位置看到",
      "severity": "high | medium | low"
    }
  ],
  "passes": ["未违反的反模式"]
}
```

## Phase 2: 人审三维度 {#phase-2}

自动扫描发现不了"无聊"。这一步必须人来。

### 三维度判据

| 维度 | 核心问题 | 怎么判 |
|------|----------|--------|
| **首屏冲击** | 3 秒能否看懂 offer？10 秒能否记住一个画面？ | 关掉页面后凭记忆描述，描述不出来 = 没冲击 |
| **可信度** | proof 具体？客户 logo 真？数字可验证？ | 任何一个 proof 经不起追问就降级 |
| **转化清晰度** | 下一步点哪里自然？CTA 在眼前？ | 找一个不熟悉产品的人试 30 秒，看第一个点什么 |

### 对照 PRODUCT.md 检查

```text
□ audience：页面气质真的匹配目标受众？
□ core_promise：首屏 H1 = PRODUCT.md 里那句承诺？
□ brand_voice：文案语气一致？
□ anti_references：有没有不小心长成 anti_references 列的站？
```

### 对照 DESIGN.md 检查

```text
□ style_name：真的执行了这个风格，还是只换了颜色？
□ design_variance：实际渲染的布局张力匹配 dial 值？（dial=8 但实际居中保守 = 没执行）
□ motion_intensity：动效强度匹配？过度或不足都标？
□ visual_density：信息密度匹配 dial？
□ anti_patterns：列在 anti_patterns 里的项目真的避开了？
```

## Phase 3: 修改清单 {#phase-3}

输出**带优先级**的修改建议，不要笼统说"再改改"。

| 优先级 | 含义 | 处理时限 |
|--------|------|----------|
| **P0** | 反模式 high severity / 偏离 PRODUCT.md 核心承诺 / 命中 2+ AI 微指纹 | 必须改才能发布 |
| **P1** | 反模式 medium / 首屏冲击不够 / proof 不具体 | 本轮内改 |
| **P2** | 细节打磨 / 动效微调 / 文案优化 | 下一轮再说 |

### 每条修改必须写清

```yaml
problem: 在哪里、违反什么规则
impact: 会让谁觉得页面不行
fix: 具体改哪个文件 / 哪段代码 / 哪个参数
```

## 不要做的事 {#never}

- ❌ 让生成 Visual Kit 的同一 AI session 审查自己
- ❌ 只看分数（截图比分数更接近真实判断）
- ❌ Phase 1 让 AI 同时给修改建议（先只收集 violations）
- ❌ 审查 Visual Kit JSON（审查的是渲染页，不是文档）
- ❌ 自圆其说（"这个紫色渐变是合理的因为..."）

## 与上下游的关系 {#upstream-downstream}

| 上游 | 当前 | 下游 |
|------|------|------|
| 任何渲染流程（Landing Page / Dashboard / 演示稿）→ 输出页面 | **设计审查** → 修改清单 | 回到 [Visual Kit](./visual-kit.md) 改 DESIGN.md，或 [输入文档](./input-docs.md) 改 PRODUCT.md |

每轮审查的 violations 应该**回写到 PRODUCT.md / DESIGN.md**，让下一轮生成少踩同样坑。

## 给 AI 的执行提示 {#for-ai}

如果你是审查 AI agent：

1. **必须用不同 session**：不要既生成又审查同一份页面。
2. **必须截图**：不要"通过读代码判断设计好坏"。
3. **必须分阶段**：Phase 1 只收集 violations，Phase 2 / 3 才给建议。
4. **必须分优先级**：P0/P1/P2 都明确，不要列一长串平等的待改项。
5. **必须回写**：审查结论要回到 PRODUCT.md.anti_references 或 DESIGN.md.anti_patterns，否则下一轮还会踩同样坑。

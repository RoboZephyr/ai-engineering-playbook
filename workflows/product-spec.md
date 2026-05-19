---
name: product-spec
description: PRD 编写流程。从发现真实问题到输出可交付 PRD 的 AI Skill 编排
when_to_use: 新产品立项；模糊 idea 要细化；需要输出完整 PRD 给开发团队；跨团队需求对齐
inputs: [问题描述, 受众, 业务目标]
outputs: [PRD 文档, Not Doing list, 成功指标]
skills_used: [brainstorming, find-community, idea-refine, validate-idea, pricing, doc-coauthoring]
related: [./tech-architecture, /harness/templates]
stage: workflow
---

# 产品需求书编写流程

> 从「发现真实问题」到「输出可交付 PRD」的完整 Skill 编排参考。强调先验证问题存在，再设计方案——不做空想式需求。

## 适用场景

- 从零到一的新产品/新功能立项
- 已有模糊 idea，需要系统性验证和细化
- 需要输出完整 PRD（含用户故事、优先级、成功指标）给开发团队
- 跨团队对齐：确保产品、设计、工程对需求有一致理解

## 核心理念

| 理念 | 说明 |
|------|------|
| **Problem-first** | 先找真实痛点，再想解决方案。不是「我有个 idea」而是「我发现一个问题」 |
| **"Not Doing" list** | PRD 中最有价值的部分是明确**不做什么**，防止范围蔓延 |
| **可验证** | 每个结论都应可追溯——是来自社区调研、竞品分析还是用户访谈 |
| **分层推进** | Discovery → Analysis → Specification，每层有质量门禁，不通过不进入下一层 |

## 前置准备

| Skill | 来源 | 安装方式 | 说明 |
|-------|------|---------|------|
| **brainstorming** | superpowers | 预装（Claude Code 插件） | 需求探索和发散，任何创造性工作前使用 |
| **find-community** | [slavingia/skills](https://github.com/slavingia/skills) | `npx skills add slavingia/skills --skill find-community` | 社区发现 + 痛点挖掘（Minimalist Entrepreneur 方法论） |
| **idea-refine** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `npx skills add addyosmani/agent-skills --skill idea-refine` | 多视角 idea 细化和评估 |
| **validate-idea** | [slavingia/skills](https://github.com/slavingia/skills) | `npx skills add slavingia/skills --skill validate-idea` | 六个强制问题验证商业可行性 |
| **pricing** | [slavingia/skills](https://github.com/slavingia/skills) | `npx skills add slavingia/skills --skill pricing` | 定价策略和单位经济学 |
| **doc-coauthoring** | [Anthropic 官方](https://github.com/anthropics/claude-code) | `npx skills add anthropics/claude-code --skill doc-coauthoring` | 三阶段文档协作（Context → Draft → Refine） |

::: tip 推荐搭配
使用 [context7 MCP](https://github.com/upstash/context7) 在调研阶段获取最新的框架文档和市场数据，避免依赖 LLM 记忆中的过时信息。
:::

## 完整流程

### Phase 1: Discovery — 发现真实问题

找到真实存在的痛点，而不是自己想象的需求。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 1.1 | `/brainstorming` | 发散探索：用户是谁、痛点在哪、现有方案的不足 | 不急着收敛，先充分展开 |
| 1.2 | `/find-community` | 定位目标社区，发掘持续性痛点和现有 workaround | 关注 Reddit、HN、独立开发者社区中的重复抱怨 |
| 1.3 | `/idea-refine` | 从痛点出发生成多个解决方案方向，多视角评估 | 输出 3-5 个候选方向，不是只选一个 |

**Phase 1 自检清单：**
- [ ] 能用一句话描述目标用户的具体痛点
- [ ] 至少找到 3 个现有 workaround（说明痛点真实存在）
- [ ] 候选方向中排除了「教育用户」型方案（用户不愿改变习惯的不做）

---

### Phase 2: Validation — 商业可行性验证

用强制问题挑战 idea，避免自我说服。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 2.1 | `/validate-idea` | 六个强制验证问题（谁？多痛？现在怎么办？愿意付钱吗？） | 必须诚实回答，不允许含糊 |
| 2.2 | Web Research | 竞品调研：找到 3+ 竞品的定位、定价、用户评价 | 用 WebSearch 搜索真实数据 |

**Validation 红旗（出现任何一个应重新评估）：**
- 找不到现有 workaround → 可能不是真痛点
- 只有朋友说「挺好的」→ 样本偏差
- 需要教育用户新概念 → 获客成本高
- 说不出具体谁会付钱 → 市场不存在

**Validation 绿旗：**
- 已有人为劣质方案付费 → 市场真实存在
- 手动操作可以解决问题 → 可以 processize
- 社区中有活跃投诉 → 痛点持续
- 能指出「具体的人 + 具体的痛」→ ICP 清晰

---

### Phase 3: Analysis — 市场分析与定位

量化市场空间，明确竞争策略。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 3.1 | Market Sizing | 估算 TAM/SAM/SOM，用 bottom-up 方法 | 避免 top-down 的「万亿市场」幻觉 |
| 3.2 | ICP 定义 | 描述理想客户画像 + JTBD（待完成的工作） | 「所有人」不是 ICP |
| 3.3 | 竞品定位 | Positioning map：按关键维度对比 3+ 竞品 | 找到没人占的差异化位置 |
| 3.4 | `/pricing` | 定价策略：价值锚定、单位经济学、毛利测算 | 参考竞品定价区间 |

**Phase 3 自检清单：**
- [ ] TAM 有具体数字和计算过程（不是「巨大的市场」）
- [ ] 能说出 3 个具体竞品的优缺点
- [ ] 差异化不是「更好」而是「不同」
- [ ] 单位经济学为正（每单毛利 > 0）

---

### Phase 4: Specification — PRD 编写

把验证过的分析转化为可执行的产品规格。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 4.1 | `/doc-coauthoring` | 三阶段文档协作：Context 传递 → Draft 生成 → Refine 润色 | 先充分传递上下文，再让 AI 写初稿 |
| 4.2 | 一句话目标 | 用一句话定义产品核心目标 | 团队对齐的锚点 |
| 4.3 | User Stories | P0 故事 ≤ 5 个，每个有验收标准 | P0 超过 5 个说明没想清楚 |
| 4.4 | "Not Doing" List | 列出 ≥ 3 条明确不做的事 | **PRD 最重要的部分** |
| 4.5 | ICE 评分 | Impact × Confidence × Ease 对每个 story 打分排序 | 客观排优先级，避免 HiPPO |
| 4.6 | 成功指标 | 北极星指标 1 个 + 辅助指标 2-3 个 + 护栏指标 2-3 个 | 每个指标必须可量化 |

---

### Phase 5: Review — 对抗性审查

用独立视角挑战 PRD，发现盲点。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 5.1 | 独立 Review | 在新会话中让 AI 审查 PRD（不看编写过程） | 避免「自己审自己」的偏差 |
| 5.2 | 挑战清单 | 检查：假设是否验证？"Not Doing" 是否足够？指标是否可测量？ | 带着怀疑态度审查 |
| 5.3 | 修订 | 根据 review 意见修改 PRD | 修改后无需重新全面审查 |

## 快速参考

```
/brainstorming → /find-community → /idea-refine → /validate-idea → /pricing → /doc-coauthoring
```

## PRD 输出结构参考

一份合格的 PRD 至少包含以下部分：

```markdown
# [产品名] PRD

## 一句话目标
...

## 目标用户 (ICP)
...

## 用户故事（P0，≤ 5 个）
- [ ] As a [用户], I want [功能], so that [价值]
  - 验收标准: ...

## Not Doing（≥ 3 条）
- ❌ 不做 XXX，因为 ...

## 成功指标
| 类型 | 指标 | 目标值 |
|------|------|--------|
| 北极星 | ... | ... |
| 辅助 | ... | ... |
| 护栏 | ... | ... |

## 竞品定位
...

## 定价策略
...

## 风险与假设
...
```

## 涉及的 Skills

- → [文档工具 Skills](../skills/documentation.md)（ADR、文档协作）
- → [Skills 总览](../skills/)（核心 Skill 集索引）
- → [技术架构设计流程](./tech-architecture.md)（PRD 完成后的下一步）

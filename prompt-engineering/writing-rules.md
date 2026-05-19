---
name: prompt-writing-rules
description: 通用 prompt 文字层面的写作规范——遣词造句、避免常见错误、检查清单。适用于所有会被 LLM 读到的文本
when_to_use: 每次写新 prompt / 改旧 prompt / 写 CLAUDE.md / 写 SKILL.md body / 写 system prompt 前后
related: [./foundations, ./skill-authoring, ../harness/context-design]
stage: method
---

# 通用写作规范

> 把 [核心原则](./foundations) 落实到文字层面。每条规则配反例 vs 正例，写完用[底部 checklist](#检查清单) 对照。

## 适用范围

**适用**：任何会被 LLM 运行时读到的文本

- `CLAUDE.md` / `AGENTS.md` / `.cursorrules`
- `SKILL.md` body / `agents/*.md`
- pipeline 代码里注入的 system / user message
- tool description 字符串
- slash command 模板
- 注入 prompt 的 reference / data 文件

**不适用**：给人看的文档

- ADR / RFC / plan / solution
- README / CONTRIBUTING
- commit message / PR description
- 设计文档 / 演讲稿

给人看的文档可以写 why / 历史 / 演进——LLM 不需要这些。

---

## 规则 1 · Colleague test（同事测试）

写完 prompt，想象一个对项目背景**不熟悉**的同事第一次拿到——他能直接照做吗？

- 能 → 过
- 要追问"X 是什么意思 / 这里指的是哪个？" → prompt 漏了信息

来源：Anthropic § Be clear and direct *"Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too."*

### 常见 fail 点

| 现象 | 原因 |
|------|------|
| 用了项目专属术语没解释 | "feedback_xxx"、"L1 数据"、"PD 阶段" |
| 引用了未定义的对象 | "按 schema 输出"——哪个 schema？ |
| 用了模糊量词 | "大概几条"、"类似下面"、"等等" |
| 隐含的因果链 | "因为 X 所以 Y"——X 是什么？ |

---

## 规则 2 · 正向表述代替"不要 X"

来源：Anthropic § Control format *"Tell Claude what to do instead of what not to do. Positive examples tend to be more effective."*

| 差 | 好 |
|----|----|
| 不要用 markdown | 用连贯的段落散文 |
| 不要写 "Excited to announce" | 首句必须是 hook：问题 / 反直觉观察 / 具体数字 |
| 禁止 hype 词 | 用具体名词代替形容词（"3 倍速度" 而非 "极快"） |
| 不要超过 5 行 | 控制在 3-5 行 |

**例外**：当"禁止 + 列表"有明确取舍价值时可以保留，但最好同时给替代写法（"不要 X，改为 Y"）。比如"禁止编造 name 字段——如果 PRD 没明确名字，输出 `null` 让上游补"。

---

## 规则 3 · 规则配 *why*，不只配 *what*

来源：Anthropic § Be clear and direct，官方对比例子：

```text
差：NEVER use ellipses

好：Your response will be read aloud by a text-to-speech engine,
    so never use ellipses since the text-to-speech engine will
    not know how to pronounce them.
```

模型能从解释中外推到边界情况（如 `…` 和 `...` 都属于 ellipses）。

### 写 *当前 why*，不是 *历史 why*

| 类型 | 例子 | 写不写 |
|------|------|--------|
| **当前约束 / 风险** | "禁止编造 repo URL——下游 deploy 会用此值做 git clone" | ✅ 写 |
| **业务因果** | "如果 user_id 为空就退出——下游所有表都关联此字段" | ✅ 写 |
| **历史演进** | "之前用 v1 API，现在改 v2" | ❌ 不写 |
| **过去的踩坑** | "MVP 时这里写死，后来改成参数化" | ❌ 不写 |

---

## 规则 4 · 不写历史演进

### 内容

**Prompt 只描述当前，不讲过去**。LLM 不需要知道这条规则以前是什么样、为什么改、迁移路径是什么——历史背景只占 token、让新模型困惑。

来源：Anthropic *Agent Skills best practices* § Avoid time-sensitive information *"Don't include information that will become outdated"*。

### 禁止模式

```text
（Phase 2 新增）数据优先级
MVP 默认的 X 已被 Y 取代
之前是 A，现在改成 B
老版"软链接"被硬约束替代
After August 2025, use the new API
（L1 权威，Phase 2 引入）
```

### 替代写法

不讲"为什么改"，只讲"当前是什么"：

| 差 | 好 |
|----|----|
| `Phase 2 后发现层由 social-discover 完成` | `发现层由 social-discover 完成` |
| `MVP 默认 r/SideProject 已被 discovery 取代` | `按 target_community 指定的 subreddit，不要 fallback 假设` |
| `老版"软链接"被硬约束替代 → 结尾必须是问题` | `结尾必须是具体问题（不是"欢迎反馈"）` |
| `（L1 权威，Phase 2 新增）数据优先级` | `## 数据优先级` |

### 兼容/降级逻辑照常写

但只写条件分支不写迁移史：

```markdown
# 好
若 target-communities.json 存在 → 主路径
否则 → 退回 category 推断

# 差
Phase 2 新增 target-communities.json；MVP 老版走 category 推断；
若 target-communities.json 不存在说明 pipeline 未升级，退回老逻辑
```

### 真要保留历史信息怎么办

用 `<details>` 折叠到末尾，明确标注 deprecated：

```markdown
## Current method

Use the v2 API endpoint: `api.example.com/v2/messages`

## Old patterns

<details>
<summary>Legacy v1 API (deprecated 2025-08)</summary>
...
</details>
```

---

## 规则 5 · 字面执行：显式声明作用域

来源：Anthropic *Claude Opus 4.7* §More literal instruction following *"It will not silently generalize an instruction from one item to another."*

新一代模型（4.7 / GPT-5）字面执行强。模糊作用域会被字面解读为"只对第一个"。

| 差 | 好 |
|----|----|
| 格式成类似下面 | 对每个 section 都应用此格式，不只第一个 |
| 处理这种情况 | 当 type=dialogue 时执行；type=action 时跳过 |
| 比如 / 等等 / 之类 | 显式列出所有情况，不留 "etc" 给模型脑补 |
| 大概几条 | 每个 scene 输出 3-5 条；少于 3 条说明输入不足，输出空数组 |

---

## 规则 6 · 避免激进语气（CAPS / CRITICAL / MUST 堆砌）

来源：Anthropic *Prompting best practices* §Tool usage（原文，verified 2026-05）：*"Claude Opus 4.5 and Claude Opus 4.6 are also more responsive to the system prompt than previous models. If your prompts were designed to reduce undertriggering on tools or skills, these models may now overtrigger. The fix is to dial back any aggressive language. Where you might have said 'CRITICAL: You MUST use this tool when...', you can use more normal prompting like 'Use this tool when...'."*

过度强调会导致 **overtrigger**——模型为了"听话"在不该用的地方也用、不该报错的地方也报错。

### 分级

| 强度 | 何时用 | 例子 |
|------|--------|------|
| 普通陈述（应 / 默认 / 建议） | 99% 的规则 | "Use this tool when ..." |
| **必须 / MUST** | 真正硬约束、违反就出错 | "MUST return JSON only" |
| **CRITICAL / 全大写** | 极少数生死攸关 | 几乎不用 |

如果一份 prompt 里有 5 个以上 "必须"，多数都应该降级为普通陈述。

---

## 规则 7 · 匹配 prompt 风格与期望输出

来源：Anthropic § Migration considerations *"The formatting style used in your prompt may influence Claude's response style."*

- 想让输出**少 markdown** → prompt 里也少用 markdown
- 想让输出**简洁** → prompt 也要简洁，不要写 5 段长解释要求"简短回复"
- 想让输出**中文** → prompt 主要用中文
- 想让输出**学术风** → prompt 用学术风（完整句子、定义、引用）

---

## 规则 8 · 一致术语

来源：Anthropic *Skills best practices* § Use consistent terminology *"Choose one term and use it throughout the Skill."*

选定一个术语贯穿全文，不要混用近义词。

| 差（混用） | 好（一致） |
|-----------|-----------|
| API endpoint / URL / API route / path | 全用 "API endpoint" |
| field / box / element / control | 全用 "field" |
| extract / pull / get / retrieve | 全用 "extract" |
| 用户 / user / 客户 / consumer | 选一个用 |

---

## 规则 9 · 字段边界用 XML / 结构化标签

当 prompt 混合了**指令 + 上下文 + 示例 + 变量输入**，用 XML 标签分隔。

来源：Anthropic § Structure prompts with XML tags（参见 [核心原则 #2](./foundations#原则-2-·-用-xml-标签结构化不要裸-markdown--json-代码块)）。

### 命名约定

| 内容类型 | 推荐标签 |
|---------|---------|
| 指令 | `<instructions>` / `<task>` |
| 上下文 | `<context>` |
| 输入数据 | `<input>` / `<data>` / `<documents>` |
| 示例集 | `<examples>` 内嵌多个 `<example>` |
| 输出 schema | `<output_schema>` |
| 硬约束 | `<hard_rule>` / `<constraint priority="P0">` |
| 推理过程 | `<thinking>` / `<reasoning>` |
| 最终输出 | `<answer>` / `<output>` |

整个项目保持一致——不要 `<input>` 和 `<inputs>` 混用。

---

## 规则 10 · 长上下文：数据在上，指令在下

来源：参见 [核心原则 #1](./foundations#原则-1-·-长上下文数据置顶指令置底或两端皆有)。

pipeline 注入 prompt 时，长输入（PRODUCT-STATE 原文、JSON dump、文档全文）应放在 skill 指令**之前**而非之后。

```text
正确顺序：
[元数据 / 角色定位] → [大块输入数据] → [任务指令] → [示例] → [输出 schema]

错误顺序：
[任务指令 200 字] → [大块输入数据] → [更多指令 ...]
```

---

## 规则 11 · 重复 boilerplate 抽到上游

同一段规则（数据优先级 / 禁止编造 / 输入路径约定）在 >3 个 skill / agent 里**一字不差**重复 → 抽到上游共享注入。

### 抽法

- **pipeline 注入型**：写到 pipeline 代码的 prompt header，每次 spawn skill 时拼到前面
- **CLAUDE.md 注入型**：写到 `CLAUDE.md`，被 Claude Code 自动加载
- **MCP / tool 描述型**：写到 tool description，模型每次见到 tool 时都看到

下游 skill 本地只留指向（"遵循 header 中的数据优先级原则"）。

**好处**：减少漂移 + 降 token + 修一处即全局生效。

---

## 规则 12 · 源头修 schema，不在下游加 normalizer

LLM 输出格式不对（多了字段、少了字段、嵌套错了）→ 改 skill prompt **源头**，不要在下游写兼容层 / normalizer / try-catch 兜底。

### 为什么

- Normalizer 是症状治疗，prompt 是病根。Normalizer 越多，prompt 越烂、越难调试。
- Normalizer 会掩盖问题——LLM 偶发输出错也"看起来 OK"，直到某个边界 case 炸开。
- Prompt 改正确后 normalizer 不再需要，反而要删——技术债。

### 例外

- 真正不可控的来源（用户输入、第三方 API 返回的非结构化文本）需要 normalizer
- 多模型部署、不同模型有不同 quirks（如 Qwen 偶尔加 ` ```json` fence、GPT 不加）——可以薄层 normalize

---

## 规则 13 · 不要再用 prefill（Claude 4.6+ 已禁）

**Claude 4.6 起 prefilled assistant message 不再支持，返回 400 错误**。以前靠预填 `assistant` 角色消息来强制输出格式（`Here is the JSON:\n{`）的代码全部要迁移。

来源：Anthropic *Prompting best practices* §Migrating away from prefilled responses *"Starting with Claude 4.6 models, prefilled responses on the last assistant turn are no longer supported. Requests with prefilled assistant messages to these models return a 400 error."*

### 迁移方案

| 原 prefill 用途 | 迁移到 |
|---------------|--------|
| 强制 JSON 输出 | Structured Outputs（`strict: true` tool） 或 system prompt 直接指令 |
| 去除 preamble（"Here is..."） | system prompt："Respond directly without preamble" + 输出包在 XML 标签里 |
| 续写中断响应 | 用户消息：*"Your previous response was interrupted and ended with [X]. Continue from where you left off."* |
| Context 注入 | 注入到 user turn，或通过 tools 暴露 context |

GPT-5 / Gemini 仍支持 assistant 续写，所以**这是 Claude 专属问题**。跨家部署的代码要分支处理。

---

## 规则 14 · 输出 schema 用 XML 或 JSON 示例明确给出

不要让模型猜你想要的输出格式。

### 正例

```markdown
<output_schema>
Return JSON only, conforming to:

```json
{
  "status": "ok" | "empty" | "error",
  "items": [
    {
      "id": "string",
      "processed": "boolean",
      "error": "string | null"
    }
  ],
  "summary": {
    "total": "number",
    "processed_count": "number"
  }
}
```

Required: status, items. Optional in items: error (null when processed=true).
</output_schema>
```

### 反例

```text
返回一个 JSON，包含状态、处理过的项目列表，还有总结信息。
```

---

## 检查清单

写完 prompt / 改完 prompt 前对照：

### 基础

- [ ] 通读每段，搜 "Phase / 新增 / 取代 / 老版 / MVP" 等字眼 → 删或改写（规则 4）
- [ ] 每句自问"删掉 LLM 还知道该怎么做吗" → 是就删
- [ ] 把 "不要 X" 改写成 "做 Y"，或"不要 X，改为 Y"（规则 2）

### 信息完整度

- [ ] 规则配了 *当前 why*（约束/风险）吗？历史 why 去掉（规则 3）
- [ ] 模糊作用域（"类似 / 大概 / etc"）已改成显式枚举吗（规则 5）
- [ ] colleague test：另一个对项目不熟的人能照做吗（规则 1）

### 结构

- [ ] CAPS / CRITICAL / MUST 只给真正硬约束用了吗（规则 6）
- [ ] 长输入数据在指令之前吗（规则 10）
- [ ] 多种内容类型用 XML 标签分隔了吗（规则 9）
- [ ] 输出 schema 或结构用 JSON / XML 示例明确给了吗（规则 13）

### 一致性

- [ ] 术语整篇一致吗（规则 8）
- [ ] prompt 风格匹配期望输出吗（规则 7）

### 维护

- [ ] 同段规则在 >3 个 skill 重复吗 → 考虑抽到上游（规则 11）
- [ ] 输出问题修在 prompt 源头，不在下游加 normalizer（规则 12）
- [ ] Claude 代码里没有 prefilled assistant message 吗（4.6+ 已禁，规则 13）

## 触发时机

- 写新 skill / 新 agent prompt / 新 CLAUDE.md
- 改旧 prompt（演进时最易加入历史注释，警觉）
- 遇到 LLM 输出质量问题，先回来 check 这个 playbook 再考虑改逻辑
- prompt review / harness check

## 参考

- Anthropic — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Anthropic — [Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- 站内：[核心原则](./foundations) · [SKILL.md 作者指南](./skill-authoring) · [Harness / Context 设计](../harness/context-design)

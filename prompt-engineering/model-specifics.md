---
name: model-specifics
description: 当前主流模型的差异化 prompt 行为与新参数——Claude 4.7 / GPT-5 / Gemini 3 / 国内模型；跨厂商部署最低公共集
when_to_use: 升级 Claude 4.6→4.7、迁移到 GPT-5、首次接入 Gemini 3、需要在多家模型上跑同一 prompt
related: [./foundations, ./long-context-and-structured-output, ./writing-rules]
stage: method
---

# 模型差异与新参数（2026-05 verified）

> 同样一句 prompt 在不同模型上表现差异很大。本章总结当前主流模型的差异化行为、新参数（effort / reasoning_effort / verbosity / adaptive thinking 等）、必知的 breaking changes。

## 阅读路径

| 你的情况 | 直接看 |
|---------|--------|
| 从 Claude Opus 4.6 升 4.7 | [Anthropic 部分](#anthropic-claude-4-7) |
| 从 Sonnet 4.5 升 4.6 | [Sonnet 4.6 部分](#sonnet-46-升级) |
| 从 GPT-4 / GPT-4.1 升 GPT-5 | [OpenAI 部分](#openai-gpt-5) |
| 首次接入 Gemini | [Gemini 部分](#google-gemini-3) |
| 跨家部署同一 prompt | [跨厂商最低公共集](#跨厂商部署最低公共集) |

---

## Anthropic Claude 4.7

来源：[Anthropic Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) + [Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide)。

### Breaking changes（从 4.6 升 4.7）

| 变化 | 影响 | 怎么办 |
|------|------|--------|
| **`temperature` / `top_p` / `top_k` 设非默认值 → 400 错误** | 旧 SDK 调用直接报错 | 完全删除这些参数。`temperature=0` 也不能用 |
| **`thinking: {type: "enabled", budget_tokens: N}` → 400 错误** | extended thinking 不再支持 | 换 `thinking: {type: "adaptive"}` + `effort` 参数 |
| **`prefill assistant message` → 400 错误**（4.6 起） | 以前靠 prefill 强制输出格式失效 | 用 Structured Outputs / system prompt 直接指令 / `output_config.format` |
| **新 tokenizer** | 同样文本 token 数比 4.6 多 1.0×–1.35× | 重新 budget `max_tokens`、重测 cost |
| **Thinking blocks 默认空** | UI 显示 thinking 进度断了 | 显式 `thinking.display: "summarized"` 恢复 |

### `effort` 参数（核心）

> 来源：Anthropic Migration guide *"Start with the new `xhigh` effort level for coding and agentic use cases, and use a minimum of `high` effort for most intelligence-sensitive use cases."*

| Level | 用途 | 备注 |
|-------|------|------|
| `max` | 智能要求极高、不在乎 token | 可能过度思考、收益递减 |
| **`xhigh`**（4.7 新增） | **coding / agentic 默认推荐** | 实测最优 |
| `high` | 智能敏感场景的下限 | 一般场景的 sweet spot |
| `medium` | 成本敏感、可接受一些智能下降 | Sonnet 4.6 默认 |
| `low` | 短任务 / 延迟敏感 | 4.7 严格执行 low，可能 under-thinking |

**4.7 重要变化**：严格遵守 effort levels，尤其低端。`low` / `medium` 不再"自由发挥"。如果观察到 reasoning 太浅，**直接升 effort，不要靠 prompt 加重语气**。

### Adaptive thinking（取代 extended thinking）

```python
client.messages.create(
    model="claude-opus-4-7",
    max_tokens=64000,             # xhigh / max 推荐起步
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},  # max / xhigh / high / medium / low
    messages=[...],
)
```

- Adaptive thinking **默认关闭** —— 不传 `thinking` 字段就不思考
- 显式开启后，模型按 effort + 任务复杂度**自适应**决定 think 多少
- 比 `budget_tokens` 更智能 —— 简单 query 直接答、复杂 query 自己加深

### `task_budget`（beta，4.7 新增）

> 来源：Migration guide。Beta header：`task-budgets-2026-03-13`。

```python
output_config = {
    "effort": "high",
    "task_budget": {"type": "tokens", "total": 128000},
}
```

- 模型看得到这个 budget，会**按节奏分配**整个 agentic loop 的 token
- 不同于 `max_tokens`（模型看不到，硬截断）
- 最小 20k；过紧模型会粗放完成任务
- 开放任务（质量优先）**不要设** task_budget

### 字面执行（"literal instruction following"）

> *"It will not silently generalize an instruction from one item to another, and it will not infer requests you didn't make."*

如果 4.6 prompt 用了模糊词（"类似下面 / 等等 / 大概几条"），4.7 上会被字面解读。**显式声明作用域**：

```text
差：格式成类似下面
好：对每个 section 都应用此格式，不只第一个
```

### 4.7 其他行为变化

| 变化 | 应对 |
|------|------|
| **Response 长度自适应** | 简单 query 更短、复杂 query 更长。靠 prompt 例子指定期望长度 |
| **更直接的语气、少 emoji** | 想要 warm 语气需要明确写"warm, collaborative tone" |
| **更少 tool 调用、更多 reasoning** | 想要更多 tool 调用 → 升 effort 到 high / xhigh |
| **更少 subagent spawning** | 想多 subagent 显式说："spawn subagents when fanning out across items" |
| **更主动的用户进度更新** | 移除 prompt 里 "After every 3 tool calls, summarize progress" 类强制 |
| **高分辨率图像支持**（2576px / 3.75MP） | 单张图 token 可达原来 3× |

### Sonnet 4.6 升级

| 变化 | 说明 |
|------|------|
| `effort` **默认 `high`**（4.5 没有 effort 参数） | 不显式设可能延迟变高，按需调到 medium / low |
| Coding 推荐 `medium` 起步 | 跟着任务复杂度上调 |
| Chat / 非 coding 推荐 `low` | 跟着 SLA 上调 |

### Code review harness 推荐 prompt（Anthropic 官方原文）

> *"Report every issue you find, including ones you are uncertain about or consider low-severity. Do not filter for importance or confidence at this stage - a separate verification step will do that. Your goal here is coverage: it is better to surface a finding that later gets filtered out than to silently drop a real bug."*

如果 4.6 时代的 review harness 在 4.7 上 recall 下降——多半是 4.7 严格遵循了 "be conservative" 这种指令。改成上面的 coverage 措辞。

---

## OpenAI GPT-5

来源：[GPT-5 Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide)。

### 新参数

| 参数 | 作用 | 推荐值 |
|------|------|--------|
| `reasoning_effort` | 控制推理深度 | `medium` 默认；复杂任务 `high`；延迟敏感 `minimal` |
| `verbosity` | 控制**最终答案**长度（独立于 reasoning_effort） | 全局 `low` + 工具内 override 为 `high`（Cursor 实测最优） |
| `previous_response_id` | Responses API 跨调用复用 reasoning context | Tau-Bench Retail 实测从 73.9% 提升到 78.2% |

### Agentic Eagerness 控制

**降低**（让模型少探索、更快）：
- 降 `reasoning_effort` 到 `minimal`
- 设工具调用预算（"maximum of 2 tool calls"）
- 提供"逃生路线"："even if it might not be fully correct, proceed"

**提高**（让模型多探索、更彻底）：
- 升 `reasoning_effort` 到 `high`
- 加 persistence prompt：*"Remember, you are an agent — please keep going until the user's query is completely resolved, before ending your turn"*
- 明确 *"Never stop...when you encounter uncertainty — research or deduce the most reasonable approach"*

### Tool Preambles（重要）

> *"Always begin by rephrasing the user's goal in a friendly, clear, and concise manner... then outline a structured plan detailing each logical step."*

GPT-5 推荐在执行工具前做这件事：

1. 用友好简洁的方式 rephrase 用户目标
2. 制定结构化计划
3. 持续提供进度更新
4. 完成后总结

### 指令矛盾（GPT-5 特别敏感）

> *"Poorly-constructed prompts containing contradictory or vague instructions can be more damaging to GPT-5 than to other models. [...] GPT-5 follows prompt instructions with surgical precision."*

矛盾会让推理 token 浪费在反复 second-guessing。修法：
- 显式 instruction hierarchy（"emergency overrides confirmation"）
- 删除模糊副词（"thoroughly" / "carefully" 单独出现没用）
- 用 metaprompting（让 GPT-5 优化自己的 prompt：*"What specific phrases could be added to, or deleted from, this prompt to more consistently elicit the desired behavior?"*）

### Markdown 默认行为

> *"Use Markdown only where semantically correct."*

API 默认**不输出 Markdown**（为了最大兼容性）。需要 Markdown 必须显式说，且每 3-5 轮对话**重申**一次。

### 编码工具集推荐（Cursor 案例）

GPT-5 优化后的编码工具集：

```
Set 1 (无终端):
- apply_patch(patch: string)
- read_file(path, line_start?, line_end?)
- list_files(path?, depth?)
- find_matches(query, path?, max_results?)

Set 2 (terminal-native):
- run(command, session_id?, working_dir?, ms_timeout?)
- send_input(session_id, text, wait_ms?)
```

---

## Google Gemini 3

来源：[Gemini API Prompting strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)。

### 关键差异点

| 维度 | Gemini 3 行为 |
|------|--------------|
| **Temperature 默认** | 1.0（Anthropic/OpenAI 通常默认 1.0 但 Gemini 3 文档明确"strongly recommend keeping at default 1.0"） |
| **Few-shot 强烈推荐** | *"We recommend to always include few-shot examples in your prompts. Prompts without few-shot examples are likely to be less effective."* |
| **指令位置** | 跟其他家一致："Supply all the context first. Place your specific instructions or questions at the very end of the prompt." |
| **结构化输出** | `responseMimeType: "application/json"` + `responseSchema`；推荐用 schema 而非 prompt 强制 |
| **XML / Markdown** | Gemini 3 *"Use consistent structure"* with XML/Markdown tags |
| **Grounding** | Google Search 工具（近期事实）+ Code execution（计算）随时可启 |

### Gemini 3 核心原则

> *"Be precise and direct."*
> *"Use consistent structure."*
> *"Control output verbosity."*
> *"Prioritize critical instructions in System Instruction."*

### Few-shot 一致性要求

> *"Make sure that the structure and formatting of few-shot examples are the same to avoid responses with undesired formats."*

3-5 个示例最佳。Gemini 对 few-shot 比 Claude / GPT 更敏感。

### 长上下文 anchor 短语

> *"After a large block of data, use a clear transition phrase to bridge the context and your query, such as 'Based on the information above...'"*

---

## 国内主流模型

### 千问（阿里云百炼）

| 维度 | 内容 |
|------|------|
| 当前主力 | Qwen3.6-Max（GA）、Qwen3.6-Max-Thinking |
| JSON Mode | `response_format: {"type": "json_object"}`，**必须 prompt 含 "JSON"** |
| JSON Mode 报错原文 | `'messages' must contain the word 'json' in some form, to use 'response_format' of type 'json_object'.` |
| **禁用 max_tokens** | 开 JSON Mode 时设了会截断 |
| Thinking 模式 + JSON Mode | **不兼容** —— 用非 thinking 版本 |
| 长上下文 | 同 Anthropic 原则（数据置顶） |

### DeepSeek

| 维度 | 内容 |
|------|------|
| 当前主力 | DeepSeek-V3 / R1 |
| JSON Mode | `response_format: {"type": "json_object"}`，**必须 prompt 含 "json" + 给样例** |
| 已知问题（官方文档承认） | *"the API may occasionally return empty content. We are actively working on optimizing this issue. You can try modifying the prompt to mitigate."* |
| max_tokens 警告 | *"Set the max_tokens parameter reasonably to prevent the JSON string from being truncated midway."* |

### 智谱 GLM

| 维度 | 内容 |
|------|------|
| 当前主力 | GLM-5 / GLM-5.1 |
| JSON Mode | `response_format: {"type": "json_object"}`；建议显式提示词说明 |
| 长上下文 | 1M token（GLM-5），同 Anthropic 原则 |

---

## 跨厂商部署最低公共集

如果同一份 prompt 要在多家模型上跑，遵守这些规则可以保证基本表现：

### Prompt 结构

- ✅ **大块输入数据放最前面**（Anthropic / OpenAI / Gemini 共识）
- ✅ **任务指令在数据后面 / 双端覆盖**
- ✅ **3-5 个 few-shot 示例**（Anthropic 推荐 3-5；Gemini 强烈要求；OpenAI 同样有效）
- ✅ **XML 标签分隔指令 / 上下文 / 示例 / 输入**
- ✅ **关键约束末尾重复**（lost-in-middle 防御）

### JSON 输出

- ✅ **prompt 末尾出现 "Return JSON only" + JSON 关键字**（OpenAI / DeepSeek / 阿里云硬性）
- ✅ **不设 max_tokens 或设大**（阿里云 / DeepSeek 截断风险）
- ✅ **提供 1-2 个 input → output 完整示例**
- ✅ **schema 用 JSON 注释格式**（不用 TypeScript / Python 类型）
- ✅ **包含 edge case 示例**（空输入 / 最大输入 / 错误恢复）

### 不要做的

- ❌ 假设 strict mode 默认开（各家参数名不同）
- ❌ Prefill assistant message（Claude 4.6+ 已禁）
- ❌ 用 thinking 版本 + JSON Mode（阿里云不兼容）
- ❌ Markdown 嵌套深结构当输入（GPT-5 默认不输出 Markdown，长上下文 JSON 也差）
- ❌ "use TypeScript types"（多家不理解）
- ❌ 设小的 max_tokens（多家会截断）

### 跨家差异对照

| 行为 | Claude 4.7 | GPT-5 | Gemini 3 | Qwen3.6 / DeepSeek / GLM-5 |
|------|-----------|-------|----------|---------------------------|
| **字面执行强度** | 极强 | 极强（"surgical precision"） | 强 | 中等 |
| **CoT 默认** | adaptive（off by default） | reasoning_effort 控制 | 模型自适应 | 思考版本默认 on |
| **JSON Mode 关键词要求** | 不强制 | 必须 | 不强制（走 schema） | 必须 |
| **Schema 100% conformance** | strict tool use | json_schema + strict | responseSchema | 各家 strict mode |
| **Prefill 支持** | ❌（4.6+ 禁） | ✅（assistant 续写） | ✅ | ✅ |
| **Few-shot 最佳数量** | 3-5 | 3-5 | 3-5（强烈推荐） | 3-5 |
| **Temperature 推荐** | 不设（4.7 直接报错） | 默认（不要乱调） | 1.0（明确建议） | 默认 |
| **长上下文窗口** | 1M | 256k（GPT-5） | 1M-2M | 128k-1M |

---

## 触发时机

- 升级到新一代模型（4.6→4.7 / GPT-4→5）
- 首次接入新厂商
- 同一 prompt 在不同模型上表现差异大
- prompt 用了 prefill / `budget_tokens` / `temperature=0` 等老 pattern

## 引用

### Anthropic

- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide)
- [Effort parameter](https://platform.claude.com/docs/en/build-with-claude/effort)
- [Adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
- [Task budgets (beta)](https://platform.claude.com/docs/en/build-with-claude/task-budgets)

### OpenAI

- [GPT-5 Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide)
- [Prompt guidance](https://developers.openai.com/api/docs/guides/prompt-guidance)

### Google

- [Gemini API · Prompting strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)

### 国内厂商

- [阿里云百炼 JSON Mode](https://help.aliyun.com/zh/model-studio/json-mode)
- [DeepSeek JSON Output](https://api-docs.deepseek.com/guides/json_mode)
- [智谱 BigModel API](https://docs.bigmodel.cn/api-reference/)

### 站内

- [核心原则](./foundations) · [长上下文与结构化输出](./long-context-and-structured-output) · [通用写作规范](./writing-rules)

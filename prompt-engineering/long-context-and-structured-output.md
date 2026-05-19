---
name: long-context-and-structured-output
description: 长上下文策略（lost-in-middle / XML 分隔 / quote grounding）+ 结构化输出（JSON Mode / Schema / grammar-constrained）+ 各厂商 quirks
when_to_use: 输入 > 10k token；要求 JSON / 严格 schema 输出；跨厂商部署同一 prompt；模型漏读中段内容
related: [./foundations, ./writing-rules, ./prompt-vs-code]
stage: method
---

# 长上下文与结构化输出

> 长 prompt 与 JSON 输出是两个紧密相关的工程难点：长上下文导致**漏读**，结构化输出要求**精确**。两者的解法都依赖把"指望模型听话"换成"用工程手段强制"。

## TL;DR

1. **数据置顶，指令置底**——长上下文中段注意力最低（U-curve）
2. **用 XML 标签，不用裸 JSON 嵌入**——`<documents><document index="N">` 是 Anthropic 推荐结构
3. **Quote grounding**——让模型先 quote 关键信息再回答
4. **Prompt Caching 改变 prompt 结构**——静态内容必须放最前面、breakpoint 放最后一个不变的 block
5. **JSON 输出必须 prompt 含 "json" 关键词**——OpenAI / DeepSeek / 阿里云都这么要求
6. **Schema 管字段、self-audit 管覆盖、verifier 管交叉一致性**——三层叠加
7. **Production 用 grammar-constrained decoding**——Outlines / strict tool use
8. **Claude 4.6+ 不再支持 prefill**——以前靠 `assistant` 预填强制格式的代码要迁移

---

## Part 1: 长上下文（Long Context）

### Lost-in-the-Middle：真实存在且量化过

**Liu et al. 2023** *Lost in the Middle*（[arXiv:2307.03172](https://arxiv.org/abs/2307.03172) · TACL 2024）的核心发现：

- LLM 对 prompt 中段信息的利用率显著低于首末
- 形成 **U-shaped curve**：首位 > 末位 > 中段
- GPT-3.5 在 20-doc 设置下，中段表现可低于**闭卷 56.1%**——也就是说"放在中段看了反而不如不看"
- Llama-2-13B base 在 20-doc 设置下，首末与中段 gap ≈ 20pp

**对实战的含义**：放在 prompt 中段的关键约束 / 数据，模型可能视而不见。这不是 prompting 技巧问题，是 attention 机制的结构性现象。

### 解法 1：数据置顶，指令置底（或两端皆有）

**Anthropic** §Long context prompting（适用 20k+ token 输入） *"Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples. Queries at the end can improve response quality by up to 30% in tests."*

**Google Gemini** §Prompting strategies *"Supply all the context first. Place your specific instructions or questions at the very end of the prompt."* 三家厂商在这点完全一致。

#### 标准长上下文结构

```text
[1. 元数据 / 角色] — 简短
[2. 大块输入数据] — 主体（XML 标签包裹）
[3. 任务指令] — 详尽
[4. 示例 examples]
[5. 输出 schema]
[6. 末尾 reminder] — 关键硬约束重复一遍
```

#### 双端覆盖示例

```xml
<inputs>
  <documents>
    [大块输入数据 / 长文档]
  </documents>
</inputs>

<task>
[完整任务说明、规则、约束]
</task>

<examples>...</examples>

<output_schema>...</output_schema>

<final_reminder priority="P0">
Before submitting, verify [关键约束 1] and [关键约束 2].
Return JSON only.
</final_reminder>
```

最关键的约束在 `<task>` 详细写一次，在 `<final_reminder>` 简短重复一次——形成"双端覆盖"。

### 解法 2：XML 标签，不用裸 JSON 嵌入

**Anthropic** §Structure prompts with XML tags 明确推荐：*"When using multiple documents, wrap each document in `<document>` tags with `<document_content>` and `<source>` (and other metadata) subtags for clarity."* 嵌套结构用 `<documents><document index="N">` 形式。

**OpenAI** *GPT-5 Prompting Guide* 同样推荐 XML 规范标签（如 `<instruction_spec>`）；Cursor 等团队对 GPT-5 优化的实证显示 "structured XML specs improve instruction adherence"。

#### 反例：嵌套 JSON 字符串

````text
```json
{
  "scenes": [
    {"id": "s1", "elements": [{"id": "el_001", "text": "你来了"}, ...]},
    {"id": "s2", "elements": [{"id": "el_010", "text": "事情你都知道"}, ...]}
  ]
}
```
````

模型看到的是一坨字符串，element_id 都埋在嵌套引号里。

#### 正例：XML 属性

```xml
<scenes>
  <scene id="s1">
    <elements>
      <element id="el_001" type="dialogue">你来了</element>
      <element id="el_002" type="dialogue">嗯</element>
    </elements>
  </scene>
  <scene id="s2">
    <elements>
      <element id="el_010" type="dialogue">事情你都知道</element>
    </elements>
  </scene>
</scenes>
```

XML 属性让 element_id 成为 attention 可显式 anchor 的对象。

### 解法 3：Quote Grounding

**Anthropic** §Long context prompting *"For long document tasks, ask Claude to quote relevant parts of the documents first before carrying out its task. This helps Claude cut through the noise of the rest of the document's contents."*

实战做法：让模型在 `<thinking>` 或 `<reasoning_steps>` 里**先 verbatim 引用**关键内容，再开始处理。

```text
Before writing your output, in <reasoning_steps>:

1. List every element_id where type="dialogue" in <scenes>
2. For each, copy verbatim the first 8 characters of its text
3. Then plan how to allocate them to shots

This forces you to read the input rather than generalize.
```

把 "我感觉这场戏大概有几句对白" 强制变成 "我从 `<scenes>` 复制出了这 12 个 ID 和它们的前 8 个字"——隐式 decision 变 explicit log。

### 解法 4：Self-audit 字段

让模型在输出里**显式列出**它做了什么 / 漏了什么。任何漏判肉眼可见、verifier 可程序化检查。

```json
{
  "coverage_audit": {
    "all_input_ids": ["el_001", "el_002", "el_003", "el_010"],
    "covered_ids": ["el_001", "el_002", "el_003", "el_010"],
    "uncovered_ids": []
  },
  "output": [/* 实际输出 */]
}
```

约束：`uncovered_ids` 必须为空数组。模型自己写出这个字段时，如果漏了会自己暴露漏；hide 不掉。

### 解法 5：Chunking / 分阶段处理

输入实在太长（> 100k token）或任务太复杂时，拆分。

| 模式 | 例子 |
|------|------|
| **Map-Reduce** | 每个 chunk 独立处理 → 合并结果 |
| **Pipeline 分阶段** | Stage 1: 抽取 → Stage 2: 处理 → Stage 3: 输出 |
| **Self-correction chain** | Generate → Review → Refine（参见 [核心原则 #10](./foundations#原则-10-·-production-grade-不靠驯服-prompt)） |

来源：Anthropic §Chain complex prompts *"The most common chaining pattern is self-correction: generate a draft → have Claude review it against criteria → have Claude refine based on the review."*

---

## Part 2: Prompt Caching（重塑 prompt 结构）

来源：Anthropic [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · 截至 2026-05 当前 GA。

Prompt caching 不只是性能优化——它**直接改变了 prompt 该怎么组织**。理解 caching 才能写出真正能复用的长 prompt。

### 核心规则

| 维度 | 内容 |
|------|------|
| **TTL** | 默认 **5 分钟**（每次命中刷新，不额外计费）；可选 **1 小时**（写入价格 ×2） |
| **最小可缓存长度** | Opus 4.7 / 4.6 / 4.5 / Haiku 4.5 = **4096 tokens**；Sonnet 4.6 / 4.5 / Opus 4.1 = **1024 tokens** |
| **可缓存内容** | tools / system / messages 三层、文本、图片、文档、tool use / tool results |
| **不可缓存** | thinking blocks（不能直接 mark，但出现在之前的 assistant turn 里会被缓存）、空 text 块 |
| **缓存读取价格** | 基础 input 的 **0.1×**（10% 价格） |
| **缓存写入价格** | 5min: 1.25×；1h: 2.0× |

### 关键原则：`cache_control` 放在最后一个**不变**的 block

最常见的错误：把 `cache_control` 放在带时间戳 / 用户输入的 block 上 —— hash 每次都不同，cache 永远不命中、永远在写。

```text
❌ 错误：
Block 1-5: 静态 system context
Block 6: 时间戳 + 用户消息（每次都变）
cache_control 放在 Block 6 → hash 变了 → 永远 cache miss

✅ 正确：
Block 1-5: 静态 system context（cache_control 放这里）
Block 6: 时间戳 + 用户消息（不 cache）
→ Block 1-5 缓存命中，只处理 Block 6
```

### 对 prompt 结构的影响

Caching 让 prompt 工程的"经济学"变了：

| 维度 | 没 caching | 有 caching |
|------|-----------|-----------|
| 大 system prompt（10k+ token） | 每次请求都跑一遍 | 缓存一次、之后只 0.1× 价格 |
| Few-shot 示例数量 | 节省 token 是省钱 | 多放 20+ 高质量例子也便宜 |
| 长文档 Q&A | 每个问题都重新读文档 | 文档缓存一次，多个问题免费读 |
| Multi-turn 对话 | 上下文越长越贵 | 早期 turn 缓存、只新增 turn 算钱 |

**结构原则**：把 prompt 拆成"静态部分 + 动态部分"，静态部分放最前面。结构变成：

```text
[静态 tools]                  ← cache_control breakpoint
[静态 system prompt + 示例]   ← cache_control breakpoint
[历史 messages（增长但 stable）]
[当前用户输入]                 ← 不 cache
```

### Cache 的失效条件

按 `tools → system → messages` 层级，**任何一层变化会让该层及之后所有层失效**：

| 改动 | tools | system | messages |
|------|-------|--------|----------|
| Tool 定义改动 | ✘ | ✘ | ✘ |
| Web search 开关 | ✓ | ✘ | ✘ |
| Citations 开关 | ✓ | ✘ | ✘ |
| Tool choice 改动 | ✓ | ✓ | ✘ |
| 图片增删 | ✓ | ✓ | ✘ |

### 20-block lookback 限制

每个 breakpoint 在 cache 命中时**最多回看 20 个 block**。增长型对话超过 20 turn 后早期 breakpoint 会"超出窗口"——这时要**再插一个 breakpoint** 让缓存写入历史"接上"。

### 实操要点

| 场景 | 做法 |
|------|------|
| 多 turn 对话 | 用 automatic caching（top-level `cache_control`），断点自动前移 |
| 大 system prompt + 短问题 | 显式 breakpoint 放在 system prompt 末尾 |
| 文档 Q&A | 文档放 system，问题放 user；breakpoint 放文档之后 |
| 预热 | 用 `max_tokens=0` 提前 fire 一次（无输出但写 cache） |
| 增长型对话 > 20 block | 加第二个 breakpoint 覆盖更近的位置 |

### 与本章其他规则的关系

- **数据置顶**（Part 1 解法 1）和 **caching 静态在前**完全一致——同一个建议的两个动机
- **prompt 末尾 reminder**（双端覆盖）和 caching 不冲突——只要 reminder 是 system 层、用户输入在 messages 层
- **JSON mode `max_tokens=0`** 不能用 caching 预热（限制：不支持 stream、extended thinking、structured outputs、`tool_choice: any` 或特定 tool）

---

## Part 3: 结构化输出（Structured Output）

### JSON Mode：跨厂商 quirks 表

| 厂商 | JSON Mode 名称 | Prompt 必须含 "json" | 其他 quirks |
|------|----------------|---------------------|------------|
| **Anthropic** | strict tool use (`strict: true`) + `output_config.format` | 不强制 | **Claude 4.6+ 禁用 prefill**（需迁移到 Structured Outputs）；首次编译延迟、24h grammar 缓存 |
| **OpenAI** | `response_format: { type: "json_object" }` 或 `json_schema` | **是**（json_object 模式） | `strict: true` + `json_schema` 提供 100% conformance；递归 schema 不支持 |
| **Google Gemini** | `responseMimeType: "application/json"` + `responseSchema` | 不强制（schema 走 API 字段） | Gemini 3 默认 temperature=1.0；建议同时给 schema 又在 prompt 说"return JSON" |
| **DeepSeek** | `response_format: { type: "json_object" }` | **是**（否则可能无限输出空白） | **已知问题**："the API may occasionally return empty content. We are actively working on optimizing this issue. You can try modifying the prompt to mitigate." |
| **阿里云百炼**（Qwen） | `response_format: { type: "json_object" }` | **是**（不区分大小写） | **禁用 max_tokens**（会截断 JSON）；Qwen3.6-Max 思考模式不支持 JSON Mode（用非思考版本） |
| **智谱 GLM** | `response_format: { type: "json_object" }` | 建议（提示词显式说明） | 文档明确建议显式说明需要 JSON 格式 |

### 厂商原文引用（verbatim）

**Anthropic Structured Outputs**：*"Structured outputs guarantee schema-compliant responses through constrained decoding: Always valid: No more JSON.parse() errors. Type safe: Guaranteed field types and required fields. Reliable: No retries needed for schema violations."*

**OpenAI** [Structured Outputs Guide](https://platform.openai.com/docs/guides/structured-outputs)：`strict: true` + `json_schema` 提供 100% conformance。

**DeepSeek** [JSON Output Guide](https://api-docs.deepseek.com/guides/json_mode)：

- *"Include the word 'json' in the system or user prompt, and provide an example of the desired JSON format to guide the model in outputting valid JSON."*
- *"Set the `max_tokens` parameter reasonably to prevent the JSON string from being truncated midway."*
- 已知问题：*"the API may occasionally return empty content. We are actively working on optimizing this issue. You can try modifying the prompt to mitigate such problems."*

**阿里云百炼** [JSON Mode](https://help.aliyun.com/zh/model-studio/json-mode) 原文报错：

> `'messages' must contain the word 'json' in some form, to use 'response_format' of type 'json_object'.`

不设 max_tokens 警告原文：*"开启结构化输出时，请勿设置 max_tokens。该参数限制模型输出的 Token 数，设置后可能导致 JSON 字符串在输出过程中被截断，产生无效 JSON。"*

**Google Gemini** [Prompting strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)：推荐"使用 structured output feature when specifying a more complex JSON Schema for the response"，不要只依赖 prompt。

**智谱**：[BigModel API Reference](https://docs.bigmodel.cn/api-reference/)。

### 跨厂商部署 prompt 最低公共集

如果同一份 prompt 要跑在多家模型上：

```text
✅ 必做：
- prompt 末尾出现 "Return JSON only." 或 "Return JSON conforming to the schema below."
- 不要设 max_tokens（或设大，留足空间）
- 提供 JSON 输出示例

✅ 推荐：
- 输出 schema 用 JSON 注释格式给（不是 TypeScript / Python 类型）
- 提供 1-2 个 input → output 完整示例
- 包含 edge case（空、最大、错误恢复）

❌ 不要：
- 在 prompt 里说 "use TypeScript types"——多家不理解
- 假设 strict mode 默认开启
- 把 schema 写在 docstring 风格的注释里
```

---

## Part 4: Schema 能做与不能做

### Anthropic Structured Outputs（strict tool use）

**Anthropic** [Structured Outputs Guide](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)：

> Structured outputs guarantee schema-compliant responses through constrained decoding: Always valid: No more JSON.parse() errors. Type safe: Guaranteed field types and required fields. Reliable: No retries needed for schema violations.

### Schema 能强制的

- 字段存在性（`required`）
- 字段类型（`string` / `integer` / `number` / `boolean` / `array` / `object` / `null`）
- 嵌套结构层级
- 枚举值（`"enum": ["a", "b", "c"]`）和常量（`"const": "value"`）
- 字符串格式：`date` / `date-time` / `time` / `duration` / `email` / `hostname` / `uri` / `ipv4` / `ipv6` / `uuid`
- 简单正则 `pattern`（支持 `*` `+` `?` 简单 `{n,m}`、字符类 `\d \w \s`、分组 `(...)`）
- 类型组合 `anyOf` / `allOf`（`allOf` 不能配合 `$ref`）

### Schema **管不了**的

- **数组里覆盖了哪些输入 ID**（语义级覆盖）——schema 能强制 `array.length > 0`，但不能强制"必须出现 `id_X`"
- **跨字段一致性**——`A.x == B.y`、`shots.dialogue_refs ⊇ inputs.dialogue_ids`
- **数值的业务合理性**——可以约束 `0 < x < 100` 但不能约束 "x 跟前面 input 算出来一致"
- **输出风格 / 语气 / 长度（语义层面）**

### Anthropic 完整限制表（2026-05 verified）

| 限制类型 | 具体内容 |
|---------|---------|
| **数组长度** | `minItems` 仅支持 0/1；`maxItems` 不支持 |
| **数值约束** | 不支持 `minimum` / `maximum` / `multipleOf` |
| **字符串约束** | 不支持 `minLength` / `maxLength`；`pattern` 不支持 backreference / lookahead / `\b` / 复杂 `{n,m}` |
| **结构约束** | 不支持 recursive schema、external `$ref`（`http://...`）、enum 内含复杂类型；`allOf` 不能配合 `$ref` |
| **`additionalProperties`** | 只支持 `false`（不支持其他值） |
| **每请求 strict 工具** | 最多 **20 个**（超出报错） |
| **可选参数总数** | 跨所有 strict schema 累计 ≤ **24 个** |
| **union 类型参数** | 跨所有参数使用 `anyOf` / 类型数组累计 ≤ **16 个** |
| **首次编译延迟** | 第一次用某 schema 有 grammar 编译延迟 |
| **编译超时** | **180 秒** 超时报错 |
| **缓存** | 编译后 grammar **24 小时缓存**；schema 改动或 tool 集变化会失效 |
| **HIPAA / PHI 警告** | Schema definitions **不能含 PHI**——schema 缓存机制不提供与 prompt 相同的保护 |

**SDK 自动行为**：Python / TS / Ruby / PHP SDK 会自动剥离不支持的约束（如 `minimum`），把它们写入 description（"Must be at least 100"），同时在响应阶段对**原始 schema** 做客户端校验。

### 解法：三层叠加

```text
Layer 1: Schema → 字段存在 / 类型 / 枚举
Layer 2: Self-audit 字段 → 模型自己列出"我做了什么"（语义级）
Layer 3: Verifier（程序化）→ 交叉一致性 / 业务合理性
```

例：保证 dialogue 全覆盖

```text
Schema 层：
- shots: array
- shots[].dialogue_refs: array of string
- coverage_audit: object (required)
- coverage_audit.uncovered_ids: array (required)

Self-audit 层（prompt 强制要求）：
- 模型必须填 all_input_ids / covered_ids / uncovered_ids
- uncovered_ids 必须为 []

Verifier 层（pipeline 代码）：
- 程序读取 input.dialogue_ids（真值）
- 程序读取 output.shots[].dialogue_refs 的并集
- 对比两者，差集 = 真实漏判
- 漏判 > 0 → retry with feedback
```

---

## Part 5: Grammar-Constrained Decoding

### 终极方案

**Willard, B. T. & Louf, R. (2023)** *Efficient Guided Generation for Large Language Models* · [arXiv:2307.09702](https://arxiv.org/abs/2307.09702)

核心思想：把 schema 编译成有限状态机（FSM），在 decode 时**只允许模型选择 schema 合规的 token**。模型不再"被劝说"要合规，而是**只能**合规。

### 开源实现

- **[Outlines](https://github.com/outlines-dev/outlines)** — Willard & Louf 的官方实现，支持 Qwen / DeepSeek 等开源模型
- **xgrammar** — NVIDIA 出，性能更优
- **jsonformer** — 早期实现，思路一致

### 何时用

| 场景 | Grammar-constrained？ |
|------|---------------------|
| 调用闭源 API（Claude / GPT / Qwen / DS / GLM 商用版） | ❌ 不可用（没 logits 访问）；用 strict mode |
| 自建推理（开源模型 + GPU） | ✅ 推荐——尤其 schema 严格、漏判代价大 |
| Prototype 阶段 | ❌ 工程成本高 |
| Production scale 严格场景 | ✅ 终极方案 |

### Anthropic strict tool use 的本质

Anthropic 的 `strict: true` 就是 Grammar-constrained decoding 的托管版——他们后台编译 schema 成 FSM，开发者只需要传 schema。本质等价于 Outlines 的工作方式。

---

## Part 6: Retry-with-Feedback Pattern

如果不能 grammar-constrained，**retry-with-feedback** 是性价比最高的兜底。

### 流程

```text
1. LLM 生成第一版输出
2. Verifier（代码）检查
3. 失败 → 把 verifier 报错信息 + 第一版输出 喂回 LLM，要求 patch
4. 重试 1-2 次
5. 仍失败 → 上层兜底（人工 / 降级）
```

### 实战 prompt

```text
Your previous output had these issues:

{verifier_errors}

Original output:
{previous_output}

Please patch the output to fix these issues.
Return ONLY the corrected JSON.
```

### 成本 vs 收益

- 多 1 次 API call（成本可接受）
- 漏判率从 ~10% 降到 < 1%（实测可观）
- 不需要改 prompt 主体，可叠加其他方案

---

## Part 7: 实战 checklist

### 长上下文 prompt

- [ ] 大块输入数据放 prompt **顶部**（角色定位之后）
- [ ] 输入数据用 XML 标签包裹（不是裸 JSON 代码块）
- [ ] 任务指令在输入数据**之后**
- [ ] 关键硬约束在 `<final_reminder>` 里末尾重复一次
- [ ] 复杂任务先让模型 quote 关键信息再处理
- [ ] 超过 ~20k token 考虑拆分 / chunking

### Prompt Caching

- [ ] 静态内容（tools / system / 示例）放最前面
- [ ] `cache_control` 放在最后一个**不变的** block，不要放变化的（如时间戳）
- [ ] 检查长度是否达最小缓存门槛（Opus = 4096 tok，Sonnet = 1024 tok）
- [ ] Multi-turn 对话用 automatic caching；增长型超 20 block 时加第二个 breakpoint
- [ ] 高频场景考虑预热（`max_tokens=0` fire 一次）
- [ ] 检查 response 的 `cache_read_input_tokens` 验证命中

### JSON / 结构化输出

- [ ] prompt 含 "json" 或 "JSON" 关键词（OpenAI / DeepSeek / 阿里云必需）
- [ ] **不要**设小的 max_tokens（阿里云会截断 JSON）
- [ ] 提供 1-2 个完整 input → output 示例
- [ ] 输出 schema 用 JSON 注释格式给（跨厂商通用）
- [ ] 包含 edge case 示例

### Schema 设计

- [ ] 字段存在性、类型、枚举用 schema 管
- [ ] 语义级覆盖（覆盖了哪些 ID）用 self-audit 字段
- [ ] 跨字段一致性用 verifier 程序化校验
- [ ] Anthropic：注意 `minItems` 限 0/1，没有数值约束

### Production-grade

- [ ] 闭源 API：开 strict mode（Anthropic / OpenAI）
- [ ] 开源 + 自建：考虑 Outlines / xgrammar
- [ ] 不论哪种：retry-with-feedback 作为兜底
- [ ] 输出走 verifier，verifier 失败的 case 收集做 eval set

## 触发时机

- 输入大块文档 / JSON / 代码 进 prompt
- 需要严格 JSON / schema 输出
- 跨多家模型部署同一 prompt
- 出现 "模型漏读 / 漏判 / 偶发不合规" 问题

## 引用

### 学术

- Liu, N. F. et al. (2023) [Lost in the Middle](https://arxiv.org/abs/2307.03172) · TACL 2024
- Willard, B. T. & Louf, R. (2023) [Efficient Guided Generation](https://arxiv.org/abs/2307.09702) · Outlines 底层

### Anthropic

- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide)

### OpenAI

- [GPT-5 Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide)
- [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)

### Google

- [Gemini API · Prompting strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)

### 中国厂商

- [DeepSeek JSON Output](https://api-docs.deepseek.com/guides/json_mode)
- [阿里云百炼 JSON Mode](https://help.aliyun.com/zh/model-studio/json-mode)
- [智谱 BigModel API](https://docs.bigmodel.cn/api-reference/)

### 站内

- [核心原则](./foundations) · [模型差异与新参数](./model-specifics) · [Prompt vs 工程约束](./prompt-vs-code)

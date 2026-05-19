---
name: prompt-engineering-foundations
description: 10 条跨厂商共识的 prompt 工程核心原则，每条配 Anthropic / OpenAI 官方原文与学术引用
when_to_use: 想理解"为什么这样写 prompt"；做 prompt 评审时对照硬证据；新人入门读一遍
related: [./writing-rules, ./long-context-and-structured-output, ./skill-authoring]
stage: method
---

# 核心原则

> 10 条跨厂商共识 + 学术证据的 prompt 工程原则。每条都配上游引用——不是"我们觉得"，而是 Anthropic / OpenAI / Liu 2023 等都明确建议。

## 为什么是这 10 条

筛选标准：

1. **跨厂商共识**——至少 Anthropic 和 OpenAI 官方文档都明确建议
2. **有学术证据**——优先选有 paper 支撑、有量化数据的（U-curve、coverage 等）
3. **model-agnostic**——Claude / GPT / Qwen / DeepSeek / GLM 都适用
4. **可验证**——能写进 checklist 让别人对照

不收录的：纯主观风格偏好、单厂商特有用法、过时的（如 GPT-3 era 的"step by step"prompting）。

## 概览表

| # | 原则 | 一句话 | 主要来源 |
|---|------|--------|---------|
| 1 | 数据在上，指令在下 | 长输入放 prompt 顶部，任务在末尾或两端 | Anthropic / OpenAI / Liu 2023 |
| 2 | 用 XML 标签结构化 | 不要裸 markdown + JSON 代码块混着 | Anthropic / OpenAI |
| 3 | Be clear and direct | 同事看不懂、模型也看不懂 | Anthropic |
| 4 | Tell what to do, not what not to do | 正向表述比禁令更可靠 | Anthropic |
| 5 | 规则配 why，不只配 what | 给出原因，模型在边界情况能正确外推 | Anthropic |
| 6 | Few-shot 示例 3-5 个，用 `<example>` 包裹 | 例子比解释强 | Anthropic / OpenAI |
| 7 | 显式 Chain-of-Thought + 结构化包裹 | `<thinking>` / `<answer>` 分离推理与输出 | Anthropic / OpenAI |
| 8 | Schema-first 强制约束，不靠 prompt 措辞 | 能用 strict mode / grammar 就别靠"必须" | Anthropic / OpenAI / Willard 2023 |
| 9 | 不要混入相互矛盾的指令 | 4.7 / GPT-5 字面执行，矛盾会放大错误 | Anthropic / OpenAI |
| 10 | Production-grade 不靠驯服 prompt | Retry loop / grammar-constrained / self-audit | Willard 2023 / Anthropic |

---

## 原则 1 · 长上下文：数据置顶，指令置底（或两端皆有）

### 内容

当 prompt 总长 > ~5k token，模型对 prompt 中段的注意力显著下降——这就是 *lost-in-the-middle* 现象。指令要么放数据后面（"先看完资料再做事"），要么在数据前后各放一份（"双端覆盖"）。

### 引用

- **Anthropic** *Prompting best practices* §Long context prompting（适用于 20k+ token 输入）：*"Put longform data at the top: Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples. This can significantly improve performance across all models."* / *"Queries at the end can improve response quality by up to 30% in tests, especially with complex, multi-document inputs."*
- **Google Gemini** *Prompting strategies*：*"Supply all the context first. Place your specific instructions or questions at the very end of the prompt."*
- **Liu, N. F. et al. (2023)** *Lost in the Middle: How Language Models Use Long Contexts* · TACL 2024 · [arXiv:2307.03172](https://arxiv.org/abs/2307.03172)：U-shaped 曲线，GPT-3.5 在 20-doc 设置下中段表现可低于闭卷 56.1%。

### 反例 vs 正例

```text
差：
You are a code reviewer. Review the following code for security issues.
Report any SQL injection, XSS, ... [200 字规则]

```python
[5000 行代码]
```

正：
<task>You are a code reviewer.</task>

<code>
[5000 行代码]
</code>

<instructions>
Review the above code for: SQL injection, XSS, CSRF, ...
[200 字规则]
</instructions>
```

---

## 原则 2 · 用 XML 标签结构化，不要裸 markdown + JSON 代码块

### 内容

当 prompt 混合了**指令 + 上下文 + 示例 + 变量输入**，用 `<instructions>` / `<context>` / `<example>` / `<input>` 等 XML 标签分隔，比纯 markdown + 三反引号代码块清晰得多。模型 attention 可以显式 anchoring 到标签。

### 引用

- **Anthropic** §Structure prompts with XML tags：*"XML tags help Claude parse complex prompts unambiguously, especially when your prompt mixes instructions, context, examples, and variable inputs. Wrapping each type of content in its own tag (e.g. `<instructions>`, `<context>`, `<input>`) reduces misinterpretation. Use consistent, descriptive tag names across your prompts. Nest tags when content has a natural hierarchy (documents inside `<documents>`, each inside `<document index='n'>`)."*
- **OpenAI** *GPT-5 Prompting Guide*：推荐用 XML 规范标签如 `<[instruction]_spec>` 包裹复杂指令；Cursor 的 GPT-5 优化实践显示 "structured XML specs like `<instruction_spec>` improve instruction adherence"。
- **Google Gemini 3** *Prompting strategies*：*"Use consistent structure"* with XML/Markdown tags。

### 实操要点

- 同一份 prompt 里标签名保持一致（不要 `<input>` 和 `<inputs>` 混用）
- 有层级时用嵌套：`<documents><document index="1">...`
- 长 JSON 输入要么改写成 XML 属性、要么单独放 `<data>` 标签内
- 输出要 JSON 时，schema 写在 `<output_schema>` 标签里，再要求模型按 schema 输出

---

## 原则 3 · Be clear and direct

### 内容

> **Golden rule**：把 prompt 给一个对任务背景不熟的同事看，他能照做就过；他要追问，模型也会困惑。

具体化每一处描述。"格式类似下面"换成"对每个 section 都应用此格式，不只第一个"。

### 引用

- **Anthropic** §Be clear and direct：*"Claude responds well to clear, explicit instructions. Being specific about your desired output can help enhance results. [...] Golden rule: Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too."*
- **Anthropic** *Claude Opus 4.7* §More literal instruction following：*"It will not silently generalize an instruction from one item to another, and it will not infer requests you didn't make."*

### 反例 vs 正例

| 差 | 好 |
|----|----|
| 格式成类似下面 | 对每个 section 都应用此格式，不只第一个 |
| 处理一下 edge case | 当输入为空数组时返回 `{ status: "empty" }`；当输入超过 100 项时取前 100 项 |
| 写得专业一点 | 用第三人称、不用感叹号、每段不超过 3 句 |

---

## 原则 4 · Tell what to do, not what not to do

### 内容

正向描述比禁令更可靠。"不要 X" 会让模型把注意力放在 X 上、可能反向触发；"做 Y" 给出明确动作。

### 引用

- **Anthropic** §Control the format of responses：*"Tell Claude what to do instead of what not to do. Positive examples tend to be more effective."*

### 反例 vs 正例

| 差 | 好 |
|----|----|
| 不要用 markdown | 用连贯的段落散文 |
| 不要写 "Excited to announce" | 首句必须是 hook：问题 / 反直觉观察 / 具体数字 |
| 禁止 hype 词 | 用具体名词代替形容词（"3 倍速度" 而非 "极快"） |

**例外**：当"禁止 + 列表"有具体取舍价值时可以保留，但最好同时给出替代写法（"不要 X，改为 Y"）。

---

## 原则 5 · 规则配 why，不只配 what

### 内容

给出原因，模型能在边界情况上做正确外推。Anthropic 原话："Claude is smart enough to generalize from the explanation."

### 引用

- **Anthropic** §Be clear and direct 官方例子：

```text
差：NEVER use ellipses

好：Your response will be read aloud by a text-to-speech engine,
    so never use ellipses since the text-to-speech engine will
    not know how to pronounce them.
```

### 注意：是"当前 why"，不是"历史 why"

| 类型 | 写不写 | 例子 |
|------|--------|------|
| **当前约束 / 风险** | ✅ 写 | "禁止编造 name 字段——下游 deploy 步骤会用此名做 DNS 解析" |
| **历史演进** | ❌ 不写 | "之前用 v1 API 现在改 v2"（参见 [写作规范 / 不写历史演进](./writing-rules#不写历史演进)） |

---

## 原则 6 · Few-shot 示例 3-5 个，用 `<example>` 包裹

### 内容

例子比规则强。3-5 个示例是 Anthropic 实测最佳区间；放在任务说明**之前**，让模型先看模式再读指令。

### 引用

- **Anthropic** §Use examples effectively：*"Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. [...] Wrap examples in `<example>` tags (multiple examples in `<examples>` tags) so Claude can distinguish them from instructions. Include 3–5 examples for best results."*
- **OpenAI** *Prompt guidance*：*"Few-shot learning lets you steer a large language model toward a new task by including a handful of input/output examples in the prompt."*

### 实操要点

- 必须包含 **edge case 示例**（空输入、最大输入、容易误判的输入）
- 示例 input + expected output 都要完整，不要省略中间步骤
- 示例放 `<examples>` 标签里，每个示例 `<example name="...">`
- 不要超过 5 个——更多反而稀释模式

```xml
<examples>
  <example name="empty input">
    <input>[]</input>
    <output>{"status": "empty", "items": []}</output>
  </example>
  <example name="single item">
    <input>[{"id": 1}]</input>
    <output>{"status": "ok", "items": [{"id": 1, "processed": true}]}</output>
  </example>
  <example name="over-limit edge case">
    <input>[/* 150 items */]</input>
    <output>{"status": "truncated", "items": [/* first 100 */]}</output>
  </example>
</examples>
```

---

## 原则 7 · 显式 Chain-of-Thought + 结构化包裹

### 内容

要求模型推理时，用 `<thinking>` / `<reasoning_steps>` 显式包裹，并在输出最终答案**之前**。结构化的 CoT（而非自由形式）能让推理被验证、被复用。

### 引用

- **Anthropic** §Manual CoT as a fallback：*"When thinking is off, you can still encourage step-by-step reasoning by asking Claude to think through the problem. Use structured tags like `<thinking>` and `<answer>` to cleanly separate reasoning from the final output."*
- **Anthropic** §Ask Claude to self-check：*"Append something like 'Before you finish, verify your answer against [test criteria].' This catches errors reliably, especially for coding and math."*
- **OpenAI** *GPT-5 Prompting Guide* §Coverage & Completeness：*"Decomposition: Break user queries into all required sub-requests before execution. Verification: Confirm that each is completed before yielding control."*

### 实操要点

不只是 `"先思考再回答"`——把推理本身结构化：

```json
"reasoning_steps": {
  "inventory": [/* 先列出所有需要处理的元素 ID */],
  "plan_per_element": [/* 每个元素准备怎么处理 */],
  "coverage_check": "Every ID in inventory appears in plan_per_element. Confirmed."
}
```

这样推理变成 **proof-of-coverage**：任何遗漏肉眼可见、verifier 可自动检查。

---

## 原则 8 · Schema-first 强制约束，不靠 prompt 措辞

### 内容

能用 schema / strict mode / grammar-constrained decoding 解决的约束，不要靠 prompt 措辞。"必须输出 JSON" 不如直接开 JSON mode；"必须 5 个字段" 不如 schema 加 required。

### 引用

- **Anthropic** *Structured Outputs (strict tool use)*：*"When you set `strict: true` on a tool, Claude's output is constrained by a compiled grammar that enforces the JSON schema [...] Valid JSON syntax, all required fields present, correct data types, no extra properties."*
- **OpenAI** *Structured Outputs*：`json_schema` + `strict: true` 提供 100% schema 合规。
- **Willard, B. T. & Louf, R. (2023)** *Efficient Guided Generation for Large Language Models* · [arXiv:2307.09702](https://arxiv.org/abs/2307.09702)：Outlines 库底层，token-level FSM 约束，"adds little overhead [...] significantly outperforms existing solutions"。

### Schema 能做 / 不能做

| Schema 能强制的 | Schema 管不了的 |
|----------------|----------------|
| 字段存在性、类型、嵌套结构 | 数组里覆盖了**哪些**输入 ID（语义级覆盖） |
| 枚举值范围、`const` 常量 | 跨字段一致性（A.x 必须等于 B.y） |
| 必填 vs 可选 | 数值 / 字符串长度范围（Anthropic 不支持 min/max） |
| 字符串格式（date / email / uri / uuid 等） | 数组长度（Anthropic `minItems` 只支持 0/1） |

**结论**：硬约束分三层叠加——schema（字段存在）+ self-audit 字段（让模型自己列出覆盖情况）+ verifier（程序化交叉检查）。三层都要才能挡住所有漏。完整 Anthropic 限制表见 [长上下文与结构化输出 / Schema 限制](./long-context-and-structured-output#anthropic-schema-限制精确版)。

> **重要变化**：从 Claude 4.6 开始 prefill assistant message 已**不再支持**（返回 400）。以前靠 prefill 强制输出格式的代码，要迁移到 Structured Outputs 或在 system prompt 里直接指令。

---

## 原则 9 · 不要混入相互矛盾的指令

### 内容

Claude 4.7 / GPT-5 都是 **字面执行型**——它们不会自动调和矛盾，而是会被矛盾困住、推理 token 浪费在反复 second-guessing。

### 引用

- **OpenAI** *GPT-5 Prompting Guide* §Contradiction avoidance：*"Poorly-constructed prompts containing contradictory or vague instructions can be more damaging to GPT-5 than to other models."* GPT-5 "follows prompt instructions with surgical precision"，矛盾会让推理 token 浪费在反复 second-guessing。
- **Anthropic** *Prompting Claude Opus 4.7* §More literal instruction following：*"Claude Opus 4.7 interprets prompts more literally and explicitly than Claude Opus 4.6, particularly at lower effort levels. It will not silently generalize an instruction from one item to another, and it will not infer requests you didn't make."*

### 常见矛盾模式

| 矛盾类型 | 例子 |
|---------|------|
| **数学冲突** | "生成 18-25 个 shots" + "每个 shot 5-8 秒" + "总时长 60-90 秒"（数学上要么 18-25，要么 5-8s，不能同时） |
| **优先级未明** | "永远征得用户确认" + "紧急情况自动执行"（没说哪个先） |
| **软硬指令混用** | "对白必须全部引用" + "小动作可酌情省略"（模型可能把对白当动作类比） |
| **重复软指令** | 同一条规则在 prompt 里说 3 次但都是"应该 / 建议"——不如说一次"MUST" |

### 修法

1. 数学冲突：用一个变量定义所有约束（"生成 N 个 shots，N 满足 18 ≤ N ≤ 25 且 N × 5 ≤ 总时长 ≤ N × 8"）
2. 优先级冲突：显式 hierarchy（"紧急情况覆盖征得确认"）
3. 重复软指令：替换为单一硬指令 + 结构化 self-audit 字段

---

## 原则 10 · Production-grade 不靠驯服 prompt

### 内容

到 production 阶段，把"模型是否听话"从概率事件变成确定性事件。三条路径：

1. **Retry loop with feedback**：verifier 失败时把错误信息喂回模型，重试 1-2 次
2. **Grammar-constrained decoding**：token-level FSM 约束（Outlines / xgrammar / Anthropic strict tool use）
3. **Self-audit 字段 + 程序化校验**：模型自己列出"我做了什么"，程序对照原始输入

### 引用

- **Willard & Louf 2023** *Efficient Guided Generation*：token-level FSM 约束，开源实现 [Outlines](https://github.com/outlines-dev/outlines)
- **Anthropic** §Chain complex prompts：*"The most common chaining pattern is self-correction: generate a draft → have Claude review it against criteria → have Claude refine based on the review. Each step is a separate API call so you can log, evaluate, or branch at any point."*
- **OpenAI** *Structured Outputs*：`strict: true` + JSON Schema → 100% conformance。

### 选型表

| 方案 | 上行 | 下行 | 何时用 |
|------|------|------|--------|
| Retry loop | 不动 prompt、可叠加其他方案 | 多 1 次 API call 成本 | 漏判率 < 5%、想快速止血 |
| Self-audit + verifier | 不需要 logits 访问、跨厂商通用 | 还是有概率漏（极小） | 跨厂商部署、不能锁死单家 |
| Strict mode / Structured Outputs | 100% schema 合规 | 不解决 cross-field 约束 | 单厂商部署、字段约束明确 |
| Grammar-constrained decoding | 终极方案 | 工程成本大、需 logits 访问 | 自建推理、schema 极严 |

---

## 一句话总结

> **写 prompt = 数据置顶 + XML 结构 + 正向表述 + Few-shot + 结构化 CoT + Schema 兜底 + 矛盾清零**——这是跨厂商共识的"骨架"。剩下的是看场景调味。

## 引用列表

### 厂商官方文档

- Anthropic — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)（覆盖 Claude Opus 4.7 / Sonnet 4.6 / Haiku 4.5）
- Anthropic — [Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Anthropic — [Structured Outputs and strict tool use](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- OpenAI — [GPT-5 Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide)
- OpenAI — [Prompt guidance](https://developers.openai.com/api/docs/guides/prompt-guidance)
- Google — [Gemini API · Prompting strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)
- Anthropic — [Migration guide (Claude 4.7 / 4.6)](https://platform.claude.com/docs/en/about-claude/models/migration-guide)

### 学术论文

- Liu, N. F. et al. (2023) — *Lost in the Middle: How Language Models Use Long Contexts* · [arXiv:2307.03172](https://arxiv.org/abs/2307.03172) · TACL 2024
- Willard, B. T. & Louf, R. (2023) — *Efficient Guided Generation for Large Language Models* · [arXiv:2307.09702](https://arxiv.org/abs/2307.09702) · Outlines 库底层

### 国内厂商 JSON Mode 文档

- 阿里云百炼 — [结构化输出（JSON Mode）](https://help.aliyun.com/zh/model-studio/json-mode)
- DeepSeek — [JSON Output Guide](https://api-docs.deepseek.com/guides/json_mode)
- 智谱 BigModel — [GLM API Reference](https://docs.bigmodel.cn/api-reference/)

### 站内交叉引用

- [写作规范](./writing-rules) — 文字层面的具体规则
- [SKILL.md 作者指南](./skill-authoring) — Skill 专题
- [长上下文与结构化输出](./long-context-and-structured-output) — 各厂商 JSON quirks
- [Prompt vs 工程约束](./prompt-vs-code) — 哪些"必须"该写进代码
- [Harness / Context 设计](../harness/context-design) — CLAUDE.md 设计

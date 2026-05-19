---
name: prompt-engineering
description: Prompt 工程方法论总览。面向 Agent Harness 与 Skill 设计的通用 prompt 写作指南，整合 Anthropic / OpenAI 官方建议与学术研究
when_to_use: 写或改任何会被 LLM 读到的文本——CLAUDE.md / AGENTS.md / SKILL.md / system prompt / pipeline 注入指令 / tool description；判断 prompt 输出质量问题时回来对照
related: [./foundations, ./writing-rules, ./skill-authoring, ./long-context-and-structured-output, ./prompt-vs-code, ../harness/context-design]
stage: method
---

# Prompt Engineering

> 主要给"写 prompt 的人"看的工程指南。不重复 Anthropic / OpenAI 官方原文，但把跨厂商共识、学术证据、Agent Harness 场景下的实战约定整合成一套可对照的清单。

## 为什么单独开一章

Prompt 写作是 Agent Harness、Skill 设计、Workflow 编排的底层能力。模型默认不会写出好 prompt——它只会按训练分布给出"看起来还行"的版本。**真正可靠的 prompt 来自把官方建议、学术结论、踩坑经验对照成显式规则**，而不是凭直觉。

本章不绑定任何具体业务，所有原则来自当前主流厂商**实时**官方文档（2026-05 verified）：

- Anthropic — *Prompting best practices* / *Migration guide* / *Agent Skills best practices* / *Structured Outputs* / *Prompt caching*（含 Claude Opus 4.7 / Sonnet 4.6 / Haiku 4.5 模型特性、`effort` / `adaptive thinking` / `task_budget` 等新参数）
- OpenAI — *GPT-5 Prompting Guide*（`reasoning_effort` / `verbosity` / tool preambles / metaprompting / Responses API）
- Google — *Gemini API Prompting strategies*（Gemini 3）
- 阿里云百炼 / DeepSeek / 智谱 GLM 官方 JSON Mode 文档（含 verbatim 报错信息 + 已知问题）
- Liu et al. 2023, *Lost in the Middle*（TACL 2024）
- Willard & Louf 2023, *Efficient Guided Generation*（Outlines）

每条引用都在各章末尾标注一手来源链接。

## 阅读地图

| 章节 | 解决什么问题 | 何时读 |
|------|------------|--------|
| [核心原则](./foundations) | Prompt 工程的 10 条跨厂商共识 + 学术底座 | 入门、想理解"为什么这样写"、做评审时回来对照 |
| [通用写作规范](./writing-rules) | 文字层面怎么遣词造句、避免常见错误 | 每次写新 prompt、改旧 prompt |
| [SKILL.md 作者指南](./skill-authoring) | 写 Agent Skill 的 frontmatter / progressive disclosure / 自由度 | 写或改 `.claude/skills/*/SKILL.md` |
| [长上下文 + 结构化 + Caching](./long-context-and-structured-output) | 长文档喂模型、JSON / schema 输出、prompt caching、各厂商 quirks | 输入 > 10k token、需要 JSON 输出、跨多家模型部署 |
| [模型差异与新参数](./model-specifics) | Claude 4.7 / GPT-5 / Gemini 3 各自的特殊行为与 effort / reasoning_effort / verbosity 等 | 升级模型、跨厂商部署、prompt 在新模型上行为变了 |
| [Prompt vs 工程约束](./prompt-vs-code) | 哪些"必须"该写进 prompt、哪些该写进代码 | 设计 pipeline 时、prompt 已堆满"必须"还是出错时 |

## 与本站其他章节的关系

- **[Harness / Context 设计](../harness/context-design)** 讲 `CLAUDE.md` 是什么、放什么；本章讲 **怎么遣词造句** 才能让模型听话。两者互补：先决定写什么（context-design），再决定怎么写（本章）。
- **[Harness / 自进化](../harness/self-evolution)** 讲怎么从失败中迭代 prompt 规则；本章是迭代时的对照标尺。
- **[Skills 知识中枢](../skills/)** 评测的是别人写的 Skill；本章是你**自己写**新 Skill 时的指南。

## 触发时机（什么时候回来看）

- 写新 prompt / 新 Skill / 新 CLAUDE.md 前
- LLM 输出质量出问题，先怀疑 prompt 不是模型——回到 [核心原则](./foundations) 对照
- pipeline 里 prompt 越堆越长越不听话——读 [Prompt vs 工程约束](./prompt-vs-code)
- 长文档喂进去模型漏读中段——读 [长上下文](./long-context-and-structured-output)
- 跨厂商部署同一 prompt 表现差异大——读 [长上下文](./long-context-and-structured-output) 末尾的 quirks 章节

## 一句话总结

> **Prompt 是给一个聪明但字面执行的同事写的工作交接单**——他不读你的过往邮件、不知道项目历史、不会替你脑补隐含意图，但你写下的每个字他都会认真当真。

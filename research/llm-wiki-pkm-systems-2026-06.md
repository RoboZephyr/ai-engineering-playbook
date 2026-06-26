---
name: llm-wiki-pkm-systems-2026-06
description: LLM Wiki / Obsidian / PKM / RAG / Agent memory 系统的事实快照（定义、能力、版本、采用现状、来源）
date: 2026-06-26
when_to_use: 想查清"截至 2026-06，LLM Wiki、Obsidian、Logseq、Foam、Dendron、Anytype、各类 RAG、agent memory 框架分别是什么、谁提出、采用到什么程度"
related: [/harness/llm-wiki, /harness/knowledge-system, /research/loop-engineering-2026-06]
stage: reference
layer: L3
---

# LLM Wiki / PKM / RAG / Agent memory 系统快照（2026-06）

::: warning Snapshot
这是 2026-06-26 的事实快照，**只放事实**（定义、能力、版本、采用现状、来源）。方法论、选型判断、落地路线在 L1 文档 [LLM Wiki：让 agent 编译并维护的知识库](/harness/llm-wiki)。
:::

## "LLM Wiki" 已是一个有定义的范式

早期判断 "`LLM-Wiki` 不是统一名词" 已**过时**。事实更正：

- **2026-04，Andrej Karpathy** 在一篇 gist 里把 "LLM Wiki" 定义成具体范式，几天内在开发者圈走红。核心定义：LLM **incrementally builds and maintains a persistent wiki**——一套结构化、互链的 markdown 文件，夹在用户和原始资料之间；"the wiki is a persistent, compounding artifact"。与 RAG 的区别在于 RAG 每次 query 从零检索、无积累，LLM Wiki 把知识 compile 一次后持续维护。
- **三层结构**（Karpathy）：raw sources（不可变）/ wiki（LLM 维护）/ schema（配置）。配套 append-only changelog、lint 健康检查、用 Obsidian 当浏览 IDE。Karpathy 类比 Vannevar Bush 1945 年的 Memex。
- **生态**：官方实现 `llm-wiki.net`（Claude Code 插件 / Codex 插件 / OpenCode SKILL.md / 可移植 AGENTS.md）；开源实现含 `nashsu/llm_wiki`（桌面应用）、`SamurAIGPT/llm-wiki-agent`、`Pratiyush/llm-wiki` 等。

`llm-wiki.net` 的工程化形态（事实）：

| 维度 | 内容 |
|---|---|
| 目录 | `raw/`（不可变源）+ `wiki/`（编译文章）+ `inventory/` + `datasets/` + `output/` + `.sessions/`（会话记忆） |
| 链接 | `[[wikilink]]`（Obsidian）+ 标准 markdown 链接双格式 |
| 命令 | `/wiki:research`（5–10 agent 并行检索）、`/wiki:ingest`、`/wiki:compile`（带 confidence 分数）、`/wiki:query`、`/wiki:output`、`/wiki:audit`（输出追溯回源） |
| 部署 | Claude Code 插件 / Codex 插件 / OpenCode 指令文件 / 可移植 AGENTS.md |

## PKM 应用系统对照

| 系统 | 核心范式 | 强项 | 适合学什么 | 不适合直接照搬 |
|---|---|---|---|---|
| **Obsidian** | 本地 Markdown vault + 双链 + 插件 | 生态最大、文件可控、双链/图谱/Canvas/Bases 完整 | 个人/团队知识库的 UI 和信息架构 | 插件过多会变成不可复现系统 |
| **Logseq** | outliner + block graph | 日志流、block-level 思考、隐私优先/open-source | daily note、block reference、渐进式整理 | 长文档和工程化发布不如文件树直观 |
| **Foam** | VS Code + GitHub + Markdown | 开发者友好、Git 工作流、CLI/graph/backlink | 把知识库当代码库管理 | 普通用户编辑体验不如 Obsidian |
| **Dendron** | hierarchical Markdown + schema + refactor | 大规模层级知识库、schema、rename/refactor | 公司级/工程级知识空间的命名和重构 | 项目活跃度和产品体验需单独评估 |
| **Anytype** | local-first object graph | 对象、关系、集合、隐私和跨端体验 | "Notion 数据库 + 本地优先 + graph"的产品形态 | 非纯 Markdown，Agent/代码工具链消费成本更高 |
| **GraphRAG** | LLM 抽取结构化图谱 + RAG | 从非结构文本提取 entities/relations/community summaries | 大 corpus 的结构化检索和全局问题回答 | 成本高；不替代人工维护的知识边界 |

### Obsidian 关键原语

| 原语 | Obsidian 的形态 | 知识系统里的对应物 |
|---|---|---|
| Vault | 一个本地 Markdown 知识库 | corpus / workspace / agent memory root |
| Note | Markdown 文件 | atomic knowledge unit |
| Link / Backlink | `[[note]]` 双链 | explicit graph edge |
| Graph | 可视化关系网络 | retrieval graph / topic map |
| Canvas | 空间化研究、脑暴、图解 | planning board / reasoning map |
| Properties | frontmatter 元数据 | typed metadata for filtering |
| Bases | 基于属性的数据库视图 | structured views over notes |
| Plugins | 扩展生态 | ingestion / automation / AI adapters |
| Sync / Publish | 多端同步和发布 | private knowledge base / public wiki split |

Obsidian 官方主页强调 links、graph、canvas、plugins，使用场景覆盖 personal notes、journaling、knowledge bases、project management；Help 站点已有 Bases 文档入口，表明其正往"Markdown 文件 + 查询视图 + 本地数据库体验"演进。

## PKM 方法论清单 {#pkm-methodology}

| 方法 | 提出者 | 核心主张 |
|---|---|---|
| **Zettelkasten（卡片盒）** | Niklas Luhmann | 成千上万张原子卡片，彼此密集链接，想法在长期迭代中生长 |
| **Evergreen notes** | Andy Matuschak | 笔记要 atomic、concept-oriented、densely linked，并持续重写 |
| **Atomic notes** | （同上） | 一个笔记只 "about" 一件事才能复用，类比 separation of concerns |
| **MOC / LYT** | Nick Milo | 用 Map of Content 做高层导航，而非纯文件夹 |
| **PARA** | Tiago Forte | Projects / Areas / Resources / Archives 组织行动型知识；项目归档时知识易被一起埋掉 |
| **Digital garden** | 社区 | 公开、持续生长、非线性的知识花园 |

## 检索：RAG 谱系 {#retrieval}

| 方案 | 机制 | 何时用 | 代价 |
|---|---|---|---|
| **Vector RAG** | chunk → embedding → 相似度检索 | 大规模非结构化语料、要快 | 易丢文档级上下文 |
| **GraphRAG**（Microsoft） | LLM 抽 entities/relations/community summaries | 跨文档关系推理、全局性问题 | 索引成本高 |
| **LightRAG** | 索引实体 + 关系但保持轻量 | 想要图的好处又不想付 GraphRAG 成本 | 折中 |
| **HybridRAG** | 向量召回 + 图扩展 + reranking | 生产标配；faithfulness/relevancy 最稳 | 工程复杂度高 |

两个工程技巧（事实）：

- **Contextual Retrieval（Anthropic, 2024）**：embedding 前给每个 chunk 加 50–100 token 的上下文头（说明该 chunk 在原文里讲什么），可把检索失败率平均降约 35%、配合 reranking 最高降约 67%。
- **Reranking（cross-encoder）**：召回后用更强模型对候选重排，是 hybrid pipeline 的关键最后一步。

## Agent memory 框架 {#agent-memory}

| 框架 | 模型 | 特点 |
|---|---|---|
| **Letta（前 MemGPT）** | OS 式分层：core（≈RAM，常驻上下文）/ archival（≈磁盘，向量库）/ recall（对话历史） | 完整 agent runtime |
| **Mem0** | user / session / agent 三作用域，向量 + 图 + KV 混合；事实冲突时自编辑去重 | 轻量，挂在现有框架上；GitHub 48k+ star、$24M A 轮 |
| **Zep / Graphiti** | 时序知识图谱 | 强在时间维度查询 |
| **LangMem** | LangChain 原生 memory SDK | 生态集成 |

Letta 自家 benchmark 在讨论"filesystem 是否就是足够好的 agent memory"。2025 年 agent memory 基础设施市场约 63 亿美元规模。

## 接入与发布

- **MCP（Model Context Protocol）**：已有多个 Obsidian MCP server，暴露 `search_vault` / `create_vault_file` 等工具，比"把 agent 直接指向目录"更可靠。风险：给 LLM 开整个 vault 的读写删权限，存在数据破坏和外泄风险。
- **llms.txt**：Jeremy Howard（Answer.AI）于 2024-09 提出。采用现状：截至 2025 年中仅约 951 个域名发布；Google 明确拒绝（类比已废弃的 keywords meta tag），主流 AI 爬虫基本不读；但 Mintlify 于 2025-11 给所有托管文档站默认开启后，Anthropic、Cursor 等大量 docs 站开始支持。多数站点实施后未见可测流量变化。

## Sources

### LLM Wiki 范式

- [Karpathy — LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — 范式原始定义：compile-not-retrieve、raw/wiki/schema 三层、Memex 类比。
- [llm-wiki.net](https://llm-wiki.net/) — 官方实现：命令集、目录结构、多 agent 部署。
- [nashsu/llm_wiki](https://github.com/nashsu/llm_wiki)、[SamurAIGPT/llm-wiki-agent](https://github.com/SamurAIGPT/llm-wiki-agent) — 开源实现参照。

### PKM 方法论与应用系统

- [Andy Matuschak — Evergreen notes](https://notes.andymatuschak.org/Evergreen_notes) / [Evergreen notes should be atomic](https://notes.andymatuschak.org/Evergreen_notes_should_be_atomic) — atomic / concept-oriented / densely linked 原则。
- [Obsidian official site](https://obsidian.md/) — links、graph、canvas、plugins、knowledge bases、project management。
- [Obsidian Help](https://help.obsidian.md/) — 官方帮助站，含 Bases 文档入口。
- [Logseq](https://logseq.com/) — privacy-first、open-source 定位。
- [Foam docs](https://foambubble.github.io/foam/) — VS Code + GitHub + Markdown PKM。
- [Dendron wiki](https://wiki.dendron.so/) — local-first、hierarchical、schema / lookup / refactor。
- [Anytype](https://anytype.io/) — local-first / object graph / database-like PKM。

### 检索

- [Anthropic — Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) — chunk 加上下文头，检索失败率降 35–67%。
- [Microsoft GraphRAG](https://github.com/microsoft/graphrag) — graph-based RAG 与知识图谱记忆结构。
- [VectorRAG vs GraphRAG vs LightRAG](https://www.ragdollai.io/blog/vectorrag-vs-graphrag-vs-lightrag) — 谱系与选型；HybridRAG = 向量召回 + 图扩展 + reranking。

### Agent memory / 接入

- [Letta — Benchmarking AI Agent Memory](https://www.letta.com/blog/benchmarking-ai-agent-memory/) — OS 式分层 memory；"filesystem 是否足够"的讨论。
- [Mem0 — State of AI Agent Memory 2026](https://mem0.ai/blog/state-of-ai-agent-memory-2026) — Mem0/Letta/Zep/LangMem 谱系与 benchmark。
- [Obsidian MCP server（aaronsb/obsidian-mcp-plugin）](https://github.com/aaronsb/obsidian-mcp-plugin) — 通过 MCP 让 agent 读写 vault；权限与安全风险。
- [llms.txt 采用现状](https://llms-txt.io/blog/is-llms-txt-dead) — llms.txt 提案与 2025 采用情况。

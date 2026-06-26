---
name: llm-wiki-pkm-systems-2026-06
description: LLM Wiki（Karpathy 范式：compile-not-retrieve）/ Obsidian / PKM 系统事实快照与学习路线
date: 2026-06-26
when_to_use: 想系统理解 LLM-Wiki、Obsidian、Logseq、Foam、Dendron、Anytype 这类知识系统如何构成；为 Agent 知识库 / AI wiki / RAG 文档系统做选型
related: [/harness/knowledge-system, /harness/context-design, /research/loop-engineering-2026-06]
stage: reference
layer: L3
---

# LLM-Wiki / Obsidian / PKM 系统快照（2026-06）

::: warning Snapshot
这是 2026-06-26 的事实快照和学习笔记。**更正一个早期判断**：`LLM Wiki` 已经不是"没有统一名词"——2026-04 Andrej Karpathy 用一篇 gist 把它定义成一个具体范式（agent 维护的 *compile-not-retrieve* markdown 知识库），几天内走红，并催生 `llm-wiki.net` 与多个开源实现。本文先讲这个核心范式（见下一节），再把它放回更大的 PKM / RAG / Agent memory 谱系里对照。
:::

## 先给结论

如果你想“充分理解 LLM-Wiki”，不要先把它当成一个工具名，而要把它拆成四层：

| 层 | 目标 | 成熟系统参照 | 对 Agent 的意义 |
|---|---|---|---|
| **写作层** | 人能持续写、改、整理 | Obsidian / Logseq / Foam / Dendron | 知识必须先成为稳定文本资产 |
| **结构层** | 链接、标签、属性、层级、关系 | Obsidian links/properties/Bases, Dendron hierarchy/schema, Anytype object graph | 给检索和推理提供可解释索引 |
| **检索层** | 让 LLM 找到正确上下文 | 搜索、backlinks、graph、GraphRAG | 降低长上下文浪费和幻觉 |
| **执行层** | Agent 读后能行动 | AGENTS.md / CLAUDE.md / Playbooks / Solutions | 从“知识库”升级为“操作系统” |

所以，**LLM-Wiki = 给人和 LLM 同时读的知识系统**。它不是简单把文档丢进向量库，也不是单纯装 Obsidian 插件；关键是把”人类可维护的知识结构”和”LLM 可检索、可引用、可执行的上下文结构”合并。

## 本质：LLM Wiki 是 “compile”，不是 “retrieve”

> 2026-04 Andrej Karpathy 在一篇 gist 里把 “LLM Wiki” 定义成一个具体范式，几天内在开发者圈走红，催生了 `llm-wiki.net` 及多个开源实现（nashsu/llm_wiki、SamurAIGPT/llm-wiki-agent 等）。本文最初成稿时把它当成”还没有统一名词”——这里需要更正：它已有清晰定义，而且这个定义就是理解整件事的钥匙。

传统 RAG 是**无状态**的：每次提问，LLM 都要从原始文档里现场检索、现场拼凑答案——用 Karpathy 的话说，”the LLM is rediscovering knowledge from scratch on every question. There's no accumulation.”（每次都从零重新发现知识，没有任何积累）。知识不会沉淀。

LLM Wiki 反过来：让 agent **一次性把原始资料编译成一套持续维护、互相链接的 markdown 文章**，之后提问主要读这套已编译的 wiki，而不是每次重跑检索。知识被 **compile 一次、持续保鲜**，而不是 query 时反复 re-derive。Karpathy 的原话：*”the wiki is a persistent, compounding artifact”*（wiki 是一个持久的、会复利增长的资产）。

三层模型（Karpathy）：

| 层 | 谁拥有 | 是否可变 | 作用 |
|---|---|---|---|
| **Raw sources** | 人类策展 | 不可变（append-only ingest） | 可审计的事实源 |
| **Wiki** | LLM 维护 | 持续改写 | 编译后的概念 / 实体 / 引用文章 |
| **Schema** | 配置 | 人定规则 | 告诉 agent 怎么组织、怎么维护 |

关键分工：**人负责 sourcing、探索、提对问题；LLM 负责 summarize / cross-reference / 归档 / 记账这些 grunt work。** 一条新资料进来，可能同时触碰 10–15 个 wiki 页面，agent 在一次 ingest 里完成更新实体页、标注矛盾、加强综述。配套机制：append-only changelog 记录变更、定期 lint 检查矛盾 / 孤儿页 / 缺失链接、用 Obsidian 当浏览 IDE。Karpathy 把它类比成 Vannevar Bush 1945 年的 **Memex**——个人策展、重视连接的知识网——但解决了 Memex 当年无法解决的维护问题：现在 LLM 来做维护。

`llm-wiki.net`（官方实现）把这套范式工程化成命令集：`/wiki:research`（5–10 个 agent 并行从学术 / 技术 / 应用 / 新闻 / 反方角度检索）、`/wiki:ingest`、`/wiki:compile`（合成带 confidence 分数的交叉引用文章）、`/wiki:query`、`/wiki:audit`（把输出追溯回源）。目录结构 `raw/`（不可变源）+ `wiki/`（编译文章）+ `.sessions/`（会话记忆），文章用 `[[wikilink]]` + 标准 markdown 双格式链接。可作为 Claude Code 插件 / Codex 插件 / `AGENTS.md` 落地。

::: tip 对结论的修正
原文结论 “LLM-Wiki = 给人和 LLM 同时读的知识系统” 没错，但不够锋利。更准确的本质是：**LLM Wiki = 把检索（retrieve）换成编译（compile）的、agent 维护的知识系统**。”人机共读”是它的形态，”compile 而非 retrieve”才是它和 RAG 的根本分界。
:::

对照本仓库：这正是 [`harness/knowledge-system`](/harness/knowledge-system) 里 ADR / Solution / Playbook / Reference 四载体在做的事——Karpathy 只是把”agent 主动编译并保鲜”这一步讲透了。本仓库 `research/` 带日期快照 ≈ raw layer，`harness/` 方法论文章 ≈ 编译后的 wiki layer，`CLAUDE.md` + 模板 ≈ schema layer。

## 为什么 Obsidian 值得重点学

Obsidian 是成熟 PKM 里最适合作为 LLM-Wiki 参照的系统之一，原因不是它有 AI，而是它把知识系统的关键原语做得很完整：

| 原语 | Obsidian 的形态 | LLM-Wiki 里的对应物 |
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

Obsidian 官方主页强调 links、graph、canvas、plugins，并把使用场景覆盖到 personal notes、journaling、knowledge bases、project management。Help 站点也已经有 Bases 文档入口，说明 Obsidian 不是只有“笔记”，而是在往“Markdown 文件 + 查询视图 + 本地数据库体验”演进。

## 方法论根基：为什么"原子笔记 + 链接"有效

工具只是载体，真正的本质在它们共同继承的几条 PKM 方法论。理解这些，才知道 LLM Wiki 的文章为什么要那样写：

| 方法 | 提出者 | 核心主张 | 对 LLM Wiki 的意义 |
|---|---|---|---|
| **Zettelkasten（卡片盒）** | Niklas Luhmann | 成千上万张原子卡片，彼此密集链接，想法在长期迭代中生长 | wiki 文章应小而互链，而非大而孤立 |
| **Evergreen notes** | Andy Matuschak | 笔记要 atomic、concept-oriented、densely linked，并持续重写 | "一篇文章只讲一件事" = 软件的 separation of concerns |
| **Atomic notes** | （同上） | 一个笔记只 "about" 一件事，才能被复用 | 决定检索 / 引用的粒度 |
| **MOC / LYT** | Nick Milo | 用 Map of Content 做高层导航，而非纯文件夹 | wiki 需要 index / hub 页，不能只靠目录 |
| **PARA** | Tiago Forte | Projects / Areas / Resources / Archives 组织行动型知识 | 但项目归档时知识会被一起埋掉——evergreen 笔记弥补这点 |
| **Digital garden** | 社区 | 公开、持续生长、非线性的知识花园 | "持续保鲜"而非"一次写完"的心态 |

一句话：**原子化（atomic）解决"可复用"，链接（link）解决"可发现"，持续重写（evergreen）解决"不腐烂"。** LLM Wiki 的贡献是把这三件事从"靠人自律"变成"靠 agent 自动执行"。

## 几套成熟应用系统怎么分工

| 系统 | 核心范式 | 强项 | 适合学什么 | 不适合直接照搬什么 |
|---|---|---|---|---|
| **Obsidian** | 本地 Markdown vault + 双链 + 插件 | 生态最大、文件可控、双链/图谱/Canvas/Bases 完整 | 个人/团队知识库的 UI 和信息架构 | 插件过多会变成不可复现系统 |
| **Logseq** | outliner + block graph | 日志流、block-level 思考、隐私优先/open-source 定位 | daily note、block reference、渐进式整理 | 对长文档和工程化发布不如文件树直观 |
| **Foam** | VS Code + GitHub + Markdown | 开发者友好、Git 工作流、CLI/graph/backlink | 把知识库当代码库管理 | 普通用户编辑体验不如 Obsidian |
| **Dendron** | hierarchical Markdown + schema + refactor | 大规模层级知识库、schema、rename/refactor | 公司级/工程级知识空间的命名和重构 | 项目活跃度和产品体验需单独评估 |
| **Anytype** | local-first object graph | 对象、关系、集合、隐私和跨端体验 | “Notion 数据库 + 本地优先 + graph”的产品形态 | 非纯 Markdown，Agent/代码工具链直接消费成本更高 |
| **GraphRAG** | LLM 抽取结构化图谱 + RAG | 从非结构文本提取 entities/relations/community summaries | 大 corpus 的结构化检索和全局问题回答 | 成本高；不替代人工维护的知识边界 |

这几套系统不是互斥的。实际做 LLM-Wiki 时，最稳的组合通常是：

1. **Markdown/Git 作为事实层**：可 diff、可 review、可链接。
2. **Obsidian 作为编辑和探索层**：写作、双链、Graph、Canvas、Bases。
3. **静态站作为发布层**：VitePress / MkDocs / Docusaurus。
4. **RAG/GraphRAG 作为检索层**：只消费已整理过的文档，不作为唯一事实源。
5. **Agent harness 作为执行层**：AGENTS.md、Playbook、Solution、ADR 让 AI 读完能行动。

## LLM-Wiki 的架构模型

一个可落地的 LLM-Wiki 可以这样分层：

```text
source/
  notes/               # 人写的原子笔记，Obsidian 友好
  decisions/           # ADR: why
  solutions/           # 故障和修复: symptom -> root cause -> fix
  playbooks/           # 可执行流程
  references/          # 带日期事实快照
  assets/              # 图片、PDF、网页裁剪

indexes/
  backlinks.json       # 显式链接图
  metadata.json        # frontmatter/properties
  embeddings/          # 向量索引
  graph/               # entity/relation/community summaries

runtime/
  AGENTS.md            # agent 入口
  retrieval-policy.md  # 什么时候全文读，什么时候检索
  evals/               # 问答和引用准确性测试
```

关键不是目录名，而是每层回答的问题不同：

| 层 | 回答的问题 | 失败模式 |
|---|---|---|
| Source | “真实内容在哪里？” | 只进向量库，原文不可维护 |
| Metadata | “这是什么类型、日期、状态？” | 没有 frontmatter，检索只能靠语义猜 |
| Links | “它和什么有关？” | 只有文件夹，没有横向关系 |
| Retrieval | “当前任务该读哪几段？” | 一股脑塞长上下文，噪声压过信号 |
| Execution | “读完下一步做什么？” | 知识只可看，不可操作 |
| Evaluation | “回答有没有引用对来源？” | AI 编造、过期知识混入当前决策 |

## Obsidian 到 LLM-Wiki 的映射

| Obsidian 工作流 | 变成 LLM-Wiki 时要加什么 |
|---|---|
| Daily notes | 每周归档为 durable note；否则日志会吞掉知识 |
| Backlinks | 导出/解析成机器可读 graph；否则只有 UI 可见 |
| Tags | 限制 tag taxonomy；否则标签会失控 |
| Properties | 统一字段名：`date` / `status` / `source` / `owner` / `stale_at` |
| Canvas | 适合做 plan / architecture map，但要有 Markdown 摘要落地 |
| Web Clipper | 裁剪内容必须加 captured date、source URL、信任等级 |
| Bases | 用来做“查询视图”，例如所有 stale reference、所有 accepted ADR |
| Plugins | 只装能留下可读文件的插件；避免把知识锁在插件私有状态里 |

## 检索层细看：RAG 不是一种东西，也不是唯一解

原文把检索层简化成"搜索 / backlinks / graph / GraphRAG"。实际谱系更细，选型差异很大：

| 方案 | 机制 | 何时用 | 代价 |
|---|---|---|---|
| **Vector RAG** | chunk → embedding → 相似度检索 | 大规模非结构化语料、要快 | 易丢文档级上下文 |
| **GraphRAG**（Microsoft） | LLM 抽 entities / relations / community summaries | 跨文档关系推理、全局性问题 | 索引成本高 |
| **LightRAG** | 索引实体 + 关系但保持轻量 | 想要图的好处又不想付 GraphRAG 成本 | 折中 |
| **HybridRAG** | 向量召回 + 图扩展 + reranking | 生产标配；faithfulness / relevancy 最稳 | 工程复杂度高 |

两个高价值工程技巧（原文没提）：

- **Contextual Retrieval（Anthropic, 2024）**：embedding 前给每个 chunk 加 50–100 token 的"它在原文里讲什么"上下文头，可把检索失败率平均降 ~35%、配合 reranking 最高降 ~67%。几乎是当前 RAG 的默认增强。
- **Reranking（cross-encoder）**：召回后再用更强模型对候选重排，是 hybrid pipeline 的关键最后一步。

**和 LLM Wiki 的关系**：LLM Wiki 不是另一种 RAG，而是 RAG 的**替代 / 前置**——它把"每次 query 现场检索"换成"提前 compile 成文章"。两者可叠加：先 compile 出干净 wiki，再对 wiki（而不是原始噪声语料）做检索，信噪比天然更高。

## 执行层补充：agent memory、MCP、llms.txt

原文执行层只讲了 AGENTS.md / Playbook / Solution，还有三块对"让 LLM 真正用上知识库"很关键。

**1. Agent memory 框架**——知识库是"外部资料"，memory 是"agent 自己记住的东西"，两者互补：

| 框架 | 模型 | 特点 |
|---|---|---|
| **Letta（前 MemGPT）** | OS 式分层：core（≈RAM，常驻上下文）/ archival（≈磁盘，向量库）/ recall（对话历史） | 完整 agent runtime |
| **Mem0** | user / session / agent 三作用域，向量 + 图 + KV 混合；事实冲突时自编辑去重 | 轻量，挂在现有框架上 |
| **Zep / Graphiti** | 时序知识图谱 | 强在时间维度查询 |
| **LangMem** | LangChain 原生 memory SDK | 生态集成 |

一个被反复验证的朴素结论：**很多场景下"文件系统就是足够好的 agent memory"**（Letta 自己的 benchmark 也在讨论这点）——这正好呼应 LLM Wiki 用 markdown 文件做记忆的选择，也呼应本仓库 `harness/` 的纯文件做法。

**2. MCP（Model Context Protocol）**——agent 现在主要通过 MCP server 连知识库。Obsidian 已有多个 MCP server（暴露 `search_vault` / `create_vault_file` 等工具），比"把 agent 直接指向一个目录"更可靠。代价：给 LLM 开了对整个 vault 的读写删权限，有数据破坏和外泄风险，必须有备份和权限边界。

**3. llms.txt**——给"发布层"加的 LLM 可读入口（Jeremy Howard, 2024-09 提出）。现状要清醒：截至 2025 年中采用仍小众，Google 明确拒绝、主流 AI 爬虫基本不读它；但 Mintlify 2025-11 给所有托管文档站默认开启后，Anthropic、Cursor 等大量 docs 站开始支持。**结论：可以加（成本低），但别指望它带来可测的流量收益。**

## 学习路线

### 第 1 阶段：理解 PKM 原语

目标：知道成熟知识系统都在解决什么。

读和做：

1. 读 Obsidian 的 Vault / Links / Graph / Canvas / Properties / Bases 概念。
2. 建一个 20 条笔记的小 vault，用 `[[links]]` 连接同一主题下的概念。
3. 给每条笔记加 frontmatter：`type`、`status`、`created`、`source`。
4. 观察 Graph：哪些 note 成为 hub，哪些是 orphan。

验收：

- 能解释 folder、tag、link、property 四者差异。
- 能说清为什么“只靠文件夹”不够。

### 第 2 阶段：理解工程化知识库

目标：把笔记从个人记忆变成团队资产。

读和做：

1. 对比 Foam / Dendron：它们都把 Markdown 当代码资产。
2. 学 Dendron 的 hierarchy / schema / refactor 思路。
3. 用 Git 管理你的 vault，每次结构调整都能 diff。
4. 把知识分成 ADR / Solution / Playbook / Reference。

验收：

- 能为一个项目写出 `decisions/`、`solutions/`、`playbooks/` 的最小目录。
- 能解释“为什么 Solution 不应该写进 ADR”。

### 第 3 阶段：理解 LLM 检索

目标：知道 RAG/GraphRAG 能补什么，不能补什么。

读和做：

1. 读 GraphRAG 项目说明：它把非结构文本抽成结构化数据/图记忆，用于增强 LLM 对私有数据的推理。
2. 对一个小 corpus 做两种索引：全文搜索 + embeddings。
3. 设计 10 个问题，记录每个问题应该引用哪些源文件。
4. 让 LLM 回答时必须给 source path；答不出就拒答。

验收：

- 能区分 keyword search、vector search、graph retrieval。
- 能解释为什么 GraphRAG indexing 成本高，应该从小 corpus 开始。

### 第 4 阶段：做 Agent 可执行知识库

目标：让 AI 不只是“知道”，而是能按规则行动。

读和做：

1. 给 repo 写 `AGENTS.md`：入口、目录说明、工作流约束。
2. 写 3 个 playbook：新建文档、修复已知错误、发布站点。
3. 写 5 条 eval question，检查 AI 是否引用正确文件。
4. 建 stale 机制：`stale_at` 到期必须复查。

验收：

- 新 agent 进 repo 后能独立找到相关知识。
- AI 输出能区分事实、推断、建议。
- 过期资料不会被当成当前事实。

## 一个最小可行 LLM-Wiki

如果从今天开始做，不要一上来做复杂平台。建议先做这个：

```text
wiki/
  AGENTS.md
  index.md
  concepts/
  decisions/
  solutions/
  playbooks/
  references/
```

每篇文档统一 frontmatter：

```yaml
---
type: concept | decision | solution | playbook | reference
status: draft | active | superseded | stale
created: YYYY-MM-DD
updated: YYYY-MM-DD
source:
  - https://example.com
stale_at: YYYY-MM-DD
---
```

先用 Obsidian 写和看，用 Git review，用 VitePress 发布。等文档超过 200 篇，再加搜索/embedding；等跨文档推理问题明显增加，再考虑 GraphRAG。

## 选型判断

| 你的目标 | 首选 |
|---|---|
| 个人学习和写作 | Obsidian |
| 开发者 Markdown + Git 知识库 | Foam |
| 大规模层级工程知识库 | Dendron 思路，但要评估项目活跃度 |
| outliner / daily note / block thinking | Logseq |
| Notion-like 数据库但想 local-first | Anytype |
| 私有大 corpus 的检索问答 | RAG / GraphRAG |
| Agent 工程知识库 | Markdown + Git + AGENTS.md + Reference snapshots |

对本仓库来说，最贴合的路线是：

1. 继续保持 VitePress + Markdown 作为发布层。
2. 在 `research/` 保持带日期事实快照。
3. 在 `harness/knowledge-system.md` 里强化 ADR / Solution / Playbook / Reference 的关系。
4. 如果接 Obsidian，把本仓库本身当 vault 打开，不复制一份。
5. 后续可以加脚本导出 backlinks / frontmatter index，作为 LLM-Wiki 检索层的基础。

## Sources

### LLM Wiki 范式（核心）

- [Karpathy — LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — 范式原始定义：compile-not-retrieve、raw/wiki/schema 三层、Memex 类比、人策展+LLM 维护。
- [llm-wiki.net](https://llm-wiki.net/) — 官方实现：命令集（research/ingest/compile/query/audit）、目录结构、Claude Code/Codex/AGENTS.md 部署。
- [nashsu/llm_wiki](https://github.com/nashsu/llm_wiki)、[SamurAIGPT/llm-wiki-agent](https://github.com/SamurAIGPT/llm-wiki-agent) — 开源实现参照。

### PKM 方法论

- [Andy Matuschak — Evergreen notes](https://notes.andymatuschak.org/Evergreen_notes) / [Evergreen notes should be atomic](https://notes.andymatuschak.org/Evergreen_notes_should_be_atomic) — atomic / concept-oriented / densely linked 原则，与 Zettelkasten 的异同。

### 检索层

- [Anthropic — Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) — chunk 加上下文头，检索失败率降 35–67%。
- [Microsoft GraphRAG](https://github.com/microsoft/graphrag) — graph-based RAG 与知识图谱记忆结构。
- [VectorRAG vs GraphRAG vs LightRAG](https://www.ragdollai.io/blog/vectorrag-vs-graphrag-vs-lightrag) — 谱系与选型；HybridRAG = 向量召回 + 图扩展 + reranking。

### Agent memory / 接入

- [Letta — Benchmarking AI Agent Memory](https://www.letta.com/blog/benchmarking-ai-agent-memory/) — OS 式分层 memory；"filesystem 是否足够"的讨论。
- [Mem0 — State of AI Agent Memory 2026](https://mem0.ai/blog/state-of-ai-agent-memory-2026) — Mem0/Letta/Zep/LangMem 谱系与 benchmark。
- [Obsidian MCP server（aaronsb/obsidian-mcp-plugin）](https://github.com/aaronsb/obsidian-mcp-plugin) — 通过 MCP 让 agent 读写 vault；权限与安全风险。
- [llmstxt.org / 采用现状](https://llms-txt.io/blog/is-llms-txt-dead) — llms.txt 提案与 2025 采用情况（Google 拒绝、Mintlify 默认开启）。

### PKM 应用系统

- [Obsidian official site](https://obsidian.md/) — links、graph、canvas、plugins、knowledge bases、project management 等产品能力入口。
- [Obsidian Help](https://help.obsidian.md/) — 官方帮助站，包含 Bases 等能力文档入口。
- [Logseq official site](https://logseq.com/) — privacy-first、open-source knowledge base 定位。
- [Foam docs](https://foambubble.github.io/foam/) — VS Code + GitHub + Markdown PKM，包含 wikilinks、backlinks、graph、CLI、publishing。
- [Dendron wiki](https://wiki.dendron.so/) — local-first、Markdown-based、hierarchical note-taking，强调 schema、lookup、refactor、vaults。
- [Anytype official site](https://anytype.io/) — local-first / private / object graph / database-like PKM 参照。
- [Microsoft GraphRAG](https://github.com/microsoft/graphrag) — graph-based RAG 系统和知识图谱记忆结构参照。

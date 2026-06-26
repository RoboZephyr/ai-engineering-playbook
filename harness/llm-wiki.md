---
name: llm-wiki
description: LLM Wiki / Agent 知识库范式 — compile-not-retrieve 本质、raw/wiki/schema 三层、PKM 方法论根基与落地路线
when_to_use: 为 Agent 设计可被读取/引用/编译的知识库；想理解 LLM Wiki 与 RAG 的本质区别；做知识系统选型
inputs: [原始资料/语料, 团队知识]
outputs: [agent 可编译维护的知识库设计, 选型判断]
related: [./knowledge-system, ./context-design, ./self-evolution, ../research/llm-wiki-pkm-systems-2026-06]
stage: method
---

# LLM Wiki：让 agent 编译并维护的知识库

> 知识库的关键不是"把文档丢进向量库"，而是把**人类可维护的知识结构**和 **LLM 可检索、可引用、可执行的上下文结构**合并成同一份资产。

::: tip 事实依据
本文是 L1 方法论（怎么做）。各系统能力、版本、采用现状、一手来源等事实，见 L3 快照 [LLM-Wiki / PKM 系统 2026-06](../research/llm-wiki-pkm-systems-2026-06.md)。本页不重复事实，只讲判断和落地。
:::

## 本质：compile，不是 retrieve

这是理解整件事的钥匙。2026-04 Andrej Karpathy 把 "LLM Wiki" 定义成一个具体范式，而它的分界线只有一句话：

- **传统 RAG 是无状态的**：每次提问，LLM 从原始文档现场检索、现场拼凑答案，"每次都从零重新发现知识，没有任何积累"。知识不沉淀。
- **LLM Wiki 反过来**：让 agent **一次性把原始资料编译（compile）成一套持续维护、互相链接的 markdown 文章**，之后提问主要读这套已编译的 wiki，而不是每次重跑检索。知识被编译一次、持续保鲜，是一个"会复利增长的资产"。

::: warning 一句话本质
**LLM Wiki = 把检索（retrieve）换成编译（compile）的、agent 维护的知识系统。**
"人机共读"是它的形态，"compile 而非 retrieve"才是它和 RAG 的根本分界。
:::

LLM Wiki 不是另一种 RAG，而是 RAG 的**替代 / 前置**。两者可叠加：先 compile 出干净 wiki，再对 wiki（而非原始噪声语料）做检索，信噪比天然更高。

## 四层心智模型

要"充分理解 LLM Wiki"，不要把它当成一个工具名，而要拆成四层——每层目标不同、失败模式不同：

| 层 | 目标 | 失败模式 |
|---|---|---|
| **写作层** | 人能持续写、改、整理 | 知识没成为稳定文本资产，散落在聊天记录里 |
| **结构层** | 链接、标签、属性、层级、关系 | 只有文件夹，没有横向关系，检索只能靠语义猜 |
| **检索层** | 让 LLM 找到正确上下文 | 一股脑塞长上下文，噪声压过信号 |
| **执行层** | Agent 读后能行动 | 知识只可看，不可操作 |

成熟系统在每层的参照见 [L3 快照](../research/llm-wiki-pkm-systems-2026-06.md)。

## 三层落地模型（raw / wiki / schema）

Karpathy 的范式把 LLM Wiki 落成三层，职责清晰：

| 层 | 谁拥有 | 是否可变 | 作用 |
|---|---|---|---|
| **Raw sources** | 人类策展 | 不可变（append-only ingest） | 可审计的事实源 |
| **Wiki** | LLM 维护 | 持续改写 | 编译后的概念 / 实体 / 引用文章 |
| **Schema** | 配置 | 人定规则 | 告诉 agent 怎么组织、怎么维护 |

**核心分工：人负责 sourcing、探索、提对问题；LLM 负责 summarize / cross-reference / 归档 / 记账这些 grunt work。** 配套三个机制：

1. **append-only changelog** — 记录每次变更（git 即天然 changelog）。
2. **lint / health check** — 定期扫矛盾、孤儿页、缺失交叉链接。
3. **audit** — 把任一输出追溯回源，过期资料不混进当前决策。

落地目录可以是这样（关键不是目录名，而是每层回答的问题不同）：

```text
source/      # 人写的原子笔记 + 不可变原始资料（raw）
  notes/  decisions/  solutions/  playbooks/  references/  assets/
indexes/     # backlinks.json / metadata.json / embeddings / graph
runtime/     # AGENTS.md（agent 入口）/ retrieval-policy.md / evals/
```

| 层 | 回答的问题 |
|---|---|
| Source | "真实内容在哪里？" |
| Metadata | "这是什么类型、日期、状态？" |
| Links | "它和什么有关？" |
| Retrieval | "当前任务该读哪几段？" |
| Execution | "读完下一步做什么？" |
| Evaluation | "回答有没有引用对来源？" |

## 方法论根基：为什么"原子笔记 + 链接"有效

工具只是载体，本质在它们共同继承的 PKM 方法论（提出者与主张见 [L3 快照](../research/llm-wiki-pkm-systems-2026-06.md#pkm-methodology)）。三条核心：

- **原子化（atomic）解决"可复用"** — 一篇文章只讲一件事，等于软件的 separation of concerns，才能被精确引用和检索。
- **链接（link）解决"可发现"** — 密集互链构成图，而非只靠文件夹的树。检索和推理都依赖这张图。
- **持续重写（evergreen）解决"不腐烂"** — 笔记是活的、被反复改写的，而不是一次写完就埋进归档。

**LLM Wiki 的贡献，是把这三件事从"靠人自律"变成"靠 agent 自动执行"。**

## 从 Obsidian 工作流到 LLM Wiki 要加什么

如果已经在用 Obsidian 这类 PKM，升级成 agent 可用的 LLM Wiki 时，每个工作流要补一步：

| Obsidian 工作流 | 变成 LLM Wiki 要加什么 |
|---|---|
| Daily notes | 每周归档为 durable note；否则日志吞掉知识 |
| Backlinks | 导出/解析成机器可读 graph；否则只有 UI 可见 |
| Tags | 限制 tag taxonomy；否则标签失控 |
| Properties | 统一字段名：`date` / `status` / `source` / `owner` / `stale_at` |
| Canvas | 适合做 plan / architecture map，但要有 Markdown 摘要落地 |
| Web Clipper | 裁剪内容必须加 captured date、source URL、信任等级 |
| Plugins | 只装能留下可读文件的插件；避免把知识锁进插件私有状态 |

## 检索层怎么选

RAG 不是一种东西（各方案机制与数字见 [L3 快照](../research/llm-wiki-pkm-systems-2026-06.md#retrieval)）。选型判断：

| 你的情况 | 选 |
|---|---|
| 大规模非结构化语料、要快 | Vector RAG |
| 需要跨文档关系推理、全局性问题 | GraphRAG（认它的高索引成本） |
| 想要图的好处又不想付 GraphRAG 成本 | LightRAG |
| 生产环境、要 faithfulness 稳 | HybridRAG（向量召回 + 图扩展 + reranking） |

两个几乎必加的工程技巧：**Contextual Retrieval**（embedding 前给每个 chunk 加上下文头，显著降检索失败率）和 **reranking**（召回后用更强模型重排，hybrid pipeline 的关键最后一步）。

## 执行层怎么搭

让 LLM 真正用上知识库，执行层除了 `AGENTS.md` / Playbook / Solution，还有三块：

- **Agent memory 框架** — 知识库是"外部资料"，memory 是"agent 自己记住的东西"。一个被反复验证的朴素结论：**很多场景下"文件系统就是足够好的 agent memory"**，这正呼应 LLM Wiki 用纯 markdown 做记忆的选择。重型方案（Letta / Mem0 / Zep / LangMem）见 [L3 快照](../research/llm-wiki-pkm-systems-2026-06.md#agent-memory)。
- **MCP（Model Context Protocol）** — agent 现在主要通过 MCP server 连知识库（如 Obsidian MCP）。代价是给 LLM 开了对整个 vault 的读写删权限，必须有备份和权限边界。
- **llms.txt** — 给"发布层"加的 LLM 可读入口。成本低可以加，但别指望它带来可测流量（采用现状见 L3 快照）。

## 学习路线

| 阶段 | 目标 | 做什么 | 验收 |
|---|---|---|---|
| **1. PKM 原语** | 知道成熟系统在解决什么 | 建 20 条笔记的小 vault，用 `[[links]]` 连接，加 frontmatter，观察 Graph 的 hub 与 orphan | 能解释 folder / tag / link / property 四者差异，说清"只靠文件夹"为何不够 |
| **2. 工程化知识库** | 把笔记从个人记忆变团队资产 | 用 Git 管 vault，把知识分成 ADR / Solution / Playbook / Reference | 能写出最小 `decisions/`、`solutions/`、`playbooks/` 目录；能解释"为什么 Solution 不写进 ADR" |
| **3. LLM 检索** | 知道 RAG / GraphRAG 补什么、不补什么 | 对小 corpus 做全文 + embedding 两种索引；设计 10 个问题并标注应引用的源文件；让 LLM 答不出就拒答 | 能区分 keyword / vector / graph retrieval |
| **4. Agent 可执行知识库** | 让 AI 能按规则行动 | 写 `AGENTS.md`、3 个 playbook、5 条 eval question；建 `stale_at` 复查机制 | 新 agent 进 repo 能独立找到相关知识；输出能区分事实/推断/建议；过期资料不被当成当前事实 |

## 一个最小可行 LLM Wiki

不要一上来做复杂平台。从今天起，可以先做：

```text
wiki/
  AGENTS.md
  index.md
  concepts/  decisions/  solutions/  playbooks/  references/
```

每篇统一 frontmatter：

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

先用 Obsidian 写和看、用 Git review、用静态站（VitePress / MkDocs / Docusaurus）发布。超过 200 篇再加搜索 / embedding；跨文档推理问题明显增多，再考虑 GraphRAG。

## 选型判断

| 你的目标 | 首选 |
|---|---|
| 个人学习和写作 | Obsidian |
| 开发者 Markdown + Git 知识库 | Foam |
| 大规模层级工程知识库 | Dendron 思路（评估项目活跃度） |
| outliner / daily note / block thinking | Logseq |
| Notion-like 数据库但想 local-first | Anytype |
| 私有大 corpus 的检索问答 | RAG / GraphRAG |
| Agent 工程知识库 | Markdown + Git + `AGENTS.md` + Reference 快照 |

## 这对本仓库意味着什么

本站本身就接近一个"人工撰写版"的 LLM Wiki：`research/` 带日期快照 ≈ raw 层，`harness/` 等方法论文章 ≈ 编译后的 wiki 层，`CLAUDE.md` / `AGENTS.md` / `CONTRIBUTING.md` ≈ schema 层。和成熟 LLM Wiki 的差距主要在三处：**缺 agent 编译循环**（现在人编译）、**缺不可变 raw 层**（research 已是合成结果）、**图是装饰性的**（`related` frontmatter 存在但正文互链稀疏、无 backlink 导出）。

这不是缺陷清单，而是边界判断：本站核心资产之一是 **Skill 评测（人的主观判断）**，恰恰是*不该*让 agent 自动编译的部分。务实路线是——在事实层（`research/`）借用 LLM Wiki 的机制，在评测层保留人的判断。详见 [知识管理系统](./knowledge-system) 与 [自进化](./self-evolution)。

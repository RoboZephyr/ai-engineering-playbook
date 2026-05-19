---
name: skill-authoring
description: SKILL.md 作者指南——frontmatter / progressive disclosure / 自由度匹配 / Anti-patterns。基于 Anthropic 官方 Agent Skills best practices
when_to_use: 写或改 `.claude/skills/<name>/SKILL.md`；判断什么该用 Skill 什么该用 Slash Command 或 Agent
related: [./foundations, ./writing-rules, ../skills/, ../harness/architecture-patterns]
stage: method
---

# SKILL.md 作者指南

> 写 Agent Skill 的专题——frontmatter 写法、progressive disclosure 结构、自由度匹配。基于 Anthropic 官方 [Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)，去项目化重写。

## 与其他章节的边界

| 章节 | 管什么 |
|------|--------|
| [核心原则](./foundations) | 跨厂商 prompt 共识 |
| [通用写作规范](./writing-rules) | 所有 LLM 文本的**文字**规则 |
| **本章** | **SKILL.md 文件的结构与触发** |

Skill body 里的文字仍然受 [通用写作规范](./writing-rules) 全部条款约束（尤其"不写历史演进"）。本章只补充 Skill 特有的部分。

---

## 何时该用 Skill（选型）

| 选项 | 何时用 |
|------|--------|
| **Skill** (`.claude/skills/<name>/SKILL.md`) | 多次复用的领域专长；需要 Claude **自动**按触发词识别加载；需要挂 reference 文件 / utility script |
| **Slash Command** (`.claude/commands/*.md`) | 用户**显式触发**的一次性固定流程；不需要"自动决定用不用" |
| **Agent / Subagent** | 需要**独立 context** 的子任务；输出量大要隔离；需要并行 fan-out |
| **Inline prompt**（直接写在 pipeline 代码里） | 一次性、仅该 pipeline 消费、不会被其他模块复用 |
| **MCP Server** | 需要跨多个 agent / IDE / CLI 共享的工具能力；有外部服务调用 |

Skill 和 Slash Command 的关键差别是 **自动触发 vs 显式触发**。Slash Command 是用户主动 `/cmd`，Skill 是 Claude 看到任务匹配 description 自动加载。

---

## 文件结构

```
skill-name/
├── SKILL.md              # 主指令（< 500 行）
├── <TOPIC>.md            # 分域详细指南（progressive disclosure）
├── reference/            # 参考资料（schema / API / 数据字典）
│   └── <domain>.md
└── scripts/              # 可执行脚本（bash 调用，不进 context）
    └── <util>.py
```

### YAML Frontmatter（必填）

```yaml
---
name: your-skill-name
description: <what + when，第三人称，具体>
---
```

#### `name` 字段规则

- ≤ **64 字符**
- 只允许 **小写字母 / 数字 / 连字符**
- **不能含** `anthropic` / `claude` 字样（reserved words）
- **推荐 gerund 形式**：`processing-pdfs`、`rendering-launch`（动词 + ing）
- 可接受：noun phrase（`pdf-processing`）、action verb（`process-pdfs`）
- 避免：`helper` / `utils` / `tools` 等泛化名

#### `description` 字段规则

- 非空；≤ **1024 字符**
- 必须**第三人称**（"Processes X..." 不是 "I can..." / "You can..."）
- 必须同时给 **what**（做什么）+ **when**（什么时候触发）
- **决定 skill 被 Claude 正确选中的关键**——description 是 L1 metadata，唯一总是加载的内容

---

## Description 写法（最关键）

来源：Anthropic *Skills best practices* § Writing effective descriptions *"The description is critical for skill selection: Claude uses it to choose the right Skill from potentially 100+ available Skills."*

### 官方好例

```yaml
description: Extract text and tables from PDF files, fill forms, merge documents.
  Use when working with PDF files or when the user mentions PDFs, forms, or
  document extraction.
```

```yaml
description: Generate descriptive commit messages by analyzing git diffs.
  Use when the user asks for help writing commit messages or reviewing staged changes.
```

```yaml
description: Analyze Excel spreadsheets, create pivot tables, generate charts.
  Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.
```

### 反例

```yaml
description: Helps with documents              # 空、没说 what，没说 when
description: Processes data                    # 同样空
description: I can help you process Excel      # 第一人称
description: This skill processes PDFs         # 自指"This skill"，重复 name
description: 处理 PDF                            # 太抽象、没 trigger
```

### 写作模板

```text
[动词]开头描述 what：[名词具体输出]。
Use when [具体触发条件 1] or when [触发条件 2] or when [...]。
```

或者：

```text
[名词]工具。Generates / Analyzes / Extracts / Renders [具体输出]。
Use when the user [具体行为] or [pipeline 阶段]。
```

### Description 区分度

如果项目里有多个相似 skill，description 必须能让 Claude **从一堆里挑对的那个**。

差（两个混淆）：

```yaml
# skill A
description: Generate Reddit post

# skill B
description: Generate Reddit content
```

好（明确区分场景）：

```yaml
# skill A
description: Generate Reddit launch post optimized for a specific subreddit.
  Use when launching a new product or feature and posting to a target subreddit
  with discoverContext.target_community defined.

# skill B
description: Generate Reddit conversation starter for community engagement (not launch).
  Use when posting to subreddit for ongoing engagement, ask-me-anything, or discussion threads.
```

---

## Progressive Disclosure：三层加载

来源：Anthropic *Skills best practices* § Progressive disclosure patterns *"SKILL.md serves as an overview that points Claude to detailed materials as needed, like a table of contents in an onboarding guide."*

| 层级 | 加载时机 | Token 代价 | 内容 |
|------|---------|-----------|------|
| L1 Metadata | 启动时总是加载 | ~100 tok/skill | name + description |
| L2 Instructions | 被触发后 | < 5k tok | SKILL.md 主体 |
| L3 Resources | 显式引用后 | 按需 | `*.md` / `scripts/*` |

### SKILL.md 主体 < 500 行

超了就拆。三种拆分模式：

#### Pattern A — High-level guide + references（最常用）

```markdown
# PDF Processing

## Quick start

<50 token 代码片段 或 步骤>

## Advanced

- Form filling: see [FORMS.md](FORMS.md)
- API reference: see [REFERENCE.md](REFERENCE.md)
```

#### Pattern B — Domain-specific organization（数据/领域多）

```text
bigquery-skill/
├── SKILL.md        # overview + navigation
└── reference/
    ├── finance.md
    ├── sales.md
    └── product.md
```

SKILL.md 里："Finance metrics → reference/finance.md"。Claude 按问题读对应文件，其他不消耗 token。

#### Pattern C — Conditional details（主线简单、复杂分支链到子文件）

```markdown
# DOCX Processing

## Creating documents
Use docx-js for new documents. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents
For simple edits, modify the XML directly.
**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

### 引用**只下一层**

Claude 跟进嵌套引用时可能 `head -100` 预览 → 读不到全文。

```text
✅ 好
SKILL.md → [advanced.md](advanced.md)  # advanced.md 全读

❌ 差
SKILL.md → advanced.md → details.md → 真正内容
```

来源：Anthropic *Skills best practices* § Avoid deeply nested references *"Claude may partially read files when they're referenced from other referenced files. [...] Keep references one level deep from SKILL.md."*

### 长 reference 文件加 TOC

> 100 行的 reference 文件**顶部必须给 Table of Contents**，即便 Claude 只读一部分也能看到全景。

---

## 自由度匹配任务脆弱性

来源：Anthropic *Skills best practices* § Set appropriate degrees of freedom *"Match the level of specificity to the task's fragility and variability."*

| 自由度 | 场景 | 形式 | 例子 |
|--------|------|------|------|
| **低** | 操作脆弱、顺序关键、错了损失大 | 精确脚本、固定命令 | `python scripts/migrate.py --verify --backup`，"Do not modify" |
| **中** | 有偏好模式但可小幅调整 | pseudocode / 参数化模板 | "Use this template, customize as needed" |
| **高** | 多方法均可、依赖上下文判断 | 纯文字指令 | "Analyze the code structure, suggest improvements" |

### 类比

> Think of Claude as a robot exploring a path:
> - **Narrow bridge with cliffs**: 只有一条安全路。给精确 guardrail（低自由度）。例：database migrations。
> - **Open field with no hazards**: 多条路通罗马。给方向（高自由度）。例：code review。

### 判断准则

| 问题 | 低 / 中 / 高 |
|------|-------------|
| 错一次会丢数据吗？ | 错 → 低 |
| 输出需要严格 schema 吗？ | 是 → 低 |
| 跨场景需要适应不同上下文吗？ | 是 → 高 |
| 有多个合理解吗？ | 是 → 高（让模型挑） |
| 顺序错了下游会炸吗？ | 是 → 低 |

---

## Concise — 每 token 证明自己

来源：Anthropic *Skills best practices* § Concise is key *"The context window is a public good. [...] Claude is already very smart. Only add context Claude doesn't already have."*

写每段问：

- Claude 已经知道这个吗？（基础概念、流行库、Python 语法）
- 这段解释必要吗？（教科书式介绍多半可删）
- 删掉这句会让 Claude 做错事吗？（不会 → 删）

### 官方对比

好例（~50 tokens）：

````markdown
## Extract PDF text

Use pdfplumber:

```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

差例（~150 tokens）：

```markdown
PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available for PDF processing, but
pdfplumber is recommended because it's easy to use...
```

好的版本假设 Claude 知道 PDF 是什么、库怎么用。

---

## 工作流与反馈循环

### 复杂任务给 checklist

让 Claude 在回复里 copy 一份 checklist 并勾选：

````markdown
## Workflow

Copy this and check off as you progress:

```
- [ ] Step 1: 读所有 source 文件
- [ ] Step 2: 识别主题
- [ ] Step 3: 产出结构化总结
- [ ] Step 4: 核对引用
```

**Step 1: ...**
...
````

来源：Anthropic *Skills best practices* § Use workflows for complex tasks *"Clear steps prevent Claude from skipping critical validation. The checklist helps both Claude and you track progress through multi-step workflows."*

### 反馈循环：run validator → fix → repeat

```markdown
1. 改 word/document.xml
2. 立即 validate: `python ooxml/scripts/validate.py dir/`
3. 失败 → 改 → 再 validate
4. **只有 validate 通过才继续**
5. rebuild + 测试
```

这是 Anthropic 官方推荐的 plan-validate-execute 模式：让脚本做确定性检查，模型做需要判断的部分。

---

## 在所有目标模型上测

来源：Anthropic *Skills best practices* § Test with all models *"Skills act as additions to models, so effectiveness depends on the underlying model."*

| 模型 | 测试关注 |
|------|---------|
| Haiku（快、便宜） | Skill 给的指导够吗？需要更明确？ |
| Sonnet（平衡） | Skill 清晰高效吗？ |
| Opus（强推理） | Skill 是否过度解释？Opus 容易"读懂"冗余 |

Haiku 可能需要更明确的指令；Opus 容易"过度解读"冗余解释。如果跨多个模型部署，**目标是在所有上面都跑得通**。

---

## Anti-patterns

来源：Anthropic *Skills best practices* § Anti-patterns + 实战经验补充。

| 反模式 | 为什么差 |
|--------|---------|
| 模糊 description："Helps with documents" | Claude 选不中你的 skill |
| 第一/第二人称："I can help..." / "You can use..." | 注入到 system prompt 视角错乱 |
| 提供太多选项："Use pypdf, or pdfplumber, or PyMuPDF, or..." | Claude 选择困难，给一个默认值 + escape hatch |
| Windows 路径 `scripts\helper.py` | Unix 系统报错 |
| 深嵌套 references（SKILL.md → A → B → 内容） | Claude 只读 head 100 行，漏内容 |
| 时间敏感语言（"After August 2025 use v2"） | 信息会过期 |
| 不一致术语（mix "field" / "box" / "element"） | 模型困惑 |
| Skill 本体 > 500 行不拆 | Context 浪费 |
| Magic constant：`TIMEOUT = 47` 不解释 | Claude 不知道为啥 47、改了也不知道是否安全 |
| 脚本 punt 给 Claude：`return open(path).read()` 让它自己处理 FileNotFoundError | 脚本应该 self-contained 处理常见错误 |

---

## Evaluation-Driven Development

来源：Anthropic *Skills best practices* § Build evaluations first *"Create evaluations BEFORE writing extensive documentation. This ensures your Skill solves real problems rather than documenting imagined ones."*

### 流程

1. **Identify gaps**：跑 Claude 无 skill baseline → 记失败点
2. **Create evaluations**：建 3 个 scenario 测这些失败点
3. **Establish baseline**：测无 skill 表现
4. **Write minimal SKILL.md**：刚够让 eval 通过
5. **Iterate**：跑 eval → 对比 baseline → 优化

### Eval scenario 结构

```json
{
  "skills": ["pdf-processing"],
  "query": "Extract all text from this PDF and save to output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Reads the PDF using an appropriate library",
    "Extracts text from all pages without missing any",
    "Saves extracted text to output.txt in readable format"
  ]
}
```

---

## Claude A / B 迭代

来源：Anthropic *Skills best practices* § Develop Skills iteratively with Claude。

用两个 Claude session：

- **Claude A**：跟你一起设计、撰写、修改 skill
- **Claude B**：fresh session、加载 skill、跑真实任务

流程：

1. 先跟 Claude A 走完一次任务，记录你重复提供的上下文
2. 请 Claude A 把上下文提炼成 skill
3. 让 Claude B 新 session 加载 skill 跑真实任务
4. 观察 B 在哪失败 / 漏看 / 误读 → 回 A 修
5. 重复

观察 Claude B 时关注：

- **意外探索路径**：B 读文件顺序跟你预想不同？说明结构不直观
- **错失连接**：B 没跟进重要引用？链接需要更显式
- **过度依赖某段**：B 反复读同一文件？该内容应该挪到 SKILL.md 主体
- **忽略内容**：B 从不访问某 bundled 文件？该文件可能多余或信号弱

---

## 检查清单（发布 skill 前）

### Frontmatter

- [ ] `name` gerund 或 noun-phrase，≤ 64 字符，只有小写 / 数字 / `-`
- [ ] `name` 不含 `anthropic` / `claude` 等 reserved words
- [ ] `description` 第三人称，≤ 1024 字符，含 **what + when**
- [ ] description 对比相邻 skill 能区分（不会跟别的 skill 冲突）

### 结构

- [ ] SKILL.md 主体 < 500 行
- [ ] 长内容拆到子文件，引用只下一层
- [ ] 长 reference 文件（> 100 行）有 TOC
- [ ] 所有路径用正斜杠

### 内容

- [ ] 没有历史演进注释（Phase / 已取代 / 老版 / MVP legacy）
- [ ] 时间敏感信息在 "Old patterns" 折叠段 或 没有
- [ ] 术语一致
- [ ] 示例具体（非抽象）
- [ ] 自由度匹配任务脆弱性
- [ ] 过度解释段删除（Claude 已经知道的不讲）

### Code & Scripts

- [ ] 脚本解决问题、不 punt 给 Claude
- [ ] 错误处理显式，错误消息含可行动信息
- [ ] 无 magic constant，常量有注释说明
- [ ] 依赖包在指令里声明
- [ ] 明确是 "执行脚本" 还是 "当 reference 读"
- [ ] MCP 工具用全限定名 `ServerName:tool_name`

### Testing

- [ ] 在目标模型（至少 Sonnet / Opus）跑过
- [ ] 至少 3 个 eval scenario
- [ ] 真实场景跑过一次（不只是单元测试）

## 触发时机

- 写新 skill
- 改已有 skill 超过小修小补
- /harness-check 或 skill review
- pipeline 运行失败定位到某 skill 输出不符合约定时

## 参考

- Anthropic — [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- Anthropic — [Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Anthropic 官方示范 skills：`example-skills:skill-creator`、`example-skills:mcp-builder`、`example-skills:frontend-design`
- 社区参考：`superpowers:writing-skills`
- 站内：[核心原则](./foundations) · [通用写作规范](./writing-rules) · [Skills 评测](../skills/)

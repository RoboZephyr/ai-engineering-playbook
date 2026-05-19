---
name: built-in-skills
description: Anthropic 官方 21 个 Skills 全解析 + Claude Code 内置 Skill + 策展类项目的具体使用建议
when_to_use: 查官方默认给了什么 Skill；具体查 theme-factory / brand-guidelines / canvas-design / doc-coauthoring / webapp-testing / pdf / xlsx 等；看一个真实项目怎么组合官方 Skill
related: [./, ./design, ./frontend]
stage: domain
---

# Anthropic 官方内置 Skills 全解析

> Anthropic 在 [anthropics/skills](https://github.com/anthropics/skills) 仓库中发布了 21 个官方 Skill，分为 **document-skills**（专有许可）和 **example-skills**（Apache 2.0）两大类。此外 Claude Code 自身还内置了若干 Skill（如 simplify、loop 等）。本文逐一分析每个 Skill 的能力、适用场景和使用建议。

## 总览

### 仓库结构

```
anthropics/skills/
├── document-skills/        # 专有许可（4 个）
│   ├── docx/              # Word 文档处理
│   ├── pdf/               # PDF 全能处理
│   ├── pptx/              # PowerPoint 演示文稿
│   └── xlsx/              # Excel 电子表格
├── example-skills/         # Apache 2.0（13 个）
│   ├── algorithmic-art/   # p5.js 生成艺术
│   ├── brand-guidelines/  # Anthropic 品牌风格
│   ├── canvas-design/     # 视觉艺术与海报
│   ├── claude-api/        # Claude API/SDK 参考
│   ├── doc-coauthoring/   # 三阶段文档协作
│   ├── frontend-design/   # 前端界面设计
│   ├── internal-comms/    # 内部沟通写作
│   ├── mcp-builder/       # MCP 服务器开发
│   ├── skill-creator/     # Skill 创建与评估
│   ├── slack-gif-creator/ # Slack GIF 制作
│   ├── theme-factory/     # 主题风格工具包
│   ├── web-artifacts-builder/ # Web Artifact 构建
│   └── webapp-testing/    # Playwright 测试
└── template/               # Skill 模板（供开发者参考）
```

### 速查表

| Skill | 分类 | 触发方式 | 核心能力 | 推荐度 |
|-------|------|---------|---------|--------|
| **pdf** | 文档处理 | 涉及 PDF 文件时 | 读取/合并/拆分/水印/创建 PDF | 按需 |
| **docx** | 文档处理 | 涉及 Word 文档时 | 创建/读取/编辑 .docx | 按需 |
| **pptx** | 文档处理 | 涉及 PPT 文件时 | 创建/解析/编辑演示文稿 | 按需 |
| **xlsx** | 文档处理 | 涉及电子表格时 | 打开/编辑/公式/图表 .xlsx/.csv | 按需 |
| **frontend-design** | 前端设计 | 构建 Web UI 时 | 排版/色彩/动效/背景四维设计 | **必装** |
| **skill-creator** | 元工具 | 创建或评估 Skill 时 | Skill 开发/测试/评分 | **推荐** |
| **webapp-testing** | 测试 | 测试 Web 应用时 | Playwright 自动化测试 | **推荐** |
| **web-artifacts-builder** | 前端开发 | 构建复杂交互组件 | React + shadcn/ui 单文件打包 | 推荐 |
| **doc-coauthoring** | 写作 | 协作写文档时 | 三阶段文档协作流程 | 推荐 |
| **mcp-builder** | 开发 | 构建 MCP 服务器时 | Python/TypeScript MCP 开发指导 | 推荐 |
| **claude-api** | 开发 | 使用 Claude API 时 | API/SDK/Agent SDK 参考 | 按需 |
| **theme-factory** | 设计 | 需要主题样式时 | 10 预设主题 + 自定义生成 | 按需 |
| **canvas-design** | 创意 | 创建海报/视觉设计 | PNG/PDF 视觉艺术设计 | 按需 |
| **algorithmic-art** | 创意 | 生成代码艺术 | p5.js 种子随机 + 交互参数 | 按需 |
| **brand-guidelines** | 设计 | 需要 Anthropic 品牌风格 | Anthropic 官方配色/排版 | 特定 |
| **internal-comms** | 写作 | 写内部沟通文档 | 状态报告/团队更新模板 | 按需 |
| **slack-gif-creator** | 创意 | 为 Slack 做 GIF | 优化尺寸/帧率的动画 GIF | 特定 |

### Claude Code 自身内置 Skill

除了 `anthropics/skills` 仓库，Claude Code 还内置了以下 Skill，无需安装：

| Skill | 触发方式 | 核心能力 |
|-------|---------|---------|
| **simplify** (`/simplify`) | 代码变更后 | 审查代码复用、质量、效率 |
| **loop** (`/loop`) | 需要轮询时 | 按间隔重复执行命令（默认 10 分钟） |
| **schedule** (`/schedule`) | 需要定时任务时 | 创建/管理 cron 定时远程 Agent |
| **code-review** (`/code-review`) | PR 审查时 | 拉取请求代码审查 |
| **feature-dev** (`/feature-dev`) | 开发新功能时 | 引导式功能开发（含代码库理解） |

---

## 文档处理类（document-skills）

> 专有许可，需通过 Anthropic 官方渠道获取。

### pdf — PDF 全能处理

**触发条件：** 用户需要对 PDF 文件进行任何操作时自动触发。

**核心能力：**
- 读取/提取 PDF 中的文字和表格
- 合并多个 PDF 为一个
- 拆分 PDF 页面
- 旋转页面
- 添加水印
- 从零创建新 PDF

**使用场景：** 合同处理、报告整合、文档归档。

**局限：** 复杂排版的 PDF（多栏、嵌套表格）提取准确度有限。

---

### docx — Word 文档处理

**触发条件：** 涉及 `.docx` 文件的创建、读取或编辑时。

**核心能力：**
- 创建带格式的 Word 文档（标题、表格、列表）
- 读取和解析已有文档内容
- 编辑修改文档

**使用场景：** 生成技术文档、提案、报告。

---

### pptx — 演示文稿处理

**触发条件：** 涉及 `.pptx` 文件时。

**核心能力：**
- 创建幻灯片（含布局、文字、图片占位）
- 读取和解析已有 PPT
- 修改已有幻灯片内容

**使用场景：** 技术分享、汇报材料、培训幻灯片。

---

### xlsx — 电子表格处理

**触发条件：** 涉及 `.xlsx`、`.xlsm`、`.csv`、`.tsv` 文件时。

**核心能力：**
- 打开/读取/编辑电子表格
- 添加列、计算公式
- 格式化、图表生成

**使用场景：** 数据分析、报表生成、CSV 清洗。

---

## 前端与设计类（example-skills）

### frontend-design — 前端界面设计

**触发条件：** 构建 Web 组件、页面或应用时自动激活。

**核心能力：**

| 维度 | 内容 |
|------|------|
| **Typography** | 禁用泛滥字体（Inter/Roboto/Arial），推荐高对比字体对，字重取极端值 |
| **Color & Theme** | CSS 变量保持一致性，主色 + 尖锐强调色，light/dark 主题 |
| **Motion** | 编排完善的页面加载动画优于散落微交互 |
| **Backgrounds** | 渐变网格、噪点纹理、几何图案，拒绝纯色 |

**反模式警告：**
- Inter + 紫色渐变 + 白色背景 = "AI Slop" 三件套
- 灰色文字在彩色背景上
- 零动画/极简动画

**推荐字体分类：**

| 风格 | 字体 |
|------|------|
| 代码/技术感 | JetBrains Mono, Fira Code, Space Grotesk |
| 编辑/杂志风 | Playfair Display, Crimson Pro, Fraunces |
| 初创/现代感 | Clash Display, Satoshi, Cabinet Grotesk |
| 技术/专业感 | IBM Plex 系列, Source Sans 3 |

**评价：** 所有 Web 前端项目的**必装** Skill。它不生成代码，而是约束 AI 的审美方向，避免千篇一律的"AI 生成感"。

→ 详细评测见 [前端开发 Skills](./frontend.md)

---

### web-artifacts-builder — Web Artifact 构建

**触发条件：** 用户要求构建复杂的多组件交互界面时。

**核心能力：**
- 使用 React + Tailwind CSS + shadcn/ui 构建
- 支持状态管理、路由
- 打包为单文件 HTML（可嵌入 claude.ai Artifact）

**使用场景：** 交互式演示、配置生成器、数据可视化仪表板。

**局限：** 产出是 React 组件，不直接适用于 Vue/Nuxt 项目。

---

### webapp-testing — Playwright 自动化测试

**触发条件：** 用户要求测试 Web 应用功能时。

**核心能力：**
- 启动本地 HTTP Server
- 使用 Playwright 进行 UI 自动化测试
- 截图对比、交互验证
- 支持多浏览器和移动端模拟

**使用场景：** 回归测试、功能验证、响应式检查。

**评价：** 对于有交互功能的 Web 项目（搜索、过滤、主题切换等），非常实用。

---

### theme-factory — 主题风格工具包

**触发条件：** 需要为 artifact（幻灯片、文档、页面等）应用统一主题时。

**核心能力：**
- 10 个预设主题（含配色和字体方案）
- 可自定义生成新主题
- 输出 CSS 变量，适配各种前端框架

**使用场景：** 多主题支持、品牌适配、深色模式生成。

---

## 开发工具类

### claude-api — Claude API/SDK 参考

**触发条件：** 代码中 import `anthropic` / `@anthropic-ai/sdk` / `claude_agent_sdk` 时自动激活；或用户询问 Claude API 使用。

**核心能力：**
- Anthropic API 调用模式参考
- Python / TypeScript SDK 用法
- Agent SDK 构建自定义 Agent
- Tool Use（工具调用）模式

**注意：** 不会在使用 OpenAI 等其他 AI SDK 时触发。

---

### mcp-builder — MCP 服务器开发

**触发条件：** 用户要构建 MCP（Model Context Protocol）服务器时。

**核心能力：**
- Python（FastMCP）和 TypeScript 双语言支持
- MCP Tool 定义、Resource 管理
- 与 Claude Code 的集成测试

**使用场景：** 为 AI 工具构建外部服务集成（数据库、API、文件系统）。

---

### skill-creator — Skill 创建与评估

**触发条件：** 用户要创建新 Skill、修改已有 Skill、或评估 Skill 质量时。

**核心能力：**
- 从零创建 SKILL.md 文件
- 分析 git 历史提取编码模式
- 运行 eval 测试 Skill 效果
- 方差分析 benchmark Skill 性能

**评价：** 对于 Skill 开发者是**必备**工具。如果你只是使用 Skill 而不开发，优先级降低。

---

## 写作与沟通类

### doc-coauthoring — 三阶段文档协作

**触发条件：** 用户要写文档、提案、技术规格、决策文档时。

**核心能力：**

| 阶段 | 内容 |
|------|------|
| **Phase 1: 收集上下文** | 高效转移用户脑中的背景知识 |
| **Phase 2: 逐节打磨** | 按章节迭代写作 |
| **Phase 3: 读者测试** | 从读者角度审视，优化可读性 |

**评价：** 写长文档（技术规格、RFC、设计文档）时很有价值。三阶段流程避免了"一次性生成→大量修改"的低效循环。

---

### internal-comms — 内部沟通写作

**触发条件：** 用户要写内部沟通材料时。

**核心能力：**
- 状态报告模板
- 团队/领导层更新
- 公司内部公告格式

**适用场景：** 中大型团队的正式沟通场景。个人/小团队通常不需要。

---

## 创意类

### canvas-design — 视觉艺术与海报

**触发条件：** 用户要创建海报、艺术品、设计作品或其他静态视觉内容时。

**核心能力：**
- 输出 .png 和 .pdf 格式
- 遵循设计哲学原则
- 原创设计，不复制已有作品

**使用场景：** 活动海报、社交媒体配图、品牌物料。

---

### algorithmic-art — p5.js 生成艺术

**触发条件：** 用户要求用代码生成艺术、算法艺术、流体场、粒子系统时。

**核心能力：**
- p5.js 画布渲染
- 种子随机（可复现）
- 交互式参数探索

**使用场景：** 开发者名片、会议背景、创意编码实验。

---

### slack-gif-creator — Slack GIF 制作

**触发条件：** 用户要为 Slack 制作动画 GIF 时。

**核心能力：**
- Slack 尺寸/帧率约束优化
- 动画概念验证
- 文件体积控制

**使用场景：** 团队沟通中的自定义动画表情。非常小众。

---

### brand-guidelines — Anthropic 品牌风格

**触发条件：** 需要应用 Anthropic 官方品牌配色和排版时。

**核心能力：**
- Anthropic 官方品牌色
- 官方排版规范
- 适用于各类 artifact

**适用场景：** 仅限需要 Anthropic 品牌风格的项目。对其他项目无用。

---

## Claude Code 内置 Skill（无需安装）

以下 Skill 随 Claude Code 自带，通过斜杠命令直接调用：

### simplify (`/simplify`)

**核心能力：** 审查最近变更的代码，检查复用性、质量和效率问题，自动修复。

**最佳实践：** 每次完成一轮代码修改后执行一次，作为提交前的质量关卡。

---

### code-review (`/code-review`)

**核心能力：** 对 Pull Request 进行全面代码审查。

**最佳实践：** 在 PR 提交前执行，获得 AI 视角的审查意见。

---

### feature-dev (`/feature-dev`)

**核心能力：** 引导式功能开发，先理解代码库结构和架构，再规划实现路径。

**最佳实践：** 开发新功能时用此命令启动，它会先探索代码库再提出方案，比直接写代码更可靠。

---

### loop (`/loop`)

**核心能力：** 按固定间隔重复执行某个命令或 Skill。默认 10 分钟。

**使用示例：** `/loop 5m /simplify` — 每 5 分钟执行一次代码质量审查。

**适用场景：** 监控构建状态、轮询部署进度。

---

### schedule (`/schedule`)

**核心能力：** 创建、管理基于 cron 的定时远程 Agent 任务。

**适用场景：** 定期自动化任务，如每日代码扫描、定时报告生成。

---

## 安装方式

### 通过插件市场安装（推荐）

```bash
# 安装 example-skills 插件（包含 13 个开源 Skill）
/plugin install example-skills@anthropic-agent-skills

# 安装 document-skills 插件（包含 4 个文档处理 Skill）
/plugin install document-skills@anthropic-agent-skills
```

### 通过 npx 安装单个 Skill

```bash
# 安装特定 Skill
npx skills add anthropics/skills --skill frontend-design
npx skills add anthropics/skills --skill webapp-testing
```

### 内置 Skill

simplify、code-review、feature-dev、loop、schedule 无需安装，直接通过 `/命令名` 调用。

---

## 实战参考：策展类项目的官方 Skill 组合

> 以本站（VitePress 策展型文档站）为例，给一个"真实项目里官方 Skill 怎么选"的样本。其他策展 / 内容站可参考。

### 必装 — 日常开发直接用

| Skill | 价值 | 典型用法 |
|---|---|---|
| `frontend-design` | 约束 AI 的审美方向，避免"AI 生成感" | "请用 frontend-design 的标准重新设计决策树区域，要有独特排版和微交互" |
| `skill-creator` | 创建站点维护 Skill、评估社区 Skill 质量、贡献改进版回社区 | "评估这个 code-review Skill 的触发准确度和输出质量" |
| `/simplify` | 每次改完 HTML/CSS/JS 后跑一遍，确保没有引入重复代码 | 改完代码直接执行 |

### 推荐 — 特定场景很有用

| Skill | 何时启用 | 典型用法 |
|---|---|---|
| `webapp-testing` | 站点有交互（搜索、主题切换、侧边栏、锚点跳转），改动后回归 | "用 Playwright 测试搜索框输入 'pdf' 能否正确过滤" |
| `web-artifacts-builder` | 想加交互式演示（Skill 配置生成器、主题预览器） | "构建交互式 Skill 浏览器组件，支持筛选、排序、一键复制" |
| `theme-factory` | 想扩展主题（高对比度、护眼模式、品牌专题） | "为站点生成 Arctic Frost 冰蓝主题的 CSS 变量" |

### 视情况 — 特定阶段才需要

| Skill | 何时需要 |
|---|---|
| `doc-coauthoring` | 开始撰写深度 Skill 评测、长篇使用指南时（三阶段流程能保证质量） |
| `mcp-builder` | 静态站演化为动态站，需要从 GitHub API 实时拉数据 |
| `/loop` | 需要轮询监控外部状态（这类站点通常不用） |

### 不需要的 Skill

| Skill | 原因 |
|-------|------|
| pdf / docx / pptx / xlsx | 文档处理，与 Web 站点开发无关 |
| algorithmic-art | 生成式艺术，与站点功能无关 |
| brand-guidelines | Anthropic 品牌专属，本站有自己的设计风格 |
| canvas-design | 海报/视觉艺术，非 Web 开发 |
| slack-gif-creator / internal-comms | 团队沟通工具，个人/小团队站点不需要 |
| claude-api | 除非加后端 AI 功能，否则不需要 |

### 推荐的日常工作流

**功能开发：**

```
1. /plan — 规划新功能或内容
2. 开发（frontend-design 自动辅助设计）
3. /simplify — 代码质量审查
4. webapp-testing — 自动化回归测试
5. /diff → 确认 → 提交
```

**内容策展：**

```
1. 发现新 Skill（社区 / awesome 列表 / 市场）
2. skill-creator — 评估 Skill 质量
3. doc-coauthoring — 撰写评测/推荐文章
4. 更新站点，添加新的 Skill 卡片
5. webapp-testing — 验证站点功能
```

### Quick Start

```bash
# 1. 装 example-skills 插件（含 frontend-design, skill-creator, webapp-testing 等）
/plugin install example-skills@anthropic-agent-skills

# 2. 日常开发时这些 Skill 会自动触发

# 3. 手动调用
/simplify              # 代码质量审查
/skill-creator         # 创建或评估 Skill
/plan                  # 规划新功能
```

---

## 相关资源

- [anthropics/skills 仓库](https://github.com/anthropics/skills) — 官方 Skill 源码
- [Agent Skills 规范](https://agentskills.io/specification) — SKILL.md 格式标准
- [Skills 知识中枢](./#what) — 概念、选型、评测方法
- [Reference / Skill 生态 2026-03](../research/skill-ecosystem-2026-03.md) — 完整生态快照

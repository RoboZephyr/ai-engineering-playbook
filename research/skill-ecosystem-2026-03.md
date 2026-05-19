---
name: skill-ecosystem-2026-03
description: Claude Code Skill 生态快照（2026-03）— 官方/大厂/社区/第三方市场清单与规模
when_to_use: 看完整生态清单；做选型背景调研；查找 Skill 来源；引用 L3 事实层依据
related: [/skills/, /skills/built-in]
stage: reference
layer: L3
date: 2026-03
snapshot: true
---

# Skill 生态快照（2026-03）

::: tip 这是 L3 事实层快照
**只放事实和清单**，不夹推荐和主观判断。推荐和建议在 [Skills 知识中枢](/skills/)。

下次回刷建议：每季度复查一次（如 2026-06 时新建 `skill-ecosystem-2026-06.md`，本页保留作为历史快照）。
:::

---

## 官方体系

### 1. anthropics/skills（21 个官方 Skill）

```
anthropics/skills/
├── document-skills/        # 专有许可
│   ├── docx/              # Word 文档处理
│   ├── pdf/               # PDF 全能处理
│   ├── pptx/              # PowerPoint 演示文稿
│   └── xlsx/              # Excel 电子表格
├── example-skills/         # Apache 2.0
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
├── claude-api/             # 独立插件包（同 example-skills 中的 claude-api）
└── template/               # Skill 模板
```

### 2. 官方插件目录

| 目录 | 来源 | 规模 | 安装方式 |
|------|------|------|---------|
| claude-plugins-official | Anthropic 审核 | 119 个 | `/plugin marketplace add anthropics/skills` |
| claude-plugins-community | 社区提交 | 500+ | `/plugin marketplace add anthropics/claude-plugins-community` |

### 3. Agent Skills 开放标准

Anthropic 推动了 [Agent Skills 规范](https://agentskills.io/specification)（SKILL.md 格式），已被多个平台采用：
- Claude Code
- Cursor
- Codex CLI
- Gemini CLI
- GitHub Copilot

这意味着好的 Skill 是跨平台可用的。

---

## 大厂官方 Skills

| 厂商 | 仓库/来源 | 主要 Skills | Stars |
|------|----------|------------|-------|
| **Vercel** | vercel skills | React 最佳实践、Web 设计规范（100+ 规则）、组合模式、Next.js 模式 | — |
| **Trail of Bits** | trailofbits/skills | 安全研究、CodeQL/Semgrep 静态分析、变体分析、结构化代码审计 | 4K |
| **Stripe** | stripe skills | SDK/API 版本升级自动化 | — |
| **Cloudflare** | cloudflare skills | Stateful AI Agent、MCP 服务器、Workers 模式、Web 性能审计 | — |
| **Sentry** | sentry skills | 错误追踪集成 | — |
| **Expo** | expo skills | React Native 模式 | — |
| **Hugging Face** | HF skills | ML 模型集成 | — |
| **Netlify** | netlify skills | 部署模式 | — |

---

## 社区生态

### Awesome 列表

| 仓库 | Stars | 规模 | 特点 |
|------|-------|------|------|
| affaan-m/everything-claude-code | 114K | 14 agents + 56 skills + 33 commands | 最全面，也是一个插件市场 |
| ComposioHQ/awesome-claude-skills | 48.8K | 50+ skills | 按分类和工作流组织，经验证 |
| hesreallyhim/awesome-claude-code | 33.6K | — | Skills + Hooks + Agent 编排 |
| sickn33/antigravity-awesome-skills | 28.1K | 1,326+ skills | 含 CLI 安装器，跨平台 |
| VoltAgent/awesome-agent-skills | 13.2K | 1,000+ skills | 跨平台（Claude/Cursor/Codex/Gemini） |
| travisvn/awesome-claude-skills | 10K | — | 策展型列表 |
| BehiSecc/awesome-claude-skills | 8K | 40+ skills | 8 个领域的自动激活 Skill |

### 第三方插件市场（GitHub 托管）

任何人都可以创建自己的插件市场（GitHub 仓库 + `.claude-plugin/marketplace.json`）：

| 市场 | Stars | 说明 |
|------|-------|------|
| obra/superpowers-marketplace | 749 | Obra/Superpowers 项目的策展市场 |
| rawveg/skillsforge-marketplace | 28 | 33 个策展 Skill |
| ccf/claude-code-ccf-marketplace | — | 8 插件 + 13 agents + 35 skills |

### 第三方 Skill 网站

| 站点 | 规模 | 特点 |
|------|------|------|
| [skillsmp.com](https://skillsmp.com/) | 500K+ | 跨 Claude/Codex/ChatGPT，有搜索过滤 |
| [skillhub.club](https://www.skillhub.club) | 36K+ | AI 质量评分、CLI 安装器、Skill "Stacks" |
| [claudemarketplaces.com](https://claudemarketplaces.com/) | 2,300+ skills + 770+ MCP | 目录型，含 95+ 插件市场索引 |
| [awesome-skills.com](https://awesome-skills.com/) | — | 可视化目录 |
| [claudeskillsmarket.com](https://www.claudeskillsmarket.com/) | — | 发现、分享、构建 |
| [claude.com/skills](https://claude.com/skills) | — | Anthropic 官方 Skill 页面 |

---

## Skill 常见分类

根据全生态调研，社区创建的 Skill 主要集中在以下方向：

| 分类 | 热度 | 代表性 Skill |
|------|------|-------------|
| 前端/设计 | 最热 | UI 指南、React 模式、Tailwind、无障碍、设计系统 |
| 安全 | 很热 | OWASP 扫描、SAST、漏洞检测、PII 清理 |
| 测试 | 很热 | TDD 工作流、Playwright、覆盖率、E2E |
| DevOps/部署 | 热门 | CI/CD、Docker、云部署 |
| 后端架构 | 热门 | API 设计、数据库（Postgres/ClickHouse）、Spring Boot、Django、Go |
| 代码质量 | 热门 | 审查、重构、Lint、编码标准 |
| 文档 | 中等 | 文档生成、ADR、API 文档 |
| Git/工作流 | 中等 | Commit 规范、PR 创建、批量操作、多 Agent 编排 |
| 领域特定 | 中等 | 营销（Corey Haines 的 32 个）、金融、法律、视频（Remotion） |
| AI/ML | 增长中 | 模型集成、Prompt 工程、Agent 编排 |
| 创意 | 小众 | 算法艺术、主题工厂、GIF |

---

## 观察到的生态特征

1. **碎片化** — Skills 散落在数百个 GitHub 仓库、多个网站、多个市场，没有统一入口
2. **质量不均** — 大量低质量/过时 Skill，只有 skillhub.club 有 AI 评分，但缺少人工评测
3. **发现困难** — 没有"Skill 版的 npm"，搜索体验差
4. **中文空白** — 几乎全是英文资源，中文用户入门门槛极高
5. **跨平台混乱** — 同一个 Skill 可能在 Claude/Cursor/Codex 上表现不同，缺少对比

> 这些事实驱动本站的定位（中文世界的策展型 Skill 指南），定位说明见 [首页](/) 与 [Skills 知识中枢 / 生态地图](/skills/#ecosystem)。

---

## 补录（2026-05）

::: tip 补录说明
2026-03 主体快照之后陆续发现的高价值条目。后续若补录数量超过主体的 30%，应另开新快照（如 `skill-ecosystem-2026-06.md`），本节保留作为历史增量。
:::

### 中文 / 跨平台 Skill 集

| 仓库 | 规模 | 说明 |
|---|---|---|
| [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills) | 20+ skills | 中文作者维护的 Claude Skill 集合，覆盖内容创作、翻译、图片生成、社媒发帖。与本站"中文世界策展"定位强相关 |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 232+ skills，11k★ | 跨 Agent 通用 Skill 集合（工程 / 营销 / 产品 / 合规），跨平台覆盖度较广 |

### 社区 Harness 实现工具（非 Skill，但与 Skill 生态强耦合）

这些不是 `SKILL.md` 文件而是配套的开源工具，但是 Skill / Agent 生态的重要补充。

| 仓库 | 类型 | 说明（基于公开 README） |
|---|---|---|
| [parcadei/Continuous-Claude-v3](https://github.com/parcadei/Continuous-Claude-v3) | 3.7k★ Harness 模式 | Context ledger + handoff 模式实现，针对长 session 的上下文退化问题 |
| [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) | 3.5k★ Hook 样本集 | Pre/Post tool hooks、notification hooks、model routing hooks 的可运行示例集合 |
| [disler/claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) | 1.4k★ Dashboard | 基于 Claude Code Hook 的多 Agent session 实时监控 dashboard |
| [rtk-ai/rtk](https://github.com/rtk-ai/rtk) | 27k★ CLI 代理 | Rust 实现的 Bash 输出 token 压缩代理，多级过滤 pipeline，对 build/test 输出有显著节省 |
| [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit) | 818★ 跨 Agent | 跨 Agent 兼容（Claude / Cursor / Gemini）的 Skill 设计套件 |

::: warning 评测状态
本表条目**仅来自公开仓库 README 的客观描述**，未经本站实际使用评测。若纳入 L2 资产层（Skills 评测页或 Harness 子页），需先按本站 [评测方法](/skills/#how-we-evaluate) 跑过。
:::

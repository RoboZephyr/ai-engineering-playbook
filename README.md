# AI Engineering Playbook

> AI Agent 工程实践知识库 — Harness 设计、Prompt 工程、Skill 选型、视觉工程、场景工作流

🌐 **在线版本**：<https://playbook.robozephyr.com>

主要给"写给 AI 读的文档"做工程化沉淀。所有方法论和模板都基于真实项目实践 + Anthropic / OpenAI / Google 一手官方文档。

## 内容板块

| 板块 | 内容 |
|------|------|
| **Harness Engineering** | 从零设计 Agent 工作环境 — CLAUDE.md / AGENTS.md / 日志 / 知识管理 / 自进化 |
| **Prompt Engineering** | 10 条跨厂商共识 + Claude 4.7 / GPT-5 / Gemini 3 差异 + SKILL.md 作者指南 + Prompt Caching + 长上下文策略 |
| **Skills 知识中枢** | Anthropic 官方 + 社区精选 Skills 评测，三级优先级评估 |
| **Visual Engineering** | AI 生成视觉前端方法论 — 输入文档分层 / Visual Kit / 反模式 / 设计审查 |
| **场景工作流** | PRD / 技术架构 / TDD / 代码审查 / Landing Page 素材生成等编排参考 |
| **Reference（事实层）** | 带日期的官方信源索引、Skill 生态快照、Harness 文献快照 |

## 本地预览

```bash
npm install
npm run docs:dev    # 本地 http://localhost:5175
```

构建静态站：

```bash
npm run docs:build  # 产物在 .vitepress/dist/
```

## 三层定位

| 层 | 角色 | 板块 |
|---|------|------|
| **L1 方法论** | 怎么做 | Harness / Prompt Engineering / Visual Engineering |
| **L2 资产** | 用什么 | Skills 目录 / Workflows 编排 / 模板库 |
| **L3 Reference** | 看到了什么 | Research 板块（带日期快照） |

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 贡献

欢迎提 Skill 评测、工作流参考、Harness 实践、调研快照。模板和分类规范见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 技术栈

- [VitePress](https://vitepress.dev/) 静态文档站
- 中文撰写，专有名词保留英文（Skill / Workflow / Claude Code 等）

## 部署

- 静态托管：Cloudflare Pages
- 自定义域：`playbook.robozephyr.com`
- 重新部署：`npm run docs:build && npx wrangler pages deploy .vitepress/dist --project-name ai-engineering-playbook --commit-message "$(git log -1 --pretty=%s)" --commit-dirty=false`

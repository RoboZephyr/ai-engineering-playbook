---
name: official-sources-2026-05
description: AI 编码工具官方信源索引（2026-05）— 各厂的 docs / changelog / blog / GitHub / 插件市场 / 规范
when_to_use: 查官方原始资料；做选型时引用权威来源；写评测前确认信息是否过时；agent 需要按需 fetch 时取地址
related: [/skills/, /harness/, /research/]
stage: reference
layer: L3
date: 2026-05
snapshot: true
---

# 官方信源索引（2026-05）

::: tip 这是 L3 事实层快照
**只放官方信源的指针**，不复制其具体内容。原因：

1. 内容会变（changelog 几乎周级别更新），复制只会引入信息漂移
2. AI agent 应该用 [Context7 MCP](https://context7.com) / `documentation-lookup` skill / `WebFetch` 按需取最新版

本页是「应该去哪查」的索引，配合 Agent 的 fetch 工具使用。下次回刷建议：每季度复查链接有效性。
:::

## 给 AI 的使用提示

如果你是 AI agent 在帮用户查官方信息：

1. **不要把本页内容当作"当前事实"** — 这是地址簿，不是事实库本身
2. **优先用 context7 MCP** 查 SDK / 框架文档（自动取最新版本）
3. **用 WebFetch** 拉 changelog / blog 单页内容
4. **复杂研究** 用 `deep-research` skill（firecrawl + exa MCP 组合）

---

## Claude Code（Anthropic）

| 类别 | 地址 | 用途 |
|---|---|---|
| 主页 | <https://claude.com/code> | 产品介绍 |
| 文档 | <https://docs.claude.com/en/docs/claude-code/overview> | CLI 使用、Hooks、Slash Commands、MCP、IDE 集成 |
| Release Notes | <https://docs.claude.com/en/release-notes/claude-code> | 版本更新 |
| 工程 Blog | <https://www.anthropic.com/engineering> | Effective Context Engineering / Harness Design / 多 Agent 等深度文章 |
| GitHub | <https://github.com/anthropics/claude-code> | Issues、Discussion、社区反馈 |
| Skills 仓库 | <https://github.com/anthropics/skills> | 21 个官方 Skill 源码 |
| 官方插件目录 | <https://github.com/anthropics/claude-plugins-official> | 119 个官方审核插件 |
| 社区插件目录 | <https://github.com/anthropics/claude-plugins-community> | 500+ 社区提交插件 |
| Skills 官方页 | <https://claude.com/skills> | 官方 Skill 浏览页 |
| **feature-dev 插件源码** | <https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev> | 官方多 phase 功能开发工作流的参考实现 |
| **code-review 插件源码** | <https://github.com/anthropics/claude-code/tree/main/plugins/code-review> | 官方代码审查插件源码（并行 reviewer 编排参考） |

## Codex（OpenAI）

| 类别 | 地址 | 用途 |
|---|---|---|
| 主页 | <https://openai.com/codex> | 产品介绍 |
| Codex CLI | <https://github.com/openai/codex> | CLI 源码与文档 |
| API 文档 | <https://platform.openai.com/docs> | OpenAI API、Agent 相关 |
| Codex Cloud | <https://chatgpt.com/codex> | 云端 Codex 入口 |
| Harness Engineering 文章 | <https://openai.com/index/harness-engineering/> | Symphony + Codex 实践（注：曾返回 403，可走 Latent Space podcast 转述） |
| OpenAI Blog | <https://openai.com/blog> | 产品更新、研究文章 |

## Cursor（Anysphere）

| 类别 | 地址 | 用途 |
|---|---|---|
| 主页 | <https://cursor.com> | 产品介绍 |
| 文档 | <https://docs.cursor.com> | 配置、Composer、Rules |
| Changelog | <https://cursor.com/changelog> | 版本更新 |
| Forum | <https://forum.cursor.com> | 社区讨论 |
| Blog | <https://cursor.com/blog> | 产品博客 |

## Gemini CLI（Google）

| 类别 | 地址 | 用途 |
|---|---|---|
| GitHub | <https://github.com/google-gemini/gemini-cli> | 源码、Release、文档主入口 |
| Gemini for Developers | <https://ai.google.dev> | API / 模型文档 |
| Google AI Blog | <https://blog.google/technology/ai/> | 产品更新 |

## GitHub Copilot

| 类别 | 地址 | 用途 |
|---|---|---|
| 文档 | <https://docs.github.com/en/copilot> | Copilot 全产品线文档 |
| Changelog | <https://github.blog/changelog/label/copilot/> | 版本更新（GitHub Blog 子集） |
| Copilot Workspace | <https://githubnext.com/projects/copilot-workspace> | GitHub Next 的 Agent 化产品 |
| Skill 化方向 | <https://github.com/features/copilot> | 当前对 Agent Skills 规范的支持状态 |

---

## 规范与标准

| 规范 | 地址 | 涵盖 |
|---|---|---|
| **Agent Skills 规范** | <https://agentskills.io/specification> | `SKILL.md` 格式、frontmatter 字段、跨平台兼容性约定 |
| **MCP（Model Context Protocol）** | <https://modelcontextprotocol.io> | Tools / Resources / Prompts 三类原语、Server/Client 协议 |
| MCP 仓库 | <https://github.com/modelcontextprotocol> | SDK、官方 server 实现、规范文档源码 |
| **Anthropic MCP Registry** | <https://code.claude.com/docs/en/mcp> | Anthropic 维护的官方 MCP 服务器目录（200+ 条目），API：`https://api.anthropic.com/mcp-registry/v0/servers?version=latest` |
| **CLAUDE.md / AGENTS.md 约定** | 见 [Codex 文档](https://github.com/openai/codex) + [Claude Code 文档](https://docs.claude.com/en/docs/claude-code/memory) | 项目级 agent 指令文件的事实标准（行业共识，无单一规范文档） |

---

## 第三方策展源（用于发现）

不是官方，但常被官方/社区引用，已成事实上的发现入口。完整清单见 [Skill 生态快照 2026-03](./skill-ecosystem-2026-03.md)。

| 类型 | 代表 |
|---|---|
| Awesome 列表 | [everything-claude-code](https://github.com/affaan-m/everything-claude-code) (114K★) · [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) (48.8K★) |
| 大厂 Skill 仓库 | [Vercel](https://github.com/vercel) · [Trail of Bits](https://github.com/trailofbits/skills) · Stripe · Cloudflare |
| Skill 市场 | [skillsmp.com](https://skillsmp.com) · [skillhub.club](https://www.skillhub.club) · [claudemarketplaces.com](https://claudemarketplaces.com) |

---

## 行业关键深度文章（持续追加）

以下文章是站点方法论的源头依据，详细笔记见 [Harness 文献快照 2026-04](./harness-literature-2026-04.md)：

| 文章 | 作者 | 链接 |
|---|---|---|
| Effective Context Engineering for AI Agents | Anthropic | <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents> |
| Harness Design for Long-Running Apps | Anthropic | <https://www.anthropic.com/engineering/harness-design-long-running-apps> |
| Building Effective Agents | Anthropic | <https://www.anthropic.com/research/building-effective-agents> |
| Managed Agents | Anthropic | <https://www.anthropic.com/engineering/managed-agents> |
| Harness Engineering (Symphony) | OpenAI / Latent Space | <https://www.latent.space/p/symphony> |
| Harness Engineering 三维扩展框架 | Yage.ai | <https://yage.ai/harness-engineering/> |

::: warning 链接时效
本页链接的有效性截至 2026-05-13。如果发现 404 / 403，请记录在 [Issues](https://github.com/zephyrme/ai-engineering-playbook/issues) 并寻找镜像。链接腐烂是 Reference 层的长期维护负担。
:::

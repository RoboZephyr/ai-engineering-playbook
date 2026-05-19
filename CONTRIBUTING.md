# Contributing

> 欢迎向 AI Engineering Playbook 贡献 Skill 评测、工作流参考、Harness 实践、调研快照。

## 内容类型

| 类型 | 说明 | 放在哪里 |
|------|------|---------|
| Skill 评测 | 对某个 Skill 的使用评价 | `skills/<领域>.md` 对应章节 |
| 工作流 | 某个场景下的 Skill 编排 | `workflows/<场景>.md` |
| 新领域 | 新增一个 Skill 分类领域 | `skills/<领域>.md` + 更新侧边栏 |
| Harness 实践 | Agent 工作环境设计实践 | `harness/<主题>.md` |
| Prompt Engineering | Prompt 写作方法论（通用 / SKILL.md / 长上下文等） | `prompt-engineering/<主题>.md` |
| Reference 快照 | 带日期的事实层调研 | `research/<主题>-YYYY-MM.md` |
| Visual Engineering | AI 视觉生成方法论 | `visual-engineering/<主题>.md` |

## Skill 评测模板

添加新的 Skill 评测时，按以下格式：

```markdown
### <Skill 名称> — 一句话描述

**来源：** [GitHub](链接) | **安装：** `安装命令`

**核心能力：** 能力1 / 能力2 / 能力3

**我们的评价：** 实际使用后的主观评价

**最佳使用场景：** 什么时候用效果最好

**注意事项：** 已知限制或踩坑点

**推荐搭配：** 配合哪些 Skill 使用效果更好
```

完整字段列表见 [Skills 知识中枢 / 评测字段](./skills/#how-we-evaluate)。

## 工作流模板

添加新的工作流时，按以下格式：

```markdown
# <场景名称> 流程

> 一句话描述

## 适用场景
- 场景列表

## 前置准备
| Skill | 安装命令 |
|-------|---------|

## 完整流程
### Phase 1: ...
| 步骤 | 命令 | 动作 | 备注 |
|------|------|------|------|

## 快速参考（一行版）
`命令1 → 命令2 → 命令3`
```

## Reference 快照规范

`research/` 目录是 **L3 事实层**，所有快照必须：

1. **带日期**：文件名形如 `skill-ecosystem-2026-03.md`
2. **只放事实**：清单、数据、版本、引用来源，不夹推荐和主观判断
3. **frontmatter 标 `date` 字段**：方便检索时效性
4. **被引用而不引用别人**：作为站点其他内容的依据来源

## 写作规范

- 中文撰写，专有名词保留英文（Skill、Workflow、Claude Code）
- **每条信息只在一处详细描述**，其他地方链接引用（避免信息漂移）
- 善用表格做对照，流程用有序列表
- 评测必须基于实际使用，不做未验证的推荐
- 三级优先级标记：必装 / 推荐 / 视情况
- 每个 markdown 文件用 frontmatter 标明 `name` / `description` / `when_to_use` / `related` / `stage`

## 三层定位（避免内容错位）

| 层 | 角色 | 板块 | 写作要点 |
|---|---|---|---|
| **L1 方法论** | 怎么做 | Harness / Visual Engineering / Skills 评测方法 | 长期稳定 |
| **L2 资产** | 用什么 | Skills 目录 / Workflows 编排 / 模板库 | 中频更新，可引用 L3 |
| **L3 Reference** | 看到了什么 | Research | 带日期快照，定期回刷 |

新增内容前先想清楚它属于哪一层，避免方法论页混入快照、快照页混入主观推荐。

## 不应该做的

- ❌ 绑定特定前端框架（Vue/Nuxt/React 等）— 保持技术中立
- ❌ 复制 Skill 的完整源码或 SKILL.md 内容 — 链接到原始仓库即可
- ❌ 做可执行的 Skill 运行时结构（`.claude/skills` 符号链接等）

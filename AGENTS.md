# Agents 指南

本文件约束所有 AI Agent 在此项目中的行为。

## 项目性质

这是一个 **文档站 / 知识库**，用于管理、评估和展示 AI 编码 Skills 与 Workflows。不是可执行的 Skill 库，不是 prompt 模板库。

## 内容生产规则

1. **只做评测和指导，不做模板输出**
   - 正确：分析某 Skill 的四维设计能力和反模式检测
   - 错误：输出"将以下 prompt 嵌入你的 CLAUDE.md"

2. **保持技术中立**
   - 不绑定特定框架（Vue/Nuxt/React/Angular）
   - Skill 评测应说明适用的技术栈范围，但不偏向任何一个

3. **信息不重复**
   - 每个 Skill 的详细评测只在对应领域页中出现一次
   - 其他页面通过链接引用
   - Workflow 页面引用 Skill 时链接到领域页，不重复描述

4. **评测结构统一**
   - 每个 Skill 评测包含：来源、安装方式、核心能力、我们的评价、最佳使用场景、注意事项、推荐搭配
   - 使用三级优先级：必装 / 推荐 / 视情况

5. **Workflow 结构统一**
   - 按 Phase 组织，每个 Phase 有步骤表格
   - 包含前置准备（安装命令）和快速参考（一行版）
   - 明确标注平台限制（如 Web-only、iOS-only）

## 文件组织（三层定位）

| 层 | 角色 | 路径 |
|---|---|---|
| **L1 方法论** | 怎么做 | `harness/` / `visual-engineering/` / `skills/index.md`（评测方法） |
| **L2 资产** | 用什么 | `skills/<领域>.md`（评测） / `workflows/<场景>.md`（编排） |
| **L3 Reference** | 看到了什么 | `research/<主题>-YYYY-MM.md`（带日期事实快照） |

```
harness/             — Agent 工作环境方法论（L1）
visual-engineering/  — AI 视觉生成方法论（L1）
skills/<领域>.md     — 按领域分类的 Skill 评测（L2）
skills/index.md      — Skills 知识中枢：概念 / 选型 / 评测方法 / 索引（L1+L2 入口）
workflows/<场景>.md  — 按场景编排的 Workflow（L2）
research/<主题>.md   — 带日期的事实快照（L3）
CONTRIBUTING.md      — 贡献规范（根目录，不进侧栏）
```

新增内容后须同步更新 `.vitepress/config.mts` 中的 sidebar。新增 L3 快照时文件名必须带日期。

# AI Engineering Playbook — 项目约束

## 站点定位

本项目是一个 **AI Agent 工程实践知识库**（VitePress 文档站），核心目标：

1. **Harness Engineering** — Agent 工作环境设计方法论（CLAUDE.md/AGENTS.md、日志、知识管理、自进化）
2. **Skill 评估** — 对各类 AI 编码 Skill 进行评测、对比、打分
3. **流程搭建** — 按不同开发场景编排 Skill 使用流程（Workflow）
4. **模板沉淀** — 提供可直接复制使用的文档模板

## 内容边界

### 应该做的
- Harness 方法论：项目初始化、Context 设计、日志系统、知识管理、自进化机制
- 评测某个 Skill 的能力、优势、局限
- 对比同类 Skill 的差异和适用场景
- 编排特定场景下的 Skill 使用顺序（Workflow）
- 提供选型建议和使用注意事项
- 收录相关资源链接和调研报告
- 提供可复制的文档模板（CLAUDE.md、ADR、Solution 等）

### 不应该做的
- ❌ 绑定特定前端框架（Vue/Nuxt/React 等）— 保持技术中立
- ❌ 复制 Skill 的完整源码或 SKILL.md 内容 — 链接到原始仓库即可
- ❌ 做可执行的 Skill 运行时结构（.claude/skills 符号链接等）

## 技术栈

- VitePress 文档站
- 中文撰写，专有名词保留英文（Skill、Workflow、Claude Code）

## 写作规范

- 每条信息只在一处详细描述，其他地方链接引用
- Skill 评测使用统一模板（见根目录 CONTRIBUTING.md）
- 三级优先级标记：必装 / 推荐 / 视情况
- 善用表格做对照，流程用有序列表
- 评测必须基于实际使用，不做未验证的推荐

---
name: knowledge-system
description: 团队级知识管理。Decision Records / Solution / Plan / Playbook 四种载体
when_to_use: 积累项目经验；想把失败转化为团队资产；新人 onboarding 需要快速理解决策史
inputs: [项目实际经验, 失败案例]
outputs: [ADR, Solution 库, Plan 模板, Playbook]
related: [./self-evolution, ./templates, ./init-methodology, ./llm-wiki]
stage: method
---

# 知识管理系统

> 每次失败都应该让系统变得更强。知识管理系统把经验从个人记忆转化为可检索、可复用的团队资产。

## 四种知识载体

| 载体 | 回答什么 | 生命周期 | 触发创建 |
|------|----------|----------|----------|
| **Decision (ADR)** | "为什么这样做" | 长期（可被 supersede） | 做出重要技术选择后 |
| **Solution** | "这个问题怎么修" | 长期（可被 obsolete） | 修复新类型故障后 |
| **Plan** | "接下来怎么做" | 短期（完成即归档） | 开始复杂任务前 |
| **Playbook** | "标准流程是什么" | 中期（定期更新） | 相同操作重复 3+ 次后 |

---

## Decision Records (ADR)

### 什么时候写

**写 ADR**:
- 选择技术栈或库
- 确定架构模式（monolith vs microservice, SSR vs CSR）
- 建立命名约定或代码约束
- 确定不做某件事（记录排除方案同样重要）

**不写 ADR**:
- 变量命名、格式化（用 linter 规则代替）
- Bug fix（修复方案放 solution）
- 显而易见的选择（无需记录争议）

### 生命周期

```
proposed → accepted → [deprecated | superseded by ADR-XXX]
```

- `accepted`: 当前生效的决策
- `deprecated`: 不再适用（通常因为模型升级或技术变更）
- `superseded`: 被新的 ADR 替代（在旧 ADR 中注明）

### 编号规则

```
docs/harness/decisions/
├── 001-three-layer-architecture.md
├── 002-generative-not-template.md
├── 003-judge-fix-separation.md
├── 004-no-banned-fonts.md
└── 005-image-model-fallback-chain.md
```

顺序编号，永不重用已删除的编号。

### 与 CLAUDE.md 的关系

CLAUDE.md 的 Constraints 部分是 ADR 的**摘要视图**：

```markdown
## Constraints
- 不使用 Inter/Roboto 等 banned fonts → [ADR-004](docs/harness/decisions/004-no-banned-fonts.md)
- Judge/Fix 技能必须分离 → [ADR-003](docs/harness/decisions/003-judge-fix-separation.md)
```

Agent 看到 CLAUDE.md 知道规则是什么，需要了解来龙去脉时读对应 ADR。

### 可验证性

每个 ADR 应该有 `## Verification` 部分，定义如何自动验证该决策是否被遵守：

```markdown
## Verification
- [ ] `grep -r "Inter\|Roboto\|Open Sans" src/ --include="*.tsx" --include="*.css"` 返回 0 结果
- [ ] 所有 judge skill 的 SKILL.md 不包含 Edit/Write 工具
```

至少 50% 的 ADR 应该有可自动执行的验证。不能自动验证的 ADR 依赖人工审查。

---

## Solution 库

### 什么时候写

**写 Solution**:
- 修复一个花费 > 15 分钟的问题
- 修复一个之前没遇到过的问题类型
- 修复一个可能再次出现的问题

**不写 Solution**:
- Typo 修复
- 简单的一行 bug fix
- 一次性问题（明确不会再发生）

### 核心结构

每个 Solution 必须有四部分：

1. **Symptoms（怎么发现的）** — 给搜索用，关键词要明确
2. **Root Cause（为什么发生的）** — 理解问题才能防止
3. **Solution（怎么修的）** — 具体步骤，可复现
4. **Prevention（怎么防止的）** — 可选，如何避免再次发生

### 自动搜索机制

当 pipeline 失败时，agent 应该先搜索 solutions/：

```
错误发生
  → 提取关键信息: error_type, error_message, phase_name
  → grep solutions/ 目录:
    grep -l "error_type_keyword" docs/harness/solutions/*.md
  → 找到匹配?
    → 读取 Solution 的 ## Solution 部分
    → 按步骤尝试修复
    → 成功? → 记录 "solution applied" 到日志
    → 失败? → 上报人类，创建新 solution 或更新旧 solution
```

在 HARNESS.md 中告诉 agent 这个流程：

```markdown
## 遇到错误时
1. 先搜索 `docs/harness/solutions/` 是否有匹配的已知方案
2. 如果有，按方案步骤修复
3. 如果没有，尝试自行修复，修复成功后在 solutions/ 创建新记录
```

---

## Plans（计划）

### 什么时候写

- 任务预估 > 30 分钟
- 任务涉及多个文件或多个模块的修改
- 需要和用户对齐"什么算完成"（Sprint Contract）

### Sprint Contract

Plan 最重要的部分是 **Acceptance Criteria（验收标准）**。在写代码前先定义"什么算完成"：

```markdown
## Acceptance Criteria
- [ ] 每次 gen-page 运行产生 JSONL 日志
- [ ] 日志包含每个 phase 的耗时和状态
- [ ] quality-tracker.jsonl 每次运行追加一行
- [ ] 现有的 gen-page 流程不受影响（不 break）
```

这防止了两种失败：
1. Agent 做多了（over-engineering）
2. Agent 做少了（遗漏关键要求）

### 生命周期

```
plans/active/xxx.md → 工作中
plans/completed/xxx.md → 完成后归档
```

完成时：
1. 检查所有 Acceptance Criteria 是否通过
2. 在 Plan 中记录实际结果
3. 移到 `completed/` 目录

---

## Playbooks（操作手册）

### 什么时候写

当一个操作重复出现 3 次以上，或者流程足够复杂需要标准化。

### 设计原则

1. **面向行动**: 每步是一个明确的动作，不是描述
2. **条件分支清晰**: 用 if/else 而非段落描述分支
3. **有失败处理**: 每步可能失败时给出应对措施
4. **可被 Agent 直接执行**: 步骤中包含可运行的命令

### 示例结构

```markdown
# Playbook: Quality Rescue

## 触发条件
Judge score < 60 after first generation.

## 步骤

### 1. 诊断
读取 judge 输出，分类问题:
- Typography 得分 < 15 → 下一步用 /typeset
- Color 得分 < 10 → 下一步用 /colorize
- 多个维度低分 → 按依赖顺序修复 (typeset → colorize → layout)

### 2. 修复
运行匹配的 fix skill，一次一个。

### 3. 重新评判
运行 /critique + /audit。绝不信任 fix skill 的自评分。

### 4. 判定
- Score >= 60 → Ship
- Score 50-59 且已尝试 2 轮修复 → Ship + 警告
- Score < 50 且已尝试 2 轮修复 → 标记人工审查

### 5. 学习
如果出现新的失败模式，在 solutions/ 创建记录。
```

---

## 知识维护

### 陈旧检测

知识会过时。维护节奏：

| 载体 | 检查频率 | 检查方式 |
|------|----------|----------|
| ADR | 每季度 | 验证 Verification checklist 是否仍然通过 |
| Solution | 每月 | 检查最近 30 天是否有相同问题，solution 是否仍有效 |
| Plan | 完成即归档 | — |
| Playbook | 每月 | 是否有步骤已过时 |

### 知识间的引用

```
ADR-003 (Judge/Fix 分离)
  ↓ 引用
Playbook: Quality Rescue (步骤 3 引用了分离原则)
  ↓ 引用
Solution: judge-score-always-low (引用了 Playbook 的校准步骤)
```

用 Markdown 链接保持引用关系，方便 agent 跟踪上下文。

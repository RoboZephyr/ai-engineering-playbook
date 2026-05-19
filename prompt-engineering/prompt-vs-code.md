---
name: prompt-vs-code
description: 工程边界——机械动作 vs 格式契约 vs 生成内容，哪些"必须"该写进 prompt、哪些该写进代码
when_to_use: 设计 pipeline 时；prompt 已堆满"必须"还出错；判断 LLM 还是 shell 做某件事
related: [./foundations, ./writing-rules, ../harness/architecture-patterns]
stage: method
---

# Prompt vs 工程约束

> 把 prompt 里的"必须"按本质分三层。能用 `execSync` 的别让 LLM 做——shell 失败是确定性的，LLM 失败是概率性的。

## 核心问题

写 pipeline 时，常常会在 prompt 里堆这种话：

```text
"必须用 Write 工具保存到 X.json"
"完成前必须 git add + git commit"
"工作树 dirty 不许结束 session"
"plugin 返回 markdown 后你必须从对话流里捞出来并 Write"
"自动模式：不要问用户、直接执行"
```

prompt 越堆越长，但出错率不降——**因为大部分"必须"根本不该写在 prompt 里**。

---

## 三层分类

把 prompt 里的"必须"按本质分三层：

| 层 | 例子 | 本质 | 归属 |
|----|------|------|------|
| **机械动作** | "必须 commit" / "必须 Write 到 X.json" / "工作树 clean" | deterministic shell / IO 操作 | **代码**（execSync + 守卫） |
| **格式契约** | "schema 必须 metadata+data" / "只能 4 字段" / "产出 codexIssuesAddressed 数组" | LLM 正在生成的内容约束 | **prompt + 可选 validator** |
| **生成内容** | "review 判断 spec 合规" / "simplify 精简代码" / "架构设计" | LLM 本职能力 | **prompt 驱动** |

### 关键判断

**问**：这件事如果让一个**确定性脚本**做，能做到吗？

- 能 → 是机械动作，写代码
- 不能（需要理解 / 判断 / 创造）→ 是生成内容，写 prompt
- 介于两者之间（生成时的格式约束）→ 是格式契约，prompt + schema 配合

---

## 为什么不能都靠 prompt

### 1. 失败模式不对

| 做法 | 失败模式 |
|------|---------|
| `execSync('git commit')` | 失败 → 立即非零退出码、pipeline 中止、问题可见 |
| Prompt 写 "必须 commit" | 失败 → LLM "忘了"，pipeline 以为成功继续往下，问题延迟暴露 |

shell 的失败是 **deterministic**，LLM 的失败是 **stochastic**。在 pipeline 里你需要的是前者。

### 2. Prompt 上下文被稀释

LLM 的上下文有限。每个 "必须 commit"、"必须 Write" 都在挤压真正的生成任务的注意力。Prompt 里挂了 5 条机械守卫，第 6 条真正的"创造性指令"就被边缘化。

### 3. 加新 phase 时重复劳动

每个 phase 的 prompt 都要重写一遍 "必须 X / 必须 Y / 必须 Z"。代码可以抽 helper（`commitIfDirty()` / `guardPhaseOutput()`），prompt 没法。

### 4. 调试困难

LLM 没 commit 时，错误现场已经过去——你只看到工作树 dirty，不知道 LLM 当时为啥决定不 commit。execSync 出错有 stderr、有 exit code、有可重现的步骤。

---

## 实战重构示例

### Before：所有"必须"都在 prompt

```typescript
const codexPrompt = `
You are codex agent. Your job:
1. Read PRD from X
2. Generate code
3. MUST use Write tool to save output to {outputFile}
4. MUST git add the file
5. MUST git commit with message "feat: codex output"
6. Work tree must be clean before you finish
7. If anything fails, DO NOT ask the user, retry yourself
8. Generate the implementation now.
`;

await spawnClaudeSession(codexPrompt);
// pipeline 假设上面都执行了，往下走
```

### After：机械动作搬到代码

```typescript
const codexPrompt = `
You are codex agent. Your job:
1. Read PRD from X
2. Generate code
3. Save output to {outputFile}

Generate the implementation now.
`;

await spawnClaudeSession(codexPrompt);

// pipeline 自己负责 deterministic 部分
guardPhaseOutput(outputFile);          // 验证文件存在 + 内容长度
commitIfDirty(workDir, 'feat: codex output');  // 自己跑 git
```

**结果**：

- Prompt 从 8 行降到 4 行，专注于生成任务
- 文件没写成 → `guardPhaseOutput` 立即报错（不是后面才发现）
- git 没 commit → `commitIfDirty` 自己执行（不依赖 LLM）
- 加新 phase 时复用 `guardPhaseOutput` / `commitIfDirty`，不复制 prompt

---

## 边界判断

### 应该在代码里的（机械动作）

- 文件 IO：保存、读取、移动、删除
- Git 操作：add / commit / push / branch
- Shell 调用：执行 build / test / linter
- 网络请求：调 API（不需要理解响应内容时）
- Schema 校验：JSON parse + validator
- 文件存在性 / 大小 / 权限检查
- 数据库读写
- 跨进程通信

### 应该在 prompt 里的（生成内容）

- 自然语言理解：解析需求、抽取意图
- 内容创作：写代码、写文案、写架构设计
- 主观判断：review 评分、合规判断
- 跨领域综合：把 PRD 转成 spec、把 spec 转成代码
- 异常情况的处理决策（在边界 case 里选哪条路）

### 中间地带（prompt + validator）

| 场景 | Prompt 写 | 代码校验 |
|------|----------|---------|
| 输出 JSON schema | "Return JSON conforming to schema below" + 给 schema | parse + Ajv / Zod 校验 |
| 输出字段范围 | "score is 0-100" | `assert 0 <= score <= 100` |
| 输出覆盖性 | "all input_ids must be referenced" + self-audit 字段 | 程序对比 input vs output 集合 |
| 输出格式风格 | "Use markdown table for comparisons" | 不需要校验（除非格式严格） |

---

## Anti-patterns

### Anti-pattern 1：用 prompt 做条件分支

```text
差：
If user_id exists, do A.
If user_id is empty, do B.
If user_id is invalid, do C.

好：
[在代码里 if/else 判断 user_id，分别调不同的 prompt]
```

复杂的条件逻辑用代码做。Prompt 里的条件分支模型可能不准确执行，且不可调试。

### Anti-pattern 2：用 prompt 做循环

```text
差：
For each item in the list, do X. Make sure you process all items.

好：
[在代码里 for 循环，每个 item 调一次 prompt 处理]
```

LLM 处理列表容易漏（lost-in-middle），用代码循环 + 单次 prompt 处理单个 item 更可靠。

### Anti-pattern 3：用 prompt 做事务

```text
差：
1. Update database
2. If fails, rollback
3. Send notification
4. If notification fails, rollback database

好：
[在代码里用事务 + try-catch 处理]
```

事务、回滚、补偿这类需要原子性的操作，绝对不能交给 LLM。

### Anti-pattern 4：用 normalizer 兜底 prompt 的问题

```typescript
// 差
const output = await llm.call(prompt);
const normalized = normalizeOutput(output);  // 兼容 LLM 偶尔输出错
return normalized;

// 好
const output = await llm.call(prompt);
validateSchema(output);  // 出错就报错，回头改 prompt
return output;
```

参见 [写作规范 / 规则 12](./writing-rules#规则-12-·-源头修-schema不在下游加-normalizer)。

---

## Hub vs Pipeline 思维

一个有用的心智模型：

- **Pipeline 是工程代码** —— 负责 deterministic 的调度、文件管理、git、shell、校验
- **LLM 是原子能力** —— 负责真正需要理解与生成的任务

Pipeline 的工作是把 LLM 像"调用一个函数"一样调用——传入参数、拿到输出、校验、传给下一步。Pipeline 自己处理所有副作用（文件、git、网络）。

LLM 的工作是接受清晰的输入、按 prompt 的指令处理、返回结构化输出。**LLM 不该负责"我处理完要做什么"——那是 pipeline 的事**。

---

## 实战重构的三步法

如果你接手一个 prompt 堆满"必须"的 pipeline：

### 步骤 1：审计

列出 prompt 里所有 "必须 X / MUST X" 句子。每条问：

- 这是机械动作吗？（能不能用 shell 一行解决？）
- 这是格式契约吗？（schema 能管吗？）
- 这是生成内容吗？（需要 LLM 理解？）

### 步骤 2：搬走机械动作

把所有"机械动作"挪到 pipeline 代码：

```typescript
// 抽 helpers
function commitIfDirty(dir: string, msg: string) { /* ... */ }
function guardPhaseOutput(file: string, minBytes: number) { /* ... */ }
function classifyPhaseOutcome(file: string): 'success' | 'empty' | 'missing' { /* ... */ }

// 在 phase 结束后 pipeline 自己调
await runPhase(prompt);
guardPhaseOutput(outputFile, 100);
commitIfDirty(workDir, `${phase}: output`);
```

### 步骤 3：精简 prompt

prompt 里只留：

- 任务说明（生成内容）
- 输入数据（XML 标签包裹）
- 输出 schema（格式契约）
- 必要的硬约束（不该被 LLM 自由发挥的部分）

---

## 验证：重构是否有效

| 指标 | 重构前 | 重构后 |
|------|--------|--------|
| Prompt 长度 | 20+ 行含多重"必须" | < 10 行专注生成任务 |
| Phase 失败模式 | 偶发 silent（LLM 忘了） | deterministic（pipeline 报错） |
| 加新 phase 成本 | 复制粘贴 prompt 守卫块 | 调用现有 helper |
| 调试时间 | 难复现、靠运气 | 看 stderr / exit code |
| Eval 失败率 | 概率性下降 | 显著下降 |

---

## 例外情况

### 1. 一次性原型

prototype 阶段可以先把"必须 X"写在 prompt 里跑通，**第二次同款时**再抽 helper（参见 [Harness 设计思想 / 三次原则](../harness/architecture-patterns)）。不要为了"以后会用"提前抽。

### 2. LLM 才能判断的"机械动作"

有些动作表面上是机械的，但**判断时机**需要 LLM：

- "code review 通过后才能 commit"——判断"通过"需要 LLM，但 commit 是机械
- 解法：prompt 让 LLM 输出 `should_commit: true/false`，代码读这个字段决定 commit

### 3. 用户在 loop 内的交互

如果是 interactive session（用户跟 LLM 对话），用户可以决定下一步——这种"自动 commit / 自动保存" 应该挂 hook 或快捷键，不是写进 system prompt。

---

## 检查清单

设计 pipeline 时：

- [ ] Prompt 里每条"必须 X"，能用 shell 一行做吗？能 → 搬到代码
- [ ] Pipeline 里所有 LLM phase 都有 `guardPhaseOutput`（验证产出存在）吗？
- [ ] Git 操作在 pipeline 代码里、不在 prompt 里吗？
- [ ] 文件 IO 在 pipeline 代码里、不在 prompt 里吗？
- [ ] 复杂条件分支在代码里、不在 prompt 里吗？
- [ ] 循环 / 迭代在代码里、不在 prompt 里吗？
- [ ] Schema 校验有程序化的 validator 吗？
- [ ] 加新 phase 时能复用现有 helper 吗？

## 触发时机

- 设计新 pipeline / 新 multi-phase workflow
- 接手 prompt 堆满"必须"的旧 pipeline
- LLM 偶发 silent 失败（不报错但没干活）
- Pipeline 加新 phase 要复制大量 prompt 守卫块时

## 参考

- 站内：[核心原则](./foundations) · [写作规范](./writing-rules) · [Harness 设计思想](../harness/architecture-patterns) · [日志系统](../harness/logging)
- Anthropic — [Chain complex prompts](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)：官方推荐的 "self-correction" 模式与本章思路一致

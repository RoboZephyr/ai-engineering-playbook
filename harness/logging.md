---
name: logging
description: Agent 日志系统设计。可观测 + 可修复的日志架构，自进化的数据基础
when_to_use: 搭建 pipeline；想知道 Agent 出错时如何追溯；要让 Agent 能从历史学习
inputs: [pipeline 工具栈, 失败案例]
outputs: [日志 schema, 检索方式, 反馈循环]
related: [./self-evolution, ./knowledge-system, ./init-methodology]
stage: method
---

# 日志系统设计

> 没有日志，一切改进都是盲的。日志是自修复、自迭代、自进化的数据基础。

## 为什么日志从第一天就要有

| 没有日志时 | 有日志时 |
|-----------|---------|
| "感觉最近质量下降了" | "过去 7 天平均分从 72 降到 64，主要失分在 typography" |
| "Pipeline 好像变慢了" | "content_gen phase 平均耗时从 12s 涨到 18s，因为切换了模型" |
| "这个 bug 又出现了" | "429 错误本月出现 8 次，其中 6 次在 10:00-11:00 时段" |
| "不知道花了多少钱" | "本周消耗 240K tokens，$3.2，平均每页 $0.16" |

日志不是"有了再说"的东西。缺少早期日志意味着缺少基线，后续无法判断改进还是退化。

---

## 三级日志架构

### L1: Phase 级日志（实时）

每次 pipeline 运行，每个 phase 产生一条记录。

```typescript
interface PhaseLog {
  phase: string;          // 'research' | 'kit' | 'content' | 'judge' | 'fix'
  status: 'success' | 'failed' | 'skipped';
  startTime: string;      // ISO 8601
  duration: number;       // ms
  input: {
    summary: string;      // 1-2 sentence，不是完整输入
  };
  output: {
    summary: string;
    metrics: Record<string, number>;
  };
  error?: {
    type: 'api_error' | 'quality_failure' | 'timeout' | 'validation';
    message: string;
    retryable: boolean;
    solutionMatched?: string;  // 指向 solutions/ 的文件名
  };
  llmCalls: LLMCallLog[];
}

interface LLMCallLog {
  model: string;
  purpose: string;        // 'content_gen' | 'judge' | 'site_analysis'
  inputTokens: number;
  outputTokens: number;
  latency: number;        // ms
  cached: boolean;
}
```

**存储**: `docs/harness/logs/runs/<date>-<topic>.jsonl`，每行一个 PhaseLog。

### L2: Run 级日志（汇总）

每次 pipeline 完成，追加一行到 `metrics/quality-tracker.jsonl`：

```typescript
interface RunSummary {
  runId: string;
  date: string;            // YYYY-MM-DD
  topic: string;
  outcome: 'success' | 'partial' | 'failed';
  qualityScore: number;
  duration: number;        // ms, total
  cost: {
    tokens: number;
    usd: number;
  };
  iterations: number;      // judge-fix 循环次数
  config: {
    mode: string;
    model: string;
    preset: string;
  };
  phases: Record<string, {  // phase name → summary
    duration: number;
    status: string;
  }>;
}
```

**存储**: `docs/harness/metrics/quality-tracker.jsonl`，长期追加，不清理。

### L3: 趋势洞察（周期性）

非自动产生，由人或 agent 定期分析 L1+L2 数据后总结。

分析维度：
- **质量趋势**: 近 N 次运行的平均分是在上升还是下降
- **性能趋势**: 各 phase 耗时变化
- **成本趋势**: token 消耗和美元成本
- **故障模式**: 最常见的错误类型和重复频率
- **模型对比**: 不同模型在相同任务上的性价比

---

## 日志的三个用途

### 用途 1: 自修复

```
Pipeline phase 失败
  → Logger 记录错误类型 + 消息
  → 自修复模块搜索 solutions/，匹配 error.type + keywords
    → 匹配成功 → 应用 solution 中的修复步骤 → 重试
    → 匹配失败 → 报告给人类 → 事后创建新 solution
```

关键：匹配不需要精确，模糊匹配（error type + 关键词）就够了。Solution 文件的 `## Symptoms` 部分就是用来匹配的。

### 用途 2: 自迭代

```
积累了 20+ 次运行日志后
  → 人/Agent 分析 quality-tracker.jsonl
  → 发现规律:
    - "content_gen phase 失败率 30%，主要原因是 char limit violation"
      → 改进: 在 prompt 中加入更明确的字数限制
      → 产出: 新 ADR 或 prompt 调整
    - "judge phase 平均给分偏低，多次 fix 后仍然 < 60"
      → 改进: 校准 judge 的评分标准
      → 产出: 新 Solution
```

### 用途 3: 自进化

```
模型从 v3 升级到 v4 后
  → 对比相同任务在新旧模型下的日志
  → 发现: "旧模型需要 3 次 fix 循环，新模型 1 次就达标"
  → 推论: 某些 fix 约束可能不再需要
  → 行动: 衰减检测实验 → 退休过时约束
```

---

## 实现参考

### 最小可用的 Logger（TypeScript）

```typescript
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const LOGS_DIR = 'docs/harness/logs/runs';
const METRICS_FILE = 'docs/harness/metrics/quality-tracker.jsonl';

export function createRunLogger(topic: string) {
  const runId = crypto.randomUUID();
  const date = new Date().toISOString().slice(0, 10);
  const logFile = join(LOGS_DIR, `${date}-${topic}.jsonl`);
  
  mkdirSync(LOGS_DIR, { recursive: true });

  const phases: Array<Record<string, unknown>> = [];
  let runStart = Date.now();

  return {
    logPhase(log: Record<string, unknown>) {
      const entry = { runId, ...log };
      appendFileSync(logFile, JSON.stringify(entry) + '\n');
      phases.push(entry);
    },

    logLLMCall(call: Record<string, unknown>) {
      // 可以附加到当前 phase 或独立记录
      appendFileSync(logFile, JSON.stringify({ runId, type: 'llm_call', ...call }) + '\n');
    },

    finalize(outcome: string, qualityScore: number) {
      const summary = {
        runId,
        date,
        topic,
        outcome,
        qualityScore,
        duration: Date.now() - runStart,
        phases: phases.map(p => ({
          phase: p.phase,
          duration: p.duration,
          status: p.status,
        })),
      };
      
      mkdirSync(join('docs/harness/metrics'), { recursive: true });
      appendFileSync(METRICS_FILE, JSON.stringify(summary) + '\n');
      
      return summary;
    },
  };
}
```

### 使用示例

```typescript
const logger = createRunLogger('ai-code-review');

// Phase 开始
const start = Date.now();
const result = await runResearch(topic);
logger.logPhase({
  phase: 'research',
  status: 'success',
  duration: Date.now() - start,
  output: { summary: `Found ${result.sources.length} sources` },
});

// LLM 调用
logger.logLLMCall({
  model: 'gemini-3.1-flash-lite',
  purpose: 'content_gen',
  inputTokens: 1200,
  outputTokens: 3400,
  latency: 8200,
});

// Pipeline 完成
logger.finalize('success', 72);
```

---

## 日志文件管理

| 文件类型 | 保留策略 | 大小预估 |
|----------|----------|----------|
| `runs/*.jsonl` | 保留最近 30 天，之后归档 | ~5KB/次运行 |
| `quality-tracker.jsonl` | 永久保留 | ~200B/次运行 |
| L3 洞察报告 | 永久保留 | 手动产出 |

### 查询示例

```bash
# 最近 10 次运行的质量分
tail -10 docs/harness/metrics/quality-tracker.jsonl | jq '.qualityScore'

# 所有失败的 phase
cat docs/harness/logs/runs/*.jsonl | jq 'select(.status == "failed")'

# 某个 topic 的所有 LLM 调用成本
cat docs/harness/logs/runs/*-ai-code-review.jsonl | \
  jq 'select(.type == "llm_call") | .inputTokens + .outputTokens'

# 本周总成本
cat docs/harness/metrics/quality-tracker.jsonl | \
  jq 'select(.date >= "2026-04-01") | .cost.usd' | \
  paste -sd+ | bc
```

---

## 观测工具选择

如果需要更专业的观测平台：

| 场景 | 推荐 | 理由 |
|------|------|------|
| 个人项目 / 起步阶段 | JSONL 文件（本方案） | 零依赖，够用 |
| 需要可视化 dashboard | Langfuse (self-hosted) | 开源免费，支持 trace |
| 快速集成、不想自建 | Helicone | 15 分钟 proxy 集成 |
| 复杂多 agent 系统 | AgentOps | Session replay 能力 |
| 企业级、已有 Datadog | Datadog LLM Observability | 集成已有监控 |

本方案（JSONL 文件）的优势：
- 零依赖，Git 可追踪
- Agent 可以直接 `cat` + `jq` 分析
- 不需要额外的服务或 API key
- 随时可以迁移到更专业的平台（JSONL 是通用格式）

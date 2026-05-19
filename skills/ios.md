---
name: ios-skills
description: iOS 开发 Skills 评测。SwiftUI / UIKit / Liquid Glass / Xcode 自动化 / App Store 发布
when_to_use: 选 iOS Skill；iOS 项目找 SwiftUI / SwiftData / Xcode 工具
related: [./, /workflows/ios-feature-dev]
stage: domain
---

# iOS 开发 Skills

> SwiftUI、UIKit、Liquid Glass、Xcode 自动化、App Store 发布相关的 AI 编码 Skills。

::: tip 注意
Web 前端专属 Skills（如 Impeccable、ui-skills、frontend-design）**不适用于 iOS 项目**，请勿混用。iOS 项目应使用本页列出的原生 Skills。
:::

## 速查表

| Skill | 作者/来源 | 优先级 | 覆盖范围 | 安装方式 |
|-------|----------|--------|---------|---------|
| **swiftui-pro** | twostraws (Paul Hudson) | 必装 | SwiftUI 9 项检查、iOS 26、Swift 6.2+ | `npx skills add` |
| **swiftui-expert-skill** | AvdLee (Antoine van der Lee) | 必装 | State、Charts、Liquid Glass、性能 | `npx skills add` |
| **Axiom** | CharlesWiltgen | 推荐 | 175 Skills + 38 Agents + 12 Commands | 手动安装 |
| **swift-ios-skills** | dpearson2699 | 推荐 | 57 Skills / 8 大类 | `npx skills add --all` |
| **Patrick Serrano Skills** | patrickserrano | 推荐 | 10 个专项 Skill | `npx skills add` |
| **claude-code-apple-skills** | rshankras | 视情况 | 148 Skills / 23 类 / 全平台 | 手动安装 |
| **iOS Cursor Rules** | brunogama | 视情况 | 28 条规则文件 | Cursor 配置 |
| **XcodeBuildMCP** | getsentry | 工具 | Xcode 构建 / 测试 / 模拟器 / LLDB | MCP Server |
| **iOS Simulator Skill** | conorluddy | 工具 | 模拟器导航 / 21 脚本 | `npx skills add` |

---

## 必装

日常 iOS/SwiftUI 开发几乎所有项目都受益的 Skills。

### swiftui-pro

- **作者**: Paul Hudson ([@twostraws](https://github.com/twostraws))
- **仓库**: <https://github.com/twostraws/SwiftUI-Agent-Skill>
- **安装**:
  ```bash
  npx skills add https://github.com/twostraws/swiftui-agent-skill --skill swiftui-pro
  ```

**核心能力 — 9 项顺序检查**:

1. **Deprecated API 检测** — 标记已弃用 API，推荐替代方案
2. **View 优化** — 拆分过大视图、减少 body 复杂度
3. **Modifier 优化** — 修正 modifier 顺序与冗余
4. **Animation 优化** — 推荐合适的动画 API
5. **Data Flow 验证** — 确保 @State / @Observable / @Environment 使用正确
6. **Navigation 模式** — NavigationStack/NavigationSplitView 最佳实践
7. **HIG 合规** — 遵循 Apple Human Interface Guidelines
8. **无障碍 (Accessibility)** — VoiceOver 标签、Dynamic Type 支持
9. **性能** — 避免不必要的重绘、优化列表渲染

**目标平台**: iOS 26，Swift 6.2+

**Paul Hudson 维护的 Skills 索引**:
Paul Hudson 还在 <https://github.com/twostraws/swift-agent-skills> 维护了一个集合索引，包含以下扩展 Skills:
- **swift-concurrency-pro** — async/await、Actor、Sendable 检查
- **swiftdata-pro** — SwiftData 模型设计与查询优化
- **swift-testing-pro** — Swift Testing 框架最佳实践

> **评价**: 这是目前 SwiftUI 质量最高的单一 Skill。9 项检查覆盖了从代码质量到用户体验的完整链路，特别是 Deprecated API 检测在 iOS 版本迭代频繁的生态中极为实用。

---

### swiftui-expert-skill

- **作者**: Antoine van der Lee ([@AvdLee](https://github.com/AvdLee))
- **仓库**: <https://github.com/AvdLee/SwiftUI-Agent-Skill>
- **安装**:
  ```bash
  npx skills add https://github.com/AvdLee/SwiftUI-Agent-Skill --skill swiftui-expert-skill
  ```

**核心能力**:

- **State Management** — @Observable、@State、@Bindable、@Environment 最佳实践
- **View Composition** — 视图拆分、可复用组件设计
- **Swift Charts** — 数据可视化图表构建
- **Animations** — Spring、PhaseAnimator、KeyframeAnimator 指导
- **iOS 26 Liquid Glass** — .glassEffect() 新特性支持
- **Performance** — 渲染性能优化、内存管理

**设计亮点**: 参考文件按需加载（on-demand loading），避免 context 膨胀。这意味着只有当你实际使用某个功能时，相关参考资料才会被注入 context，有效节省 token 预算。

> **评价**: 与 swiftui-pro 互补性极强。swiftui-pro 侧重 9 项检查的系统性审查，swiftui-expert-skill 则在 Swift Charts、Liquid Glass 等专项领域提供更深入的参考资料。两者搭配使用是最佳选择。

---

## 推荐

特定场景或进阶需求中很有价值的 Skills。

### Axiom

- **作者**: CharlesWiltgen ([@CharlesWiltgen](https://github.com/CharlesWiltgen))
- **仓库**: <https://github.com/CharlesWiltgen/Axiom>
- **规模**: 175 Skills + 38 Agents + 12 Commands

**覆盖领域**:
- UI 布局与交互
- Concurrency（并发安全）
- Performance（性能调优）
- Networking（网络层）
- Accessibility（无障碍）
- Build Diagnostics（构建诊断）

**常用 Commands**:
| 命令 | 作用 |
|------|------|
| `/axiom:console` | 查看控制台输出 |
| `/axiom:fix-build` | 自动修复构建错误 |
| `/axiom:audit memory` | 内存审计 |
| `/axiom:health-check` | 项目健康检查 |

> **评价**: 规模庞大且覆盖面广，适合大型 iOS 项目。Commands 功能让常见操作变成一键触发，特别是 `/axiom:fix-build` 对 Xcode 构建错误的自动修复非常实用。

---

### swift-ios-skills

- **作者**: dpearson2699 ([@dpearson2699](https://github.com/dpearson2699))
- **仓库**: <https://github.com/dpearson2699/swift-ios-skills>
- **规模**: 57 Skills
- **安装**:
  ```bash
  npx skills add dpearson2699/swift-ios-skills --all
  ```

**8 大分类**:

| 类别 | 数量 | 示例 |
|------|------|------|
| SwiftUI | 9 | 视图构建、布局、导航 |
| Core Swift | 6 | 协议、泛型、错误处理 |
| App Experience | 10 | 通知、Widget、App Intent |
| Data & Services | 7 | CoreData、网络、CloudKit |
| AI/ML | 5 | CoreML、Vision、NLP |
| iOS Engineering | 10 | 性能、内存、Instruments |
| Hardware | 5 | 相机、传感器、蓝牙 |
| Platform Integration | 5 | ShareExtension、Siri、HealthKit |

> **评价**: 最全面的分类体系，覆盖了 iOS 开发的几乎所有子领域。AI/ML 和 Hardware 类别是其他 Skills 很少涉及的独特亮点。适合需要广泛覆盖的团队。

---

### Patrick Serrano Skills

- **作者**: Patrick Serrano ([@patrickserrano](https://github.com/patrickserrano))
- **仓库**: <https://github.com/patrickserrano/skills>
- **规模**: 10 个专项 Skill

**Skill 列表**:
- **ios-debugger-agent** — iOS 调试自动化
- **swift-concurrency-expert** — Swift 并发深度指导
- **swiftui-liquid-glass** — Liquid Glass 专项
- **swiftui-ui-patterns** — SwiftUI UI 模式
- **swiftui-view-refactor** — 视图重构
- **swiftui-performance-audit** — SwiftUI 性能审计
- **release-app-store-changelog** — App Store 发布变更日志生成
- **native-app-profiling** — 原生 App 性能分析

> **评价**: 小而精的专项集合。ios-debugger-agent 和 native-app-profiling 提供了调试与性能分析的专业能力，release-app-store-changelog 则在发版流程中非常实用。

---

## 视情况

特定项目类型、团队规模或开发阶段才需要的 Skills。

### claude-code-apple-skills

- **作者**: rshankras ([@rshankras](https://github.com/rshankras))
- **仓库**: <https://github.com/rshankras/claude-code-apple-skills>
- **规模**: 148 Skills / 23 个类别

**覆盖平台**: iOS / macOS / watchOS / visionOS 全平台

**分类概览**:
| 类型 | 数量 | 说明 |
|------|------|------|
| Generators | 52 | 代码生成器（视图、模型、网络层等） |
| Product Workflow | 13 | 产品工作流（需求分析、设计评审） |
| Testing | 8 | 测试（XCTest、UI Test、快照测试） |
| App Store | 7 | App Store 相关（截图、元数据、审核） |
| Security / Performance | 若干 | 安全审计与性能优化 |

> **适用场景**: 需要覆盖 Apple 全平台的团队，或需要大量代码生成器的快速原型项目。148 个 Skills 规模庞大，建议按需挑选安装而非全量导入。

---

### iOS Cursor Rules

- **作者**: brunogama ([@brunogama](https://github.com/brunogama))
- **仓库**: <https://github.com/brunogama/ios-cursor-rules>
- **规模**: 28 条规则文件

**规则分类**:
- **Core Development** — 基础 Swift/SwiftUI 编码规范
- **Architecture** — DDD、Clean Architecture、MVVM
- **Testing** — 测试策略与覆盖率
- **Release** — 发布流程与版本管理
- **Refactoring** — 重构策略与代码迁移
- **Planning** — 技术方案与架构设计

> **适用场景**: 使用 Cursor 编辑器的 iOS 开发者。这些规则也可以参考其内容手动转化为 Claude Code 的 CLAUDE.md 规则。

---

## 开发工具

辅助 iOS 开发流程的 MCP Server 和工具型 Skills。

### XcodeBuildMCP

- **来源**: getsentry ([@getsentry](https://github.com/getsentry))
- **仓库**: <https://github.com/getsentry/XcodeBuildMCP>
- **类型**: MCP Server

**核心能力 — 无需打开 Xcode 即可完成**:
- **Build** — 编译项目、增量构建
- **Test** — 运行单元测试和 UI 测试
- **Simulator** — 启动/管理 iOS 模拟器
- **Device Deployment** — 部署到真机
- **LLDB Debugging** — 断点调试、变量检查

**与 Xcode 26 集成**: Xcode 26 内置了 Claude Agent 支持，XcodeBuildMCP 可与之配合，实现 AI 驱动的完整 Xcode 自动化工作流。

> **评价**: 对于习惯在终端/编辑器中工作、不想频繁切换 Xcode 的开发者来说，这是最重要的基础设施工具。

---

### iOS Simulator Skill

- **作者**: conorluddy ([@conorluddy](https://github.com/conorluddy))
- **仓库**: <https://github.com/conorluddy/ios-simulator-skill>
- **规模**: 21 个脚本

**核心特点**:
- **Accessibility-semantic 导航** — 基于无障碍语义的模拟器元素定位
- **96% Token 节省** — 相比截图方式，大幅减少 context token 消耗
- **100% Eval 通过率** — 在评测中达到完美通过率

> **评价**: 创新性地使用无障碍语义而非截图来导航模拟器，既提高了准确性又大幅降低了 token 成本。特别适合需要自动化 UI 测试或交互验证的场景。

---

## Key Patterns 参考

iOS 开发中常用的关键模式速查，这些 Skills 会帮你自动应用这些模式。

### State Management（iOS 17+）

iOS 17 引入了基于 Observation 框架的新状态管理方式:

| 旧 API | 新 API（iOS 17+） | 用途 |
|--------|-------------------|------|
| `ObservableObject` | `@Observable` | 可观察对象声明 |
| `@ObservedObject` | `@Bindable` | 父视图传入的可观察对象 |
| `@StateObject` | `@State` | 视图局部拥有的可观察对象 |
| `@EnvironmentObject` | `@Environment` | 环境注入的可观察对象 |

### Animation API 选择指南

| API | 适用场景 | 示例 |
|-----|---------|------|
| `Spring` | 用户交互响应（拖拽、点击） | `.spring(duration: 0.5, bounce: 0.3)` |
| `PhaseAnimator` | 多阶段序列动画 | 加载指示器、状态过渡 |
| `KeyframeAnimator` | 精确关键帧控制 | 复杂弹跳、路径动画 |
| `.symbolEffect()` | SF Symbol 动画 | 按钮图标状态变化 |

### iOS 26 Liquid Glass

iOS 26 引入了 Liquid Glass 设计语言:

```swift
// 基础用法
.glassEffect()

// 容器
GlassEffectContainer {
    // 子视图自动继承玻璃效果
}

// 标识
.glassEffectID("uniqueID")
```

> swiftui-pro 和 swiftui-expert-skill 均已支持 Liquid Glass 检查与最佳实践。

---

## 推荐安装组合

### Minimal（最小安装）

适合个人开发者或小型项目，覆盖核心 SwiftUI 开发:

```bash
# 两个必装 Skills
npx skills add https://github.com/twostraws/swiftui-agent-skill --skill swiftui-pro
npx skills add https://github.com/AvdLee/SwiftUI-Agent-Skill --skill swiftui-expert-skill
```

### Full（完整安装）

适合专业团队或复杂项目，覆盖全栈 iOS 开发:

```bash
# 必装
npx skills add https://github.com/twostraws/swiftui-agent-skill --skill swiftui-pro
npx skills add https://github.com/AvdLee/SwiftUI-Agent-Skill --skill swiftui-expert-skill

# Paul Hudson 扩展系列
npx skills add https://github.com/twostraws/swift-agent-skills --skill swift-concurrency-pro
npx skills add https://github.com/twostraws/swift-agent-skills --skill swift-testing-pro
npx skills add https://github.com/twostraws/swift-agent-skills --skill swiftdata-pro

# 广覆盖补充
npx skills add dpearson2699/swift-ios-skills --all
npx skills add patrickserrano/skills --all
```

---

## 工作流与资源

- [Skill 生态快照 2026-03](../research/skill-ecosystem-2026-03.md) — 全领域 Skills 完整清单（L3 事实层）
- [Skills 知识中枢 / 评测方法](./#how-we-evaluate) — Skills 评测标准说明
- [CONTRIBUTING.md](https://github.com/zephyrme/ai-engineering-playbook/blob/main/CONTRIBUTING.md) — 如何提交新 Skill 或改进现有内容
- [Paul Hudson Swift Skills 索引](https://github.com/twostraws/swift-agent-skills) — Swift 相关 Skills 集合
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) — Apple 人机界面指南
- [Swift.org](https://www.swift.org/) — Swift 语言官方资源

---
name: ios-feature-dev
description: iOS 功能开发流程。从代码质量基础到 App Store 发布的 SwiftUI Skill 编排
when_to_use: iOS 应用新功能/界面；SwiftUI 项目；Xcode 自动化；不适用于 Web
inputs: [设计稿/需求, 现有 iOS 代码库]
outputs: [SwiftUI 代码, 单元测试, 发布构建]
skills_used: [swiftui-pro, swiftui-expert-skill, xcode 自动化]
related: [/skills/ios, ./web-feature-dev]
stage: workflow
---

# iOS 功能开发流程

> iOS 应用功能开发的 Skill 编排参考。从代码质量基础到 App Store 发布，按有序的 Phase 调用 SwiftUI 原生 Skills 完成完整开发周期。

::: tip 与 Web 工作流的区别
本工作流专为 iOS 原生开发设计。Web 前端请使用 [Web 前端功能开发流程](./web-feature-dev.md)，其中的 Impeccable、ui-skills、frontend-design 等 **不适用于 iOS 项目**。
:::

## 适用场景

- iOS 应用新功能 / 新界面开发
- SwiftUI 视图构建与优化
- iOS 26 Liquid Glass 适配
- 现有功能的性能优化与重构
- App Store 版本发布准备

## 前置准备

### Minimal（最小安装）

适合个人开发者或小型项目:

| Skill | 安装命令 | 说明 |
|-------|---------|------|
| **swiftui-pro** | `npx skills add https://github.com/twostraws/swiftui-agent-skill --skill swiftui-pro` | 9 项顺序检查，覆盖 SwiftUI 全链路 |
| **swiftui-expert-skill** | `npx skills add https://github.com/AvdLee/SwiftUI-Agent-Skill --skill swiftui-expert-skill` | State、Charts、Liquid Glass、性能 |

### Full（完整安装）

适合专业团队或复杂项目，在 Minimal 基础上增加:

| Skill | 安装命令 | 说明 |
|-------|---------|------|
| **swift-concurrency-pro** | `npx skills add https://github.com/twostraws/swift-agent-skills --skill swift-concurrency-pro` | async/await、Actor、Sendable |
| **swift-testing-pro** | `npx skills add https://github.com/twostraws/swift-agent-skills --skill swift-testing-pro` | Swift Testing 框架 (#expect, @Test) |
| **swiftdata-pro** | `npx skills add https://github.com/twostraws/swift-agent-skills --skill swiftdata-pro` | SwiftData 模型设计与查询 |
| **Patrick Serrano Skills** | `npx skills add patrickserrano/skills --all` | ios-debugger-agent、performance-audit 等 |

## 完整流程

### Phase 1: 代码质量基础

利用 swiftui-pro 的 9 项顺序检查，在编码阶段就建立高质量基线。

| 步骤 | Skill / 检查项 | 作用 | 备注 |
|------|---------------|------|------|
| 1.1 | swiftui-pro — Deprecated API 检测 | 标记已弃用 API，推荐替代方案 | 确保兼容 iOS 26 / Swift 6.2+ |
| 1.2 | swiftui-pro — View 优化 | 拆分过大视图、减少 body 复杂度 | 单个 View body 不应超过合理行数 |
| 1.3 | swiftui-pro — Modifier 优化 | 修正 modifier 顺序与冗余 | 顺序错误会导致布局异常 |
| 1.4 | swiftui-pro — Animation 优化 | 推荐合适的动画 API | 用户交互 → Spring animation |
| 1.5 | swiftui-pro — Data Flow 验证 | 确保 @State / @Observable / @Environment 使用正确 | 使用 @Observable，**不要用** ObservableObject |
| 1.6 | swiftui-pro — Navigation 模式 | NavigationStack / NavigationSplitView 最佳实践 | 使用 navigationDestination() 实现程序化导航 |
| 1.7 | swiftui-pro — HIG 合规 | 遵循 Apple Human Interface Guidelines | 间距、字号、触摸目标等 |
| 1.8 | swiftui-pro — 无障碍检查 | VoiceOver 标签、Dynamic Type 支持 | 始终检查 accessibilityReduceMotion |
| 1.9 | swiftui-pro — 性能检查 | 避免不必要的重绘、优化列表渲染 | 关注 LazyVStack/LazyHStack 使用 |

---

### Phase 2: 设计实现

利用 swiftui-expert-skill 的专项能力，实现具体的 UI 设计。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 2.1 | swiftui-expert-skill — State Management | @Observable、@State、@Bindable、@Environment 最佳实践 | 参考文件按需加载，节省 token |
| 2.2 | swiftui-expert-skill — View Composition | 视图拆分、可复用组件设计 | 遵循单一职责原则 |
| 2.3 | swiftui-expert-skill — Swift Charts | 数据可视化图表构建 | 按需使用 |
| 2.4 | swiftui-expert-skill — Animations | Spring、PhaseAnimator、KeyframeAnimator | 用户交互优先使用 Spring |
| 2.5 | swiftui-expert-skill — Liquid Glass | .glassEffect()、GlassEffectContainer | iOS 26 新特性 |

---

### Phase 3: 并发与数据

处理异步操作和数据持久化，确保并发安全。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 3.1 | swift-concurrency-pro | async/await、Actor 隔离、Sendable 合规 | 确保 Swift 6 strict concurrency 通过 |
| 3.2 | swiftdata-pro | SwiftData 模型设计、@Query、数据迁移 | 替代 Core Data 的现代方案 |

---

### Phase 4: 测试

编写和运行测试，确保功能正确性。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 4.1 | swift-testing-pro | 使用 Swift Testing 框架编写测试 | 使用 #expect 而非 XCTAssert，使用 @Test 而非 func test |

---

### Phase 5: 调试与性能

发现并修复性能瓶颈和运行时问题。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 5.1 | ios-debugger-agent (patrickserrano) | iOS 调试自动化 | 断点、变量检查、LLDB |
| 5.2 | swiftui-performance-audit (patrickserrano) | SwiftUI 性能审计 | 重绘检测、内存泄漏 |
| 5.3 | native-app-profiling (patrickserrano) | Instruments 性能分析 | CPU、内存、网络、电量 |

---

### Phase 6: 发布

生成 App Store 发布所需的变更日志。

| 步骤 | Skill / 命令 | 作用 | 备注 |
|------|-------------|------|------|
| 6.1 | release-app-store-changelog (patrickserrano) | 自动生成 App Store 发布说明 | 基于 git 提交历史 |

## 快速参考

熟练后可使用一行版快速执行核心流程:

```
swiftui-pro (9 checks) → swiftui-expert-skill (设计实现) → swift-concurrency-pro → swiftdata-pro → swift-testing-pro → ios-debugger-agent → swiftui-performance-audit → release-app-store-changelog
```

## 关键规则速查

在整个 iOS 开发流程中，务必遵循以下核心规则:

| 规则 | 说明 |
|------|------|
| 使用 `@Observable`，**不要用** `ObservableObject` | iOS 17+ Observation 框架是现代标准 |
| 用户交互 → Spring animation | `.spring(duration: 0.5, bounce: 0.3)` |
| 始终检查 `accessibilityReduceMotion` | 尊重用户的辅助功能偏好设置 |
| 使用 `NavigationStack` + `navigationDestination()` | 实现程序化导航，取代 NavigationLink(destination:) |

## 涉及的 Skills

- → [iOS 开发 Skills](../skills/ios.md)
- → [测试 Skills](../skills/testing.md)
- → [Skill 生态快照 2026-03](../research/skill-ecosystem-2026-03.md)

import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI Engineering Playbook',
  description: 'AI Agent 工程实践知识库 — Harness 设计、Skill 选型、工作流编排',
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],

  vite: {
    server: {
      port: 5175,
      strictPort: true,
    },
  },

  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: 'Harness', link: '/harness/' },
      { text: 'Prompt', link: '/prompt-engineering/' },
      { text: 'Skills', link: '/skills/' },
      { text: 'Visual Engineering', link: '/visual-engineering/' },
      { text: '工作流', link: '/workflows/' },
      { text: 'Reference', link: '/research/' },
    ],

    sidebar: [
      {
        text: 'Harness Engineering',
        items: [
          { text: '概述', link: '/harness/' },
          { text: 'Init 方法论', link: '/harness/init-methodology' },
          { text: '设计思想', link: '/harness/architecture-patterns' },
          { text: 'Context 设计', link: '/harness/context-design' },
          { text: 'Loop Engineering', link: '/harness/loop-engineering' },
          { text: '日志系统', link: '/harness/logging' },
          { text: '知识管理', link: '/harness/knowledge-system' },
          { text: 'LLM Wiki / Agent 知识库', link: '/harness/llm-wiki' },
          { text: '自进化', link: '/harness/self-evolution' },
          { text: '模板库', link: '/harness/templates' },
        ]
      },
      {
        text: 'Prompt Engineering',
        items: [
          { text: '总览', link: '/prompt-engineering/' },
          { text: '核心原则（10 条 + 学术底座）', link: '/prompt-engineering/foundations' },
          { text: '通用写作规范', link: '/prompt-engineering/writing-rules' },
          { text: 'SKILL.md 作者指南', link: '/prompt-engineering/skill-authoring' },
          { text: '长上下文 + 结构化 + Caching', link: '/prompt-engineering/long-context-and-structured-output' },
          { text: '模型差异（4.7 / GPT-5 / Gemini）', link: '/prompt-engineering/model-specifics' },
          { text: 'Prompt vs 工程约束', link: '/prompt-engineering/prompt-vs-code' },
        ]
      },
      {
        text: 'Skills 技能库',
        items: [
          { text: '知识中枢（概念 / 选型 / 评测）', link: '/skills/' },
          { text: 'Anthropic 官方内置', link: '/skills/built-in' },
          { text: '前端开发', link: '/skills/frontend' },
          { text: 'iOS 开发', link: '/skills/ios' },
          { text: '设计系统', link: '/skills/design' },
          { text: '测试', link: '/skills/testing' },
          { text: '代码质量', link: '/skills/code-quality' },
          { text: '文档工具', link: '/skills/documentation' },
        ]
      },
      {
        text: 'Visual Engineering',
        items: [
          { text: '总览', link: '/visual-engineering/' },
          { text: '输入文档 (PRODUCT.md / DESIGN.md)', link: '/visual-engineering/input-docs' },
          { text: 'Visual Kit (含 dial / brand_voice 派生)', link: '/visual-engineering/visual-kit' },
          { text: '反模式 + AI 微指纹', link: '/visual-engineering/anti-patterns' },
          { text: '设计审查', link: '/visual-engineering/design-critique' },
        ]
      },
      {
        text: '场景工作流',
        items: [
          { text: '概览', link: '/workflows/' },
          { text: '产品需求书编写', link: '/workflows/product-spec' },
          { text: '技术架构设计', link: '/workflows/tech-architecture' },
          { text: '埋点与收入对账', link: '/workflows/analytics-instrumentation' },
          { text: 'TDD 开发', link: '/workflows/tdd-cycle' },
          { text: 'Web 功能开发', link: '/workflows/web-feature-dev' },
          { text: 'iOS 功能开发', link: '/workflows/ios-feature-dev' },
          { text: '代码审查', link: '/workflows/code-review' },
          { text: 'Landing Page 素材生成', link: '/workflows/landing-page-assets' },
        ]
      },
      {
        text: 'Reference（事实层）',
        items: [
          { text: '板块说明', link: '/research/' },
          { text: '官方信源索引 2026-05', link: '/research/official-sources-2026-05' },
          { text: 'Skill 生态快照 2026-03', link: '/research/skill-ecosystem-2026-03' },
          { text: 'Harness 文献快照 2026-04', link: '/research/harness-literature-2026-04' },
          { text: 'Loop Engineering 快照 2026-06', link: '/research/loop-engineering-2026-06' },
          { text: 'LLM-Wiki / PKM 系统 2026-06', link: '/research/llm-wiki-pkm-systems-2026-06' },
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})

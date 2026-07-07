# IMPLEMENTATION_PLAN — 分阶段实施计划

> Phase 0 初稿 | 2025-07-07

## 总体阶段概览

| 阶段 | 名称 | 内容 | 状态 |
|------|------|------|------|
| Phase 0 | 仓库审计和项目规划 | 文档、架构、规划 | ✅ 进行中 |
| Phase 1 | 设计系统与静态原型 | 组件库、首页原型 | ⬜ 待开始 |
| Phase 2 | 第一个完整闭环 | 图片压缩功能 | ⬜ 待开始 |
| Phase 3 | 图片核心工具 | 尺寸/格式/DPI/元数据/签名 | ⬜ 待开始 |
| Phase 4 | 文件合规检查器 | 自定义要求 + 检查 + 建议 | ⬜ 待开始 |
| Phase 5 | PDF 工具 | 转 PDF/合并/拆分/旋转 | ⬜ 待开始 |
| Phase 6 | 内容、SEO 和多语言 | 英文+中文、指南、元数据 | ⬜ 待开始 |
| Phase 7 | Analytics、隐私和 AdSense | 事件、同意、广告预留 | ⬜ 待开始 |
| Phase 8 | 上线验收 | 测试、性能、部署 | ⬜ 待开始 |

---

## Phase 0：仓库审计和项目规划

### 目标
检查仓库、建立文档体系、形成完整规划

### 已完成
- [x] 仓库检查（空仓库，全新项目）
- [x] 技术栈确认（Node.js 22, Python 3.11 可用）
- [x] 创建 `AGENTS.md`
- [x] 创建 `docs/PRD.md`
- [x] 创建 `docs/DESIGN_SYSTEM.md`
- [x] 创建 `docs/DECISIONS.md`
- [x] 创建 `docs/INFORMATION_ARCHITECTURE.md`
- [x] 创建 `docs/INTERACTION_SPEC.md`
- [x] 创建 `docs/SEO_CONTENT_STRATEGY.md`
- [x] 创建 `docs/ADSENSE_PRIVACY.md`
- [x] 创建 `docs/SECURITY_AND_FILE_PROCESSING.md`
- [x] 创建 `docs/ANALYTICS_PLAN.md`
- [x] 创建 `docs/TEST_PLAN.md`
- [x] 创建 `docs/IMPLEMENTATION_PLAN.md`（本文档）
- [ ] 初始化 Git 仓库
- [ ] 创建 `.gitignore`
- [ ] 输出 Phase 0 完成报告

### 输出物
- 项目文档体系（12 份文档）
- 技术选型决策
- 风险清单
- 页面地图
- P0/P1/P2 功能列表
- 设计系统初稿
- 安全与隐私风险列表
- AdSense 接入准备方案
- 分阶段开发计划

---

## Phase 1：设计系统与静态原型（规划中）

### 目标
建立组件库和首页/检查页静态原型

### 任务列表
1. 初始化 Next.js 项目（App Router + TypeScript + Tailwind CSS）
2. 配置国际化路由（`/[locale]`）
3. 创建全局布局（Header + Footer + 最大宽度容器）
4. 创建设计令牌（CSS 变量 + Tailwind 配置）
5. 实现基础 UI 组件：Button, Input, Select, Checkbox, RadioGroup
6. 实现 FileDropzone 组件（含拖拽和点击）
7. 实现 Alert, Progress, Dialog, Toast
8. 实现 EmptyState, ErrorState, ResultSummary, BeforeAfterComparison
9. 实现 AdContainer 占位组件
10. 首页静态原型（含所有区块）
11. 文件检查页静态原型
12. 运行基础检查（类型检查、ESLint、构建）
13. 三个视口截图验证

### 预计时间
—

---

## Phase 2-8 详细计划

将在各阶段开始前细化。每个阶段完成后更新本文档。

---

## 风险清单

| 风险 | 影响 | 可能性 | 缓解措施 |
|------|------|--------|----------|
| Safari 不支持 OffscreenCanvas | PDF/图片处理需 fallback | 中 | 检测并 fallback 到主线程 Canvas |
| HEIC 浏览器支持不稳定 | 无法在 P0 支持 | 高 | 推迟到 P1，P0 给出明确提示 |
| 大文件导致移动端内存不足 | 处理失败或浏览器崩溃 | 中 | 设置合理上限，显示内存警告 |
| pdf-lib 不支持加密 PDF | 无法处理加密 PDF | 中 | 明确告知用户需先解密 |
| 浏览器兼容性差异 | 部分功能在某些浏览器不可用 | 中 | 广泛测试，优雅降级 |
| 第三方依赖安全漏洞 | 潜在安全风险 | 低 | 定期审计，最小依赖原则 |
| 用户上传敏感文件 | 隐私风险 | 低 | 本地处理，不上传服务器 |

---

## 技术选型总结

| 类别 | 选择 | 原因 |
|------|------|------|
| 框架 | Next.js 15 (App Router) | 服务端渲染、路由、SEO 友好 |
| 语言 | TypeScript 严格模式 | 类型安全 |
| 样式 | Tailwind CSS 4 | 设计令牌统一、按需生成 |
| 图标 | Lucide Icons | 统一线性风格、Tree-shakeable |
| PDF 处理 | pdf-lib | 纯 JS、无外部依赖、功能完整 |
| PDF 预览 | pdfjs-dist (仅元数据) | 按需加载 |
| 图片元数据 | exifr | 轻量、支持浏览器 |
| 测试 | Vitest + RTL + Playwright | 现代、快速、功能完整 |
| 无障碍 | axe-core | 自动化检查 |
| 部署 | Vercel | 与 Next.js 原生集成 |

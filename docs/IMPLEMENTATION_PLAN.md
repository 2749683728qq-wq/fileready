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

## Phase 1：设计系统与静态原型（已完成）

### 目标
建立组件库和首页/检查页静态原型

### 已完成
1. ✅ 初始化 Next.js 项目（App Router + TypeScript + Tailwind CSS）
2. ✅ 配置国际化路由（`/[locale]`）
3. ✅ 创建全局布局（Header + Footer + 最大宽度容器）
4. ✅ 创建设计令牌（CSS 变量 + Tailwind 配置）
5. ✅ 实现基础 UI 组件：Button, Input, Select, Checkbox, RadioGroup
6. ✅ 实现 FileDropzone 组件（含拖拽和点击）
7. ✅ 实现 Alert, Progress, Dialog, Toast
8. ✅ 实现 EmptyState, ErrorState, ResultSummary, BeforeAfterComparison
9. ✅ 实现 AdContainer 占位组件
10. ✅ 首页静态原型（含所有区块）
11. ✅ 文件检查页静态原型
12. ✅ 运行基础检查（类型检查、ESLint、构建）
13. ✅ 三个视口截图验证

### 新增依赖
- `lucide-react`：统一线性图标
- `@playwright/test`：端到端和视觉测试

### 截图位置
`/workspace/screenshots/phase-1/`

### 已知问题
- 当前所有页面只有英文版，中文本地化在 Phase 6 实现
- 文件检查页为静态原型，文件读取为模拟数据
- 尚未实现真实 AdSense 广告加载（仅预留组件）

---

## Phase 2：第一个完整闭环 — 图片压缩（已完成）

### 目标
实现从文件上传、读取、压缩、对比到下载的完整图片压缩流程。

### 已完成
1. ✅ 实现浏览器端图片压缩核心算法（Canvas + quality 二分搜索）
2. ✅ 实现图片文件读取、类型验证、大小验证
3. ✅ 实现元数据读取（EXIF、DPI、GPS 存在性）
4. ✅ 实现透明度检测
5. ✅ 创建 `useImageCompressor` 状态管理 hook
6. ✅ 构建 `/en/tools/image-compressor` 页面
7. ✅ 覆盖 16 种工具状态中的主要状态
8. ✅ 实现取消操作、失败恢复、下载功能
9. ✅ 生成测试用图片 fixture
10. ✅ 编写 E2E 测试验证真实压缩流程
11. ✅ 三个视口截图验证

### 新增依赖
- `exifr`：读取图片 EXIF 元数据

### 压缩算法
- 优先降低 JPEG/WebP quality（二分搜索）
- quality 不够时回退尺寸缩小
- 支持 AbortController 取消
- PNG 压缩通过 Canvas 转 PNG 实现（无损，空间有限）

### 测试结果
| 检查项 | 结果 |
|--------|------|
| TypeScript 类型检查 | ✅ 通过 |
| ESLint | ✅ 通过 |
| 生产构建 | ✅ 通过 |
| E2E 压缩测试 | ✅ 通过（50KB 目标） |
| 视觉截图 | ✅ 3 张 |

---

## Phase 3（进行中）：图片核心工具

### 3.1 图片尺寸调整和裁剪 ✅ 已完成

**完成内容：**
- ✅ 实现交互式裁剪编辑器（8 向拖拽手柄 + 键盘微调 + 九宫格参考线）
- ✅ 实现 8 种固定比例裁剪 + 自定义比例 + 自由裁剪
- ✅ 实现像素/毫米/厘米/英寸单位换算（基于 DPI）
- ✅ 实现旋转（90°/180°/270°）和翻转（水平/垂直）
- ✅ 实现锁定宽高比/解锁
- ✅ 构建完整页面（上传→裁剪→设置→处理→对比→下载）
- ✅ E2E 测试通过
- ✅ 3 张视口截图

**新增文件：**
- `src/lib/image/resize.ts` — 图片处理核心算法
- `src/components/tools/CropEditor.tsx` — 交互式裁剪组件
- `src/app/[locale]/tools/image-resizer/page.tsx` — 完整页面
- `tests/e2e/image-resizer.e2e.spec.ts` — E2E 测试
- `tests/e2e/phase3-screenshots.spec.ts` — 截图测试

### 3.2 图片格式转换 ⬜ 待开发
### 3.3 DPI 换算器 ⬜ 待开发
### 3.4 图片元数据清理 ⬜ 待开发
### 3.5 签名图片处理 ⬜ 待开发

---

## Phase 0-3 测试结果记录

| 检查项 | Phase 0 | Phase 1 | Phase 2 | Phase 3.1 |
|--------|---------|---------|---------|-----------|
| TypeScript 类型检查 | ✅ | ✅ | ✅ | ✅ |
| ESLint | ✅ | ✅ | ✅ | ✅ |
| 生产构建 | ✅ | ✅ | ✅ | ✅ |
| E2E 测试 | — | — | ✅ | ✅ |
| 视觉截图 | — | ✅ 10 | ✅ 3 | ✅ 3 |

| 检查项 | Phase 0 | Phase 1 | Phase 2 |
|--------|---------|---------|---------|
| TypeScript 类型检查 | ✅ 无代码 | ✅ 通过 | ✅ 通过 |
| ESLint | ✅ 无代码 | ✅ 通过 | ✅ 通过 |
| 生产构建 | ✅ 无代码 | ✅ 通过 | ✅ 通过 |
| 单元/组件测试 | — | — | ⬜ 待补充 |
| Playwright 截图 | ✅ 无代码 | ✅ 10 张 | ✅ 3 张 |
| E2E 真实流程 | ✅ 无代码 | ✅ 无代码 | ✅ 通过 |

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

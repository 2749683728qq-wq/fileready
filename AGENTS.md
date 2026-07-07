# AGENTS.md — 开发规则

> 本文档记录长期稳定、简洁的开发规则。完整产品需求见 `docs/PRD.md`。

## 项目标识

- **项目名称**：File Upload Assistant（品牌名称待确定）
- **产品类别**：在线文件上传处理与合规检查平台
- **核心定位**：帮助用户检查、压缩、调整、转换和整理图片、PDF、签名及扫描文件，使其更符合各类在线系统的上传要求

## 开发原则

1. **分阶段开发**：必须按 Phase 顺序执行，不得跳跃。每个 Phase 完成后停止，等待明确指令。
2. **不删除可用代码**：修改前先检查仓库，不覆盖或删除已有功能。
3. **本地处理优先**：图片和 PDF 处理优先在浏览器端完成，不将用户文件上传到服务器。
4. **安全第一**：不暴露密钥、不记录用户文件内容、不记录文件名。
5. **真实可信**：不使用虚假评论、虚假用户数、虚假合作伙伴 Logo。不暗示政府官方身份。
6. **可访问性**：目标 WCAG 2.2 AA。键盘可操作、焦点清晰、拖拽同时支持点击。

## 技术栈

- Next.js (App Router) + TypeScript 严格模式
- Tailwind CSS
- `pdf-lib` 或等效浏览器 PDF 库
- Web Worker 处理大文件
- Vitest + React Testing Library + Playwright
- 国际化路由（首版：英文 + 简体中文）
- 不依赖付费 AI 接口

## 文件处理规则

- 优先浏览器 File API、Canvas、Web Worker
- 大文件处理不阻塞主线程
- 同时检查扩展名和 MIME 类型
- 设置合理文件大小上限
- 处理完成后释放 Object URL
- 不使用 LocalStorage 保存原文件

## 禁止事项（摘要）

- 未检查仓库就重建项目
- 一次性开发所有功能
- 写入虚假 AdSense ID / Analytics ID / 域名
- 暴露密钥、上传用户文件、记录用户文件名
- 批量生成 SEO 页面、复制竞争网站
- 在下载按钮旁放广告
- 使用虚假评论或用户数
- 承诺文件一定通过审核
- 测试未通过却声称完成

## 文档结构

- `AGENTS.md` — 本文档（开发规则）
- `docs/PRD.md` — 完整产品需求
- `docs/DESIGN_SYSTEM.md` — 设计系统
- `docs/IMPLEMENTATION_PLAN.md` — 分阶段实施计划
- `docs/DECISIONS.md` — 重要决策记录
- `docs/INFORMATION_ARCHITECTURE.md` — 信息架构
- `docs/INTERACTION_SPEC.md` — 交互规范
- `docs/SEO_CONTENT_STRATEGY.md` — SEO 与内容策略
- `docs/ADSENSE_PRIVACY.md` — AdSense 与隐私
- `docs/SECURITY_AND_FILE_PROCESSING.md` — 安全与文件处理
- `docs/ANALYTICS_PLAN.md` — 分析计划
- `docs/TEST_PLAN.md` — 测试计划

## 每个阶段结束时

1. 运行类型检查、ESLint、单元测试、组件测试、Playwright 核心流程、生产构建
2. 提供完成报告（做了什么、修改了哪些文件、设计决策、依赖、测试结果、截图位置、已知问题、需人工确认项、下一阶段建议）

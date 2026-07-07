# TEST_PLAN — 测试计划

> Phase 0 初稿 | 测试策略和检查清单

## 1. 测试工具栈

| 工具 | 用途 |
|------|------|
| Vitest | 单元测试 |
| React Testing Library | 组件测试 |
| Playwright | E2E 和视觉回归 |
| axe-core | 无障碍检查 |
| ESLint | 代码质量 |
| Prettier | 代码格式 |
| TypeScript | 类型检查 |

## 2. 每个阶段必须运行

```bash
# 类型检查
npx tsc --noEmit

# ESLint
npx eslint .

# 单元测试 + 组件测试
npx vitest run

# Playwright 核心流程
npx playwright test

# 生产构建
npm run build
```

## 3. 测试视口

| 视口 | 宽度×高度 | 代表设备 |
|------|-----------|----------|
| 手机 | 375×812 | iPhone X |
| 平板 | 768×1024 | iPad |
| 桌面 | 1440×900 | 常见笔记本 |

## 4. 必测场景

### 4.1 文件名

- [ ] 长文件名（200+ 字符）
- [ ] 中文文件名
- [ ] 文件名含空格
- [ ] 文件名含特殊字符（`&`, `#`, `%`, `+`）
- [ ] 无扩展名文件
- [ ] 双扩展名（`.jpg.png`）

### 4.2 图片

- [ ] 透明 PNG
- [ ] 超大图片（8000×6000+）
- [ ] 极小图片（10×10）
- [ ] 损坏图片
- [ ] 错误扩展名（PNG 改名 .jpg）
- [ ] EXIF 方向标记图片
- [ ] 包含 GPS 元数据的图片
- [ ] 1×1 像素图片

### 4.3 PDF

- [ ] 损坏 PDF
- [ ] 加密 PDF（需密码）
- [ ] 多页 PDF（100+ 页）
- [ ] 空白 PDF
- [ ] 包含表单的 PDF
- [ ] 扫描版 PDF（纯图片）
- [ ] 混合方向 PDF（横竖混合）

### 4.4 用户行为

- [ ] 连续快速点击
- [ ] 处理中途取消
- [ ] 重复下载
- [ ] 浏览器返回按钮
- [ ] 页面刷新
- [ ] 处理中关闭标签页
- [ ] 网络断开（Service Worker 离线）
- [ ] 多个文件快速连续上传

### 4.5 配置

- [ ] 无广告 ID
- [ ] 无 Analytics ID
- [ ] 广告开关关闭
- [ ] Cookie 未同意
- [ ] JavaScript 禁用（降级提示）

### 4.6 可访问性

- [ ] 键盘完成核心流程
- [ ] 焦点样式可见
- [ ] 200% 文字缩放
- [ ] `prefers-reduced-motion`
- [ ] 屏幕阅读器（VoiceOver/NVDA）基本可用
- [ ] 颜色对比度达标

## 5. 视觉检查流程

每完成一个主要页面：

1. 启动真实开发服务器
2. 使用 Playwright 打开页面
3. 保存三个视口截图到 `screenshots/[phase]/[page]-[viewport].png`
4. 检查横向滚动
5. 检查文字截断
6. 检查弹窗
7. 检查按钮大小（≥44px 触控目标）
8. 检查长错误信息
9. 检查中文和英文换行
10. 修复明显问题后重新截图

## 6. 测试文件组织

```
tests/
  unit/           # 单元测试
    lib/
    hooks/
    utils/
  components/     # 组件测试
    ui/
    tools/
  e2e/            # E2E 测试
    tools/
    flows/
  fixtures/       # 测试用文件
    images/
    pdfs/
  screenshots/    # 视觉回归截图
```

## 7. 测试数据

测试用文件放在 `tests/fixtures/`：
- 不使用真实用户文件
- 生成测试用图片（各种尺寸、格式）
- 生成测试用 PDF（各种页数）
- 不包含版权内容
- 不包含真实个人信息

## 8. CI/CD 集成（未来）

- GitHub Actions 自动运行测试
- PR 合并前必须通过类型检查 + Lint + 测试
- 生产构建作为 CI 步骤
- Playwright 使用容器化浏览器

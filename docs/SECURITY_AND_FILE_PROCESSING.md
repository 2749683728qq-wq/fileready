# SECURITY_AND_FILE_PROCESSING — 安全与文件处理规范

> Phase 0 初稿 | 安全要求和文件处理技术规范

## 1. 安全原则

- 零信任前端：不信任任何用户输入和上传文件
- 最小权限：前端只使用必要 API
- 默认安全：不依赖用户正确配置

## 2. 文件上传安全

### 2.1 类型验证

- 同时检查文件扩展名和 MIME 类型
- 使用文件的 magic bytes 验证真实类型（不依赖扩展名）
- 维护白名单而非黑名单

### 2.2 大小限制

| 文件类型 | 最大大小 | 原因 |
|----------|----------|------|
| 图片 | 20 MB | 浏览器 Canvas 限制 |
| PDF | 30 MB | 浏览器内存限制 |
| 合并/拆分 PDF | 总计 50 MB | 多文件内存占用 |

### 2.3 数量限制

| 操作 | 最大数量 |
|------|----------|
| 图片转 PDF | 20 张 |
| PDF 合并 | 10 个文件 |
| 批量图片 | 10 张 |

## 3. 文件处理规范

### 3.1 处理原则

- 优先浏览器 File API + Canvas + Web Worker
- 大文件处理不阻塞主线程
- 可取消长任务（AbortController）
- 失败后保留原文件并提供恢复建议
- 处理完成后释放 Object URL

### 3.2 技术方案

| 功能 | 方案 | 备选 |
|------|------|------|
| 图片压缩/调整 | Canvas API + OffscreenCanvas | Web Worker 中处理 |
| 图片格式转换 | Canvas toBlob/toDataURL | — |
| PDF 读取 | pdfjs-dist（仅元数据提取用） | — |
| PDF 操作 | pdf-lib | — |
| 图片元数据 | exifr（轻量 EXIF 库） | — |
| EXIF 清理 | Canvas 重绘（自动剥离 EXIF） | exifr 写入 |

### 3.3 依赖评估

每个新增依赖需评估：
- 用途是否必要
- 是否支持浏览器端
- 包大小（gzipped）
- 维护状态（最近更新、Star 数、Issue 响应）
- 安全风险（已知漏洞）
- 是否有更轻量替代方案

## 4. 浏览器兼容性

### 4.1 支持浏览器

- Chrome 最新两个版本
- Firefox 最新两个版本
- Safari 最新两个版本
- Edge 最新两个版本

### 4.2 关键 API 兼容性

| API | Chrome | Firefox | Safari | Edge |
|-----|--------|---------|--------|------|
| File API | ✓ | ✓ | ✓ | ✓ |
| Canvas | ✓ | ✓ | ✓ | ✓ |
| Web Worker | ✓ | ✓ | ✓ | ✓ |
| OffscreenCanvas | ✓ | ✓ | ❌ | ✓ |
| URL.createObjectURL | ✓ | ✓ | ✓ | ✓ |
| AbortController | ✓ | ✓ | ✓ | ✓ |

Safari 不支持 OffscreenCanvas，需要 fallback 到主线程 Canvas。

## 5. 安全响应头

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-src 'none'; object-src 'none';
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## 6. 前端安全要求

- 不暴露 API 密钥或环境变量（除 `NEXT_PUBLIC_` 前缀）
- 不使用 `dangerouslySetInnerHTML`
- 不执行文件中的脚本
- URL 参数不包含用户文件信息
- 不在错误监控中记录文件内容
- 不使用 `eval()` 或 `Function()` 动态执行

## 7. 依赖安全

- 定期运行 `npm audit`
- 使用 Dependabot 或类似工具
- 锁定依赖版本（package-lock.json 提交到仓库）
- 不引入不必要的依赖

## 8. 数据处理清单

- [ ] 文件不在服务器端存储
- [ ] 文件名不在日志中记录
- [ ] Object URL 在处理完成后释放
- [ ] 页面关闭时清理临时数据
- [ ] 不使用 LocalStorage 保存原文件
- [ ] 用户设置中不包含文件内容
- [ ] Analytics 事件不含文件名或内容
- [ ] 错误报告不含用户文件信息

# ANALYTICS_PLAN — 分析计划

> Phase 0 初稿 | GA4 预留架构和产品指标

## 1. 基本原则

- 预留 Google Analytics 4，默认关闭
- 事件中不得包含文件名、文件内容、身份信息、完整错误文件、用户上传要求中的敏感文本
- 不追踪广告点击
- 用户同意前不加载分析代码

## 2. 环境变量

```bash
NEXT_PUBLIC_GA_ENABLED=false
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## 3. 匿名产品事件

### 3.1 事件列表

| 事件名 | 说明 |
|--------|------|
| `tool_view` | 查看工具页面 |
| `file_selected` | 用户选择了文件 |
| `validation_started` | 开始合规检查 |
| `validation_completed` | 合规检查完成 |
| `validation_failed` | 合规检查失败 |
| `processing_started` | 开始处理文件 |
| `processing_cancelled` | 用户取消处理 |
| `processing_completed` | 处理成功完成 |
| `processing_failed` | 处理失败 |
| `download_started` | 用户点击下载 |
| `related_tool_clicked` | 点击相关工具链接 |
| `guide_viewed` | 查看指南 |

### 3.2 允许的参数

| 参数 | 示例值 | 说明 |
|------|--------|------|
| `tool_name` | `image-compressor` | 工具标识 |
| `broad_file_type` | `image`, `pdf` | 大类文件类型 |
| `success_or_failure` | `success`, `failure` | 处理结果 |
| `error_category` | `format_unsupported`, `size_exceeded` | 错误分类 |
| `processing_duration_bucket` | `0-1s`, `1-5s`, `5-30s`, `30s+` | 处理时长区间 |
| `device_category` | `mobile`, `tablet`, `desktop` | 设备类型 |
| `locale` | `en`, `zh-CN` | 语言 |

### 3.3 禁止记录

- 文件名（包括部分文件名）
- 文件内容
- 用户输入原文
- IP 地址（使用 GA4 默认匿名化）
- 精确文件大小（只用区间）

## 4. 北极星指标

**每周成功生成并下载的处理后文件数量。**

## 5. 产品指标

| 指标 | 计算方式 | 目标 |
|------|----------|------|
| 文件选择成功率 | file_selected / tool_view | > 60% |
| 检查完成率 | validation_completed / validation_started | > 85% |
| 处理完成率 | processing_completed / processing_started | > 80% |
| 下载率 | download_started / processing_completed | > 90% |
| 错误率 | (validation_failed + processing_failed) / total | < 10% |
| 取消率 | processing_cancelled / processing_started | < 15% |
| 平均处理时长 | processing_duration 分布 | < 5s 占比 > 70% |
| 二次处理率 | 同会话中同一工具多次使用 | 观察中 |
| 移动端成功率 | 按 device_category 拆分 | 与桌面差距 < 10% |

## 6. SEO 指标

| 指标 | 说明 |
|------|------|
| 有效索引页数 | Search Console 报告 |
| 搜索展示次数 | 按查询和页面拆分 |
| 自然搜索点击 | 按查询和页面拆分 |
| 非品牌关键词 | 排除品牌名的搜索流量 |
| 工具页点击率 | 工具页在搜索结果中的 CTR |
| 重复/无效页数量 | Coverage 报告 |

## 7. 广告指标（审核通过后）

| 指标 | 说明 |
|------|------|
| 页面 RPM | 按页面类型拆分 |
| 广告可见率 | Active View |
| 广告对工具完成率的影响 | 有广告 vs 无广告页面对比 |
| 页面布局变化 | CLS 中广告贡献 |
| 异常流量检测 | 政策中心状态 |

不得以广告点击率作为产品主要目标。

## 8. 实现方案

- 使用 Next.js 的 `<Script strategy="afterInteractive">` 加载 GA4
- 事件通过自定义 `trackEvent` 函数发送
- 开发环境不发送事件
- 开关关闭时不加载 GA4 脚本
- Cookie 同意前不发送事件
- 使用 GA4 的 `gtag('consent', ...)` API 管理同意状态

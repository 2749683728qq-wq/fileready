# INFORMATION ARCHITECTURE — 信息架构

> Phase 0 初稿 | 路由和页面结构

## 1. URL 结构

使用独立、清晰、可读的 URL。所有路由基于 `/[locale]`。

### 1.1 核心工具

```
/[locale]/check-file              # 文件合规检查器（核心入口）
/[locale]/tools/image-compressor   # 图片压缩
/[locale]/tools/image-resizer      # 图片裁剪和尺寸调整
/[locale]/tools/image-converter    # 图片格式转换
/[locale]/tools/signature-resizer  # 签名图片处理
/[locale]/tools/image-to-pdf       # 图片转 PDF
/[locale]/tools/merge-pdf          # PDF 合并
/[locale]/tools/split-pdf          # PDF 拆分/提取/旋转
/[locale]/tools/remove-image-metadata  # 图片元数据清理
/[locale]/tools/dpi-calculator     # DPI 与尺寸换算器
```

### 1.2 使用场景

```
/[locale]/use-cases/job-applications      # 求职
/[locale]/use-cases/school-applications   # 学校和申请
/[locale]/use-cases/exam-registration     # 考试报名
/[locale]/use-cases/visa-passport         # 签证和护照
/[locale]/use-cases/government-forms      # 政府和公共服务
/[locale]/use-cases/everyday-office       # 日常办公
```

### 1.3 指南

```
/[locale]/guides               # 指南列表
/[locale]/guides/[slug]        # 单篇指南
```

### 1.4 信息页面

```
/[locale]/about                  # 关于
/[locale]/contact                # 联系
/[locale]/privacy                # 隐私政策
/[locale]/cookies                # Cookie 政策
/[locale]/terms                  # 使用条款
/[locale]/disclaimer             # 免责声明
/[locale]/accessibility          # 无障碍声明
/[locale]/advertising-disclosure # 广告披露
```

### 1.5 首页

```
/[locale]                        # 首页
```

## 2. 不索引的页面/状态

以下状态不得进入 sitemap、不得被索引、不得显示广告：
- 处理进度状态
- 结果预览状态
- 下载页面
- 错误状态
- 空白状态
- 404 页面
- Cookie/隐私设置弹窗

处理过程中不为临时状态生成可索引 URL。

## 3. 导航结构

### 3.1 主导航

```
首页 | 工具 ↓ | 场景 ↓ | 指南 | 关于
```

- **工具下拉**：文件检查、图片压缩、尺寸调整、格式转换、签名处理、图片转 PDF、PDF 合并、PDF 拆分、元数据清理、DPI 换算
- **场景下拉**：求职、学校申请、考试报名、签证护照、政府表格、日常办公

### 3.2 页脚

```
工具列表 | 使用场景 | 精选指南 | 关于 | 联系 | 隐私 | Cookie | 条款 | 免责 | 无障碍 | 广告披露
```

## 4. 面包屑

所有工具页和指南页使用面包屑：

```
首页 > [类别] > [页面标题]
```

例如：
```
首页 > 工具 > 图片压缩
首页 > 场景 > 求职
首页 > 指南 > 如何压缩 PDF 到 500KB 以内
```

使用 `BreadcrumbList` 结构化数据。

## 5. 页面地图

### P0 阶段页面（共约 22 个）

| 页面 | 路由 | 类型 |
|------|------|------|
| 首页 | `/` | 入口 |
| 文件检查 | `/check-file` | 工具 |
| 图片压缩 | `/tools/image-compressor` | 工具 |
| 尺寸调整 | `/tools/image-resizer` | 工具 |
| 格式转换 | `/tools/image-converter` | 工具 |
| 签名处理 | `/tools/signature-resizer` | 工具 |
| 图片转 PDF | `/tools/image-to-pdf` | 工具 |
| PDF 合并 | `/tools/merge-pdf` | 工具 |
| PDF 拆分 | `/tools/split-pdf` | 工具 |
| 元数据清理 | `/tools/remove-image-metadata` | 工具 |
| DPI 换算 | `/tools/dpi-calculator` | 工具 |
| 求职场景 | `/use-cases/job-applications` | 场景 |
| 学校场景 | `/use-cases/school-applications` | 场景 |
| 考试场景 | `/use-cases/exam-registration` | 场景 |
| 签证场景 | `/use-cases/visa-passport` | 场景 |
| 政府场景 | `/use-cases/government-forms` | 场景 |
| 办公场景 | `/use-cases/everyday-office` | 场景 |
| 指南列表 | `/guides` | 列表 |
| 关于 | `/about` | 信息 |
| 联系 | `/contact` | 信息 |
| 隐私 | `/privacy` | 信息 |
| Cookie | `/cookies` | 信息 |
| 条款 | `/terms` | 信息 |
| 免责 | `/disclaimer` | 信息 |
| 无障碍 | `/accessibility` | 信息 |
| 广告披露 | `/advertising-disclosure` | 信息 |

> 以上乘以 2 种语言（en, zh-CN），实际页面约 52 个。P0 中工具页先完成英文，中文翻译在 Phase 6 统一进行。

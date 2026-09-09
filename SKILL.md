---
name: gts-autin-coder
description: Generate Vue 3 + Element Plus pages from text, screenshots, or HTML. Uses Less + rem + Vue Router + GTS token system. Delivers .vue SFC source (views/ workspace, mock API, i18n-ready) + zero-build offline preview (index.gts.html). Triggers on "页面生成", "Vue 页面", "Element Plus", "看板", "列表", "截图转码", "dashboard".
---

# GTS Autin Coder — Vue 3 + Element Plus 页面生成（.vue 源码交付）

You are an expert UI/UX Designer and Frontend Engineer specializing in Generative UI (Vue 3 + Element Plus).
Your product is **真实 Vue 源码**：一组 `.vue` SFC 文件（`<script setup>` + Less + rem + 标准ESM import），写在 `{slug}/src/` 工作区内 —— **代码本身就是交付件**，可直接拷入任何 Vue 3 + Element Plus + Vite 工程；同时附带零构建离线预览 `index.gts.html`（浏览器直接打开）。对话以单个 `<artifact>` 链接结束。

## 技术栈

- **框架**: Vue 3 (`<script setup>` Composition API)
- **UI**: Element Plus 2.x
- **路由**: Vue Router 4.x
- **样式**: Less + CSS 变量（`var(--gts-*)` token 体系）
- **单位**: rem（根字体 10px，`px / 10 = rem`）
- **依赖白名单**: vue / vue-router / element-plus / @element-plus/icons-vue / dayjs / less

## Session Context Caching

1. **NEVER re-read** a file you have already read this session.
2. **Design system:** `references/design_system.md` — 仅在换肤/深色模式/token场景咨询时读取（日常生成不需要，SKILL.md 已内嵌速查）。
3. **Code patterns:** 信任 SKILL.md 附录 B 的速查模式，无需外部参考。
4. **Element Plus API:** 信任你的知识，标准 EP 2.x API。

## Output Contract (READ FIRST)

`init.mjs` 初始化出的工作区结构（**init 只创建必要文件，其余按需创建**）：

```
{slug}/
├── mock/modules/{slug}.js          # Mock API（init 必建，与 src 同级）
├── public/library/                 # 预览运行时 UMD（FIXED — 勿改勿删）
├── src/                            # ★ 交付件
│   ├── main.js                     # 工程入口（FIXED）
│   ├── App.vue                     # 应用壳：路由出口（init 生成）
│   ├── README.md                   # 接入说明（FIXED）
│   ├── assets/                     # 主题/字体/样式（FIXED）
│   │   ├── fonts/ style/ themes/
│   │   ├── images/ uploads/        # 按需创建素材
│   ├── locales/                    # 全局 i18n（init 必建）
│   │   ├── lang/zh-CN/common.json
│   │   ├── lang/en-US/common.json
│   │   └── index.js
│   ├── router/index.js             # 路由（init 必建 — 内联，无 guards/modules）
│   ├── views/{slug}/               # ★ 页面主目录（init 必建）
│   │   ├── index.vue               # 页面主组件
│   │   └── js/constants.js         # 页面常量
│   ├── components/                 # 跨页共享组件（按需创建）
│   ├── api/                        # API 层（按需创建）
│   ├── composables/                # composable（按需创建）
│   ├── constants/                  # 全局常量（按需创建）
│   ├── directives/                 # 指令（按需创建）
│   ├── stores/                     # 状态管理（按需创建）
│   └── utils/                      # 工具函数（按需创建）
├── index.gts.html                  # 离线预览加载器（FIXED）
└── preview-data.js                 # 源码映射（build 自动生成）
```

**Editable vs FIXED:**
- **You edit ONLY:** `views/**`、`components/**`、`api/**`、`composables/**`、`constants/**`、`directives/**`、`locales/**`、`router/**`、`stores/**`、`utils/**`、`mock/**`、`assets/uploads/`、`assets/images/`。
- **FIXED:** `main.js`、`App.vue`（默认生成好）、`assets/themes/`、`assets/style/`、`public/`、`index.gts.html`、`preview-data.js`。

**HARD RULES（src/ 内代码约束）:**
- 标准 ESM：`import { ref } from 'vue'`、`import { ElMessage } from 'element-plus'`、`import { Search } from '@element-plus/icons-vue'`、`import dayjs from 'dayjs'`、`import { useRouter } from 'vue-router'`。**裸依赖白名单仅此五项**（+ element-plus 子路径）。（`less` 仅构建工具，非运行时依赖）
- 组件用 `<script setup>` + Composition API；相对路径 import 子组件 `import StatusTag from './components/StatusTag.vue'`。
- 颜色一律 `var(--gts-*)` token；Element Plus 组件用语义 `type` prop。
- `<style lang="less" scoped>`，类名按组件功能命名（简短，如 `.header`、`.kpi-card`、`.filter-bar`），嵌套在根类下避免冲突；**禁止内联 `style="..."`**（动态绑定 `:style` 允许，仅限需变量计算的场景）。
- **CSS 单位用 rem**（`px / 10 = rem`：`16px → 1.6rem`、`24px → 2.4rem`、`8px → 0.8rem`）。px 仅在 build 时产生 WARN。
- 禁止在 SFC 样式里定义 `:root`、`[data-gts-theme]`、`--gts-*`（页面局部变量用 `--page-*` 前缀）。
- 图片素材：`import logo from '../../assets/uploads/logo.png'` 或 `import icon from '../../assets/images/ran.svg'`。

## 换肤系统

- 页面消费 token（见「附录 A — Token 速查」）→ 任何皮肤下自动跟随。
- 运行时切换：`document.documentElement.setAttribute('data-gts-theme', '<name>')`。
- 深色模式：`assets/style/theme/dark.less` 已定义 `html[data-gts-theme="dark"]` 下的 token 覆盖。
- 新皮肤：文件放 `assets/themes/gts-{name}.css` → `index.gts.html` 换肤插槽追加 `<link>`。

## How to Use This Skill

### Input Type 1: Text — 页面描述
用户描述整个页面（如 "做一个设备管理后台"、"数据看板"）。
1. **Analyze intent:** 页面场景、目标用户、核心问题。
2. **Expand completeness:** 生产级同类页面必须有什么（B 端控制台 = 顶栏 + 侧边导航 + 主内容区 + 状态反馈）。
3. **Decompose:** 拆成页面主组件 + 子组件，**颗粒度尽可能小**——一个子组件一个 .vue 文件。复用性组件放 `components/`，页面私有放 `views/{slug}/components/`。**index.vue 只做组合层**：引入子组件、编排布局、协调交互；业务逻辑、数据请求、复杂计算均拆到 `js/` 或 composable，禁止 index.vue 膨胀。
4. **Macro layout:** 外壳形态 — `el-container`（aside+header+main）或单栏内容页。

### Input Type 2: Text — 模块描述
单个 UI 块（如 "一个 KPI 指标卡片"）→ 作为独立组件生成 + 页面 index.vue 以展示形态包裹。

### Input Type 3: Image / Screenshot
1. **Analyze the image:** 布局、组件、层级、视觉分区。
2. **Map to Element Plus + GTS token。**
3. **Extract data with fidelity:** 转录而非发明 — 行数列数与图片**完全一致**，逐格独立读取，严禁行间复制。

### Input Type 4: Raw HTML
解析 DOM/CSS → 原生控件映射 Element Plus 组件，颜色映射最近似 token，重复内容提为数据。

---

## Generation Workflow (All Input Types)

### Step 1 — 布局策略 & Generative Expansion
页面级 `el-container` 骨架或单栏；模块级居中卡片。NEVER sparse：用尽全部数据、mock 真实文本、CTA、搜索/筛选/分页、状态标签/进度等视觉语义。IMAGE 输入保真优先。

### Step 2 — Init Workspace（MANDATORY）
1. **Confirm {artifact-folder}:** 运行时上下文提供的绝对路径；缺失则回退当前工作目录。
2. **Derive {slug}:** kebab-case ASCII，2–6 段语义英文（"设备管理" → `device-management`）。
3. **Init:**
   ```
   node scripts/init.mjs "{artifact-folder}" "{slug}"
   ```
   成功输出 `RESULT: OK` + `HTML_PATH` + `SRC_DIR` + `PAGE`。

### Step 3 — Author .vue Files
在 `SRC_DIR` 下编写页面（遵循「页面代码规范」）：
1. `views/{slug}/index.vue` — 页面主组件（替换骨架内容）。**index.vue 只做组合层**：布局编排 + 子组件引用 + 事件协调；禁止把全部逻辑堆在 index.vue 中。
2. 页面私有子组件放 `views/{slug}/components/*.vue`；跨页复用组件放 `src/components/{base|business|layout}/{PascalCase}.vue`。**每个 .vue 单一职责，颗粒度小**：一个 UI 区块一个文件（如 `FilterBar.vue`、`KpiCard.vue`、`DataTable.vue`、`EditDialog.vue`），index.vue 组合它们。
3. 常量/配置放 `views/{slug}/js/constants.js`（页面私有）；复杂逻辑抽 composable — 页面私有放 `views/{slug}/js/use-*.js`，跨页共享按需创建 `src/composables/`；Mock API 放 `mock/modules/{slug}.js`，页面直接引用。**index.vue 的 `<script setup>` 行数控制在 ~80 行以内**，超出则拆分。
5. **i18n:** 文本不放裸字符串，在 `views/{slug}/js/` 内定义或扩展 `src/locales/`（见「i18n 模式」）。

### Step 3.5 — 生成前自检（MANDATORY，build 前必做）

1. **相对 import 路径**层级正确（见「页面代码规范」item 8）
2. **图标名 / el-\* 组件名 / token 名**精确匹配（见「附录 A 速查表」）
3. **PascalCase / kebab-case 组件标签**都有对应 import
4. **`<style lang="less">` 内**无 `:root` / `[data-gts-theme]` / `--gts-*:` 定义
5. **裸 import** 仅限白名单五项
6. **`v-for` 有 `:key`**；`v-if` 不与 `v-for` 同标签
7. **无静态内联 `style="..."`**（`:style` 动态绑定允许）
8. **CSS 单位用 rem**（`px / 10 = rem`）

### Step 4 — Verify（MANDATORY，自动刷新预览）
```
node scripts/build.mjs --dir "{artifact-folder}/{slug}"
```
- **Success:** `OK index.gts.html verified (N pages, M components, K el-tag uses)`
- **Failure:** `RESULT: FAIL | <文件>: <原因>` → 修复 → 重跑（最多 3 次）
- **WARN:** px 值、hex 颜色、内联样式 — 非阻断性，但应修正
- 校验覆盖：@vue/compiler-sfc 编译 + el-* 白名单(121) + 图标白名单(293) + 导出白名单 + 相对 import 解析 + 裸依赖白名单 + ESM 语法 + token 存在性 + 样式卫生 + 内联样式检查 + px 检查。

### Step 5 — Output
```
<artifact type="text/link">{HTML_PATH value}</artifact>
```
直接在浏览器打开 `index.gts.html` 即可预览（file:// 协议可直接加载）。

---

## Modification Workflow

用户要求修改已生成页面时，**不要重新生成**：
1. **Locate:** `{artifact-folder}/{slug}/src/views/{slug}/...`
2. **Edit:** 只做请求的改动 — 未提及内容保持不变。
3. **Re-verify:** 重跑 `build.mjs` → 输出同一 `<artifact>` link。

---

## 页面代码规范（src/ 内 .vue 文件）

0. **页面布局选型:**
   - B 端控制台：`el-container`（aside 侧导航 + header 顶栏 + main 内容区）
   - 列表页：标题行 → 筛选行 → `el-table` → `el-pagination`
   - 看板页：顶部 KPI 卡片行 → 下方图表/数据区
   - 内容页：单栏，根容器（如 `.page-root`）padding 2.4rem
   - 间距：4 的倍数 rem；区块间 1.6-2.4rem，组件内 0.8-1.2rem
1. **组件写法:** `<script setup>` 优先；`defineProps`/`defineEmits` 声明组件契约。**文件颗粒度小**：一个组件一个 .vue 文件，单一职责。**index.vue 只做组合**，子组件各自封装自己的状态与逻辑。
2. **imports 顺序:** vue → vue-router → element-plus → @element-plus/icons-vue → dayjs → 相对子组件/素材/mock/constants。
3. **mock 数据 + Mock API:** 放 `mock/modules/{slug}.js`（与 src 同级），页面直接 import。用 Promise + setTimeout 模拟异步请求（见「Mock API 模式」）。语义化 key（`deviceName` 禁止 `val1`）；主列表 ≥ 10 条状态多样。
4. **常量:** 放 `views/{slug}/js/constants.js`，全大写+下划线命名（`ALARM_LEVEL`、`STATUS_MAP`）。
5. **图标:** `import { Search, Plus } from '@element-plus/icons-vue'`；用法 `<el-icon :size="20"><Search /></el-icon>` 或 `:icon="Search"`。
6. **反馈:** 轻提示 `ElMessage`；危险操作 `ElMessageBox.confirm(..., { type: 'warning' })`；表格 `v-loading`；空态 `el-empty`。
7. **样式:** `<style lang="less" scoped>`，类名按组件功能命名（简短，如 `.header`、`.kpi-card`、`.filter-bar`），间距用 rem，颜色用 token。**禁止内联 `style="..."`**；`:style` 动态绑定仅限需变量计算的场景。Less 嵌套、变量、混入可用；SFC 内不 `@import` 外部 .less（预览兼容性）。
8. **表格:** `el-table` + `el-table-column`；自定义列 `<template #default="{ row }">`；操作列 `fixed="right"` ≤3 个按钮（多了收进 `el-dropdown`）；≥8 条数据配 `el-pagination`。
9. **相对路径计算（最易错项）:**
   ```
   {slug}/
   ├── mock/
   │   └── modules/{slug}.js                  ← Mock API
   ├── src/
   │   ├── components/
   │   │   └── SharedCard.vue                 ← 跨页共享组件（按需创建）
   │   ├── assets/uploads/logo.png            ← 素材
   │   ├── assets/images/ran.svg              ← SVG 图标
   │   └── views/{slug}/
   │       ├── index.vue                      ← 页面主组件
   │       ├── components/StatusTag.vue       ← 子组件（按需创建）
   │       └── js/constants.js               ← 常量

   从 index.vue 引用:
     子组件:    import StatusTag from './components/StatusTag.vue'
     常量:      import { STATUS_MAP } from './js/constants.js'
     Mock API:  import { fetchList } from '../../../mock/modules/{slug}.js'
     素材:      import logo from '../../assets/uploads/logo.png'
     SVG 图标:  import ranIcon from '../../assets/images/ran.svg'
     跨页组件:  import SharedCard from '../../components/SharedCard.vue'

   从 components/StatusTag.vue 引用:
     素材:      import logo from '../../../assets/uploads/logo.png'
   ```

---

## Mock API 模式

init.mjs 已生成 `mock/modules/{slug}.js`（与 src 同级，Promise + setTimeout 模拟）。页面直接引用：
```js
import { fetchList } from '../../../mock/modules/{slug}.js'
```

## i18n 模式

init.mjs 已生成 `src/locales/lang/zh-CN/common.json` + `en-US/common.json`。页面 i18n 按需在 `views/{slug}/js/` 内定义或扩展 locales：
```js
// 简单引用方式
const t = { title: '${pageName}', refresh: '刷新' }
// 模板: {{ t.title }}
```

---

## 运行时错误预防（build 不覆盖）

1. **el-select v-model 值必须在 options 中:** 初始值必须是某个 `el-option` 的 `value`，否则显示裸值。建议初始值 `''`（配合 `clearable`）。
2. **el-table column prop 与 data key 匹配:** `prop="xxx"` 必须对应数据对象的实际 key，否则列空白。
3. **template 不引用未声明的变量:** `<script setup>` 中未定义的变量在模板中不渲染但不报错。
4. **Less 嵌套不要过深:** ≤ 3 层嵌套，避免选择器特异性问题。

---

## 附录 A — 速查表与错误预防

### 高频错误预防（build 拦截项）

| # | 错误写法 | 正确写法 | 原因 |
|---|---------|---------|------|
| 1 | `import { Searchh } from '@element-plus/icons-vue'` | `import { Search }` | 图标名不在 293 白名单 |
| 2 | `<el-table-cloumn>` | `<el-table-column>` | 组件名不在 121 白名单 |
| 3 | `<StatusTag />` 但没 import | `import StatusTag from './components/StatusTag.vue'` | 标签无对应 import |
| 4 | `import logo from '../assets/uploads/logo.png'` | `import logo from '../../assets/uploads/logo.png'` | 路径少一级 |
| 5 | `import { ElToast } from 'element-plus'` | `import { ElMessage } from 'element-plus'` | 导出名不在白名单 |
| 6 | `var(--gts-color-blue)` | `var(--gts-color-primary)` | token 未定义 |
| 7 | `<style>` 内 `:root { --gts-x: #fff }` | token 在 `src/assets/themes/` | style 禁止 :root |
| 8 | `style="color: red"` | class + `<style lang="less">` 定义 | 禁止内联样式 |
| 9 | `padding: 16px` | `padding: 1.6rem` | 应使用 rem 单位 |
| 10 | `slot-scope="scope"` | `<template #default="{ row }">` | 旧语法编译失败 |
| 11 | `v-if` 和 `v-for` 同标签 | 分开到不同标签 | 编译错误 |
| 12 | `src="/assets/uploads/x.png"` | `import img from '../../assets/uploads/x.png'` | 预览无法解析裸路径 |

### 常用图标（import from '@element-plus/icons-vue'，大小写敏感，build 校验 293 白名单）

```
Search  Plus  Edit  Delete  View  Refresh  Setting  User  Lock  Check
Close  Warning  InfoFilled  ArrowDown  ArrowUp  ArrowLeft  ArrowRight
Monitor  Filter  More  Calendar  Bell  Download  Upload
```

### 常用 el-\* 组件（build 校验 121 白名单，以下最高频）

```
el-button  el-input  el-select  el-option  el-table  el-table-column
el-pagination  el-form  el-form-item  el-dialog  el-drawer  el-tag
el-icon  el-menu  el-container  el-header  el-aside  el-main
el-row  el-col  el-card  el-tabs  el-tab-pane  el-tooltip  el-dropdown
```

### Token 速查（var(--gts-\*)，使用不在本表中的 token = build 拦截）

```
品牌色: --gts-color-primary  -hover  -active  -on-primary  -primary-container  -on-primary-container
功能色: --gts-color-success  -warning  -danger  -error  -info
文本色: --gts-text-1  -2  -3  -4  -disabled  -inverse
背景色: --gts-bg-page  -container  -overlay  -hover  -fill
边框色: --gts-border-1  -2
其他:   --gts-mask  --gts-shadow-1  -2  -3  --gts-radius-sm  -md  -lg  -full  --gts-font-family
```

### rem 换算（根字体 10px）

`px / 10 = rem`（如 16px → 1.6rem、24px → 2.4rem、8px → 0.8rem）

---

## References

- **[references/design_system.md](references/design_system.md)** — GTS token 全表、换肤协议、布局规范（按需查阅）

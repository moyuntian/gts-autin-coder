# GTS Autin 页面交付件（src/）

本目录即生成产物，可直接拷入任何 Vue 3 + Element Plus 工程。

## 目录结构

```
src/
├── main.js              # 工程入口示例（预览不执行；接入时参考或直接使用）
├── App.vue              # 应用壳：路由出口（<RouterView />）
├── api/                 # API 层
│   ├── modules/         # 页面 API 模块（预览 re-export mock；真实工程替换为 request 调用）
│   ├── request.js       # 请求封装占位（真实工程替换为 axios）
│   └── index.js         # API 聚合导出
├── components/          # 跨页共享组件（base/ business/ layout/）
├── composables/         # 跨页共享 composable（useTable 等）
├── constants/           # 全局常量
├── directives/          # 自定义指令（v-permission 等）
├── locales/             # 全局 i18n（lang/zh-CN/ lang/en-US/）
├── router/              # 路由（modules/ + guards.js + index.js）
├── stores/              # 状态管理（预览 reactive；真实工程 Pinia）
├── utils/               # 工具函数（format / validator）
├── views/               # 页面（每个页面一个文件夹，index.vue 为入口）
│   └── XxxYyy/
│       ├── index.vue
│       ├── components/  # 页面私有子组件
│       ├── js/          # 页面私有常量 + composable
│       └── locale/      # 页面 i18n
└── assets/
    ├── fonts/           # HarmonyOS Sans 字体
    ├── uploads/         # 页面引用的图片素材
    └── themes/          # GTS 主题体系（换肤）
        ├── base.css       # 字体/骨架/滚动条
        ├── gts-bridge.css # --gts-* → --el-* 桥接（Element Plus 跟随换肤）
        └── gts-default.css # 默认皮肤（协议见同目录 README.md）
```

## 接入步骤

1. 安装依赖（若工程尚未安装）：`npm i vue vue-router element-plus @element-plus/icons-vue dayjs`
2. 拷贝 `src/` 对应目录进工程（或只取所需页面文件夹 + `assets/themes/` + 用到的 `assets/`）。
3. 拷贝 `mock/` 目录进工程根级（如使用 mock 开发）；真实工程替换为实际 API 调用。
4. 在工程路由中注册页面，例如：
   ```js
   { path: '/device-management', component: () => import('@/views/device-management/index.vue') }
   ```
5. 在工程入口引入主题三件套（见 `main.js`）：`base.css`、`gts-bridge.css`、`themes/gts-default.css`。
6. 页面颜色全部走 `var(--gts-*)` token —— 换肤体系接入后页面自动跟随（协议见同目录 README.md）。

## 换肤

- 运行时切换：`document.documentElement.setAttribute('data-gts-theme', '<皮肤名>')`
- 新增皮肤：`assets/themes/gts-{name}.css` + 入口追加 import（或预览 html 追加 link）

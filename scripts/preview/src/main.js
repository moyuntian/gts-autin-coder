// ============================================================
// 真实工程接入入口（预览不执行此文件；预览由 index.gts.html 加载）
// 依赖：vue@^3.4、vue-router@^4.4、element-plus@^2.7、
//       @element-plus/icons-vue@^2.3、dayjs@^1.11、less@^4.2
// ============================================================
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// GTS 主题体系
import './assets/themes/base.css'
import './assets/themes/gts-bridge.css'
import './assets/themes/gts-default.css'

// 项目 Less 基础样式（Vite 自动编译 Less）
import './assets/style/base.less'
import './assets/style/theme/dark.less'

// 路由
import router from './router'

// ▼▼ 换肤插槽：接入新皮肤 css 后在此追加 import ▼▼
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component)
}
app.mount('#app')

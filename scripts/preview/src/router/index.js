// ============================================================
// router/index.js — 路由配置（真实工程使用）
// 预览不执行路由（App.vue 直接渲染页面组件）
// ============================================================
import { createRouter, createWebHistory } from 'vue-router'

// ▼▼ 页面路由：新增页面时在此添加 ▼▼
const routes = [
  // ROUTER_SLOT
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

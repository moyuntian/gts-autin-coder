#!/usr/bin/env node
// init.mjs
// Initializes a gts-autin page workspace: creates {slug}/ with a REAL Vue 3
// deliverable (standard structure under src/) plus the offline preview runtime.
//
// init.mjs ONLY creates essential files:
//   - mock/modules/{slug}.js     (always)
//   - src/locales/               (always — global i18n)
//   - src/views/{slug}/          (always — starter page)
//   - src/router/index.js        (always — preview needs it)
//   - src/App.vue + main.js      (always — FIXED from template)
//
// Other directories (api/, composables/, constants/, directives/, stores/,
// utils/, router/guards.js, router/modules/, components/) are created
// ON-DEMAND by the AI agent as needed.
//
// Layout created:
//   {slug}/
//   ├── mock/modules/{slug}.js           # Mock 数据 + API 模拟
//   ├── public/library/                  # 预览运行时 UMD（FIXED）
//   ├── src/
//   │   ├── main.js                      # 工程入口（FIXED）
//   │   ├── App.vue                      # 应用壳
//   │   ├── README.md                    # 接入说明（FIXED）
//   │   ├── assets/                      # 主题/字体/样式（FIXED）
//   │   ├── mock/modules/{slug}.js       # Mock 数据 + API 模拟
//   │   ├── locales/                     # 全局 i18n
//   │   │   ├── lang/zh-CN/common.json
//   │   │   ├── lang/en-US/common.json
//   │   │   └── index.js
//   │   ├── router/index.js              # 路由（内联，无 guards/modules）
//   │   └── views/{slug}/               # ★ 页面主目录
//   │       ├── index.vue                # 页面主组件
//   │       └── js/constants.js          # 页面常量
//   ├── index.gts.html                   # 离线预览加载器（FIXED）
//   └── preview-data.js                  # 源码映射（build 自动生成）
//
// Usage:
//   node init.mjs "<artifact-folder>" "<slug>"
//
// Output (agent-parseable):
//   RESULT: OK
//   HTML_PATH: <absolute path to {slug}/index.gts.html>
//   SRC_DIR: <absolute path to {slug}/src>
//   PAGE: <PascalCase page name>
//   RESULT: FAIL | <reason>

import {
  existsSync,
  statSync,
  mkdirSync,
  cpSync,
  writeFileSync,
  readdirSync,
  rmdirSync,
} from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { refresh } from './build-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function fail(reason) {
  console.log(`RESULT: FAIL | ${reason}`);
  process.exit(1);
}

// --- args ---
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
let artifactFolder, slug;
if (args.length === 2) {
  [artifactFolder, slug] = args;
} else if (args.length === 1) {
  artifactFolder = process.cwd();
  [slug] = args;
} else {
  fail('Usage: node init.mjs "<artifact-folder>" "<slug>"');
}

if (!existsSync(artifactFolder) || !statSync(artifactFolder).isDirectory()) {
  fail(`Artifact folder does not exist or is not a directory: ${artifactFolder}`);
}
if (!/^[a-z0-9]+(-[a-z0-9]+){1,5}$/.test(slug)) {
  fail(`Slug must be kebab-case ascii, 2-6 hyphen-separated segments: '${slug}'`);
}

// ---------- 1. resolve template ----------
const preview = resolve(__dirname, 'preview');
const scaffoldSrc = join(preview, 'src');
const libSrc = join(preview, 'public', 'library');
const htmlSrc = join(preview, 'index.gts.html');
for (const p of [scaffoldSrc, libSrc, htmlSrc]) {
  if (!existsSync(p)) fail(`template incomplete, missing: ${p}`);
}

// ---------- 2. derive names ----------
const pageName = slug
  .split('-')
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join('');

// ---------- 3. create destination ----------
const dest = join(artifactFolder, slug);
if (existsSync(join(dest, 'src'))) {
  fail(`target already exists (use Modification Workflow instead): ${dest}`);
}
mkdirSync(dest, { recursive: true });

// ---------- 4. copy deliverable scaffold (main.js + assets + README) ----------
const srcDir = join(dest, 'src');
cpSync(scaffoldSrc, srcDir, { recursive: true });

// ---------- 5. create directories ----------
mkdirSync(join(dest, 'mock', 'modules'), { recursive: true });
mkdirSync(join(srcDir, 'locales', 'lang', 'zh-CN'), { recursive: true });
mkdirSync(join(srcDir, 'locales', 'lang', 'en-US'), { recursive: true });
mkdirSync(join(srcDir, 'views', slug, 'js'), { recursive: true });

// ---------- 6. write starter files ----------

// --- 6a. mock/modules/{slug}.js ---
writeFileSync(
  join(dest, 'mock', 'modules', `${slug}.js`),
  `// ${pageName} — Mock 数据 + API 请求模拟
// 真实工程中替换为实际 API 调用（axios/fetch）

const mockData = [
  { id: 1, name: '${pageName}示例-01', status: 'running' },
  { id: 2, name: '${pageName}示例-02', status: 'stopped' },
  { id: 3, name: '${pageName}示例-03', status: 'pending' },
  { id: 4, name: '${pageName}示例-04', status: 'idle' },
  { id: 5, name: '${pageName}示例-05', status: 'maintenance' },
]

export function fetchList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = mockData
      if (params.keyword) {
        result = result.filter((item) => item.name.includes(params.keyword))
      }
      resolve({ data: result, total: result.length })
    }, 300)
  })
}

export function fetchDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockData.find((item) => item.id === id) })
    }, 200)
  })
}
`,
  'utf8',
);

// --- 6b. locales/lang/zh-CN/common.json ---
writeFileSync(
  join(srcDir, 'locales', 'lang', 'zh-CN', 'common.json'),
  JSON.stringify({
    confirm: '确定', cancel: '取消', search: '搜索', reset: '重置',
    add: '新增', edit: '编辑', delete: '删除', view: '查看', refresh: '刷新',
    operation: '操作', status: '状态', name: '名称', success: '成功', failed: '失败',
  }, null, 2) + '\n',
  'utf8',
);

// --- 6c. locales/lang/en-US/common.json ---
writeFileSync(
  join(srcDir, 'locales', 'lang', 'en-US', 'common.json'),
  JSON.stringify({
    confirm: 'Confirm', cancel: 'Cancel', search: 'Search', reset: 'Reset',
    add: 'Add', edit: 'Edit', delete: 'Delete', view: 'View', refresh: 'Refresh',
    operation: 'Action', status: 'Status', name: 'Name', success: 'Success', failed: 'Failed',
  }, null, 2) + '\n',
  'utf8',
);

// --- 6d. locales/index.js ---
writeFileSync(
  join(srcDir, 'locales', 'index.js'),
  `// i18n 入口 — 预览环境简单对象合并；真实工程用 vue-i18n
import zhCNCommon from './lang/zh-CN/common.json'
import enUSCommon from './lang/en-US/common.json'

export const messages = {
  'zh-CN': { common: zhCNCommon },
  'en-US': { common: enUSCommon },
}
`,
  'utf8',
);

// --- 6e. router/index.js (simple inline, no guards/modules) ---
writeFileSync(
  join(srcDir, 'router', 'index.js'),
  `import { createRouter, createWebHashHistory } from 'vue-router'
import ${pageName} from '../views/${slug}/index.vue'

const routes = [
  { path: '/', name: '${slug}', component: ${pageName} },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
`,
  'utf8',
);

// --- 6f. views/{slug}/index.vue ---
writeFileSync(
  join(srcDir, 'views', slug, 'index.vue'),
  `<script setup>
// ${pageName} — 页面主组件（交付入口；真实工程中由路由挂载）
import { ref, onMounted } from 'vue'
import { Monitor } from '@element-plus/icons-vue'
import { fetchList } from '../../../mock/modules/${slug}.js'
import { PAGE_TITLE, STATUS_MAP } from './js/constants.js'

const loading = ref(false)
const dataList = ref([])

async function fetchData() {
  loading.value = true
  try {
    const res = await fetchList()
    dataList.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="page-root">
    <el-card shadow="never">
      <template #header>
        <div class="header">
          <span class="title">{{ PAGE_TITLE }}</span>
          <el-button type="primary" :icon="Monitor" @click="fetchData">刷新</el-button>
        </div>
      </template>
      <el-table :data="dataList" v-loading="loading">
        <el-table-column type="index" label="序号" width="6rem" />
        <el-table-column prop="name" label="名称" min-width="14rem" />
        <el-table-column label="状态" width="10rem">
          <template #default="{ row }">
            <el-tag :type="STATUS_MAP[row.status]?.type || 'info'">
              {{ STATUS_MAP[row.status]?.label || row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.page-root {
  min-height: 100%;
  padding: 2.4rem;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--gts-text-1);
  }
}
</style>
`,
  'utf8',
);

// --- 6g. views/{slug}/js/constants.js ---
writeFileSync(
  join(srcDir, 'views', slug, 'js', 'constants.js'),
  `// ${pageName} — 常量定义
// 常量命名：全大写 + 下划线（如 ALARM_LEVEL）

export const PAGE_TITLE = '${pageName}'

export const STATUS_MAP = {
  running:     { label: '运行中', type: 'success' },
  stopped:     { label: '已停止', type: 'danger' },
  pending:     { label: '待审核', type: 'warning' },
  idle:        { label: '空闲',   type: 'info' },
  maintenance: { label: '维护中', type: 'warning' },
}

export const STATUS_OPTIONS = [
  { label: '运行中', value: 'running' },
  { label: '已停止', value: 'stopped' },
  { label: '待审核', value: 'pending' },
  { label: '空闲',   value: 'idle' },
  { label: '维护中', value: 'maintenance' },
]
`,
  'utf8',
);

// --- 6h. App.vue ---
writeFileSync(
  join(srcDir, 'App.vue'),
  `<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>
`,
  'utf8',
);

// ---------- 7. copy preview runtime + loader ----------
cpSync(libSrc, join(dest, 'public', 'library'), { recursive: true });
cpSync(htmlSrc, join(dest, 'index.gts.html'));

// ---------- 8. generate preview-data.js ----------
const result = refresh(dest);
if (!result.ok) fail(result.reason);

// ---------- 8a. remove empty directories ----------
function removeEmptyDirs(dir) {
  let removed = false;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const full = join(dir, entry.name);
      if (removeEmptyDirs(full)) removed = true;
    }
  }
  if (readdirSync(dir).length === 0) {
    rmdirSync(dir);
    return true;
  }
  return removed;
}
removeEmptyDirs(dest);

// ---------- 9. done ----------
console.log('RESULT: OK');
console.log(`HTML_PATH: ${resolve(join(dest, 'index.gts.html'))}`);
console.log(`SRC_DIR: ${resolve(srcDir)}`);
console.log(`PAGE: ${pageName}`);
process.exit(0);

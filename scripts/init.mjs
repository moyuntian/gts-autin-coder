#!/usr/bin/env node
// init.mjs
// Initializes a gts-autin page workspace: creates {slug}/ with a REAL Vue
// deliverable (src/) plus the offline preview runtime. The AI then authors
// .vue SFC files under src/ — the code IS the deliverable.
//
// Layout created:
//   {slug}/
//   ├── src/                        ← 交付件（真实工程结构，直接可拷贝）
//   │   ├── main.js                 # 工程入口示例
//   │   ├── App.vue                 # 应用壳：路由出口（<RouterView />）
//   │   ├── README.md               # 接入说明
//   │   ├── views/{kebab}/          # 页面主目录
//   │   │   ├── index.vue           # 页面主组件（交付入口）
//   │   │   ├── components/          # 页面私有子组件
//   │   │   ├── js/constants.js     # 常量定义
//   │   │   └── mock/home.js        # Mock 数据 + API 模拟
//   │   ├── components/             # 跨页共享组件
//   │   ├── router/index.js         # 路由配置
//   │   └── assets/
//   │       ├── fonts/              # HarmonyOS Sans（FIXED）
//   │       ├── images/             # SVG 图标素材
//   │       ├── uploads/            # 用户提供的图片素材
//   │       ├── style/              # Less 样式（base.less + theme/dark.less）
//   │       └── themes/             # GTS 主题体系（FIXED）
//   │           ├── base.css / gts-bridge.css / gts-default.css
//   ├── public/library/             # 预览运行时 UMD（FIXED — 勿改勿删，不随工程交付）
//   ├── index.gts.html              # 离线预览加载器（FIXED）
//   └── preview-data.js             # src/ 源码映射（build 自动重新生成，勿手改）
//
// Usage:
//   node init.mjs "<artifact-folder>" "<slug>"
//   (if artifact-folder is omitted, falls back to cwd)
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
  rmSync,
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

// --- args: [artifactFolder?, slug] ---
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
const scaffoldSrc = join(preview, 'src');          // main.js + assets/{fonts,themes,style,images} + components/ + router/
const libSrc = join(preview, 'public', 'library'); // preview-only UMD runtime
const htmlSrc = join(preview, 'index.gts.html');
for (const p of [scaffoldSrc, libSrc, htmlSrc]) {
  if (!existsSync(p)) fail(`template incomplete, missing: ${p}`);
}

// ---------- 2. derive page component name (PascalCase for component name) ----------
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

// ---------- 4. copy deliverable scaffold ----------
// scaffold src 自带 assets/{fonts,themes,style} + main.js + README.md + router/
const srcDir = join(dest, 'src');
cpSync(scaffoldSrc, srcDir, { recursive: true });
mkdirSync(join(srcDir, 'views', slug, 'js'), { recursive: true });
mkdirSync(join(srcDir, 'views', slug, 'mock'), { recursive: true });

// ---------- 5. starter page ----------
writeFileSync(
  join(srcDir, 'views', slug, 'index.vue'),
  `<script setup>
// ${pageName} — 页面主组件（交付入口；真实工程中由路由挂载）
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Monitor } from '@element-plus/icons-vue'
import { fetchList } from './mock/home.js'
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

// ---------- 5a. constants.js ----------
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

// ---------- 5b. mock/home.js ----------
writeFileSync(
  join(srcDir, 'views', slug, 'mock', 'home.js'),
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

// ---------- 5c. router/index.js (update with page route) ----------
writeFileSync(
  join(srcDir, 'router', 'index.js'),
  `import { createRouter, createWebHashHistory } from 'vue-router'
import ${pageName} from '../views/${slug}/index.vue'

// createWebHashHistory 兼容 file:// 离线预览；真实工程可改 createWebHistory()
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

// ---------- 6. app shell ----------
writeFileSync(
  join(srcDir, 'App.vue'),
  `<script setup>
// 应用壳：路由出口（真实工程由 router 挂载页面组件，预览同样走 router）
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

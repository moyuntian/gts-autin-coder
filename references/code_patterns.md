# GTS 代码模式参考 — 完整列表页示例

> 以下代码通过 build.mjs 全部验证（SFC 编译 + 白名单 + token + Less + rem + 样式卫生）。
> 作为生成代码的**参考锚点**：文件结构、import 写法、组件搭配、mock 数据量均以此为准。
> 生成不同页面时，替换业务内容，保持结构和写法不变。

## 文件结构

```
src/views/device-management/
├── index.vue                    ← 页面主组件（骨架 + 筛选 + 表格 + 分页 + dialog）
├── components/
│   └── StatusTag.vue            ← 状态标签子组件（el-tag + STATUS_MAP）
├── js/
│   └── constants.js             ← 常量定义（STATUS_MAP, STATUS_OPTIONS）
├── mock/
│   └── home.js                  ← Mock API 请求模拟（fetchList, fetchDetail）
└── locale/
    ├── zh.js                    ← 中文文案
    └── en.js                    ← 英文文案
```

## js/constants.js

> 常量命名：全大写 + 下划线（如 ALARM_LEVEL）。

```js
export const PAGE_TITLE = '设备管理'

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
```

## mock/home.js

> Mock API：Promise + setTimeout 模拟异步请求。语义化 key；主列表 ≥ 10 条覆盖所有状态。

```js
const mockData = [
  { id: 1,  deviceName: '应用服务器-01',   deviceCode: 'SRV-001',   status: 'running',     ip: '192.168.1.10',  cpu: 45, memory: 62, location: '机房A-机柜01', lastHeartbeat: 1705300200000 },
  { id: 2,  deviceName: '数据库服务器-01', deviceCode: 'DB-001',    status: 'running',     ip: '192.168.1.20',  cpu: 78, memory: 85, location: '机房A-机柜02', lastHeartbeat: 1705300140000 },
  { id: 3,  deviceName: '缓存服务器-01',   deviceCode: 'CACHE-001', status: 'stopped',     ip: '192.168.1.30',  cpu: 0,  memory: 0,  location: '机房B-机柜01', lastHeartbeat: 1705299600000 },
  { id: 4,  deviceName: '文件服务器-02',   deviceCode: 'FILE-002',  status: 'pending',     ip: '192.168.2.10',  cpu: 12, memory: 23, location: '机房B-机柜03', lastHeartbeat: 1705299000000 },
  { id: 5,  deviceName: 'API网关-01',      deviceCode: 'GW-001',    status: 'running',     ip: '192.168.3.10',  cpu: 56, memory: 48, location: '机房A-机柜04', lastHeartbeat: 1705300100000 },
  { id: 6,  deviceName: '消息队列-01',     deviceCode: 'MQ-001',    status: 'idle',        ip: '192.168.3.20',  cpu: 5,  memory: 15, location: '机房A-机柜05', lastHeartbeat: 1705300080000 },
  { id: 7,  deviceName: '负载均衡-01',     deviceCode: 'LB-001',    status: 'running',     ip: '192.168.4.10',  cpu: 32, memory: 41, location: '机房C-机柜01', lastHeartbeat: 1705300120000 },
  { id: 8,  deviceName: '监控服务器-01',   deviceCode: 'MON-001',   status: 'maintenance', ip: '192.168.4.20',  cpu: 18, memory: 30, location: '机房C-机柜02', lastHeartbeat: 1705290000000 },
  { id: 9,  deviceName: '日志服务器-01',   deviceCode: 'LOG-001',   status: 'running',     ip: '192.168.5.10',  cpu: 65, memory: 72, location: '机房C-机柜03', lastHeartbeat: 1705300060000 },
  { id: 10, deviceName: '备份服务器-01',   deviceCode: 'BAK-001',   status: 'stopped',     ip: '192.168.5.20',  cpu: 0,  memory: 0,  location: '机房D-机柜01', lastHeartbeat: 1705280000000 },
  { id: 11, deviceName: '测试服务器-01',   deviceCode: 'TEST-001',  status: 'idle',        ip: '192.168.6.10',  cpu: 3,  memory: 8,  location: '机房D-机柜02', lastHeartbeat: 1705300040000 },
  { id: 12, deviceName: '生产服务器-02',   deviceCode: 'PROD-002',  status: 'running',     ip: '192.168.6.20',  cpu: 89, memory: 91, location: '机房A-机柜06', lastHeartbeat: 1705300160000 },
]

export function fetchList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = mockData
      if (params.keyword) {
        result = result.filter((item) => item.deviceName.includes(params.keyword))
      }
      if (params.status) {
        result = result.filter((item) => item.status === params.status)
      }
      const start = ((params.page || 1) - 1) * (params.pageSize || 10)
      const paged = result.slice(start, start + (params.pageSize || 10))
      resolve({ data: paged, total: result.length })
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
```

## locale/zh.js

```js
export default {
  title: '设备管理',
  addDevice: '新增设备',
  editDevice: '编辑设备',
  searchPlaceholder: '搜索设备名称',
  statusFilter: '状态筛选',
  confirmDelete: '确定删除设备吗？',
  deleteSuccess: '删除成功',
  saveSuccess: '保存成功',
}
```

## components/StatusTag.vue

> 子组件写法：defineProps 声明契约；STATUS_MAP 从 constants.js 引入。

```vue
<script setup>
import { STATUS_MAP } from '../js/constants.js'

defineProps({
  status: { type: String, required: true },
})
</script>

<template>
  <el-tag :type="STATUS_MAP[status]?.type || 'info'" effect="light">
    {{ STATUS_MAP[status]?.label || status }}
  </el-tag>
</template>
```

## index.vue

> 完整页面：el-container 骨架 + 侧导航 + 顶栏 + KPI 卡片 + 筛选行 + 表格 + 分页 + dialog 表单。
> 注意：Less 样式 + rem 单位 + mock API 异步调用 + 无内联样式 + constants 引入。

```vue
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, Plus, Edit, Delete, View, Refresh,
  ArrowDown, Monitor, Setting, Download,
  DataAnalysis, Bell, Tools,
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import StatusTag from './components/StatusTag.vue'
import { fetchList, fetchDetail } from './mock/home.js'
import { STATUS_MAP, STATUS_OPTIONS, PAGE_TITLE } from './js/constants.js'
import t from './locale/zh.js'

const loading = ref(false)
const tableData = ref([])
const query = reactive({ keyword: '', status: '', page: 1, pageSize: 10 })
const total = ref(0)
const isCollapse = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref(t.addDevice)
const submitting = ref(false)
const formRef = ref()
const form = reactive({ id: null, deviceName: '', deviceCode: '', ip: '', location: '', status: 'running' })
const rules = {
  deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  deviceCode: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
  ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
}

const kpiList = [
  { label: '设备总数', value: 128, icon: Monitor,      color: 'var(--gts-color-primary)' },
  { label: '在线设备', value: 96,  icon: DataAnalysis, color: 'var(--gts-color-success)' },
  { label: '告警设备', value: 8,   icon: Bell,         color: 'var(--gts-color-warning)' },
  { label: '离线设备', value: 24,  icon: Setting,      color: 'var(--gts-color-danger)' },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetchList(query)
    tableData.value = res.data
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  query.keyword = ''
  query.status = ''
  query.page = 1
  fetchData()
}

function handleAdd() {
  dialogTitle.value = t.addDevice
  Object.assign(form, { id: null, deviceName: '', deviceCode: '', ip: '', location: '', status: 'running' })
  dialogVisible.value = true
}

function handleEdit(row) {
  dialogTitle.value = t.editDevice
  Object.assign(form, row)
  dialogVisible.value = true
}

function handleView(row) {
  ElMessage.info(`查看设备：${row.deviceName}`)
}

function handleCommand(cmd, row) {
  if (cmd === 'export') {
    ElMessage.success(`已导出设备：${row.deviceName}`)
  } else if (cmd === 'delete') {
    ElMessageBox.confirm(t.confirmDelete, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    }).then(() => {
      ElMessage.success(t.deleteSuccess)
    }).catch(() => {})
  }
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      dialogVisible.value = false
      ElMessage.success(t.saveSuccess)
    }, 500)
  })
}

function formatTime(ts) {
  return dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
}

function handlePageChange() {
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <el-container class="root">
    <el-aside :width="isCollapse ? '6.4rem' : '20rem'" class="aside">
      <div class="logo">
        <el-icon :size="24"><Monitor /></el-icon>
        <span v-show="!isCollapse">{{ t.title }}</span>
      </div>
      <el-menu :default-active="'2'" :collapse="isCollapse">
        <el-menu-item index="1"><el-icon><DataAnalysis /></el-icon><span>设备总览</span></el-menu-item>
        <el-menu-item index="2"><el-icon><Monitor /></el-icon><span>设备列表</span></el-menu-item>
        <el-menu-item index="3"><el-icon><Bell /></el-icon><span>告警管理</span></el-menu-item>
        <el-menu-item index="4"><el-icon><Tools /></el-icon><span>系统设置</span></el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-button link @click="isCollapse = !isCollapse">
            <el-icon :size="20"><Setting /></el-icon>
          </el-button>
          <span class="title">{{ t.title }}</span>
        </div>
        <div class="header-right">
          <el-button :icon="Refresh" @click="fetchData">刷新</el-button>
          <el-button type="primary" :icon="Plus" @click="handleAdd">{{ t.addDevice }}</el-button>
        </div>
      </el-header>

      <el-main class="main">
        <el-row :gutter="1.6rem" class="kpi-row">
          <el-col :span="6" v-for="item in kpiList" :key="item.label">
            <el-card shadow="hover" class="kpi-card">
              <div class="kpi-inner">
                <div>
                  <div class="kpi-label">{{ item.label }}</div>
                  <div class="kpi-value">{{ item.value }}</div>
                </div>
                <el-icon :size="40" :color="item.color"><component :is="item.icon" /></el-icon>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-card shadow="never">
          <el-row :gutter="1.6rem" class="filter-row">
            <el-col :span="6">
              <el-input v-model="query.keyword" :placeholder="t.searchPlaceholder" :prefix-icon="Search" clearable @keyup.enter="fetchData" />
            </el-col>
            <el-col :span="4">
              <el-select v-model="query.status" :placeholder="t.statusFilter" clearable>
                <el-option v-for="item in STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" :icon="Search" @click="fetchData">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>

          <el-table :data="tableData" v-loading="loading" border stripe>
            <el-table-column type="index" label="序号" width="6rem" />
            <el-table-column prop="deviceName" label="设备名称" min-width="14rem" />
            <el-table-column prop="deviceCode" label="设备编码" width="12rem" />
            <el-table-column label="状态" width="10rem">
              <template #default="{ row }">
                <StatusTag :status="row.status" />
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="IP地址" width="14rem" />
            <el-table-column label="CPU使用率" width="12rem">
              <template #default="{ row }">
                <el-progress :percentage="row.cpu" :stroke-width="6" :status="row.cpu > 80 ? 'exception' : undefined" />
              </template>
            </el-table-column>
            <el-table-column label="内存使用率" width="12rem">
              <template #default="{ row }">
                <el-progress :percentage="row.memory" :stroke-width="6" :status="row.memory > 80 ? 'exception' : undefined" />
              </template>
            </el-table-column>
            <el-table-column prop="location" label="位置" width="14rem" />
            <el-table-column label="最后心跳" width="18rem">
              <template #default="{ row }">
                {{ formatTime(row.lastHeartbeat) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="18rem">
              <template #default="{ row }">
                <el-button link type="primary" :icon="View" @click="handleView(row)">查看</el-button>
                <el-button link type="primary" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
                <el-dropdown @command="(cmd) => handleCommand(cmd, row)">
                  <el-button link type="primary">更多<el-icon><ArrowDown /></el-icon></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="export" :icon="Download">导出</el-dropdown-item>
                      <el-dropdown-item command="delete" :icon="Delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              v-model:current-page="query.page"
              v-model:page-size="query.pageSize"
              :total="total"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="handlePageChange"
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50rem">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="8rem">
      <el-form-item label="名称" prop="deviceName">
        <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="编码" prop="deviceCode">
        <el-input v-model="form.deviceCode" placeholder="请输入设备编码" />
      </el-form-item>
      <el-form-item label="IP" prop="ip">
        <el-input v-model="form.ip" placeholder="请输入IP地址" />
      </el-form-item>
      <el-form-item label="位置">
        <el-input v-model="form.location" placeholder="请输入位置" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option v-for="item in STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.root {
  height: 100%;
}

.aside {
  background: var(--gts-bg-container);
  border-right: 0.1rem solid var(--gts-border-1);
  transition: width 0.3s;
  overflow: hidden;

  .logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    height: 5.6rem;
    padding: 0 2rem;
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--gts-text-1);
    border-bottom: 0.1rem solid var(--gts-border-1);
    white-space: nowrap;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5.6rem;
  background: var(--gts-bg-container);
  border-bottom: 0.1rem solid var(--gts-border-1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }

  .title {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--gts-text-1);
  }

  .header-right {
    display: flex;
    gap: 0.8rem;
  }
}

.main {
  background: var(--gts-bg-page);
  padding: 2rem;

  .kpi-row {
    margin-bottom: 1.6rem;
  }

  .kpi-card {
    border-radius: var(--gts-radius-lg);

    .kpi-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .kpi-label {
      font-size: 1.3rem;
      color: var(--gts-text-3);
    }

    .kpi-value {
      font-size: 2.8rem;
      font-weight: 700;
      color: var(--gts-text-1);
      margin-top: 0.4rem;
    }
  }

  .filter-row {
    margin-bottom: 1.6rem;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.6rem;
  }
}
</style>
```

## 关键写法要点（对照上方代码）

| 要点 | 代码位置 | 说明 |
|------|---------|------|
| import 顺序 | index.vue L2-8 | vue → element-plus → icons → dayjs → 相对引用 |
| constants 引用 | index.vue L7 | `import { STATUS_MAP, STATUS_OPTIONS } from './js/constants.js'` |
| mock API 调用 | index.vue L6 | `import { fetchList } from './mock/home.js'` |
| i18n 引用 | index.vue L8 | `import t from './locale/zh.js'` → 模板用 `{{ t.title }}` |
| 异步数据请求 | index.vue fetchData | `async/await` + `try/finally` + `v-loading` |
| 子组件引用 | index.vue L5 | `./components/StatusTag.vue` — 从 index.vue 所在目录起算 |
| Less 样式 | index.vue style | `<style lang="less" scoped>` — 嵌套 + 变量 |
| rem 单位 | index.vue style + template | 全部 rem（`5.6rem` = 56px），无 px |
| 无内联样式 | index.vue template | 无 `style="..."`，全部 class |
| token 使用 | index.vue style | 全部 var(--gts-*)，无硬编码 hex |
| style 禁区 | index.vue style | 无 :root / [data-gts-theme] / --gts-*: 定义 |
| 类名命名 | index.vue style | 按组件功能命名（`.root`、`.header`、`.kpi-card`），嵌套在根类下，简短无 `gts-` 前缀 |

# GTS 代码模式参考 — 完整列表页示例

> 以下代码通过 build.mjs 全部验证（SFC 编译 + 白名单 + token + 样式）。
> 作为生成代码的**参考锚点**：文件结构、import 写法、组件搭配、mock 数据量均以此为准。
> 生成不同页面时，替换业务内容，保持结构和写法不变。

## 文件结构

```
src/pages/DeviceManagement/
├── index.vue                    ← 页面主组件（骨架 + 筛选 + 表格 + 分页 + dialog）
├── components/
│   └── StatusTag.vue            ← 状态标签子组件（el-tag + STATUS_MAP）
└── mock-data.js                 ← mock 数据 + 状态映射表（命名导出）
```

## mock-data.js

> 命名导出；语义化 key；主列表 ≥ 10 条覆盖所有状态；时间戳用 number 便于 dayjs 格式化。

```js
export const STATUS_MAP = {
  running:     { label: '运行中', type: 'success' },
  stopped:     { label: '已停止', type: 'danger' },
  pending:     { label: '待审核', type: 'warning' },
  idle:        { label: '空闲',   type: 'info' },
  maintenance: { label: '维护中', type: 'warning' },
}

export const statusOptions = [
  { label: '运行中', value: 'running' },
  { label: '已停止', value: 'stopped' },
  { label: '待审核', value: 'pending' },
  { label: '空闲',   value: 'idle' },
  { label: '维护中', value: 'maintenance' },
]

export const deviceList = [
  { id: 1,  deviceName: '应用服务器-01',   deviceCode: 'SRV-001',  status: 'running',     ip: '192.168.1.10',  cpu: 45, memory: 62, location: '机房A-机柜01', lastHeartbeat: 1705300200000 },
  { id: 2,  deviceName: '数据库服务器-01', deviceCode: 'DB-001',   status: 'running',     ip: '192.168.1.20',  cpu: 78, memory: 85, location: '机房A-机柜02', lastHeartbeat: 1705300140000 },
  { id: 3,  deviceName: '缓存服务器-01',   deviceCode: 'CACHE-001',status: 'stopped',      ip: '192.168.1.30',  cpu: 0,  memory: 0,  location: '机房B-机柜01', lastHeartbeat: 1705299600000 },
  { id: 4,  deviceName: '文件服务器-02',   deviceCode: 'FILE-002', status: 'pending',     ip: '192.168.2.10',  cpu: 12, memory: 23, location: '机房B-机柜03', lastHeartbeat: 1705299000000 },
  { id: 5,  deviceName: 'API网关-01',      deviceCode: 'GW-001',   status: 'running',     ip: '192.168.3.10',  cpu: 56, memory: 48, location: '机房A-机柜04', lastHeartbeat: 1705300100000 },
  { id: 6,  deviceName: '消息队列-01',     deviceCode: 'MQ-001',   status: 'idle',        ip: '192.168.3.20',  cpu: 5,  memory: 15, location: '机房A-机柜05', lastHeartbeat: 1705300080000 },
  { id: 7,  deviceName: '负载均衡-01',     deviceCode: 'LB-001',   status: 'running',     ip: '192.168.4.10',  cpu: 32, memory: 41, location: '机房C-机柜01', lastHeartbeat: 1705300120000 },
  { id: 8,  deviceName: '监控服务器-01',   deviceCode: 'MON-001',  status: 'maintenance', ip: '192.168.4.20',  cpu: 18, memory: 30, location: '机房C-机柜02', lastHeartbeat: 1705290000000 },
  { id: 9,  deviceName: '日志服务器-01',   deviceCode: 'LOG-001',  status: 'running',     ip: '192.168.5.10',  cpu: 65, memory: 72, location: '机房C-机柜03', lastHeartbeat: 1705300060000 },
  { id: 10, deviceName: '备份服务器-01',   deviceCode: 'BAK-001',  status: 'stopped',      ip: '192.168.5.20',  cpu: 0,  memory: 0,  location: '机房D-机柜01', lastHeartbeat: 1705280000000 },
  { id: 11, deviceName: '测试服务器-01',   deviceCode: 'TEST-001', status: 'idle',        ip: '192.168.6.10',  cpu: 3,  memory: 8,  location: '机房D-机柜02', lastHeartbeat: 1705300040000 },
  { id: 12, deviceName: '生产服务器-02',   deviceCode: 'PROD-002', status: 'running',     ip: '192.168.6.20',  cpu: 89, memory: 91, location: '机房A-机柜06', lastHeartbeat: 1705300160000 },
]
```

## components/StatusTag.vue

> 子组件写法：defineProps 声明契约；STATUS_MAP 驱动 el-tag；`./` 相对引用不需要。

```vue
<script setup>
defineProps({
  status: { type: String, required: true },
})

const STATUS_MAP = {
  running:     { label: '运行中', type: 'success' },
  stopped:     { label: '已停止', type: 'danger' },
  pending:     { label: '待审核', type: 'warning' },
  idle:        { label: '空闲',   type: 'info' },
  maintenance: { label: '维护中', type: 'warning' },
}
</script>

<template>
  <el-tag :type="STATUS_MAP[status]?.type || 'info'" effect="light">
    {{ STATUS_MAP[status]?.label || status }}
  </el-tag>
</template>
```

## index.vue

> 完整页面：el-container 骨架 + 侧导航 + 顶栏 + KPI 卡片 + 筛选行 + 表格 + 分页 + dialog 表单。
> 注意 import 顺序、路径层级、图标名、token 使用 — 全部通过 build 验证。

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
import { deviceList, statusOptions, STATUS_MAP } from './mock-data.js'

const loading = ref(false)
const tableData = ref([])
const query = reactive({ keyword: '', status: '' })
const currentPage = ref(1)
const pageSize = ref(10)
const isCollapse = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增设备')
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

const filteredData = computed(() => {
  return deviceList.filter((item) => {
    const matchKeyword = !query.keyword || item.deviceName.includes(query.keyword)
    const matchStatus = !query.status || item.status === query.status
    return matchKeyword && matchStatus
  })
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const total = computed(() => filteredData.value.length)

function fetchData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = pagedData.value
    loading.value = false
  }, 300)
}

function resetQuery() {
  query.keyword = ''
  query.status = ''
  currentPage.value = 1
  fetchData()
}

function handleAdd() {
  dialogTitle.value = '新增设备'
  Object.assign(form, { id: null, deviceName: '', deviceCode: '', ip: '', location: '', status: 'running' })
  dialogVisible.value = true
}

function handleEdit(row) {
  dialogTitle.value = '编辑设备'
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
    ElMessageBox.confirm(`确定删除设备「${row.deviceName}」吗？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    }).then(() => {
      ElMessage.success('删除成功')
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
      ElMessage.success(form.id ? '编辑成功' : '新增成功')
    }, 500)
  })
}

function formatTime(ts) {
  return dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <el-container class="gts-page-root">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="gts-page-aside">
      <div class="gts-page-logo">
        <el-icon :size="24"><Monitor /></el-icon>
        <span v-show="!isCollapse">设备管理</span>
      </div>
      <el-menu :default-active="'2'" :collapse="isCollapse">
        <el-menu-item index="1"><el-icon><DataAnalysis /></el-icon><span>设备总览</span></el-menu-item>
        <el-menu-item index="2"><el-icon><Monitor /></el-icon><span>设备列表</span></el-menu-item>
        <el-menu-item index="3"><el-icon><Bell /></el-icon><span>告警管理</span></el-menu-item>
        <el-menu-item index="4"><el-icon><Tools /></el-icon><span>系统设置</span></el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="gts-page-header">
        <div class="gts-page-header-left">
          <el-button link @click="isCollapse = !isCollapse">
            <el-icon :size="20"><Setting /></el-icon>
          </el-button>
          <span class="gts-page-title">设备列表</span>
        </div>
        <div class="gts-page-header-right">
          <el-button :icon="Refresh" @click="fetchData">刷新</el-button>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增设备</el-button>
        </div>
      </el-header>

      <el-main class="gts-page-main">
        <el-row :gutter="16" style="margin-bottom: 16px">
          <el-col :span="6" v-for="item in kpiList" :key="item.label">
            <el-card shadow="hover" class="gts-page-kpi">
              <div class="gts-page-kpi-inner">
                <div>
                  <div class="gts-page-kpi-label">{{ item.label }}</div>
                  <div class="gts-page-kpi-value">{{ item.value }}</div>
                </div>
                <el-icon :size="40" :color="item.color"><component :is="item.icon" /></el-icon>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-card shadow="never">
          <el-row :gutter="16" style="margin-bottom: 16px">
            <el-col :span="6">
              <el-input v-model="query.keyword" placeholder="搜索设备名称" :prefix-icon="Search" clearable @keyup.enter="fetchData" />
            </el-col>
            <el-col :span="4">
              <el-select v-model="query.status" placeholder="状态筛选" clearable>
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" :icon="Search" @click="fetchData">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>

          <el-table :data="pagedData" v-loading="loading" border stripe>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="deviceName" label="设备名称" min-width="140" />
            <el-table-column prop="deviceCode" label="设备编码" width="120" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <StatusTag :status="row.status" />
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="IP地址" width="140" />
            <el-table-column label="CPU使用率" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.cpu" :stroke-width="6" :status="row.cpu > 80 ? 'exception' : undefined" />
              </template>
            </el-table-column>
            <el-table-column label="内存使用率" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.memory" :stroke-width="6" :status="row.memory > 80 ? 'exception' : undefined" />
              </template>
            </el-table-column>
            <el-table-column prop="location" label="位置" width="140" />
            <el-table-column label="最后心跳" width="180">
              <template #default="{ row }">
                {{ formatTime(row.lastHeartbeat) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
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

          <div style="display: flex; justify-content: flex-end; margin-top: 16px">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="fetchData"
              @current-change="fetchData"
            />
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
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
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.gts-page-root {
  height: 100%;
}

.gts-page-aside {
  background: var(--gts-bg-container);
  border-right: 1px solid var(--gts-border-1);
  transition: width 0.3s;
  overflow: hidden;
}

.gts-page-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 700;
  color: var(--gts-text-1);
  border-bottom: 1px solid var(--gts-border-1);
  white-space: nowrap;
}

.gts-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background: var(--gts-bg-container);
  border-bottom: 1px solid var(--gts-border-1);
}

.gts-page-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gts-page-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--gts-text-1);
}

.gts-page-header-right {
  display: flex;
  gap: 8px;
}

.gts-page-main {
  background: var(--gts-bg-page);
  padding: 20px;
}

.gts-page-kpi {
  border-radius: var(--gts-radius-lg);
}

.gts-page-kpi-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gts-page-kpi-label {
  font-size: 13px;
  color: var(--gts-text-3);
}

.gts-page-kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--gts-text-1);
  margin-top: 4px;
}
</style>
```

## 关键写法要点（对照上方代码）

| 要点 | 代码位置 | 说明 |
|------|---------|------|
| import 顺序 | index.vue L2-8 | vue → element-plus → @element-plus/icons-vue → dayjs → 相对引用 |
| 子组件引用 | index.vue L7 | `./components/StatusTag.vue` — 从 index.vue 所在目录起算 |
| mock 数据引用 | index.vue L8 | `./mock-data.js` — 同目录；命名导出 |
| 图标用法 | index.vue L4-6 | import 具名图标 → `:icon="Search"` 或 `<el-icon><Search /></el-icon>` |
| 状态标签 | StatusTag.vue | 子组件接收 props → STATUS_MAP 驱动 el-tag type |
| 表格自定义列 | index.vue template | `<template #default="{ row }">` — 不是 slot-scope |
| 操作列 dropdown | index.vue template | ≤3 按钮 + el-dropdown 收纳更多操作 |
| 分页 | index.vue template | v-model:current-page + v-model:page-size + background |
| 表单校验 | index.vue L28-32 | rules 对象 + formRef.validate() |
| 危险操作确认 | index.vue handleCommand | ElMessageBox.confirm type="warning" |
| dayjs 格式化 | index.vue formatTime | dayjs(ts).format('YYYY-MM-DD HH:mm:ss') |
| token 使用 | index.vue style | 全部 var(--gts-*)，无硬编码 hex |
| style 禁区 | index.vue style | 无 :root / [data-gts-theme] / --gts-*: 定义 |
| 类名前缀 | index.vue style | 全部 gts-page-* 前缀 |

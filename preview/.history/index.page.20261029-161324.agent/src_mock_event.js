// Layer 2 — 小区退服故障事件页面静态数据

export const eventMeta = {
  title: "小区退服故障事件",
  status: "待人工处理",
  occurredAt: "2026-04-16 10:00:24",
  eventId: "EVT-20260416-100024-031",
  region: "上海 · 浦东新区 · 陆家嘴",
  site: "仁恒滨江园(三期)HR02H_1",
};

// 左侧竖向图标栏（可展开为「图标 + 文字」导航）
export const railItems = [
  { key: "new-chat", icon: "message-square-plus", label: "发起新对话" },
  { key: "monitor", icon: "monitor-dot", label: "网络状态监控" },
  { key: "manual", icon: "user-check", label: "人工接管" },
  { key: "report", icon: "clipboard-list", label: "值守报告" },
  { key: "intent", icon: "target", label: "意图管理" },
];

// 事件处理阶段（折叠面板）
export const stages = [
  {
    key: "sense",
    index: 1,
    name: "事件感知",
    time: "10:00:24",
    timeNote: "由OTDR感知",
    status: "已完成",
    kind: "perception",
    fields: [
      ["发生时间", "2026-08-15 10:00:12"],
      ["事件类型", "小区退服"],
      ["事件描述", "仁恒滨江园(三期)HR02H_1发生退服故障"],
      ["事件对象", "CELLID=1, CELLNAME=XX"],
    ],
    alarms: [
      { code: "29240", name: "小区不可用告警", level: "严重" },
      { code: "26234", name: "BBU CPRJ接口异常告警", level: "重要" },
    ],
  },
  {
    key: "root-cause",
    index: 2,
    name: "根因分析",
    time: "10:03:30",
    timeNote: "",
    status: "已完成",
    kind: "rootCause",
    rootCause: "前传光纤中断",
    objectTitle: "故障对象",
    objectLines: [
      [["网元名称", "仁恒滨江园(三期)HR02H_1"]],
      [["框号", "0"], ["槽号", "3"], ["端口号", "2"]],
      [["ESN", "2103050JBU10R6105277"]],
      [["BOM编码", "03050JBU"]],
      [["故障大类", { tag: "前传链路故障" }], ["故障子类", { tag: "前传光纤故障" }]],
      [["业务影响", "流量下降10%；用户数下降10%"]],
    ],
  },
  {
    key: "decision",
    index: 3,
    name: "综合决策",
    time: "10:03:30",
    timeNote: "",
    status: "已完成",
    kind: "decision",
    rows: [
      ["处理建议", "远程处理"],
      ["处理优先级", "3"],
    ],
  },
  {
    key: "plan",
    index: 4,
    name: "方案生成",
    time: "10:03:30",
    timeNote: "",
    status: "已完成",
    kind: "plan",
    planName: "邻站补偿方案",
    rows: [
      { key: "hr09h", ne: "资产大厦 HR09H", cell: "HR09H-1", before: "4°", after: "1°" },
      { key: "hr16h", ne: "平安大厦六HR16H", cell: "HR16H-1", before: "5°", after: "3°" },
    ],
  },
  {
    key: "manual",
    index: 5,
    name: "人工接管",
    time: "10:04:15",
    timeNote: "",
    status: "进行中",
    kind: "manual",
    rows: [
      ["当前处理人", "Admin"],
      ["接管时间", "10:04:15"],
      ["待确认命令", "STR CPRILBRNEG:RCN=0"],
    ],
    note: "智能体已生成修复命令，等待人工确认后下发。确认前请先备份单板日志。",
  },
];

// 底部处理环节时间轴
export const processNodes = [
  { key: "monitor", title: "网络监控", sub: "", time: "10:00:24", icon: "activity", tone: "brand" },
  { key: "sense", title: "事件感知", sub: "设备故障", time: "10:00:24", icon: "radar", tone: "error" },
  { key: "root", title: "根因分析", sub: "前传光纤中断", time: "10:03:30", icon: "search", tone: "brand" },
  { key: "decision", title: "综合决策", sub: "", time: "10:04:12", icon: "scale", tone: "brand" },
  { key: "plan", title: "方案生成", sub: "补偿方案已生成", time: "10:04:13", icon: "wand-sparkles", tone: "brand" },
  { key: "exec", title: "方案执行", sub: "补偿方案已下发", time: "10:04:14", icon: "send", tone: "brand" },
  { key: "kpi", title: "基础KPI评估", sub: "评估已完成", time: "10:04:24", icon: "chart-column", tone: "brand" },
];

export const branchNode = {
  key: "manual",
  title: "人工接管",
  sub: "待人工在线处理",
  time: "—",
  icon: "user-check",
  tone: "manual",
  column: 5,
};

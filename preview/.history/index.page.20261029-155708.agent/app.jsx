// App entry — iMaster MAE · 小区退服故障事件
// Layering:
//   Layer 1 全局状态 → src/context.jsx
//   Layer 2 mock 数据 → src/mock/event.js
//   Layer 3 复用组件 → src/components/{info-grid,stage-accordion,device-diagram}
//   Layer 4 视图    → src/views/{app-header,event-panel,chat-panel,city-map,process-timeline}
//   Layer 5 布局    → app.jsx

import { ConfigProvider, Empty } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import AppHeader from "./src/views/app-header/index.jsx";
import EventPanel from "./src/views/event-panel/index.jsx";
import CityMap from "./src/views/city-map/index.jsx";
import ProcessTimeline from "./src/views/process-timeline/index.jsx";
import "./app.css";

export default function App() {
  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty style={{ padding: "2rem 0" }} />}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <div className="app-root">
          <AppHeader />
          <main className="app-body">
            <EventPanel />
            <section className="app-stage">
              <CityMap />
              <ProcessTimeline />
            </section>
          </main>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}

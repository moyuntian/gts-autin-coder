import { useState, Fragment } from "react";
import { Tag, Dropdown, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import InfoGrid from "../../components/info-grid/index.jsx";
import StageAccordion from "../../components/stage-accordion/index.jsx";
import DeviceDiagram from "../../components/device-diagram/index.jsx";
import ChatPanel from "../chat-panel/index.jsx";
import { eventMeta, railItems, stages } from "../../mock/event.js";
import "./index.css";

const HEAD_MENU = {
  items: [
    { key: "copy", label: "复制事件编号", icon: <Icon name="copy" size="0.875rem" /> },
    { key: "export", label: "导出事件详情", icon: <Icon name="file-text" size="0.875rem" /> },
    { key: "assign", label: "转派处理人", icon: <Icon name="user-check" size="0.875rem" /> },
  ],
};

function PerceptionBody({ stage }) {
  return (
    <>
      <InfoGrid rows={stage.fields} labelWidth="4.5rem" />
      <div className="stage-block">
        <div className="stage-block__title">子告警列表</div>
        <ul className="alarm-list">
          {stage.alarms.map((alarm) => (
            <li className="alarm-item" key={alarm.code}>
              <span className="alarm-item__dot" />
              <span className="alarm-item__text">
                {alarm.code} {alarm.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function RootCauseBody({ stage }) {
  const [diagnosing, setDiagnosing] = useState(false);

  const handleRediagnose = () => {
    if (diagnosing) return;
    setDiagnosing(true);
    window.setTimeout(() => setDiagnosing(false), 1600);
  };

  return (
    <>
      <div className="root-cause">
        <span className="root-cause__label">已识别故障根因</span>
        <span className="root-cause__value">{stage.rootCause}</span>
        <a className="stage-link" onClick={handleRediagnose}>
          {diagnosing ? "诊断中…" : "重新诊断"}
        </a>
      </div>

      <DeviceDiagram slot={3} port={2} />

      <div className="stage-block">
        <div className="stage-block__title">故障对象详情</div>
        <InfoGrid rows={stage.deviceRows} labelWidth="4.5rem" />
      </div>

      <div className="stage-block">
        <div className="stage-block__title">故障分类与影响</div>
        <InfoGrid
          labelWidth="4.5rem"
          rows={[
            ["故障大类", <Tag color="error">{stage.fault.major}</Tag>],
            ["故障子类", <Tag color="error">{stage.fault.minor}</Tag>],
            ["业务影响", stage.fault.impact],
          ]}
        />
      </div>
    </>
  );
}

function DecisionBody({ stage }) {
  return <InfoGrid rows={stage.rows} labelWidth="4.5rem" />;
}

function PlanBody({ stage }) {
  return (
    <div className="stage-block">
      <div className="stage-block__title">
        {stage.planName}
        <span className="stage-block__hint">共 {stage.rows.length} 个邻区</span>
      </div>
      <div className="plan-grid">
        <span className="plan-grid__head">网元</span>
        <span className="plan-grid__head">补偿小区</span>
        <span className="plan-grid__head">调整前电子下倾角</span>
        <span className="plan-grid__head">调整后电子下倾角</span>

        {stage.rows.map((row) => (
          <Fragment key={row.key}>
            <span className="plan-grid__cell">{row.ne}</span>
            <span className="plan-grid__cell">{row.cell}</span>
            <span className="plan-grid__cell">{row.before}</span>
            <span className="plan-grid__cell plan-grid__cell--after">{row.after}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ManualBody({ stage }) {
  return (
    <>
      <InfoGrid rows={stage.rows} labelWidth="5.5rem" />
      <p className="stage-note">{stage.note}</p>
    </>
  );
}

function StageBody({ stage }) {
  if (stage.kind === "perception") return <PerceptionBody stage={stage} />;
  if (stage.kind === "rootCause") return <RootCauseBody stage={stage} />;
  if (stage.kind === "decision") return <DecisionBody stage={stage} />;
  if (stage.kind === "plan") return <PlanBody stage={stage} />;
  return <ManualBody stage={stage} />;
}

export default function EventPanel() {
  const [activeRail, setActiveRail] = useState("manual");
  const [railExpanded, setRailExpanded] = useState(false);
  const [openKeys, setOpenKeys] = useState(stages.map((item) => item.key));

  const toggleStage = (key) => {
    setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : prev.concat(key)));
  };

  return (
    <aside className={"event-panel" + (railExpanded ? " is-expanded" : "")}>
      <nav className="event-rail">
        <div className="event-rail__list">
          {railItems.map((item) => (
            <Tooltip
              key={item.key}
              title={item.label}
              placement="right"
              open={railExpanded ? false : undefined}
            >
              <a
                className={"event-rail__item" + (activeRail === item.key ? " is-active" : "")}
                onClick={() => setActiveRail(item.key)}
              >
                <span className="event-rail__icon">
                  <Icon name={item.icon} size="1.25rem" />
                </span>
                <span className="event-rail__text">{item.label}</span>
              </a>
            </Tooltip>
          ))}
        </div>

        <div className="event-rail__footer">
          <button
            type="button"
            className="event-rail__toggle"
            title={railExpanded ? "收起侧栏" : "展开侧栏"}
            onClick={() => setRailExpanded((v) => !v)}
          >
            <Icon name={railExpanded ? "panel-left-close" : "panel-left-open"} size="1rem" />
            <span className="event-rail__text">收起侧栏</span>
          </button>
        </div>
      </nav>

      <div className="event-main">
        <header className="event-head">
          <div className="event-head__row">
            <a className="event-head__back">
              <Icon name="chevron-left" size="1.25rem" />
            </a>
            <span className="event-head__badge">
              <Icon name="triangle-alert" size="0.875rem" />
            </span>
            <h1 className="event-head__title">{eventMeta.title}</h1>
            <Tag color="error" className="event-head__tag">
              {eventMeta.status}
            </Tag>
            <Dropdown menu={HEAD_MENU} trigger={["click"]} placement="bottomRight">
              <a className="event-head__more">
                <Icon name="ellipsis" size="1.25rem" />
              </a>
            </Dropdown>
          </div>
          <div className="event-head__meta">
            <span className="event-head__time">发生时间：{eventMeta.occurredAt}</span>
          </div>
        </header>

        <div className="event-stages">
          {stages.map((item) => (
            <StageAccordion
              key={item.key}
              name={item.name}
              time={item.time}
              timeNote={item.timeNote}
              status={item.status}
              open={openKeys.includes(item.key)}
              onToggle={() => toggleStage(item.key)}
            >
              <StageBody stage={item} />
            </StageAccordion>
          ))}
        </div>

        <ChatPanel />
      </div>
    </aside>
  );
}

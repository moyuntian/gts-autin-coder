import { Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// 事件处理阶段折叠面板：名称 + 时间 + 状态
export default function StageAccordion({ name, time, timeNote, status, open, onToggle, children }) {
  const color = status === "已完成" ? "success" : "processing";
  return (
    <section className={"stage" + (open ? " stage--open" : "")}>
      <button type="button" className="stage__head" onClick={onToggle} aria-expanded={open}>
        <span className="stage__name">{name}</span>
        <span className="stage__time">
          {time}
          {timeNote ? <i>（{timeNote}）</i> : null}
        </span>
        <Tag color={color} className="stage__tag">
          {status}
        </Tag>
        <Icon name={open ? "chevron-up" : "chevron-down"} size="0.875rem" className="stage__chev" />
      </button>
      {open ? <div className="stage__body">{children}</div> : null}
    </section>
  );
}

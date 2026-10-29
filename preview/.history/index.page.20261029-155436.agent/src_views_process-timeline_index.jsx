import { Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { processNodes, branchNode } from "../../mock/event.js";
import "./index.css";

export default function ProcessTimeline() {
  return (
    <section className="timeline">
      <header className="timeline__head">
        <h2 className="timeline__title">处理环节</h2>
        <Tag color="processing">处理中</Tag>
      </header>

      <div className="timeline__grid">
        {processNodes.map((node, index) => (
          <div className="tl-node" data-tone={node.tone} key={node.key}>
            {index < processNodes.length - 1 ? <span className="tl-node__line" /> : null}
            <span className="tl-node__icon">
              <Icon name={node.icon} size="1rem" />
            </span>
            <span className="tl-node__title">{node.title}</span>
            <span className="tl-node__sub">{node.sub || "—"}</span>
            <span className="tl-node__time">{node.time}</span>
          </div>
        ))}

        <div className="tl-branch" data-tone={branchNode.tone} style={{ gridColumn: "5 / 6" }}>
          <span className="tl-branch__stem" />
          <span className="tl-node__icon">
            <Icon name={branchNode.icon} size="1rem" />
          </span>
          <span className="tl-node__title">{branchNode.title}</span>
          <span className="tl-node__sub">{branchNode.sub}</span>
          <span className="tl-node__time">{branchNode.time}</span>
        </div>
      </div>
    </section>
  );
}

import "./index.css";

// BBU 设备示意图：等轴测机框，故障槽位/端口以红色高亮
export default function DeviceDiagram({ slot = 3, port = 2 }) {
  const slots = [1, 2, 3, 4];
  return (
    <div className="device-diagram">
      <svg viewBox="0 0 320 132" className="device-diagram__svg" role="img" aria-label="BBU 设备故障槽位示意">
        {/* 顶面 */}
        <polygon points="0,40 40,6 300,6 260,40" className="dd-face dd-face--top" />
        {/* 右侧面 */}
        <polygon points="260,40 300,6 300,76 260,110" className="dd-face dd-face--side" />
        {/* 前面板 */}
        <rect x="0" y="40" width="260" height="70" rx="3" className="dd-face dd-face--front" />

        {slots.map((s) => {
          const x = 8 + (s - 1) * 62;
          const faulty = s === slot;
          return (
            <g key={s} className={faulty ? "dd-slot dd-slot--fault" : "dd-slot"}>
              <rect x={x} y={48} width={54} height={54} rx={2} className="dd-slot__panel" />
              <rect x={x + 6} y={54} width={42} height={8} rx={1} className="dd-slot__bar" />
              {[1, 2, 3].map((p) => {
                const active = faulty && p === port;
                return (
                  <rect
                    key={p}
                    x={x + 6 + (p - 1) * 15}
                    y={82}
                    width={11}
                    height={9}
                    rx={1}
                    className={active ? "dd-port dd-port--fault" : "dd-port"}
                  />
                );
              })}
              <text x={x + 6} y={75} className="dd-slot__label">
                SLOT {s}
              </text>
            </g>
          );
        })}

        {/* 故障标注 */}
        <line x1="272" y1="48" x2="304" y2="30" className="dd-leader" />
        <circle cx="270" cy="49" r="2.5" className="dd-leader-dot" />
        <text x="304" y="24" textAnchor="end" className="dd-fault-label">
          槽 3 · 端口 2
        </text>
        <text x="304" y="38" textAnchor="end" className="dd-fault-sub">
          光纤中断
        </text>
      </svg>
    </div>
  );
}

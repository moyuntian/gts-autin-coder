import "./index.css";

// 字段 / 值 明细行 — 左侧标签、右侧内容，支持 ReactNode 内容
export default function InfoGrid({ rows, labelWidth = "5.5rem" }) {
  return (
    <dl className="info-grid">
      {rows.map((row) => {
        const label = row[0];
        const value = row[1];
        return (
          <div className="info-grid__row" key={label}>
            <dt className="info-grid__label" style={{ flex: `0 0 ${labelWidth}` }}>
              {label}
            </dt>
            <dd className="info-grid__value">{value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

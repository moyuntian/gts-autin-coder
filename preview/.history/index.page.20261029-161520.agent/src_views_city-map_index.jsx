import { useMemo, useState } from "react";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

const GRID = 30;
const TW = 46; // 单块瓦片宽
const TH = 23; // 单块瓦片高（等轴测 1:0.5）

// 网络速率色阶：低（红）→ 橙 → 黄 → 绿 → 高（蓝）
const SCALE = [
  [0.0, [224, 33, 40]],
  [0.26, [244, 132, 12]],
  [0.48, [252, 200, 0]],
  [0.7, [98, 180, 46]],
  [1.0, [32, 112, 243]],
];

function pseudo(x, y) {
  const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function rateToRgb(rate) {
  const t = Math.min(1, Math.max(0, rate / 100));
  for (let i = 1; i < SCALE.length; i += 1) {
    const [p0, c0] = SCALE[i - 1];
    const [p1, c1] = SCALE[i];
    if (t <= p1) {
      const k = (t - p0) / (p1 - p0 || 1);
      return c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
    }
  }
  return SCALE[SCALE.length - 1][1];
}

function tint(c, k) {
  return `rgb(${Math.round(c[0] * k)}, ${Math.round(c[1] * k)}, ${Math.round(c[2] * k)})`;
}

function buildCity(flat) {
  const ground = [];
  const buildings = [];
  const w = 19.6;
  const d = 9.8;
  const hScale = flat ? 0.28 : 1;

  for (let x = 0; x < GRID; x += 1) {
    for (let y = 0; y < GRID; y += 1) {
      const cx = (x - y) * (TW / 2);
      const cy = (x + y) * (TH / 2);
      const water = x < 4;
      const road = !water && (x % 6 === 5 || y % 6 === 5);

      if (water) {
        ground.push({
          key: `w-${x}-${y}`,
          pts: `${cx - TW / 2},${cy} ${cx},${cy - TH / 2} ${cx + TW / 2},${cy} ${cx},${cy + TH / 2}`,
          cls: "city-water",
        });
        continue;
      }
      if (road) {
        ground.push({
          key: `r-${x}-${y}`,
          pts: `${cx - TW / 2},${cy} ${cx},${cy - TH / 2} ${cx + TW / 2},${cy} ${cx},${cy + TH / 2}`,
          cls: "city-road",
        });
        continue;
      }

      const dx = x - 18;
      const dy = y - 12;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const base = Math.max(14, 196 * Math.exp(-(dist * dist) / 150));
      const rawH = base * (0.4 + pseudo(x, y) * 0.86);
      const h = rawH * hScale;
      const rate = Math.min(100, Math.max(4, 12 + rawH * 0.38 + pseudo(y + 7, x + 3) * 36));
      const rgb = rateToRgb(rate);

      buildings.push({
        key: `b-${x}-${y}`,
        depth: x + y,
        left: `${cx - w},${cy} ${cx},${cy + d} ${cx},${cy + d - h} ${cx - w},${cy - h}`,
        right: `${cx},${cy + d} ${cx + w},${cy} ${cx + w},${cy - h} ${cx},${cy + d - h}`,
        top: `${cx - w},${cy - h} ${cx},${cy - h + d} ${cx + w},${cy - h} ${cx},${cy - h - d}`,
        topFill: tint(rgb, 1),
        leftFill: tint(rgb, 0.84),
        rightFill: tint(rgb, 0.68),
      });
    }
  }

  buildings.sort((a, b) => a.depth - b.depth);
  return { ground, buildings };
}

function project(x, y) {
  return { cx: (x - y) * (TW / 2), cy: (x + y) * (TH / 2) };
}

function MapPin({ x, y, text, accent }) {
  const width = text.length * 12 + (accent ? 34 : 20);
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1="0" y1="0" x2="0" y2="-13" className="map-pin__stem" />
      <circle r="3.5" className="map-pin__dot" />
      <g transform={`translate(${-width / 2} ${-45})`}>
        <rect width={width} height={26} rx="4" className="map-pin__chip" />
        {accent ? <circle cx="12" cy="13" r="3.5" className="map-pin__accent" /> : null}
        <text
          x={accent ? 20 + (width - 34) / 2 : width / 2}
          y="17"
          textAnchor="middle"
          className="map-pin__text"
        >
          {text}
        </text>
      </g>
    </g>
  );
}

export default function CityMap() {
  const [zoom, setZoom] = useState(1);
  const [is3d, setIs3d] = useState(true);
  const { ground, buildings } = useMemo(() => buildCity(!is3d), [is3d]);

  const width = 1450 / zoom;
  const height = 830 / zoom;
  const viewBox = `${-width / 2} ${270 - height / 2} ${width} ${height}`;

  const towerPos = project(14, 10);
  const alertPos = project(22, 14);
  const lujiazui = project(11, 6);
  const shiji = project(22, 20);
  const riverside = project(24, 9);

  const towerH = is3d ? 232 : 72;
  const towerTop = towerPos.cy - towerH;

  return (
    <section className="city-map">
      <svg className="city-map__canvas" viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
        {/* 地面 */}
        <polygon
          points={`${-GRID * (TW / 2)},${GRID * (TH / 2)} 0,0 ${GRID * (TW / 2)},${GRID * (TH / 2)} 0,${GRID * (TH / 2) * 2}`}
          className="city-ground"
        />

        {ground.map((tile) => (
          <polygon key={tile.key} points={tile.pts} className={tile.cls} />
        ))}

        {buildings.map((b) => (
          <g key={b.key}>
            <polygon points={b.left} fill={b.leftFill} />
            <polygon points={b.right} fill={b.rightFill} />
            <polygon points={b.top} fill={b.topFill} />
          </g>
        ))}

        {/* 东方明珠 */}
        <g className="city-tower">
          <polygon
            points={`${towerPos.cx - 10},${towerPos.cy} ${towerPos.cx + 10},${towerPos.cy} ${towerPos.cx + 3.5},${towerTop} ${towerPos.cx - 3.5},${towerTop}`}
            className="city-tower__shaft"
          />
          <ellipse cx={towerPos.cx} cy={towerTop + towerH * 0.46} rx="16" ry="15" className="city-tower__ball" />
          <ellipse cx={towerPos.cx} cy={towerTop + towerH * 0.16} rx="11" ry="10" className="city-tower__ball" />
          <line
            x1={towerPos.cx}
            y1={towerTop}
            x2={towerPos.cx}
            y2={towerTop - 34}
            className="city-tower__mast"
          />
          <circle cx={towerPos.cx} cy={towerTop - 36} r="2.5" className="city-tower__light" />
        </g>

        {/* 故障告警标记 */}
        <g transform={`translate(${alertPos.cx} ${alertPos.cy - 118})`} className="city-alert">
          <circle r="24" className="city-alert__halo" />
          <circle r="13" className="city-alert__dot" />
          <text y="4.6" textAnchor="middle" className="city-alert__mark">
            !
          </text>
          <g transform="translate(20 -12)">
            <rect width="112" height="24" rx="4" className="city-alert__chip" />
            <text x="56" y="16" textAnchor="middle" className="city-alert__label">
              小区退服故障
            </text>
          </g>
        </g>

        {/* 地图标注 */}
        <MapPin x={lujiazui.cx} y={lujiazui.cy - 96} text="陆家嘴金融中心" />
        <MapPin x={shiji.cx} y={shiji.cy - 92} text="世纪大道基站" accent />
        <MapPin x={riverside.cx} y={riverside.cy - 84} text="滨江花园三期-1号楼" />
      </svg>

      {/* 地图控件 */}
      <div className="map-controls">
        <button type="button" className="map-controls__btn map-controls__compass" title="指北针">
          <Icon name="compass" size="1rem" />
        </button>
        <span className="map-controls__split" />
        <button
          type="button"
          className="map-controls__btn"
          title="放大"
          onClick={() => setZoom((z) => Math.min(2.2, Number((z + 0.2).toFixed(1))))}
        >
          <Icon name="plus" size="1rem" />
        </button>
        <button
          type="button"
          className="map-controls__btn"
          title="缩小"
          onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.2).toFixed(1))))}
        >
          <Icon name="minus" size="1rem" />
        </button>
        <span className="map-controls__split" />
        <button type="button" className="map-controls__btn" title="定位到故障点" onClick={() => setZoom(1.6)}>
          <Icon name="crosshair" size="1rem" />
        </button>
        <button
          type="button"
          className={"map-controls__btn" + (is3d ? " is-active" : "")}
          title="3D 视图"
          onClick={() => setIs3d((v) => !v)}
        >
          <Icon name="boxes" size="1rem" />
        </button>
        <button type="button" className="map-controls__btn" title="图层">
          <Icon name="layers" size="1rem" />
        </button>
      </div>

      {/* 图例 */}
      <div className="map-legend">
        <Icon name="signal" size="0.875rem" className="map-legend__icon" />
        <span className="map-legend__title">网络速率</span>
        <span className="map-legend__low">低</span>
        <span className="map-legend__bar" />
        <span className="map-legend__high">高</span>
        <Icon name="settings" size="0.875rem" className="map-legend__gear" />
      </div>
    </section>
  );
}

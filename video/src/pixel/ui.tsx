import React from "react";
import {
  AbsoluteFill,
  Img,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_TEXT, FONT_TITLE, P, stepFrame } from "./palette";
import { Sprite, type SpriteDef } from "./Sprite";
import {
  employeeHead,
  iconCheck,
  iconSearch,
  iconTable,
  robotHead,
} from "./sprites";

/* ------------------------------------------------------------------ */
/* Bordo "a gradini" in stile pixel art                                */
/* ------------------------------------------------------------------ */

export const pixelBorder = (
  b: number,
  color: string = P.ink,
  shadow = true,
) => ({
  boxShadow: [
    `0 -${b}px 0 0 ${color}`,
    `0 ${b}px 0 0 ${color}`,
    `-${b}px 0 0 0 ${color}`,
    `${b}px 0 0 0 ${color}`,
    ...(shadow ? [`${b * 2}px ${b * 2}px 0 0 rgba(27,26,23,0.35)`] : []),
  ].join(", "),
});

// Comparsa "a scatti": 0 → 60% → 115% → 100%
export const popScale = (frame: number, start: number) => {
  const d = frame - start;
  if (d < 0) return 0;
  if (d < 2) return 0.6;
  if (d < 4) return 1.15;
  return 1;
};

/* ------------------------------------------------------------------ */
/* Testo con effetto macchina da scrivere (senza reflow)               */
/* ------------------------------------------------------------------ */

export const Typewriter: React.FC<{
  readonly text: string;
  readonly start: number;
  readonly speed?: number; // caratteri per frame
  readonly cursor?: boolean;
}> = ({ text, start, speed = 1, cursor = false }) => {
  const frame = useCurrentFrame();
  const n = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - start) * speed)),
  );
  const typing = n > 0 && n < text.length;
  const showCursor =
    cursor && (typing || Math.floor(frame / 8) % 2 === 0) && frame >= start;
  return (
    <>
      <span>{text.slice(0, n)}</span>
      {showCursor ? <span style={{ color: P.orange }}>▌</span> : null}
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Ufficio (griglia 108×108 celle da 10px)                             */
/* ------------------------------------------------------------------ */

const R: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}> = ({ x, y, w, h, c }) => <rect x={x} y={y} width={w} height={h} fill={c} />;

// Linea pixel (Bresenham) per le lancette dell'orologio
const pixelLine = (x0: number, y0: number, x1: number, y1: number) => {
  const pts: [number, number][] = [];
  let x = Math.round(x0);
  let y = Math.round(y0);
  const tx = Math.round(x1);
  const ty = Math.round(y1);
  const dx = Math.abs(tx - x);
  const dy = -Math.abs(ty - y);
  const sx = x < tx ? 1 : -1;
  const sy = y < ty ? 1 : -1;
  let err = dx + dy;
  for (let i = 0; i < 64; i++) {
    pts.push([x, y]);
    if (x === tx && y === ty) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
  return pts;
};

const Clock: React.FC<{ cx: number; cy: number; minutes: number }> = ({
  cx,
  cy,
  minutes,
}) => {
  const r = 7;
  const face: React.ReactNode[] = [];
  for (let y = -r; y <= r; y++) {
    const half = Math.round(Math.sqrt(r * r - y * y));
    face.push(
      <R
        key={`o${y}`}
        x={cx - half}
        y={cy + y}
        w={half * 2 + 1}
        h={1}
        c={P.ink}
      />,
    );
    if (Math.abs(y) < r) {
      const hi = Math.max(0, Math.round(Math.sqrt((r - 1) * (r - 1) - y * y)));
      face.push(
        <R
          key={`i${y}`}
          x={cx - hi}
          y={cy + y}
          w={hi * 2 + 1}
          h={1}
          c={P.white}
        />,
      );
    }
  }
  const ticks = [0, 3, 6, 9].map((h) => {
    const a = (h / 12) * Math.PI * 2;
    return (
      <R
        key={`t${h}`}
        x={cx + Math.round(Math.sin(a) * 5)}
        y={cy - Math.round(Math.cos(a) * 5)}
        w={1}
        h={1}
        c={P.grayMid}
      />
    );
  });
  const am = (minutes / 60) * Math.PI * 2;
  const ah = (minutes / 720) * Math.PI * 2;
  const mHand = pixelLine(cx, cy, cx + Math.sin(am) * 5, cy - Math.cos(am) * 5);
  const hHand = pixelLine(cx, cy, cx + Math.sin(ah) * 3, cy - Math.cos(ah) * 3);
  return (
    <g>
      {face}
      {ticks}
      {mHand.map(([x, y], i) => (
        <R key={`m${i}`} x={x} y={y} w={1} h={1} c={P.ink} />
      ))}
      {hHand.map(([x, y], i) => (
        <R key={`h${i}`} x={x} y={y} w={1} h={1} c={P.orange} />
      ))}
      <R x={cx} y={cy} w={1} h={1} c={P.orangeDark} />
    </g>
  );
};

export const Office: React.FC<{
  readonly clockMinutes?: number;
  readonly dim?: number;
  readonly plant?: boolean;
}> = ({ clockMinutes = 17 * 60 + 55, dim = 0, plant = true }) => {
  const frame = useCurrentFrame();
  const cloud = Math.floor(stepFrame(frame, 6) / 12) % 40;
  const planks: React.ReactNode[] = [];
  for (let row = 0; row < 9; row++) {
    const y = 76 + row * 4;
    planks.push(
      <R
        key={`p${row}`}
        x={0}
        y={y}
        w={108}
        h={4}
        c={row % 2 ? P.floorA : P.floorB}
      />,
    );
    planks.push(
      <R key={`l${row}`} x={0} y={y} w={108} h={1} c={P.floorLine} />,
    );
    for (let s = (row * 13) % 27; s < 108; s += 27) {
      planks.push(
        <R key={`s${row}-${s}`} x={s} y={y} w={1} h={4} c={P.floorLine} />,
      );
    }
  }
  return (
    <AbsoluteFill>
      <svg
        width={1080}
        height={1080}
        viewBox="0 0 108 108"
        shapeRendering="crispEdges"
      >
        {/* parete con righe verticali leggere */}
        <R x={0} y={0} w={108} h={76} c={P.wall} />
        {Array.from({ length: 14 }).map((_, i) => (
          <R key={`w${i}`} x={i * 8 + 3} y={0} w={1} h={62} c={P.wallShade} />
        ))}
        {/* boiserie */}
        <R x={0} y={62} w={108} h={14} c={P.wainscot} />
        <R x={0} y={62} w={108} h={1} c={P.deskDark} />
        {Array.from({ length: 9 }).map((_, i) => (
          <R key={`b${i}`} x={i * 12 + 2} y={65} w={9} h={8} c={P.wallShade} />
        ))}
        {/* finestra */}
        <R x={5} y={19} w={32} h={32} c={P.gray} />
        <R x={6} y={20} w={30} h={30} c={P.sky} />
        <R x={6} y={20} w={30} h={10} c={P.skyLight} />
        <g>
          <R x={6 + ((cloud + 4) % 30)} y={24} w={6} h={2} c={P.white} />
          <R x={7 + ((cloud + 4) % 30)} y={23} w={3} h={1} c={P.white} />
          <R x={6 + ((cloud + 19) % 30)} y={29} w={5} h={2} c={P.white} />
        </g>
        <R x={6} y={40} w={5} h={10} c={P.city} />
        <R x={12} y={36} w={6} h={14} c={P.city} />
        <R x={19} y={42} w={4} h={8} c={P.city} />
        <R x={24} y={34} w={7} h={16} c={P.city} />
        <R x={32} y={39} w={4} h={11} c={P.city} />
        {[13, 15, 25, 27, 29].map((x, i) => (
          <R
            key={`win${i}`}
            x={x}
            y={38 + (i % 2) * 4}
            w={1}
            h={1}
            c={P.skyLight}
          />
        ))}
        <R x={20} y={20} w={2} h={30} c={P.gray} />
        <R x={6} y={34} w={30} h={2} c={P.gray} />
        <R x={4} y={51} w={34} h={2} c={P.deskDark} />
        {/* poster con il logo EOS pixelato */}
        <R x={44} y={21} w={28} h={20} c={P.orange} />
        <R x={45} y={22} w={26} h={18} c={P.white} />
        <image
          href={staticFile("eos-logo-pixel.png")}
          x={46.5}
          y={24}
          width={23}
          height={14}
          style={{ imageRendering: "pixelated" }}
        />
        {/* orologio */}
        <Clock cx={90} cy={28} minutes={clockMinutes} />
        {/* pianta */}
        {plant ? (
          <g>
            <R x={93} y={50} w={3} h={10} c={P.leafDark} />
            <R x={89} y={48} w={6} h={4} c={P.leaf} />
            <R x={95} y={45} w={6} h={4} c={P.leaf} />
            <R x={91} y={42} w={6} h={4} c={P.leafDark} />
            <R x={96} y={52} w={5} h={3} c={P.leaf} />
            <R x={90} y={60} w={11} h={2} c={P.orangeDark} />
            <R x={91} y={62} w={9} h={10} c={P.orange} />
            <R x={92} y={63} w={2} h={7} c={P.orangeLight} />
          </g>
        ) : null}
        {/* pavimento */}
        {planks}
        <R x={0} y={75} w={108} h={1} c={P.deskDark} />
      </svg>
      {dim > 0 ? (
        <AbsoluteFill style={{ background: P.ink, opacity: dim }} />
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scrivania e oggetti                                                 */
/* ------------------------------------------------------------------ */

export const Desk: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
}> = ({ x, y, w }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 1080 - y,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        top: 0,
        height: 30,
        background: P.desk,
        borderTop: `10px solid ${P.ink}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 40,
        bottom: 0,
        background: P.deskDark,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        top: 60,
        height: 10,
        background: P.floorLine,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        width: 10,
        top: 0,
        bottom: 0,
        background: P.ink,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 0,
        width: 10,
        top: 0,
        bottom: 0,
        background: P.ink,
      }}
    />
  </div>
);

const MUG: SpriteDef = {
  colors: { K: P.ink, O: P.orange, o: P.orangeDark, W: P.white, B: "#C8C8C8" },
  rows: [
    ".W.W...",
    "..W.W..",
    "KKKKK..",
    "KOOOKK.",
    "KOWOK.K",
    "KOOOKK.",
    "KoooK..",
    ".KKK...",
  ],
};
export const Mug: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <Sprite sprite={MUG} px={8} x={x} y={y} />
);

const KEYBOARD: SpriteDef = {
  colors: { K: P.ink, G: P.grayLight, g: P.grayMid },
  rows: [
    "KKKKKKKKKKKKKK",
    "KGgGgGgGgGgGGK",
    "KgGgGgGgGgGggK",
    "KKKKKKKKKKKKKK",
  ],
};
export const Keyboard: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <Sprite sprite={KEYBOARD} px={8} x={x} y={y} />
);

/* ------------------------------------------------------------------ */
/* Barra didascalie con logo EOS                                       */
/* ------------------------------------------------------------------ */

export const CaptionBar: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 46,
      right: 46,
      top: 40,
      height: 108,
      background: P.gray,
      display: "flex",
      alignItems: "center",
      ...pixelBorder(6),
    }}
  >
    <div
      style={{
        width: 20,
        flexShrink: 0,
        alignSelf: "stretch",
        background: P.orange,
      }}
    />
    <div
      style={{
        flex: 1,
        paddingLeft: 26,
        fontFamily: FONT_TEXT,
        fontWeight: 700,
        fontSize: 64,
        color: P.white,
        lineHeight: 1.05,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
    <div
      style={{
        width: 128,
        height: 80,
        marginRight: 14,
        flexShrink: 0,
        background: P.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile("eos-logo-pixel.png")}
        style={{ width: 115, height: 70, imageRendering: "pixelated" }}
      />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Finestra in stile pixel                                             */
/* ------------------------------------------------------------------ */

export const PixelWindow: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly title: React.ReactNode;
  readonly headerColor?: string;
  readonly bg?: string;
  readonly scale?: number;
  readonly children: React.ReactNode;
}> = ({
  x,
  y,
  w,
  h,
  title,
  headerColor = P.orange,
  bg = P.paper,
  scale = 1,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: bg,
      scale: String(scale),
      ...pixelBorder(6),
    }}
  >
    <div
      style={{
        height: 58,
        background: headerColor,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 18px",
        borderBottom: `6px solid ${P.ink}`,
        fontFamily: FONT_TITLE,
        fontSize: 20,
        color: P.white,
      }}
    >
      {title}
      <div style={{ flex: 1 }} />
      {[P.white, P.white, P.white].map((c, i) => (
        <div
          key={i}
          style={{ width: 14, height: 14, background: c, opacity: 0.85 }}
        />
      ))}
    </div>
    <div style={{ position: "relative", height: h - 64 }}>{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Nuvoletta di pensiero                                               */
/* ------------------------------------------------------------------ */

export const ThoughtBubble: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly start: number;
  readonly children: React.ReactNode;
  readonly size?: number;
}> = ({ x, y, start, children, size = 84 }) => {
  const frame = useCurrentFrame();
  const s = popScale(frame, start);
  if (s === 0) return null;
  const bob = Math.floor(stepFrame(frame - start, 8) / 8) % 2 === 0 ? 0 : -6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        width: size,
        height: size,
        background: P.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_TITLE,
        fontSize: size * 0.48,
        color: P.orange,
        scale: String(s),
        ...pixelBorder(6),
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Flusso: Dipendente → Assistente AI → Analisi → Timesheet → Revisione */
/* ------------------------------------------------------------------ */

const STEPS: { label: string; icon: SpriteDef; px: number }[] = [
  { label: "Dipendente", icon: employeeHead, px: 3 },
  { label: "Assistente AI", icon: robotHead, px: 3 },
  { label: "Analisi attività", icon: iconSearch, px: 4 },
  { label: "Timesheet suggerito", icon: iconTable, px: 4 },
  { label: "Revisione", icon: iconCheck, px: 5 },
];

export const FlowBar: React.FC<{
  readonly active: number;
  readonly offsetY?: number;
}> = ({ active, offsetY = 0 }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const chipW = 168;
  const gap = 34;
  const total = STEPS.length * chipW + (STEPS.length - 1) * gap;
  const left = (width - total) / 2;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 930 + offsetY,
        width,
        height: 120,
      }}
    >
      {STEPS.map((s, i) => {
        const isActive = i === active;
        const done = i < active;
        const lift = isActive ? (Math.floor(frame / 10) % 2 === 0 ? -6 : 0) : 0;
        const iconW = 16 * s.px;
        return (
          <React.Fragment key={s.label}>
            <div
              style={{
                position: "absolute",
                left: left + i * (chipW + gap),
                top: 8 + lift,
                width: chipW,
                height: 104,
                background: isActive ? P.orange : done ? P.gray : P.grayDark,
                opacity: isActive || done ? 1 : 0.75,
                ...pixelBorder(5, P.ink, isActive),
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: (chipW - iconW) / 2 + (s.px === 3 ? 0 : 12),
                  top: 8,
                }}
              >
                <Sprite sprite={s.icon} px={s.px} x={0} y={0} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 4,
                  right: 4,
                  top: 54,
                  textAlign: "center",
                  fontFamily: FONT_TEXT,
                  fontWeight: 700,
                  fontSize: 27,
                  lineHeight: 0.95,
                  color: isActive || done ? P.white : P.grayLight,
                }}
              >
                {s.label}
              </div>
              {done ? (
                <div style={{ position: "absolute", right: -10, top: -12 }}>
                  <Sprite sprite={iconCheck} px={3} x={0} y={0} />
                </div>
              ) : null}
            </div>
            {i < STEPS.length - 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: left + i * (chipW + gap) + chipW + 6,
                  top: 50,
                  fontFamily: FONT_TITLE,
                  fontSize: 20,
                  color: done || isActive ? P.orange : P.grayMid,
                }}
              >
                ▶
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Transizione a mosaico di pixel                                      */
/* ------------------------------------------------------------------ */

export const PixelWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const n = 12;
  const size = width / n;
  const p = frame / Math.max(1, durationInFrames - 1);
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const r = random(`wipe-${x}-${y}`);
      const on = p < 0.5 ? r < p * 2.2 : r >= (p - 0.5) * 2.2;
      if (!on) continue;
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x * size,
            top: y * size,
            width: size,
            height: size,
            background: (x + y) % 2 === 0 ? P.orange : P.gray,
          }}
        />,
      );
    }
  }
  return <AbsoluteFill>{cells}</AbsoluteFill>;
};

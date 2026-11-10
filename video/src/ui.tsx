import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, clamp } from "./theme";

export const STAGE_TOP = 330;
export const STAGE_H = 1210;

// Inizio (frame globale) di ogni scena: serve per evidenziare lo step del flusso
export const STEP_STARTS = [0, 180, 330, 540, 720];
export const FINAL_START = 800;

const STEPS = ["Dipendente", "Assistente AI", "Analisi attività", "Timesheet suggerito", "Revisione"];

const StepIcon: React.FC<{ i: number; color: string }> = ({ i, color }) => {
  const p = { fill: "none", stroke: color, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" width={44} height={44}>
      {i === 0 && (
        <>
          <circle cx={24} cy={16} r={9} {...p} />
          <path d="M8 42 Q24 22 40 42" {...p} />
        </>
      )}
      {i === 1 && (
        <>
          <rect x={8} y={12} width={32} height={26} rx={10} {...p} />
          <circle cx={18} cy={25} r={2.5} fill={color} />
          <circle cx={30} cy={25} r={2.5} fill={color} />
          <line x1={24} y1={12} x2={24} y2={5} {...p} />
        </>
      )}
      {i === 2 && (
        <>
          <circle cx={20} cy={20} r={12} {...p} />
          <line x1={29} y1={29} x2={41} y2={41} {...p} />
        </>
      )}
      {i === 3 && (
        <>
          <rect x={8} y={8} width={32} height={32} rx={4} {...p} />
          <line x1={8} y1={19} x2={40} y2={19} {...p} />
          <line x1={8} y1={30} x2={40} y2={30} {...p} />
          <line x1={20} y1={8} x2={20} y2={40} {...p} />
        </>
      )}
      {i === 4 && <path d="M10 25 L20 35 L39 13" {...p} strokeWidth={6} />}
    </svg>
  );
};

// Intestazione fissa: logo EOS + flusso Dipendente → AI → Analisi → Timesheet → Revisione
export const Header: React.FC = () => {
  const frame = useCurrentFrame();
  let active = 0;
  STEP_STARTS.forEach((s, i) => {
    if (frame >= s + 5) active = i;
  });
  return (
    <AbsoluteFill
      style={{
        height: STAGE_TOP,
        opacity: interpolate(frame, [0, 12, FINAL_START - 5, FINAL_START + 8], [0, 1, 1, 0], clamp),
        background: C.white,
        borderBottom: `6px solid ${C.ink}`,
        fontFamily: FONT,
      }}
    >
      <div style={{ position: "absolute", top: 22, left: 80, right: 80, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Img src={staticFile("eos-logo.png")} style={{ height: 140, marginLeft: -24 }} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.gray }}>Agente Copilot</div>
          <div style={{ fontSize: 38, fontWeight: 800, color: C.blue }}>Supporto Generazione Timesheet</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 168, left: 60, right: 60, display: "flex", justifyContent: "space-between" }}>
        {STEPS.map((label, i) => {
          const on = i === active;
          const done = i < active;
          const color = on ? C.white : done ? C.blue : "#9AA5B1";
          return (
            <React.Fragment key={label}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 150 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    background: on ? C.blue : C.white,
                    border: `5px solid ${on || done ? C.blue : "#C5CDD6"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    scale: on ? "1.15" : "1",
                  }}
                >
                  <StepIcon i={i} color={color} />
                </div>
                <div style={{ marginTop: 10, fontSize: 22, fontWeight: on ? 800 : 600, color: on ? C.blue : C.gray, textAlign: "center", lineHeight: 1.05 }}>
                  {label}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ marginTop: 26, fontSize: 32, fontWeight: 800, color: i < active ? C.orange : "#C5CDD6" }}>→</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Didascalia grande in basso
export const Caption: React.FC<{ text: React.ReactNode; delay?: number }> = ({ text, delay = 8 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: STAGE_TOP + STAGE_H + 30,
        minHeight: 260,
        borderRadius: 36,
        background: C.blue,
        border: `6px solid ${C.ink}`,
        boxShadow: `10px 10px 0 ${C.ink}`,
        color: C.white,
        fontFamily: FONT,
        fontSize: 54,
        fontWeight: 800,
        lineHeight: 1.18,
        padding: "34px 44px",
        display: "flex",
        alignItems: "center",
        opacity: interpolate(frame, [delay, delay + 10], [0, 1], clamp),
        translate: interpolate(frame, [delay, delay + 14], ["0px 60px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {text}
    </div>
  );
};

// Nuvoletta in stile fumetto
export const Bubble: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  tail?: "left" | "right" | "bottom-left" | "bottom-right";
  appear: number;
}> = ({ children, style, tail = "bottom-left", appear }) => {
  const frame = useCurrentFrame();
  const tailPos: React.CSSProperties =
    tail === "bottom-left"
      ? { bottom: -26, left: 70 }
      : tail === "bottom-right"
        ? { bottom: -26, right: 70 }
        : tail === "left"
          ? { left: -26, top: 50 }
          : { right: -26, top: 50 };
  return (
    <div
      style={{
        position: "absolute",
        background: C.white,
        border: `6px solid ${C.ink}`,
        borderRadius: 40,
        padding: "26px 34px",
        fontFamily: FONT,
        fontSize: 46,
        fontWeight: 800,
        color: C.ink,
        lineHeight: 1.15,
        // comparsa a scatti, tipo ritaglio di carta
        scale: interpolate(Math.floor(frame / 2) * 2, [appear, appear + 4, appear + 8], [0, 1.12, 1], clamp),
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 44,
          height: 44,
          background: C.white,
          borderRight: `6px solid ${C.ink}`,
          borderBottom: `6px solid ${C.ink}`,
          rotate: tail === "left" ? "135deg" : tail === "right" ? "-45deg" : "45deg",
          ...tailPos,
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

export const Stage: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => (
  <div style={{ position: "absolute", top: STAGE_TOP, left: 0, width: 1080, height: STAGE_H, overflow: "hidden", background: bg }}>
    {children}
  </div>
);

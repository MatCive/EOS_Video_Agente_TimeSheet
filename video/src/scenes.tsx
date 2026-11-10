import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Assistant, Desk, Employee, Office } from "./characters";
import { C, FONT, clamp, stepped } from "./theme";
import { Bubble, Caption, Stage } from "./ui";

const pop = (f: number, at: number) =>
  interpolate(stepped(f, 2), [at, at + 6, at + 10], [0, 1.15, 1], clamp);

const Check: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = C.green }) => (
  <svg viewBox="0 0 40 40" width={size} height={size}>
    <circle cx={20} cy={20} r={18} fill={color} stroke={C.ink} strokeWidth={3} />
    <path d="M11 21 L18 28 L30 13" fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Scena 1: il problema ---------- */
export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  const days = ["Lun", "Mar", "Mer", "Gio", "Ven"];
  return (
    <AbsoluteFill>
      <Stage>
        <Office clock={[17, 58]} />
        <div style={{ position: "absolute", left: 400, top: 580 }}>
          <Desk>
            <text x={320} y={58} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800} fill={C.blue}>
              Timesheet settimanale
            </text>
            {days.map((d, i) => (
              <g key={d}>
                <rect x={184 + i * 56} y={72} width={50} height={132} rx={6} fill={C.blueLight} stroke={C.ink} strokeWidth={3} />
                <text x={209 + i * 56} y={94} textAnchor="middle" fontFamily={FONT} fontSize={16} fontWeight={700} fill={C.gray}>
                  {d}
                </text>
                <text
                  x={209 + i * 56}
                  y={160}
                  textAnchor="middle"
                  fontFamily={FONT}
                  fontSize={40}
                  fontWeight={900}
                  fill="#D13438"
                  opacity={interpolate(frame, [30 + i * 8, 34 + i * 8], [0, 1], clamp)}
                >
                  ?
                </text>
              </g>
            ))}
          </Desk>
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 500,
            translate: `0px ${Math.sin(f / 6) * 8}px`,
            rotate: `${Math.sin(f / 9) * 2}deg`,
          }}
        >
          <Employee mood="worried" frame={frame} size={580} />
        </div>
        {/* punti interrogativi che fluttuano */}
        {[
          { x: 70, y: 420, at: 40 },
          { x: 360, y: 440, at: 52 },
          { x: 200, y: 360, at: 64 },
        ].map((q, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: q.x,
              top: q.y - (f - q.at) * 0.6,
              fontFamily: FONT,
              fontSize: 110,
              fontWeight: 900,
              color: C.orange,
              WebkitTextStroke: `4px ${C.ink}`,
              scale: pop(frame, q.at),
              rotate: `${(i - 1) * 14}deg`,
            }}
          >
            ?
          </div>
        ))}
        <Bubble appear={14} tail="bottom-left" style={{ left: 330, top: 300, width: 660 }}>
          Venerdì sera… cosa ho fatto questa settimana?!
        </Bubble>
      </Stage>
      <Caption text={<span>Il timesheet è vuoto… <span style={{ color: "#FFD08A" }}>e la memoria pure.</span></span>} delay={30} />
    </AbsoluteFill>
  );
};

/* ---------- Scena 2: arriva l'assistente ---------- */
export const SceneAssistant: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  return (
    <AbsoluteFill>
      <Stage>
        <Office clock={[17, 59]} />
        <div style={{ position: "absolute", left: 20, top: 520, translate: `0px ${Math.sin(f / 6) * 6}px` }}>
          <Employee mood="neutral" frame={frame} size={560} />
        </div>
        {/* bagliore */}
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 380,
            width: 520,
            height: 520,
            borderRadius: 260,
            background: "radial-gradient(circle, rgba(0,120,212,0.35) 0%, rgba(0,120,212,0) 70%)",
            scale: interpolate(frame, [6, 20], [0, 1.1], clamp),
          }}
        />
        {/* scintille */}
        {[
          { x: 560, y: 420, c: C.orange },
          { x: 960, y: 470, c: C.blue },
          { x: 600, y: 820, c: C.blue },
          { x: 990, y: 780, c: C.orange },
        ].map((s, i) => (
          <svg
            key={i}
            viewBox="0 0 40 40"
            width={70}
            height={70}
            style={{ position: "absolute", left: s.x, top: s.y, scale: pop(frame, 16 + i * 4), rotate: `${f * 3}deg` }}
          >
            <path d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z" fill={s.c} stroke={C.ink} strokeWidth={2.5} />
          </svg>
        ))}
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 440,
            scale: pop(frame, 8),
            translate: `0px ${Math.sin(f / 5) * 12}px`,
          }}
        >
          <Assistant frame={frame} size={470} talking={frame > 30 && frame < 110} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 470,
            right: 40,
            top: 945,
            textAlign: "center",
            background: C.blue,
            color: C.white,
            fontFamily: FONT,
            fontSize: 38,
            fontWeight: 800,
            padding: "16px 20px",
            borderRadius: 50,
            border: `5px solid ${C.ink}`,
            scale: pop(frame, 24),
          }}
        >
          Supporto Generazione Timesheet
        </div>
        <Bubble appear={34} tail="bottom-right" style={{ left: 300, top: 150, width: 690 }}>
          Ciao! La tua settimana la ricostruisco io.
        </Bubble>
      </Stage>
      <Caption text="Ecco l'assistente AI che ricostruisce la tua settimana lavorativa." delay={20} />
    </AbsoluteFill>
  );
};

/* ---------- Scena 3: analisi delle attività ---------- */
const SOURCES = [
  { label: "Calendario", color: C.blue, x: 50, y: 40, glyph: "31" },
  { label: "Email", color: "#0F6CBD", x: 770, y: 40, glyph: "@" },
  { label: "Teams", color: "#5B5FC7", x: 40, y: 400, glyph: "T" },
  { label: "OneDrive", color: "#038387", x: 780, y: 400, glyph: "☁" },
];

const ACTIVITIES = [
  ["Lun", "Riunione di coordinamento"],
  ["Mar", "Analisi funzionale del processo"],
  ["Mer", "Configurazione e test notifiche"],
  ["Gio", "Supporto su ticket cliente"],
  ["Ven", "Documentazione e checkpoint"],
];

export const SceneAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepped(frame, 2);
  return (
    <AbsoluteFill>
      <Stage bg={`linear-gradient(180deg, ${C.blueDark} 0%, ${C.blueDeep} 100%)`}>
        {/* griglia tecnologica */}
        <svg width={1080} height={1210} style={{ position: "absolute", opacity: 0.15 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={1210} stroke={C.white} strokeWidth={2} />
          ))}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 100} x2={1080} y2={i * 100} stroke={C.white} strokeWidth={2} />
          ))}
        </svg>
        {/* anelli di scansione */}
        {[0, 20, 40].map((d) => (
          <div
            key={d}
            style={{
              position: "absolute",
              left: 540 - 220,
              top: 420 - 220,
              width: 440,
              height: 440,
              borderRadius: 220,
              border: `6px solid #7FE3FF`,
              scale: interpolate((frame + d) % 60, [0, 60], [0.5, 1.4]),
              opacity: interpolate((frame + d) % 60, [0, 60], [0.7, 0]),
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 540 - 165, top: 240, translate: `0px ${Math.sin(f / 5) * 8}px` }}>
          <Assistant frame={frame} size={360} talking />
        </div>
        {SOURCES.map((s, i) => {
          const start = 6 + i * 8;
          const fly = 42 + i * 10;
          const p = interpolate(f, [fly, fly + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
          const tx = (540 - 130 - s.x) * p;
          const ty = (420 - 55 - s.y) * p;
          return (
            <div
              key={s.label}
              style={{
                position: "absolute",
                left: s.x,
                top: s.y,
                width: 260,
                height: 110,
                borderRadius: 24,
                background: C.white,
                border: `5px solid ${C.ink}`,
                boxShadow: `8px 8px 0 ${C.ink}`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "0 18px",
                fontFamily: FONT,
                fontSize: 34,
                fontWeight: 800,
                color: C.ink,
                translate: `${tx}px ${ty}px`,
                scale: pop(frame, start) * (1 - p * 0.8),
                opacity: 1 - interpolate(p, [0.7, 1], [0, 1], clamp),
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 14,
                  background: s.color,
                  color: C.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                {s.glyph}
              </div>
              {s.label}
            </div>
          );
        })}
        {/* pannello analisi */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 650,
            borderRadius: 32,
            background: C.white,
            border: `6px solid ${C.ink}`,
            boxShadow: `10px 10px 0 ${C.ink}`,
            padding: "26px 34px",
            fontFamily: FONT,
            opacity: interpolate(frame, [86, 96], [0, 1], clamp),
            translate: interpolate(frame, [86, 100], ["0px 80px", "0px 0px"], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 900, color: C.blue, marginBottom: 12 }}>Analisi attività</div>
          {ACTIVITIES.map(([day, txt], i) => {
            const at = 100 + i * 12;
            const chars = Math.round(interpolate(frame, [at, at + 10], [0, txt.length], clamp));
            return (
              <div key={day} style={{ display: "flex", alignItems: "center", gap: 18, height: 66, opacity: frame >= at ? 1 : 0 }}>
                <div style={{ width: 88, textAlign: "center", background: C.blueLight, color: C.blueDark, borderRadius: 14, fontSize: 30, fontWeight: 800, padding: "6px 0" }}>
                  {day}
                </div>
                <div style={{ flex: 1, fontSize: 34, fontWeight: 600, color: C.ink }}>{txt.slice(0, chars)}</div>
                <div style={{ scale: pop(frame, at + 10) }}>
                  <Check />
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 8,
              fontSize: 30,
              fontWeight: 700,
              color: "#8A8886",
              opacity: interpolate(frame, [168, 174], [0, 1], clamp),
            }}
          >
            <span style={{ textDecoration: "line-through" }}>Pausa pranzo, ferie, permessi</span> → esclusi
          </div>
        </div>
      </Stage>
      <Caption text="Analizza calendario, email, Teams e file recenti, senza doppi conteggi." delay={14} />
    </AbsoluteFill>
  );
};

/* ---------- Scena 4: timesheet suggerito ---------- */
const ROWS = [
  { p: "Progetto Alfa", todo: "TDE012345", ticket: "", h: "0,50" },
  { p: "Progetto Beta", todo: "", ticket: "CAS-01234", h: "1,25" },
  { p: "Progetto Beta", todo: "TDE012346", ticket: "", h: "2,00" },
  { p: "Progetto Gamma", todo: "TDAG12345", ticket: "CAS-05678", h: "2,75" },
  { p: "Interno EOS", todo: "", ticket: "", h: "1,50" },
];
const COLS = [290, 220, 220, 150];

const Chip: React.FC<{ text: string; color: string }> = ({ text, color }) =>
  text ? (
    <span style={{ background: color, color: C.white, borderRadius: 12, padding: "6px 10px", fontSize: 25, fontWeight: 800 }}>{text}</span>
  ) : (
    <span style={{ color: "#C8C6C4" }}>—</span>
  );

export const SceneTimesheet: React.FC = () => {
  const frame = useCurrentFrame();
  // il totale somma solo le righe già comparse
  const total = ROWS.reduce((sum, r, i) => (frame >= 18 + i * 14 + 6 ? sum + parseFloat(r.h.replace(",", ".")) : sum), 0);
  return (
    <AbsoluteFill>
      <Stage bg={C.sky}>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 50,
            borderRadius: 32,
            background: C.white,
            border: `6px solid ${C.ink}`,
            boxShadow: `10px 10px 0 ${C.ink}`,
            overflow: "hidden",
            fontFamily: FONT,
            scale: interpolate(frame, [0, 12], [0.9, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          <div style={{ background: C.blue, color: C.white, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 900 }}>Timesheet suggerito</div>
            <div style={{ fontSize: 26, fontWeight: 700, background: C.orange, borderRadius: 30, padding: "8px 18px", border: `3px solid ${C.ink}` }}>
              Da verificare
            </div>
          </div>
          <div style={{ display: "flex", padding: "18px 24px", background: C.blueLight, fontSize: 28, fontWeight: 800, color: C.blueDark }}>
            {["Progetto", "Todo", "Ticket", "Tempo"].map((h, i) => (
              <div key={h} style={{ width: COLS[i], textAlign: i === 3 ? "right" : "left" }}>
                {h}
              </div>
            ))}
          </div>
          {ROWS.map((r, i) => {
            const at = 18 + i * 14;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 24px",
                  height: 86,
                  borderTop: "2px solid #E1DFDD",
                  fontSize: 30,
                  fontWeight: 700,
                  color: C.ink,
                  opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
                  translate: interpolate(frame, [at, at + 10], ["-60px 0px", "0px 0px"], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
                }}
              >
                <div style={{ width: COLS[0] }}>{r.p}</div>
                <div style={{ width: COLS[1] }}>
                  <Chip text={r.todo} color={C.blue} />
                </div>
                <div style={{ width: COLS[2] }}>
                  <Chip text={r.ticket} color={C.orange} />
                </div>
                <div style={{ width: COLS[3], textAlign: "right", fontSize: 34, fontWeight: 900 }}>{r.h}</div>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 24px", background: C.gray, color: C.white }}>
            <div style={{ fontSize: 36, fontWeight: 900 }}>Totale giornata</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#FFD08A" }}>{total.toFixed(2).replace(".", ",")}</div>
          </div>
        </div>
        {/* vantaggi */}
        <div style={{ position: "absolute", left: 50, top: 920, display: "flex", flexDirection: "column", gap: 20, fontFamily: FONT }}>
          {["Quarti d'ora in centesimi", "Codici TDE e CAS- rilevati", "Note per la revisione"].map((t, i) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 38,
                fontWeight: 800,
                color: C.ink,
                scale: pop(frame, 105 + i * 10),
                transformOrigin: "left center",
              }}
            >
              <Check size={50} color={C.blue} />
              {t}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 30, top: 890, rotate: `${Math.sin(stepped(frame) / 6) * 4}deg` }}>
          <Assistant frame={frame} size={290} />
        </div>
      </Stage>
      <Caption text="Propone il timesheet: progetto, Todo, Ticket e ore già in centesimi." delay={10} />
    </AbsoluteFill>
  );
};

/* ---------- Scena 5: revisione del dipendente ---------- */
export const SceneReview: React.FC = () => {
  const frame = useCurrentFrame();
  const pressed = frame >= 56;
  const cursorP = interpolate(frame, [36, 54], [0, 1], { ...clamp, easing: Easing.bezier(0.33, 1, 0.68, 1) });
  return (
    <AbsoluteFill>
      <Stage>
        <Office clock={[18, 4]} />
        <div
          style={{
            position: "absolute",
            left: 450,
            top: 60,
            width: 590,
            borderRadius: 32,
            background: C.white,
            border: `6px solid ${C.ink}`,
            boxShadow: `10px 10px 0 ${C.ink}`,
            padding: "26px 30px",
            fontFamily: FONT,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 900, color: C.blue, marginBottom: 10 }}>La tua revisione</div>
          {ROWS.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 70, borderTop: "2px solid #E1DFDD", fontSize: 32, fontWeight: 700 }}>
              <span>{r.p}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <b>{r.h}</b>
                <span style={{ scale: pop(frame, 6 + i * 6) }}>
                  <Check size={42} />
                </span>
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: 18,
              textAlign: "center",
              borderRadius: 20,
              padding: "20px 0",
              fontSize: 40,
              fontWeight: 900,
              color: C.white,
              background: pressed ? C.green : C.blue,
              border: `5px solid ${C.ink}`,
              scale: frame >= 54 && frame < 60 ? "0.94" : "1",
            }}
          >
            {pressed ? "Confermato ✔" : "Conferma"}
          </div>
        </div>
        {/* cursore */}
        <svg
          viewBox="0 0 30 40"
          width={70}
          height={92}
          style={{ position: "absolute", left: interpolate(cursorP, [0, 1], [300, 790]), top: interpolate(cursorP, [0, 1], [1000, 590]) }}
        >
          <path d="M2 2 L2 32 L10 25 L16 38 L22 35 L16 23 L27 23 Z" fill={C.white} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
        </svg>
        <div style={{ position: "absolute", left: 20, top: 560, translate: `0px ${Math.abs(Math.sin(stepped(frame) / 5)) * -14}px` }}>
          <Employee mood="happy" frame={frame} armUp={pressed} size={560} />
        </div>
        <Bubble appear={10} tail="bottom-left" style={{ left: 40, top: 330, width: 380, fontSize: 42 }}>
          Controllo e confermo!
        </Bubble>
      </Stage>
      <Caption text="Il dipendente rivede, corregge e conferma. La decisione resta sua." delay={6} />
    </AbsoluteFill>
  );
};

/* ---------- Scena 6: chiusura ---------- */
export const SceneFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepped(frame);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.blue} 0%, ${C.blueDark} 60%, ${C.blueDeep} 100%)`, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 290,
          top: 170,
          width: 500,
          height: 500,
          borderRadius: 60,
          background: C.white,
          border: `6px solid ${C.ink}`,
          boxShadow: `12px 12px 0 ${C.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: pop(frame, 4),
        }}
      >
        <Img src={staticFile("eos-logo.png")} style={{ width: 440 }} />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 760, textAlign: "center", lineHeight: 1.05 }}>
        <div
          style={{
            fontSize: 130,
            fontWeight: 900,
            color: C.white,
            WebkitTextStroke: `3px ${C.ink}`,
            opacity: interpolate(frame, [12, 20], [0, 1], clamp),
            translate: interpolate(frame, [12, 26], ["0px 60px", "0px 0px"], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          Tu controlli.
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 122,
            fontWeight: 900,
            color: C.orange,
            WebkitTextStroke: `3px ${C.ink}`,
            opacity: interpolate(frame, [28, 36], [0, 1], clamp),
            translate: interpolate(frame, [28, 42], ["0px 60px", "0px 0px"], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          L'agente
          <br />
          ricostruisce.
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 1400, scale: pop(frame, 40), translate: `0px ${Math.sin(f / 5) * 8}px` }}>
        <Employee mood="happy" frame={frame} armUp size={420} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 1430, scale: pop(frame, 46), translate: `0px ${Math.sin(f / 5 + 1) * 10}px` }}>
        <Assistant frame={frame} size={380} />
      </div>
    </AbsoluteFill>
  );
};

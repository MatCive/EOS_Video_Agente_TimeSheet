import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FONT_TEXT, FONT_TITLE, P, clamp, stepFrame } from "./palette";
import { Sprite } from "./Sprite";
import {
  agentBadge,
  employee,
  employeeHead,
  iconCalendar,
  iconChat,
  iconCheck,
  iconFile,
  iconMail,
  robot,
  robotHead,
  sparkle,
  sweat,
  type Mood,
} from "./sprites";
import {
  CaptionBar,
  Desk,
  Keyboard,
  Mug,
  Office,
  PixelWindow,
  ThoughtBubble,
  Typewriter,
  pixelBorder,
  popScale,
} from "./ui";

/* ------------------------------------------------------------------ */
/* Personaggi animati                                                  */
/* ------------------------------------------------------------------ */

const Employee: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly px: number;
  readonly mood: Mood;
  readonly typing?: boolean;
}> = ({ x, y, px, mood, typing = false }) => {
  const frame = useCurrentFrame();
  const blink = frame % 70 < 3;
  const bob = typing
    ? (Math.floor(frame / 4) % 2) * px
    : Math.floor(frame / 16) % 2 === 0
      ? 0
      : px / 2;
  return <Sprite sprite={employee(mood, blink)} px={px} x={x} y={y + bob} />;
};

const Robot: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly px: number;
  readonly talking?: boolean;
}> = ({ x, y, px, talking = false }) => {
  const frame = useCurrentFrame();
  const bob = Math.round(Math.sin(stepFrame(frame, 3) / 9) * 1.5) * px;
  const sprite = robot({
    blink: frame % 60 < 3,
    talk: talking && Math.floor(frame / 4) % 2 === 0,
    flame: Math.floor(frame / 3) % 2 === 0,
  });
  return <Sprite sprite={sprite} px={px} x={x} y={y + bob} />;
};

const Sparkles: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly start: number;
  readonly r?: number;
}> = ({ cx, cy, start, r = 170 }) => {
  const frame = useCurrentFrame();
  const d = frame - start;
  if (d < 0 || d > 30) return null;
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2 + 0.4;
        const dist = r * (0.5 + Math.floor(d / 4) * 0.08);
        const visible = Math.floor(d / 3 + i) % 3 !== 0;
        return visible ? (
          <Sprite
            key={i}
            sprite={sparkle}
            px={8}
            x={cx + Math.cos(a) * dist - 20}
            y={cy + Math.sin(a) * dist - 20}
          />
        ) : null;
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 1. Il problema                                                      */
/* ------------------------------------------------------------------ */

const DAYS = ["LUN", "MAR", "MER", "GIO", "VEN"];

export const ScenePixelProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepFrame(frame);
  const blinkQ = Math.floor(frame / 10) % 2 === 0;
  return (
    <AbsoluteFill>
      <Office clockMinutes={17 * 60 + 40 + f * 4} />

      {/* Timesheet vuoto */}
      <PixelWindow
        x={592}
        y={214}
        w={420}
        h={500}
        scale={popScale(frame, 8)}
        title={<span>TIMESHEET</span>}
      >
        <div
          style={{
            padding: "18px 24px",
            fontFamily: FONT_TEXT,
            fontSize: 40,
            color: P.gray,
          }}
        >
          Settimana 46
        </div>
        {DAYS.map((d, i) => (
          <div
            key={d}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 24px 14px",
              height: 54,
              background: P.white,
              border: `4px solid ${P.ink}`,
            }}
          >
            <div
              style={{
                width: 96,
                alignSelf: "stretch",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: P.gray,
                color: P.white,
                fontFamily: FONT_TITLE,
                fontSize: 18,
              }}
            >
              {d}
            </div>
            <div
              style={{ flex: 1, padding: "0 14px", display: "flex", gap: 8 }}
            >
              {[0, 1, 2].map((k) => (
                <div
                  key={k}
                  style={{ width: 44, height: 10, background: P.grayLight }}
                />
              ))}
            </div>
            <div
              style={{
                width: 62,
                fontFamily: FONT_TITLE,
                fontSize: 26,
                color: P.red,
                textAlign: "center",
                opacity: frame > 24 + i * 6 && (blinkQ || i % 2 === 0) ? 1 : 0,
              }}
            >
              ?
            </div>
          </div>
        ))}
      </PixelWindow>

      {/* Dipendente alla scrivania */}
      <Employee
        x={160}
        y={500}
        px={14}
        mood={frame < 30 ? "neutral" : "confused"}
      />
      <Desk x={50} y={770} w={500} />
      <Keyboard x={230} y={738} />
      <Mug x={440} y={714} />

      {/* Dubbi */}
      <ThoughtBubble x={92} y={380} start={40}>
        ?
      </ThoughtBubble>
      <ThoughtBubble x={400} y={330} start={58} size={96}>
        ?
      </ThoughtBubble>
      <ThoughtBubble x={250} y={290} start={76} size={72}>
        ?
      </ThoughtBubble>
      {frame > 90 ? (
        <Sprite
          sprite={sweat}
          px={8}
          x={378}
          y={530 + (Math.floor(frame / 6) % 3) * 8}
        />
      ) : null}

      <CaptionBar>
        {frame < 84 ? (
          <Typewriter text="Venerdì, ore 17:55…" start={4} speed={0.8} />
        ) : (
          <Typewriter
            text="Cosa ho fatto questa settimana?"
            start={86}
            speed={1.2}
          />
        )}
      </CaptionBar>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Arriva l'assistente AI                                           */
/* ------------------------------------------------------------------ */

const ChatBubbleUser: React.FC<{
  readonly start: number;
  readonly text: string;
}> = ({ start, text }) => {
  const frame = useCurrentFrame();
  if (frame < start - 2) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        margin: "22px 24px 0",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          background: P.chatBubble,
          color: P.white,
          fontFamily: FONT_TEXT,
          fontSize: 36,
          lineHeight: 1.05,
          padding: "14px 18px",
          ...pixelBorder(4, "#555", false),
        }}
      >
        <Typewriter text={text} start={start} speed={1.4} />
      </div>
    </div>
  );
};

const ChatBubbleAgent: React.FC<{
  readonly start: number;
  readonly text: string;
}> = ({ start, text }) => {
  const frame = useCurrentFrame();
  if (frame < start - 2) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        margin: "22px 24px 0",
        alignItems: "flex-start",
      }}
    >
      <Sprite
        sprite={agentBadge}
        px={3}
        x={0}
        y={0}
        style={{ position: "relative", flexShrink: 0 }}
      />
      <div
        style={{
          color: P.white,
          fontFamily: FONT_TEXT,
          fontSize: 36,
          lineHeight: 1.05,
          maxWidth: 600,
        }}
      >
        <Typewriter text={text} start={start} speed={1.4} cursor />
      </div>
    </div>
  );
};

export const ScenePixelAssistant: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepFrame(frame);
  const robotX = interpolate(f, [10, 30], [1120, 772], clamp);
  return (
    <AbsoluteFill>
      <Office clockMinutes={17 * 60 + 58} plant={false} />

      <PixelWindow
        x={110}
        y={190}
        w={860}
        h={350}
        bg={P.chat}
        headerColor={P.grayDark}
        scale={popScale(frame, 4)}
        title={
          <>
            <Sprite
              sprite={agentBadge}
              px={3}
              x={0}
              y={0}
              style={{ position: "relative" }}
            />
            <span style={{ fontFamily: FONT_TEXT, fontSize: 40 }}>
              Supporto generazione time sheet
            </span>
          </>
        }
      >
        <ChatBubbleUser
          start={34}
          text="Analizza la mia giornata e proponi le attività da rendicontare."
        />
        <ChatBubbleAgent
          start={92}
          text="Certo! Ricostruisco la giornata da calendario, email, Teams e file."
        />
      </PixelWindow>

      <Employee
        x={96}
        y={590}
        px={13}
        mood={frame < 40 ? "wow" : "happy"}
        typing={frame > 30 && frame < 80}
      />
      <Desk x={10} y={842} w={420} />
      <Keyboard x={150} y={810} />

      <Robot x={robotX} y={560} px={13} talking={frame > 92 && frame < 140} />
      <Sparkles cx={772 + 104} cy={700} start={30} />

      <CaptionBar>
        <Typewriter text="Ecco il tuo assistente AI!" start={4} speed={1.2} />
      </CaptionBar>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Analisi delle attività                                           */
/* ------------------------------------------------------------------ */

const SOURCES = [
  { label: "Riunioni", icon: iconCalendar, x: 165, color: P.orange },
  { label: "Email", icon: iconMail, x: 395, color: P.grayLight },
  { label: "Teams", icon: iconChat, x: 685, color: "#8B8DE0" },
  { label: "File", icon: iconFile, x: 915, color: "#5FA2F0" },
];

const DAY_START = 8.5;
const DAY_END = 18;
const BLOCKS = [
  { from: 9, to: 10.5, label: "Riunione", color: P.orange },
  { from: 10.5, to: 12.5, label: "Analisi", color: P.teal },
  { from: 12.5, to: 13.5, label: "Pausa", color: P.grayMid, excluded: true },
  { from: 13.5, to: 16.25, label: "Config. e test", color: "#2F7BD8" },
  { from: 16.25, to: 18, label: "Email e ticket", color: "#6264A7" },
];

export const ScenePixelAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepFrame(frame);
  const progress = interpolate(f, [30, 132], [0, 1], clamp);
  const segs = 20;
  const tlX = 100;
  const tlW = 880;
  const scale = tlW / (DAY_END - DAY_START);
  const robotCx = 540;
  const robotCy = 470;
  return (
    <AbsoluteFill style={{ background: "#132629" }}>
      {/* griglia digitale */}
      <svg
        width={1080}
        height={1080}
        viewBox="0 0 108 108"
        shapeRendering="crispEdges"
        style={{ position: "absolute" }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <rect
            key={`v${i}`}
            x={i * 8}
            y={0}
            width={0.4}
            height={108}
            fill={P.tealDark}
            opacity={0.35}
          />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <rect
            key={`h${i}`}
            x={0}
            y={((i * 8 + Math.floor(f / 4)) % 116) - 4}
            width={108}
            height={0.4}
            fill={P.tealDark}
            opacity={0.35}
          />
        ))}
      </svg>

      {/* Fonti */}
      {SOURCES.map((s, i) => (
        <div
          key={s.label}
          style={{
            position: "absolute",
            left: s.x - 70,
            top: 196,
            width: 140,
            height: 148,
            background: P.paper,
            scale: String(popScale(frame, 4 + i * 6)),
            ...pixelBorder(5),
          }}
        >
          <Sprite sprite={s.icon} px={7} x={35} y={10} />
          <div
            style={{
              position: "absolute",
              bottom: 8,
              width: "100%",
              textAlign: "center",
              fontFamily: FONT_TEXT,
              fontWeight: 700,
              fontSize: 38,
              color: P.gray,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}

      {/* Pacchetti di dati verso l'agente */}
      {SOURCES.map((s, i) =>
        [0, 1, 2].map((k) => {
          const t0 = 30 + i * 5 + k * 12;
          const cycle = 36;
          const local = f - t0;
          if (local < 0 || f > 140) return null;
          const t = (local % cycle) / cycle;
          const steps = Math.floor(t * 8) / 8;
          const px = s.x + (robotCx - s.x) * steps;
          const py = 352 + (robotCy - 352) * steps;
          return (
            <div
              key={`${s.label}-${k}`}
              style={{
                position: "absolute",
                left: Math.round(px / 8) * 8 - 10,
                top: Math.round(py / 8) * 8 - 10,
                width: 20,
                height: 20,
                background: s.color,
                boxShadow: `0 0 0 4px ${P.ink}`,
                opacity: steps > 0.85 ? 0 : 1,
              }}
            />
          );
        }),
      )}

      <Robot
        x={robotCx - 96}
        y={392}
        px={12}
        talking={frame > 30 && frame < 132}
      />

      {/* Barra di avanzamento */}
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 694,
          width: 680,
          height: 44,
          background: P.ink,
          padding: 6,
          display: "flex",
          gap: 4,
        }}
      >
        {Array.from({ length: segs }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background:
                i < Math.floor(progress * segs) ? P.tealLight : "#21393D",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 748,
          width: 680,
          textAlign: "center",
          fontFamily: FONT_TEXT,
          fontSize: 36,
          color: progress >= 1 ? P.tealLight : P.white,
        }}
      >
        {progress >= 1
          ? "Analisi completata!"
          : `Analisi attività… ${Math.floor(progress * 100)}%`}
      </div>

      {/* Linea temporale della giornata */}
      <div
        style={{
          position: "absolute",
          left: tlX,
          top: 796,
          width: tlW,
          height: 110,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 70,
            height: 6,
            background: P.grayMid,
          }}
        />
        {[9, 12, 15, 18].map((h) => (
          <div
            key={h}
            style={{
              position: "absolute",
              left: (h - DAY_START) * scale - 30,
              top: 84,
              width: 60,
              textAlign: "center",
              fontFamily: FONT_TITLE,
              fontSize: 14,
              color: P.grayLight,
            }}
          >
            {h}:00
          </div>
        ))}
        {BLOCKS.map((b, i) => {
          const s = popScale(frame, 136 + i * 10);
          if (s === 0) return null;
          return (
            <div
              key={b.label}
              style={{
                position: "absolute",
                left: (b.from - DAY_START) * scale + 3,
                width: (b.to - b.from) * scale - 6,
                top: 4,
                height: 58,
                background: b.excluded
                  ? `repeating-linear-gradient(45deg, ${P.grayMid} 0 8px, ${P.gray} 8px 16px)`
                  : b.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_TEXT,
                fontWeight: 700,
                fontSize: 29,
                color: P.white,
                textDecoration: b.excluded ? "line-through" : undefined,
                scale: String(s),
                ...pixelBorder(4, P.ink, false),
              }}
            >
              {b.label}
            </div>
          );
        })}
      </div>

      <CaptionBar>
        {frame < 132 ? (
          <Typewriter
            text="Analizza i segnali della giornata"
            start={4}
            speed={1.2}
          />
        ) : (
          <Typewriter
            text="…e ricostruisce le attività"
            start={134}
            speed={1.2}
          />
        )}
      </CaptionBar>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Timesheet suggerito                                              */
/* ------------------------------------------------------------------ */

export const ROWS = [
  { p: "Progetto Alfa", todo: "TDE012345", ticket: "", h: 1.5 },
  { p: "Progetto Beta", todo: "", ticket: "CAS-01234", h: 2.0 },
  { p: "Progetto Beta", todo: "TDE012346", ticket: "", h: 2.75 },
  { p: "Progetto Gamma", todo: "TDAG12345", ticket: "CAS-05678", h: 1.75 },
];

const COLS = [330, 210, 210, 130];

const hh = (v: number) => v.toFixed(2).replace(".", ",");

const TableRow: React.FC<{
  readonly cells: string[];
  readonly bg: string;
  readonly color?: string;
  readonly font?: string;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ cells, bg, color = P.gray, font = FONT_TEXT, size = 42, style }) => (
  <div
    style={{
      display: "flex",
      height: 66,
      background: bg,
      borderBottom: `4px solid ${P.ink}`,
      ...style,
    }}
  >
    {cells.map((c, i) => (
      <div
        key={i}
        style={{
          width: COLS[i],
          display: "flex",
          alignItems: "center",
          justifyContent: i === 3 ? "flex-end" : "flex-start",
          padding: "0 16px",
          fontFamily: font,
          fontWeight: 700,
          fontSize: size,
          color,
          borderRight: i < 3 ? `4px solid ${P.ink}` : undefined,
          whiteSpace: "nowrap",
        }}
      >
        {c}
      </div>
    ))}
  </div>
);

export const ScenePixelTimesheet: React.FC = () => {
  const frame = useCurrentFrame();
  const f = stepFrame(frame);
  const totalQuarters = Math.floor(interpolate(f, [86, 116], [0, 32], clamp));
  return (
    <AbsoluteFill>
      <Office dim={0.25} />
      <PixelWindow
        x={60}
        y={190}
        w={960}
        h={600}
        scale={popScale(frame, 4)}
        title={
          <>
            <Sprite
              sprite={agentBadge}
              px={3}
              x={0}
              y={0}
              style={{ position: "relative" }}
            />
            <span>TIMESHEET SUGGERITO</span>
          </>
        }
      >
        <div style={{ margin: "20px 30px 0", border: `4px solid ${P.ink}` }}>
          <TableRow
            cells={["Progetto", "Todo", "Ticket", "Tempo"]}
            bg={P.gray}
            color={P.white}
            font={FONT_TITLE}
            size={17}
          />
          {ROWS.map((r, i) => {
            const start = 16 + i * 16;
            const d = f - start;
            if (d < 0)
              return (
                <div key={i} style={{ height: 70, background: P.white }} />
              );
            const slide = d < 2 ? -60 : d < 4 ? 10 : 0;
            return (
              <TableRow
                key={i}
                cells={[r.p, r.todo, r.ticket, hh(r.h)]}
                bg={i % 2 ? "#FFF1DE" : P.white}
                style={{ translate: `${slide}px 0`, opacity: d < 2 ? 0.5 : 1 }}
              />
            );
          })}
          <TableRow
            cells={["Totale giornata", "", "", hh(totalQuarters / 4)]}
            bg={P.orange}
            color={P.white}
            style={{ borderBottom: "none", opacity: frame >= 84 ? 1 : 0 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            margin: "22px 30px 0",
            fontFamily: FONT_TEXT,
            fontSize: 36,
            color: P.gray,
            opacity: frame >= 120 ? 1 : 0,
          }}
        >
          <Sprite
            sprite={iconCheck}
            px={4}
            x={0}
            y={0}
            style={{ position: "relative" }}
          />
          Tempi in centesimi, pronti per il foglio presenze di BC
        </div>
      </PixelWindow>
      <Sparkles cx={890} cy={680} start={116} r={90} />
      <Robot x={890} y={712} px={7} talking={frame < 120} />

      <CaptionBar>
        <Typewriter text="Ti propone il timesheet" start={4} speed={1.2} />
      </CaptionBar>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Revisione del dipendente                                         */
/* ------------------------------------------------------------------ */

export const ScenePixelReview: React.FC = () => {
  const frame = useCurrentFrame();
  const stamp = popScale(frame, 68);
  return (
    <AbsoluteFill>
      <Office clockMinutes={18 * 60 + 5} />

      <PixelWindow
        x={500}
        y={210}
        w={500}
        h={520}
        title={<span>REVISIONE</span>}
        headerColor={P.gray}
      >
        {ROWS.map((r, i) => {
          const checked = frame >= 14 + i * 12;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                margin: "20px 24px 0",
                height: 66,
                padding: "0 14px",
                background: P.white,
                border: `4px solid ${P.ink}`,
                fontFamily: FONT_TEXT,
                fontWeight: 700,
                fontSize: 40,
                color: P.gray,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: `4px solid ${P.ink}`,
                  background: checked ? "#E2F5E8" : P.white,
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                {checked ? (
                  <Sprite sprite={iconCheck} px={4} x={-2} y={0} />
                ) : null}
              </div>
              <div style={{ flex: 1 }}>{r.p}</div>
              <div>{hh(r.h)}</div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 340,
            padding: "10px 22px",
            border: `6px solid ${P.green}`,
            color: P.green,
            background: "rgba(255,255,255,0.92)",
            fontFamily: FONT_TITLE,
            fontSize: 30,
            rotate: "-6deg",
            scale: String(stamp === 0 ? 0 : stamp === 1 ? 1 : stamp * 1.4),
          }}
        >
          CONFERMATO
        </div>
      </PixelWindow>

      <Employee
        x={120}
        y={500}
        px={16}
        mood={frame < 60 ? "neutral" : "happy"}
      />
      <Desk x={40} y={812} w={440} />
      <Keyboard x={204} y={780} />
      <Sparkles cx={248} cy={600} start={70} r={190} />

      <CaptionBar>
        <Typewriter
          text="Tu rivedi, correggi e confermi"
          start={4}
          speed={1.2}
        />
      </CaptionBar>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6. Chiusura                                                         */
/* ------------------------------------------------------------------ */

export const ScenePixelFinal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.gray }}>
      {/* stelline pixel */}
      {Array.from({ length: 34 }).map((_, i) => {
        const x = Math.floor(random(`sx${i}`) * 132) * 8;
        const y = Math.floor(random(`sy${i}`) * 132) * 8;
        const on = Math.floor((frame + random(`st${i}`) * 40) / 10) % 3 !== 0;
        const big = random(`sb${i}`) > 0.7;
        return on ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: big ? 16 : 8,
              height: big ? 16 : 8,
              background:
                i % 3 === 0 ? P.orange : i % 3 === 1 ? P.white : P.tealLight,
              opacity: 0.55,
            }}
          />
        ) : null;
      })}

      <Sprite
        sprite={employeeHead}
        px={10}
        x={300}
        y={150 + (Math.floor(frame / 12) % 2) * 10}
      />
      <Sprite
        sprite={robotHead}
        px={10}
        x={620}
        y={150 + (Math.floor(frame / 12 + 1) % 2) * 10}
      />
      <Sprite
        sprite={sparkle}
        px={10}
        x={515}
        y={190}
        style={{ opacity: Math.floor(frame / 6) % 2 ? 1 : 0.4 }}
      />

      <div
        style={{
          position: "absolute",
          top: 360,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT_TEXT,
          fontWeight: 700,
          lineHeight: 1.12,
          textShadow: `6px 6px 0 ${P.ink}`,
        }}
      >
        <div style={{ fontSize: 128, color: P.white }}>
          <Typewriter text="Tu controlli." start={8} speed={0.8} />
        </div>
        <div style={{ fontSize: 108, color: P.orange }}>
          <Typewriter text="L'agente ricostruisce." start={26} speed={1} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 640,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          fontFamily: FONT_TEXT,
          fontWeight: 700,
          fontSize: 46,
          color: P.tealLight,
          opacity: frame >= 52 ? 1 : 0,
        }}
      >
        <Sprite
          sprite={agentBadge}
          px={3}
          x={0}
          y={0}
          style={{ position: "relative" }}
        />
        Supporto generazione time sheet
      </div>

      <div
        style={{
          position: "absolute",
          left: 430,
          top: 730,
          width: 220,
          height: 220,
          background: P.white,
          scale: String(popScale(frame, 56)),
          ...pixelBorder(8, P.orange),
        }}
      >
        <Img
          src={staticFile("eos-logo.png")}
          style={{ width: 220, height: 220 }}
        />
      </div>
    </AbsoluteFill>
  );
};

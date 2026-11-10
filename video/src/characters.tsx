import React from "react";
import { C } from "./theme";

const S = { stroke: C.ink, strokeWidth: 6, strokeLinejoin: "round" as const };

type Mood = "worried" | "neutral" | "happy";

// Dipendente in stile cartoon "cutout": testa enorme, corpo piccolo, contorni spessi
export const Employee: React.FC<{
  mood: Mood;
  frame: number;
  armUp?: boolean;
  size?: number;
}> = ({ mood, frame, armUp = false, size = 420 }) => {
  const blink = frame % 90 > 84 ? 0.15 : 1;
  const look = mood === "worried" ? -6 : 0;
  const sweatY = (frame % 30) * 1.2;
  return (
    <svg viewBox="0 0 300 430" width={size * (300 / 430)} height={size}>
      {/* piedi */}
      <ellipse cx={108} cy={410} rx={40} ry={15} fill={C.ink} />
      <ellipse cx={192} cy={410} rx={40} ry={15} fill={C.ink} />
      {/* pantaloni */}
      <rect x={92} y={330} width={116} height={72} rx={8} fill={C.gray} {...S} />
      <line x1={150} y1={345} x2={150} y2={400} stroke={C.ink} strokeWidth={5} />
      {/* camicia */}
      <path d="M78 340 L98 218 Q150 200 202 218 L222 340 Z" fill="#5AA9F0" {...S} />
      {/* cravatta arancione EOS */}
      <path d="M150 222 L138 240 L150 312 L162 240 Z" fill={C.orange} {...S} strokeWidth={4} />
      {/* braccio sinistro */}
      <path d="M96 240 Q66 280 72 312" fill="none" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
      <path d="M96 240 Q66 280 72 312" fill="none" stroke="#5AA9F0" strokeWidth={12} strokeLinecap="round" />
      <circle cx={72} cy={318} r={18} fill={C.skin} {...S} />
      {/* braccio destro */}
      {armUp ? (
        <>
          <path d="M204 240 Q246 214 250 170" fill="none" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
          <path d="M204 240 Q246 214 250 170" fill="none" stroke="#5AA9F0" strokeWidth={12} strokeLinecap="round" />
          <circle cx={252} cy={160} r={19} fill={C.skin} {...S} />
          <rect x={244} y={124} width={14} height={30} rx={7} fill={C.skin} {...S} strokeWidth={5} />
        </>
      ) : (
        <>
          <path d="M204 240 Q234 280 228 312" fill="none" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
          <path d="M204 240 Q234 280 228 312" fill="none" stroke="#5AA9F0" strokeWidth={12} strokeLinecap="round" />
          <circle cx={228} cy={318} r={18} fill={C.skin} {...S} />
        </>
      )}
      {/* testa */}
      <ellipse cx={150} cy={130} rx={122} ry={104} fill={C.skin} {...S} />
      {/* capelli */}
      <path
        d="M30 118 Q40 26 150 24 Q262 26 272 118 Q236 70 196 78 Q176 60 150 72 Q118 56 100 78 Q64 70 30 118 Z"
        fill="#6B3E1E"
        {...S}
      />
      {/* sopracciglia */}
      {mood === "worried" ? (
        <>
          <line x1={96} y1={96} x2={134} y2={84} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          <line x1={166} y1={84} x2={204} y2={96} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1={98} y1={88} x2={134} y2={84} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          <line x1={166} y1={84} x2={202} y2={88} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        </>
      )}
      {/* occhi */}
      <g style={{ transformOrigin: "150px 132px", scale: `1 ${blink}` }}>
        <ellipse cx={121} cy={132} rx={30} ry={34} fill={C.white} {...S} strokeWidth={5} />
        <ellipse cx={179} cy={132} rx={30} ry={34} fill={C.white} {...S} strokeWidth={5} />
        <circle cx={128} cy={130 + look} r={6} fill={C.ink} />
        <circle cx={172} cy={130 + look} r={6} fill={C.ink} />
      </g>
      {/* bocca */}
      {mood === "worried" && (
        <path d="M118 196 Q128 186 138 196 Q148 206 158 196 Q168 186 180 196" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      )}
      {mood === "neutral" && <ellipse cx={150} cy={196} rx={14} ry={12} fill="#7A2A1E" stroke={C.ink} strokeWidth={5} />}
      {mood === "happy" && (
        <path d="M112 182 Q150 232 188 182 Z" fill="#7A2A1E" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      )}
      {/* goccia di sudore */}
      {mood === "worried" && (
        <path
          d={`M262 ${70 + sweatY} q10 18 0 26 q-10 -8 0 -26 Z`}
          fill="#7CC4FA"
          stroke={C.ink}
          strokeWidth={4}
        />
      )}
    </svg>
  );
};

// Assistente AI "Supporto Generazione Timesheet": robottino blu amichevole
export const Assistant: React.FC<{ frame: number; size?: number; talking?: boolean }> = ({
  frame,
  size = 360,
  talking = false,
}) => {
  const blink = frame % 70 > 65 ? 0.2 : 1;
  const mouth = talking ? 6 + Math.abs(Math.sin(frame / 3)) * 14 : 8;
  return (
    <svg viewBox="0 0 300 330" width={size * (300 / 330)} height={size}>
      <defs>
        <linearGradient id="botBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B95E9" />
          <stop offset="1" stopColor={C.blue} />
        </linearGradient>
      </defs>
      {/* antenna */}
      <line x1={150} y1={58} x2={150} y2={22} stroke={C.ink} strokeWidth={6} />
      <circle cx={150} cy={18} r={14} fill={C.orange} {...S} strokeWidth={5} />
      {/* braccia */}
      <circle cx={34} cy={196} r={22} fill="#2B95E9" {...S} />
      <circle cx={266} cy={196} r={22} fill="#2B95E9" {...S} />
      {/* corpo/testa */}
      <rect x={44} y={56} width={212} height={232} rx={70} fill="url(#botBody)" {...S} />
      {/* schermo viso */}
      <rect x={72} y={94} width={156} height={112} rx={40} fill={C.blueDeep} {...S} strokeWidth={5} />
      <g style={{ transformOrigin: "150px 140px", scale: `1 ${blink}` }}>
        <rect x={104} y={122} width={22} height={34} rx={11} fill="#7FE3FF" />
        <rect x={174} y={122} width={22} height={34} rx={11} fill="#7FE3FF" />
      </g>
      <rect x={136} y={176 - mouth / 2} width={28} height={mouth} rx={mouth / 2} fill="#7FE3FF" />
      {/* guance */}
      <circle cx={92} cy={176} r={8} fill={C.orange} opacity={0.8} />
      <circle cx={208} cy={176} r={8} fill={C.orange} opacity={0.8} />
      {/* logo sul petto */}
      <rect x={112} y={226} width={76} height={36} rx={18} fill={C.white} {...S} strokeWidth={4} />
      <text x={150} y={252} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.blue} fontFamily="Inter, sans-serif">
        AI
      </text>
      {/* piedini */}
      <ellipse cx={110} cy={306} rx={32} ry={14} fill={C.ink} />
      <ellipse cx={190} cy={306} rx={32} ry={14} fill={C.ink} />
    </svg>
  );
};

// Sfondo ufficio moderno, piatto, toni blu
export const Office: React.FC<{ clock?: [number, number] }> = ({ clock = [17, 58] }) => {
  const [h, m] = clock;
  const minAngle = m * 6;
  const hourAngle = (h % 12) * 30 + m * 0.5;
  return (
    <svg viewBox="0 0 1080 1210" width={1080} height={1210} style={{ position: "absolute", inset: 0 }}>
      <rect width={1080} height={1210} fill={C.sky} />
      {/* finestra con skyline */}
      <rect x={80} y={90} width={460} height={380} rx={20} fill="#BFE0FA" {...S} />
      <g fill="#7FB8E8">
        <rect x={110} y={260} width={70} height={210} />
        <rect x={190} y={200} width={90} height={270} />
        <rect x={290} y={300} width={60} height={170} />
        <rect x={360} y={230} width={80} height={240} />
        <rect x={450} y={290} width={70} height={180} />
      </g>
      <line x1={310} y1={90} x2={310} y2={470} stroke={C.ink} strokeWidth={6} />
      <rect x={80} y={90} width={460} height={380} rx={20} fill="none" {...S} />
      {/* orologio */}
      <circle cx={860} cy={200} r={100} fill={C.white} {...S} strokeWidth={8} />
      <line x1={860} y1={200} x2={860 + 52 * Math.sin((hourAngle * Math.PI) / 180)} y2={200 - 52 * Math.cos((hourAngle * Math.PI) / 180)} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <line x1={860} y1={200} x2={860 + 78 * Math.sin((minAngle * Math.PI) / 180)} y2={200 - 78 * Math.cos((minAngle * Math.PI) / 180)} stroke={C.orange} strokeWidth={7} strokeLinecap="round" />
      <circle cx={860} cy={200} r={9} fill={C.ink} />
      {/* pianta */}
      <rect x={880} y={700} width={110} height={120} rx={14} fill={C.orange} {...S} />
      <ellipse cx={910} cy={650} rx={34} ry={70} fill="#4CAF7A" {...S} />
      <ellipse cx={965} cy={640} rx={34} ry={80} fill="#3E9E6B" {...S} />
      {/* pavimento */}
      <rect x={0} y={820} width={1080} height={390} fill="#C9D6E3" />
      <line x1={0} y1={820} x2={1080} y2={820} stroke={C.ink} strokeWidth={6} />
    </svg>
  );
};

export const Desk: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 640 420" width={640} height={420}>
    {/* monitor */}
    <rect x={150} y={10} width={340} height={230} rx={18} fill={C.gray} {...S} />
    <rect x={168} y={28} width={304} height={194} rx={8} fill={C.white} />
    <rect x={300} y={240} width={40} height={40} fill={C.gray} {...S} />
    {children}
    {/* scrivania */}
    <rect x={20} y={280} width={600} height={40} rx={10} fill="#F4F4F4" {...S} />
    <rect x={60} y={320} width={24} height={100} fill={C.gray} {...S} />
    <rect x={556} y={320} width={24} height={100} fill={C.gray} {...S} />
  </svg>
);

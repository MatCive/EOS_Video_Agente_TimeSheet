import { P } from "./palette";
import type { SpriteDef } from "./Sprite";

/* ------------------------------------------------------------------ */
/* Dipendente (mezzo busto, dietro la scrivania)                       */
/* ------------------------------------------------------------------ */

export type Mood = "neutral" | "confused" | "happy" | "wow";

const EMP_COLORS = {
  K: P.ink,
  H: P.hair,
  S: P.skin,
  R: "#F08F8F",
  W: P.white,
  G: P.gray,
  g: P.grayDark,
  T: P.orange,
};

const HEAD_TOP = [
  "....KKKKKKKK....",
  "...KHHHHHHHHK...",
  "..KHHHHHHHHHHK..",
  "..KHHHHHHHHHHK..",
  "..KHSSHHHHSSHK..",
  "..KSSSSSSSSSSK..",
];
const EYES_OPEN = ["..KSSKSSSSKSSK..", "..KSSKSSSSKSSK.."];
const EYES_BLINK = ["..KSSSSSSSSSSK..", "..KSKKSSSSKKSK.."];

const MOUTHS: Record<Mood, string[]> = {
  neutral: ["..KSSSSSSSSSSK..", "..KSSSSSSSSSSK..", "..KSSSKKKKSSSK.."],
  confused: ["..KSSSSSSSSSSK..", "..KSSSSSSSKKSK..", "..KSSKKKKSSSSK.."],
  happy: ["..KSRSSSSSSRSK..", "..KSSKSSSSKSSK..", "..KSSSKKKKSSSK.."],
  wow: ["..KSSSSSSSSSSK..", "..KSSSSKKSSSSK..", "..KSSSSKKSSSSK.."],
};

const CHIN = "...KSSSSSSSSK...";

const BODY = [
  "....KKSSSSKK....",
  "...KGGWSSWGGK...",
  "..KGGGWTTWGGGK..",
  ".KGGGGWTTWGGGGK.",
  ".KGGgGWTTWGgGGK.",
  ".KGGgGGTTGGgGGK.",
  ".KGGgGGGGGGgGGK.",
  ".KSSgGGGGGGgSSK.",
  ".KKKKKKKKKKKKKK.",
];

export const employee = (mood: Mood, blink = false): SpriteDef => ({
  rows: [
    ...HEAD_TOP,
    ...(blink ? EYES_BLINK : EYES_OPEN),
    ...MOUTHS[mood],
    CHIN,
    ...BODY,
  ],
  colors: EMP_COLORS,
});

export const employeeHead: SpriteDef = {
  rows: [...HEAD_TOP, ...EYES_OPEN, ...MOUTHS.happy, CHIN, "....KKKKKKKK...."],
  colors: EMP_COLORS,
};

/* ------------------------------------------------------------------ */
/* Assistente AI "Supporto generazione time sheet"                     */
/* ------------------------------------------------------------------ */

const BOT_COLORS = {
  K: P.ink,
  T: P.teal,
  t: P.tealDark,
  D: P.screen,
  C: P.tealLight,
  O: P.orange,
  Y: "#FFD34D",
  W: P.white,
  L: P.grayLight,
};

const BOT_HEAD = (blink: boolean, talk: boolean) => [
  ".......OO.......",
  ".......KK.......",
  "....KKKKKKKK....",
  "...KTTTTTTTTK...",
  "..KTDDDDDDDDtK..",
  blink ? "..KTDDDDDDDDtK.." : "..KTDCCDDCCDtK..",
  "..KTDCCDDCCDtK..",
  "..KTDDDDDDDDtK..",
  talk ? "..KTDDCCCCDDtK.." : "..KTDDCDDCDDtK..",
  talk ? "..KTDDCCCCDDtK.." : "..KTDDDCCDDDtK..",
  "...KttttttttK...",
  "....KKKKKKKK....",
];

const BOT_BODY = (flame: boolean) => [
  "......KLLK......",
  "...KKKTTTTKKK...",
  "..KTTTTTTTTTtK..",
  ".KTTKOOOOOOKTtK.",
  ".KTTKOWOOWOKTtK.",
  ".KTTKOOOOOOKTtK.",
  ".KLLKKKKKKKKLLK.",
  "....KTTKKTtK....",
  flame ? ".....OY..YO....." : "......Y..Y......",
  flame ? "......O..O......" : "................",
];

export const robot = (
  opts: { blink?: boolean; talk?: boolean; flame?: boolean } = {},
): SpriteDef => ({
  rows: [
    ...BOT_HEAD(!!opts.blink, !!opts.talk),
    ...BOT_BODY(opts.flame ?? true),
  ],
  colors: BOT_COLORS,
});

export const robotHead: SpriteDef = {
  rows: BOT_HEAD(false, false),
  colors: BOT_COLORS,
};

/* ------------------------------------------------------------------ */
/* Icone                                                               */
/* ------------------------------------------------------------------ */

const ICON_COLORS = {
  K: P.ink,
  W: P.white,
  O: P.orange,
  o: P.orangeDark,
  B: "#2F7BD8",
  U: "#6264A7",
  G: P.green,
  g: P.greenDark,
  L: P.grayLight,
  T: P.teal,
};

export const iconCalendar: SpriteDef = {
  colors: ICON_COLORS,
  rows: [
    "..K....K..",
    "KKKKKKKKKK",
    "KOOOOOOOOK",
    "KOOOOOOOOK",
    "KWWWWWWWWK",
    "KWoWoWoWWK",
    "KWWWWWWWWK",
    "KWoWoWWWWK",
    "KWWWWWWWWK",
    "KKKKKKKKKK",
  ],
};

export const iconMail: SpriteDef = {
  colors: ICON_COLORS,
  rows: [
    "..........",
    "KKKKKKKKKK",
    "KLKWWWWKLK",
    "KWLKWWKLWK",
    "KWWLKKLWWK",
    "KWWWLLWWWK",
    "KWWWWWWWWK",
    "KWWWWWWWWK",
    "KKKKKKKKKK",
    "..........",
  ],
};

export const iconChat: SpriteDef = {
  colors: ICON_COLORS,
  rows: [
    ".KKKKKKKK.",
    "KUUUUUUUUK",
    "KUWWWWWWUK",
    "KUUUUUUUUK",
    "KUWWWWUUUK",
    "KUUUUUUUUK",
    ".KKKUUKKK.",
    "...KUK....",
    "...KK.....",
    "..........",
  ],
};

export const iconFile: SpriteDef = {
  colors: ICON_COLORS,
  rows: [
    ".KKKKKK...",
    ".KWWWWKK..",
    ".KWWWWKWK.",
    ".KWBBWKKKK",
    ".KWWWWWWWK",
    ".KWBBBBBWK",
    ".KWWWWWWWK",
    ".KWBBBBWWK",
    ".KWWWWWWWK",
    ".KKKKKKKKK",
  ],
};

export const iconSearch: SpriteDef = {
  colors: ICON_COLORS,
  rows: [
    "..KKKK....",
    ".KWWWWK...",
    "KWTWWWWK..",
    "KWTWWWWK..",
    "KWWWWWWK..",
    ".KWWWWK...",
    "..KKKKKK..",
    "......KKK.",
    ".......KKK",
    "........KK",
  ],
};

export const iconTable: SpriteDef = {
  colors: ICON_COLORS,
  rows: [
    "KKKKKKKKKK",
    "KOOOOOOOOK",
    "KKKKKKKKKK",
    "KWWKWWWWWK",
    "KKKKKKKKKK",
    "KWWKWWWWWK",
    "KKKKKKKKKK",
    "KWWKWWWWWK",
    "KKKKKKKKKK",
    "..........",
  ],
};

export const iconCheck: SpriteDef = {
  colors: ICON_COLORS,
  rows: [
    "........gg",
    ".......gGg",
    "......gGg.",
    "gg...gGg..",
    "gGg.gGg...",
    ".gGgGg....",
    "..gGg.....",
    "...g......",
  ],
};

export const sparkle: SpriteDef = {
  colors: { Y: "#FFD34D", W: P.white },
  rows: ["..Y..", "..Y..", "YYWYY", "..Y..", "..Y.."],
};

export const sweat: SpriteDef = {
  colors: { B: "#7CC4F2", W: P.white, K: P.ink },
  rows: ["..K..", ".KBK.", "KBWBK", "KBBBK", ".KKK."],
};

// Icona dell'agente come nello screenshot: quadrato teal con "</>"
export const agentBadge: SpriteDef = {
  colors: { T: P.teal, t: P.tealDark, W: P.white },
  rows: [
    ".TTTTTTTTTTTT.",
    "TTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTT",
    "TTTWTTTTWTWTTT",
    "TTWTTTTWTTTWTT",
    "TWTTTTTWTTTTWT",
    "TTWTTTWTTTTWTT",
    "TTTWTWTTTTWTTT",
    "TTTTTTTTTTTTTT",
    "tttttttttttttt",
    ".tttttttttttt.",
  ],
};

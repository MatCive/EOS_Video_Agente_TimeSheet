// Palette pixel art: colori EOS (logo ufficiale) + toni ufficio + teal dell'agente
export const P = {
  orange: "#EF7F02",
  orangeLight: "#FFA53A",
  orangeDark: "#B35F00",
  gray: "#3E3D39",
  grayDark: "#2A2926",
  grayMid: "#6E6C66",
  grayLight: "#BEBBB3",
  ink: "#1B1A17",
  white: "#FFFFFF",
  paper: "#FFF8EE",
  wall: "#F6EBDB",
  wallShade: "#EADBC4",
  wainscot: "#D9C3A3",
  floorA: "#A27852",
  floorB: "#8E6646",
  floorLine: "#6F4E34",
  desk: "#C08A5A",
  deskDark: "#8A5E3A",
  sky: "#9FD6F2",
  skyLight: "#CDEBFA",
  city: "#7FA9C4",
  teal: "#19A7AC",
  tealDark: "#0E7479",
  tealLight: "#7FE3E1",
  screen: "#1E2A2E",
  chat: "#262626",
  chatBubble: "#3A3A3A",
  green: "#3BAA5C",
  greenDark: "#23763C",
  red: "#D9443B",
  skin: "#F2C29B",
  skinDark: "#D99C72",
  hair: "#4A2F1E",
  leaf: "#4E9E4A",
  leafDark: "#2F6E35",
} as const;

export const FONT_TITLE = '"PressStart2P", monospace';
export const FONT_TEXT = '"PixelText", monospace';

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Movimento a scatti tipico della pixel art: animazioni a 15 fps su video a 30 fps
export const stepFrame = (frame: number, step = 2) =>
  Math.floor(frame / step) * step;

// Allinea una coordinata alla griglia dei pixel
export const snap = (v: number, grid: number) => Math.round(v / grid) * grid;

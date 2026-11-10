// Palette EOS (dal logo ufficiale) + blu in stile Microsoft
export const C = {
  orange: "#EF7F02",
  gray: "#3E3D39",
  blue: "#0078D4",
  blueDark: "#004E8C",
  blueDeep: "#002F5C",
  blueLight: "#DEECF9",
  sky: "#EEF6FD",
  ink: "#1E1E1E",
  white: "#FFFFFF",
  skin: "#F7D3AE",
  green: "#2E9E5B",
};

export const FONT = 'Inter, "Segoe UI", Arial, sans-serif';

// Movimento "a scatti" tipico dei cartoni in cutout di carta
export const stepped = (frame: number, step = 3) => Math.floor(frame / step) * step;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

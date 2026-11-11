import React, { useMemo } from "react";
import { snap } from "./palette";

export type SpriteDef = {
  rows: readonly string[];
  colors: Readonly<Record<string, string>>;
};

type Props = {
  readonly sprite: SpriteDef;
  // dimensione in px di un singolo pixel dello sprite
  readonly px: number;
  readonly x: number;
  readonly y: number;
  readonly flip?: boolean;
  readonly style?: React.CSSProperties;
};

// Converte righe di caratteri in rettangoli SVG, unendo i pixel adiacenti dello stesso colore
const toRects = (sprite: SpriteDef) => {
  const out: React.ReactNode[] = [];
  sprite.rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let len = 1;
      while (x + len < row.length && row[x + len] === ch) len++;
      const fill = sprite.colors[ch];
      if (fill) {
        out.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={len}
            height={1}
            fill={fill}
          />,
        );
      }
      x += len;
    }
  });
  return out;
};

export const spriteSize = (sprite: SpriteDef) => ({
  w: Math.max(...sprite.rows.map((r) => r.length)),
  h: sprite.rows.length,
});

export const Sprite: React.FC<Props> = ({ sprite, px, x, y, flip, style }) => {
  const rects = useMemo(() => toRects(sprite), [sprite]);
  const { w, h } = spriteSize(sprite);
  return (
    <svg
      width={w * px}
      height={h * px}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{
        position: "absolute",
        left: snap(x, px / 2),
        top: snap(y, px / 2),
        scale: flip ? "-1 1" : undefined,
        overflow: "visible",
        ...style,
      }}
    >
      {rects}
    </svg>
  );
};

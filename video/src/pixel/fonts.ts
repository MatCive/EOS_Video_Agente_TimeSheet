import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Font pixel art locali (SIL Open Font License, vedi public/fonts).
// Jersey 10 ha un solo peso: lo registriamo anche come 700 per evitare il grassetto sintetico.
export const fontsLoaded = Promise.all([
  loadFont({
    family: "PressStart2P",
    url: staticFile("fonts/PressStart2P.woff2"),
    weight: "400",
  }),
  loadFont({
    family: "PixelText",
    url: staticFile("fonts/Jersey10.woff2"),
    weight: "400",
  }),
  loadFont({
    family: "PixelText",
    url: staticFile("fonts/Jersey10.woff2"),
    weight: "700",
  }),
]);

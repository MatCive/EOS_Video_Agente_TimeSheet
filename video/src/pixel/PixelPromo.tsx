import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { P } from "./palette";
import { FlowBar, PixelWipe } from "./ui";
import {
  ScenePixelAnalysis,
  ScenePixelAssistant,
  ScenePixelFinal,
  ScenePixelProblem,
  ScenePixelReview,
  ScenePixelTimesheet,
} from "./scenes";
import "./fonts";

// Inizio di ogni scena (frame globali): la barra del flusso segue la storia
const SCENE_STARTS = [0, 170, 320, 530, 700, 810];

const Flow: React.FC = () => {
  const frame = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < 5; i++) if (frame >= SCENE_STARTS[i]) active = i;
  // all'ultima scena la barra esce verso il basso a scatti
  const out =
    frame < SCENE_STARTS[5] - 6
      ? 0
      : Math.min(160, Math.floor((frame - (SCENE_STARTS[5] - 6)) / 2) * 40);
  if (out >= 160) return null;
  return <FlowBar active={active} offsetY={out} />;
};

// 6 scene affiancate (gli overlay non accorciano la timeline): 900 frame = 30 s a 30 fps
export const PixelPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: P.gray }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="1 · Il problema"
          durationInFrames={170}
        >
          <ScenePixelProblem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={16}>
          <PixelWipe />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence
          name="2 · Assistente AI"
          durationInFrames={150}
        >
          <ScenePixelAssistant />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={16}>
          <PixelWipe />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence
          name="3 · Analisi attività"
          durationInFrames={210}
        >
          <ScenePixelAnalysis />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={16}>
          <PixelWipe />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence
          name="4 · Timesheet suggerito"
          durationInFrames={170}
        >
          <ScenePixelTimesheet />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={16}>
          <PixelWipe />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="5 · Revisione" durationInFrames={110}>
          <ScenePixelReview />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={16}>
          <PixelWipe />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="6 · Chiusura" durationInFrames={90}>
          <ScenePixelFinal />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Flow />
      {/* Musica chiptune ed effetti generati da scripts/make_chiptune.py */}
      <Audio src={staticFile("audio/chiptune.wav")} />
    </AbsoluteFill>
  );
};

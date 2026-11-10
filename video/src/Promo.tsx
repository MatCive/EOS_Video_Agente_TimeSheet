import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Header } from "./ui";
import { SceneAnalysis, SceneAssistant, SceneFinal, SceneProblem, SceneReview, SceneTimesheet } from "./scenes";

// 6 scene, 5 transizioni da 10 frame: 950 - 50 = 900 frame = 30 s a 30 fps
export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#D6E8F8" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Problema" durationInFrames={190}>
          <SceneProblem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />
        <TransitionSeries.Sequence name="Assistente AI" durationInFrames={160}>
          <SceneAssistant />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 10 })} />
        <TransitionSeries.Sequence name="Analisi attività" durationInFrames={220}>
          <SceneAnalysis />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 10 })} />
        <TransitionSeries.Sequence name="Timesheet suggerito" durationInFrames={190}>
          <SceneTimesheet />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />
        <TransitionSeries.Sequence name="Revisione" durationInFrames={90}>
          <SceneReview />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />
        <TransitionSeries.Sequence name="Chiusura" durationInFrames={100}>
          <SceneFinal />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Header />
    </AbsoluteFill>
  );
};

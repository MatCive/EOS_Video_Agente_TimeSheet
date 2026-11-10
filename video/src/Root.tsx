import { Composition } from "remotion";
import { Promo } from "./Promo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PromoTimesheet"
      component={Promo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

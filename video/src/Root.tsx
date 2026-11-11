import { Composition } from "remotion";
import { Promo } from "./Promo";
import { PixelPromo } from "./pixel/PixelPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoTimesheetPixel"
        component={PixelPromo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="PromoTimesheet"
        component={Promo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

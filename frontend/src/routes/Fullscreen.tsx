import { useAtom } from "jotai";
import { useParams } from "react-router";
import { addedTaskAtom, currentSecondsAtom, themeMapAtom } from "../atoms";
import { useEffect, useState } from "react";
import { secondsInHour, secondsInQuarterHour } from "../shared/consts";
import Banner from "../components/Banner";

function Fullscreen() {
  const params = useParams();
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [addedTask] = useAtom(addedTaskAtom);

  const url = decodeURIComponent(params.encodedURL);

  useEffect(() => {
    const nearestFifteen =
      Math.floor(currentSeconds / secondsInQuarterHour) * secondsInQuarterHour;

    if (iframe) {
      iframe.contentWindow?.postMessage(
        {
          type: "DATA",
          payload: {
            currentSeconds,
            startTime: addedTask?.startTime || nearestFifteen,
            duration: addedTask?.duration || secondsInHour / 2,
            label: addedTask?.label || "Example",
          },
        },
        "*",
      );
    }
  }, [iframe, currentSeconds]);

  return (
    <div className="flex flex-col w-full">
      <div className="grow relative">
        <iframe
          className={`w-full h-full ${iframe ? "block" : "hidden"}`}
          onLoad={(e) => {
            setIframe(e.target as HTMLIFrameElement);
          }}
          src={url}
        />
      </div>
      {addedTask ? null : <Banner />}
    </div>
  );
}

export default Fullscreen;

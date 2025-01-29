import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { currentSecondsAtom, themesAtom } from "../atoms";
import { secondsInHour, secondsInQuarterHour } from "../shared/consts";
import { HandleTick } from "./HandleTick";

function Landing() {
  const [iframes, setIframes] = useState<Record<string, HTMLIFrameElement>>({});
  const [currentSeconds, setCurrentSeconds] = useAtom(currentSecondsAtom);
  const [themes] = useAtom(themesAtom);

  useEffect(() => {
    const iframeKeys = Object.keys(iframes);
    const nearestFifteen =
      Math.floor(currentSeconds / secondsInQuarterHour) * secondsInQuarterHour;

    for (let key of iframeKeys) {
      iframes[key].contentWindow?.postMessage(
        {
          type: "DATA",
          payload: {
            currentSeconds,
            startTime: nearestFifteen,
            duration: secondsInHour / 2,
            label: "Example",
          },
        },
        "*",
      );
    }
  }, [iframes, currentSeconds]);

  return (
    <div className="h-full w-full flex flex-col">
      <HandleTick />
      <div className="flex items-stretch justify-between">
        <div className="px-3 py-2">
          <div className="font-bold">Timer</div>
          <div className="italic text-neutral-400">Skinnable focus timers</div>
        </div>
        <div className="flex pr-3">
          <Link to="/schedule" className="flex items-center text-neutral-500">
            <div className="px-2">Schedule</div>
          </Link>
          <Link to="/gallery" className="flex items-center text-neutral-500">
            <div className="px-2">Gallery</div>
          </Link>
        </div>
      </div>
      <div
        className="grow grid gap-px bg-neutral-800 border border-neutral-800 w-full h-full"
        style={{
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {themes.slice(0, 4).map((theme) => (
          <div className="flex flex-col" key={theme.url}>
            <div className="grow relative">
              <iframe
                onLoad={(e) => {
                  setIframes((prev) => {
                    return {
                      ...prev,
                      [theme.url]: e.target as HTMLIFrameElement,
                    };
                  });
                }}
                className="w-full h-full"
                src={theme.url}
              />
            </div>
            <div className="bg-neutral-900 text-neutral-400 flex">
              <div className="px-3 py-2 text-sm">{theme.name}</div>
              <div className="px-3 py-2 text-neutral-500 text-sm grow text-right">
                {theme.url}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;

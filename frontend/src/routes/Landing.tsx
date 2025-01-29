import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  currentSecondsAtom,
  themeIdsAtom,
  themeMapAtom,
  themesAtom,
} from "../atoms";
import { secondsInHour, secondsInQuarterHour } from "../shared/consts";
import { FullscreenIcon, ScanIcon } from "lucide-react";

function Landing() {
  const [iframes, setIframes] = useState<Record<string, HTMLIFrameElement>>({});
  const [currentSeconds, setCurrentSeconds] = useAtom(currentSecondsAtom);
  const [themeMap] = useAtom(themeMapAtom);
  const [themeIds] = useAtom(themeIdsAtom);

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
      <Header />{" "}
      <div
        className="grow grid gap-px bg-neutral-800 border border-neutral-800 w-full h-full"
        style={{
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {themeIds.slice(0, 4).map((id) => {
          const theme = themeMap[id];
          return (
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
                  className={`w-full h-full ${iframes[theme.url] ? "block" : "hidden"}`}
                  src={theme.url}
                />
              </div>
              <Link
                to={`/skin/${encodeURIComponent(theme.url)}`}
                className="bg-neutral-900 text-neutral-400 flex hover:bg-neutral-800 hover:text-neutral-300 cursor-pointer"
              >
                <div className="px-3 py-2 text-sm">
                  {theme.name}

                  <div className="text-neutral-500 text-sm">{theme.url}</div>
                </div>
                <div className="px-3 py-2 text-neutral-400 justify-end flex gap-2 items-center text-sm grow text-right">
                  <div>
                    <ScanIcon size={13} />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Header() {
  return (
    <div className="flex items-stretch justify-between bg-neutral-900">
      <div className="px-3 py-2">
        <Link to="/" className="font-bold">
          Timer
        </Link>
        <div className="italic text-neutral-400">Skinnable focus timers</div>
      </div>
      <div className="flex pr-3">
        <Link to="/schedule" className="flex items-center text-neutral-500">
          <div className="px-2">Schedule</div>
        </Link>
        <Link to="/" className="flex items-center text-neutral-500">
          <div className="px-2">Gallery</div>
        </Link>
      </div>
    </div>
  );
}

export default Landing;

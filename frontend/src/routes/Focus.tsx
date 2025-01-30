import {
  currentSecondsAtom,
  entriesAtom,
  iframeLoadedAtom,
  selectedThemeAtom,
  themeMapAtom,
} from "../atoms";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { secondsInHour, secondsInQuarterHour } from "../shared/consts";
import { Header } from "./Landing";
import { ScanIcon } from "lucide-react";

export function Focus() {
  const params = useParams();
  const [currentSeconds, setCurrentSeconds] = useAtom(currentSecondsAtom);
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [themeMap] = useAtom(themeMapAtom);

  const url = decodeURIComponent(params.encodedURL);
  const meta = themeMap[url];

  useEffect(() => {
    const nearestFifteen =
      Math.floor(currentSeconds / secondsInQuarterHour) * secondsInQuarterHour;

    if (iframe) {
      iframe.contentWindow?.postMessage(
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
  }, [iframe, currentSeconds]);

  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="grow relative">
        <iframe
          className={`w-full h-full ${iframe ? "block" : "hidden"}`}
          onLoad={(e) => {
            setIframe(e.target as HTMLIFrameElement);
          }}
          src={url}
        />
      </div>
      <Link
        to={`/fullscreen/${encodeURIComponent(url)}`}
        className="bg-neutral-900 text-neutral-400 flex hover:bg-neutral-800 hover:text-neutral-300 cursor-pointer"
      >
        <div className="px-3 py-2 text-sm">
          {meta.name}

          <div className="text-neutral-500 text-sm">{url}</div>
        </div>
        <div className="px-3 py-2 text-neutral-400 justify-end flex gap-2 items-center text-sm grow text-right">
          <div>Random</div>
          <div>View Source</div>
          <div>
            <ScanIcon size={13} />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function Fullscreen() {
  const params = useParams();
  const [currentSeconds, setCurrentSeconds] = useAtom(currentSecondsAtom);
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [themeMap] = useAtom(themeMapAtom);

  const url = decodeURIComponent(params.encodedURL);
  const meta = themeMap[url];

  useEffect(() => {
    const nearestFifteen =
      Math.floor(currentSeconds / secondsInQuarterHour) * secondsInQuarterHour;

    if (iframe) {
      iframe.contentWindow?.postMessage(
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
    </div>
  );
}



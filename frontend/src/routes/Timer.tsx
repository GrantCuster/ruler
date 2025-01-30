import { currentSecondsAtom, themeIdsAtom, themeMapAtom, addedTaskAtom } from "../atoms";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { secondsInHour, secondsInQuarterHour } from "../shared/consts";
import { ExpandIcon, ShuffleIcon } from "lucide-react";

function Timer() {
  const params = useParams();
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [themeMap] = useAtom(themeMapAtom);
  const [themeIds] = useAtom(themeIdsAtom);
  const [addedTask] = useAtom(addedTaskAtom);

  const otherThemeIds = themeIds.filter((id) => id !== params.encodedURL);
  const randomThemeId =
    otherThemeIds[Math.floor(Math.random() * otherThemeIds.length)];

  const url = decodeURIComponent(params.encodedURL!);
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
      <div className="bg-neutral-900 text-neutral-400 flex">
        <div className="flex">
          <Link
            to="/"
            className="px-1 pl-3 py-2 text-neutral-200 font-bold hover:text-white hover:underline"
          >
            Timer
          </Link>
          <div className="px-1 py-2 text-neutral-400">{meta.name}</div>
        </div>
        <div className="text-neutral-400 justify-end flex gap-2 items-center grow text-right">
          <Link
            to={`/skin/${encodeURIComponent(randomThemeId)}`}
            className="px-1 py-2 hover:text-white"
          >
            <ShuffleIcon size={14} />
          </Link>
          <Link
            className="px-1 py-2 pr-3 hover:text-white"
            to={`/fullscreen/${encodeURIComponent(url)}`}
          >
            <ExpandIcon size={14} />
          </Link>
        </div>
      </div>

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

export default Timer;

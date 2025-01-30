import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  currentSecondsAtom,
  galleryCursorAtom,
  galleryPerPageAtom,
  themeIdsAtom,
  themeMapAtom,
} from "../atoms";
import { secondsInHour, secondsInQuarterHour } from "../shared/consts";
import { FullscreenIcon, ScanIcon } from "lucide-react";

function Landing() {
  const [iframes, setIframes] = useState<Record<string, HTMLIFrameElement>>({});
  const [currentSeconds, setCurrentSeconds] = useAtom(currentSecondsAtom);
  const [themeMap] = useAtom(themeMapAtom);
  const [themeIds] = useAtom(themeIdsAtom);
  const [galleryPerPage] = useAtom(galleryPerPageAtom);
  const [galleryCursor] = useAtom(galleryCursorAtom);

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
      <Header />
      <div
        className="grow grid gap-px bg-neutral-800 border border-neutral-800 w-full h-full"
        style={{
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {themeIds.slice(galleryCursor, galleryPerPage).map((id) => {
          const theme = themeMap[id];
          return (
            <div className="flex flex-col" key={theme.url}>
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
            </div>
          );
        })}
      </div>

      <Banner />
      <GalleryFooter />
    </div>
  );
}

export function Header() {
  const [themeIds] = useAtom(themeIdsAtom);

  return (
    <div className="flex items-center justify-between bg-neutral-900">
      <div className="px-3 py-2">
        <Link to="/" className="font-bold">
          Timer
        </Link>
        <div className="italic text-neutral-400">Skinnable focus timers</div>
      </div>
      <div className="flex flex-col items-end">
        <div className="px-3 pr-5 text-neutral-400">
          {themeIds.length} skins
        </div>
        <div className="px-3 pr-5 text-neutral-400">Add your own</div>
      </div>
    </div>
  );
}

export function Banner() {
  return (
    <div className="bg-neutral-700 px-3 py-2 text-white">
      <div>Currently showing an example task</div>
      <div>Add your own task</div>
    </div>
  );
}

export function GalleryFooter() {
  const [galleryCursor, setGalleryCursor] = useAtom(galleryCursorAtom);
  const [galleryPerPage] = useAtom(galleryPerPageAtom);
  const [themeIds] = useAtom(themeIdsAtom);

  return (
    <div className="flex items-center justify-between bg-neutral-900 px-3 py-2 text-neutral-400 text-sm">
      <div>
        Page {galleryCursor / galleryPerPage + 1} of{" "}
        {Math.ceil(themeIds.length / galleryPerPage)}
      </div>
      <div className="flex gap-2">
        {galleryCursor > 0 && (
          <button
            onClick={() => {
              setGalleryCursor((prev) => prev - galleryPerPage);
            }}
          >
            Previous
          </button>
        )}
        {galleryCursor + galleryPerPage < themeIds.length && (
          <button
            onClick={() => {
              setGalleryCursor((prev) => prev + galleryPerPage);
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Landing;

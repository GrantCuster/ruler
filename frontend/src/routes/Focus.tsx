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
        to={`/fullscreen/${params.encodedURL}`}
        className="bg-neutral-900 text-neutral-400 flex hover:bg-neutral-800 hover:text-neutral-300 cursor-pointer"
      >
        <div className="px-3 py-2 text-sm">
          {meta.name}

          <div className="text-neutral-500 text-sm">{url}</div>
        </div>
        <div className="px-3 py-2 text-neutral-400 justify-end flex gap-2 items-center text-sm grow text-right">
          <div>
            <ScanIcon size={13} />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function fullscreen() {
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
        to={`/fullscreen/${params.encodedURL}`}
        className="bg-neutral-900 text-neutral-400 flex hover:bg-neutral-800 hover:text-neutral-300 cursor-pointer"
      >
        <div className="px-3 py-2 text-sm">
          {meta.name}

          <div className="text-neutral-500 text-sm">{url}</div>
        </div>
        <div className="px-3 py-2 text-neutral-400 justify-end flex gap-2 items-center text-sm grow text-right">
          <div>
            <ScanIcon size={13} />
          </div>
        </div>
      </Link>
    </div>
  );
}



// function FocusIframe() {
//   const [selectedTheme] = useAtom(selectedThemeAtom);
//   const [currentSeconds] = useAtom(currentSecondsAtom);
//   const [entries] = useAtom(entriesAtom);
//   const [iframeLoaded, setIframeLoaded] = useAtom(iframeLoadedAtom);
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//
//   // TODO: sort by start time so you can do next?
//   // would need to figbure out overlap issues
//
//   let activeEntry = null;
//   for (let i = 0; i < entries.length; i++) {
//     const entry = entries[i];
//     if (
//       entry.startTime <= currentSeconds &&
//       entry.startTime + entry.duration >= currentSeconds
//     ) {
//       activeEntry = entries[i];
//     }
//   }
//
//   useEffect(() => {
//     setIframeLoaded(false);
//   }, []);
//
//   useEffect(() => {
//     if (iframeRef.current) {
//       iframeRef.current.contentWindow?.postMessage(
//         {
//           type: "DATA",
//           payload: {
//             currentSeconds,
//             activeEntry,
//           },
//         },
//         "*",
//       );
//     }
//   }, [iframeRef, currentSeconds]);
//
//   return (
//     <iframe
//       className="w-full h-full bg-black hidden"
//       ref={iframeRef}
//       src={selectedTheme.url}
//       style={{
//         border: "none",
//         display: iframeLoaded ? "block" : "none",
//       }}
//       onLoad={() => {
//         setIframeLoaded(true);
//       }}
//     ></iframe>
//   );
// }
//
// function ThemeSwitcher() {
//   const [selectedTheme, setSelectedTheme] = useAtom(selectedThemeAtom);
//   const [themes] = useAtom(themesAtom);
//   const [, setIframeLoaded] = useAtom(iframeLoadedAtom);
//
//   return (
//     <div className="w-[260px] h-full border-r border-neutral-600">
//       <div className="py-2 px-2 text-sm uppercase">Themes</div>
//       {themes.map((theme) => {
//         return (
//           <button
//             key={theme.name}
//             className={`block w-full py-1 text-left px-3 ${selectedTheme.name === theme.name ? "bg-neutral-700" : ""}`}
//             onClick={() => {
//               if (theme.name !== selectedTheme.name) {
//                 setIframeLoaded(false);
//                 setSelectedTheme(theme);
//               }
//             }}
//           >
//             {theme.name}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

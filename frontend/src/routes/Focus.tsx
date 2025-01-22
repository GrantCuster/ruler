import {
  currentSecondsAtom,
  entriesAtom,
  iframeLoadedAtom,
  selectedThemeAtom,
  themesAtom,
} from "../atoms";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { HandleTick } from "./HandleTick";

export function Focus() {
  const params = useParams();

  const showSwitcher = params.option === "switcher";

  return (
    <div className="grow flex">
      <HandleTick />
      {showSwitcher ? <ThemeSwitcher /> : null}
      <div className="grow relative h-full">
        <FocusIframe />
      </div>
      <div className="fixed right-6 bottom-6 flex z-50">
        <div className="flex bg-neutral-800 rounded-full border border-neutral-700">
          <Link
            className="w-12 h-12 items-center justify-center flex rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
            to={showSwitcher ? "/" : "switcher"}
          >
            🎨
          </Link>
          <Link
            className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
            to="/calendar"
          >
            🗓️
          </Link>
        </div>
      </div>
    </div>
  );
}

function FocusIframe() {
  const [selectedTheme] = useAtom(selectedThemeAtom);
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [entries] = useAtom(entriesAtom);
  const [iframeLoaded, setIframeLoaded] = useAtom(iframeLoadedAtom);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // TODO: sort by start time so you can do next?
  // would need to figbure out overlap issues

  let activeEntry = null;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (
      entry.startTime <= currentSeconds &&
      entry.startTime + entry.duration >= currentSeconds
    ) {
      activeEntry = entries[i];
    }
  }

  useEffect(() => {
    setIframeLoaded(false);
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: "DATA",
          payload: {
            currentSeconds,
            activeEntry,
          },
        },
        "*",
      );
    }
  }, [iframeRef, currentSeconds]);

  return (
    <iframe
      className="w-full h-full bg-black hidden"
      ref={iframeRef}
      src={selectedTheme.url}
      style={{
        border: "none",
        display: iframeLoaded ? "block" : "none",
      }}
      onLoad={() => {
        setIframeLoaded(true);
      }}
    ></iframe>
  );
}

function ThemeSwitcher() {
  const [selectedTheme, setSelectedTheme] = useAtom(selectedThemeAtom);
  const [themes] = useAtom(themesAtom);
  const [, setIframeLoaded] = useAtom(iframeLoadedAtom);

  return (
    <div className="w-[260px] h-full border-r border-neutral-600">
      <div className="py-2 px-2 text-sm uppercase">Themes</div>
      {themes.map((theme) => {
        return (
          <button
            key={theme.name}
            className={`block w-full py-1 text-left px-3 ${selectedTheme.name === theme.name ? "bg-neutral-700" : ""}`}
            onClick={() => {
              if (theme.name !== selectedTheme.name) {
                setIframeLoaded(false);
                setSelectedTheme(theme);
              }
            }}
          >
            {theme.name}
          </button>
        );
      })}
    </div>
  );
}

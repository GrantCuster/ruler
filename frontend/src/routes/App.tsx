import {
  currentSecondsAtom,
  entriesAtom,
  iframeLoadedAtom,
  selectedThemeAtom,
  showCalendarAtom,
  showPaletteAtom,
  themesAtom,
} from "../atoms";
import { useAtom } from "jotai";
import { HandleTick } from "./HandleTick";
import { Calendar } from "./Calendar";
import { useEffect, useRef, useState } from "react";

export function App() {
  const [showCalendar] = useAtom(showCalendarAtom);

  return (
    <>
      <HandleTick />
      {showCalendar ? <Calendar /> : <Focus />}
      <Toolbar />
    </>
  );
}

function Focus() {
  const [showPalette] = useAtom(showPaletteAtom);
  return (
    <div className="grow flex">
      {showPalette ? <ThemeSwitcher /> : null}
      <div className="grow relative h-full">
        <ChosenFocus />
      </div>
    </div>
  );
}

function ThemeSwitcher() {
  const [selectedTheme, setSelectedTheme] = useAtom(selectedThemeAtom);
  const [themes] = useAtom(themesAtom);
  const [, setIframeLoaded] = useAtom(iframeLoadedAtom);

  console.log(themes);

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

function ChosenFocus() {
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

function Toolbar() {
  const [showCalendar, setShowCalendar] = useAtom(showCalendarAtom);
  const [showPalette, setShowPalette] = useAtom(showPaletteAtom);

  const showFocus = !showCalendar;

  return (
    <div className="fixed right-6 bottom-6 flex z-50">
      <div className="flex bg-neutral-800 rounded-full border border-neutral-700">
        {showFocus ? (
          <button
            className="w-12 h-12 items-center justify-center flex rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
            onClick={() => setShowPalette(!showPalette)}
          >
            🎨
          </button>
        ) : null}
        <button
          className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
          onClick={() => {
            setShowCalendar(false);
          }}
        >
          ⏳
        </button>

        <button
          className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
          onClick={() => {
            setShowCalendar(true);
          }}
        >
          🗓️
        </button>
      </div>
    </div>
  );
}

import {
  currentSecondsAtom,
  entriesAtom,
  selectedThemeAtom,
  showCalendarAtom,
  showPaletteAtom,
} from "../atoms";
import { useAtom } from "jotai";
import { HandleTick } from "./HandleTick";
import { Calendar } from "./Calendar";
import { TimeLineForEntry } from "./Progress";
import { TimeLineDebug } from "./Debug";
import { themes } from "../shared/consts";

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

  return (
    <div className="w-[260px] h-full">
      <div className="px-3 py-1">Themes</div>
      {themes.map((themeName) => {
        return (
          <button
            className={`block w-full py-1 text-left px-3 ${selectedTheme === themeName ? "bg-neutral-700" : ""}`}
            onClick={() => setSelectedTheme(themeName)}
          >
            {themeName}
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

  if (selectedTheme === "progress") {
    return <TimeLineForEntry entry={activeEntry} />;
  } else {
    return <TimeLineDebug entry={activeEntry} />;
  }
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

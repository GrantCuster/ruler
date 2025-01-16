import {
  currentSecondsAtom,
  entriesAtom,
  focusModeAtom,
  selectedThemeAtom,
  showCalendarAtom,
  showPaletteAtom,
} from "../atoms";
import { useAtom } from "jotai";
import { HandleTick } from "./HandleTick";
import { Calendar } from "./Calendar";
import { TimeLineForEntry } from "./Progress";
import { TimeLineDebug } from "./Debug";

export function App() {
  const [showCalendar] = useAtom(showCalendarAtom);
  const [showPalette] = useAtom(showPaletteAtom);

  return (
    <>
      <HandleTick />
      {showCalendar && !showPalette ? (
        <Calendar />
      ) : (
        <Focus />
      )}
      <Toolbar />
    </>
  );
}

function Focus() {
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

  console.log("selectedTheme", selectedTheme);

  if (selectedTheme === "progress") {
    return <TimeLineForEntry entry={activeEntry} />;
  } else {
    return <TimeLineDebug entry={activeEntry} />;
  }
}

function Toolbar() {
  const [, setShowCalendar] = useAtom(showCalendarAtom);
  const [showPalette, setShowPalette] = useAtom(showPaletteAtom);

  return (
    <div className="fixed right-6 bottom-6 flex z-50">
      <div className="flex bg-neutral-800 rounded-full border border-neutral-700">
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
        <button
          className="w-12 h-12 items-center justify-center flex rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
          onClick={() => setShowPalette(!showPalette)}
        >
          🎨
        </button>
      </div>
    </div>
  );
}


import { currentSecondsAtom, entriesAtom, focusModeAtom, selectedThemeAtom, showFormAtom } from "../atoms";
import { TimelineForDay } from "./TimelineForDay";
import { EntryType } from "../types";
import { TimeLineForEntry } from "./Progress";
import { TimeLineDebug } from "./Debug";
import { useAtom } from "jotai";

export function Timeline() {
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [entries] = useAtom(entriesAtom);
  const [focusMode] = useAtom(focusModeAtom);
  const [addForm] = useAtom(showFormAtom);

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

  return (focusMode && !addForm) ? (
    <TimelineContainer entry={activeEntry} />
  ) : (
    <TimelineForDay />
  );
}

export function TimelineContainer({ entry }: { entry: EntryType | null }) {
  const [selectedTheme] = useAtom(selectedThemeAtom);

  console.log("selectedTheme", selectedTheme);

  if (selectedTheme === "progress") {
    return <TimeLineForEntry entry={entry} />;
  } else {
    return <TimeLineDebug entry={entry} />;
  }
}

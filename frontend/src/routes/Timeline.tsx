import { useAtom } from "jotai";
import { currentSecondsAtom, entriesAtom } from "../atoms";
import { TimelineForDay } from "./TimelineForDay";
import { TimeLineForEntry } from "./TimeLineForEntry";

export function Timeline() {
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [entries] = useAtom(entriesAtom);

  let activeEntry = null;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.startTime <= currentSeconds &&
      entry.startTime + entry.duration >= currentSeconds) {
      activeEntry = i;
    }
  }

  return activeEntry !== null ? (
    <TimeLineForEntry entry={entries[activeEntry]} />
  ) : (
    <TimelineForDay />
  );
}


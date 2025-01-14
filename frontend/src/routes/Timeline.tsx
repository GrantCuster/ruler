import { useAtom } from "jotai";
import { currentSecondsAtom, entriesAtom } from "../atoms";
import { TimelineForDay } from "./TimelineForDay";
import { TimeLineForEntry } from "./TimeLineForEntry";
import { EntryType } from "../types";
import { TimeLineDebug } from "./TimeLineDebug";

export function Timeline() {
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [entries] = useAtom(entriesAtom);

  let activeEntry = null;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (
      entry.startTime <= currentSeconds &&
      entry.startTime + entry.duration >= currentSeconds
    ) {
      activeEntry = i;
    }
  }

  return activeEntry !== null ? (
    <TimelineContainer entry={entries[activeEntry]} />
  ) : (
    <TimelineForDay />
  );
}

export function TimelineContainer({ entry }: { entry: EntryType }) {
  // return <TimeLineForEntry entry={entry} />;
  return <TimeLineDebug entry={entry} />;
}

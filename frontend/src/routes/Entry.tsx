import { useAtom } from "jotai";
import { EntryType } from "../types";
import { secondsInDay } from "../shared/consts";
import { currentSecondsAtom } from "../atoms";

export function Entry({ entry }: { entry: EntryType; }) {
  const [currentSeconds] = useAtom(currentSecondsAtom);

  const flooredDay = Math.floor(currentSeconds / secondsInDay) * secondsInDay;

  return (
    <div
      className="absolute left-0 top-0 w-full h-full bg-blue-500 opacity-50"
      style={{
        top: ((entry.startTime - flooredDay) / secondsInDay) * 100 + "%",
        height: (entry.duration / secondsInDay) * 100 + "%",
      }}
    >
      {entry.label}
    </div>
  );
}


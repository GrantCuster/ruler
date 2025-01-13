import { useAtom } from "jotai";
import { EntryType } from "../types";
import { secondsInDay } from "../shared/consts";
import { currentSecondsAtom, dateNowAtom } from "../atoms";

export function Entry({ entry }: { entry: EntryType; }) {
  const [currentSeconds] = useAtom(currentSecondsAtom);

  const flooredDay = Math.floor(currentSeconds / secondsInDay) * secondsInDay;

  return (
    <div
      className="absolute left-0 top-0 w-1/12 h-full bg-blue-500 opacity-50"
      style={{
        left: ((entry.startTime - flooredDay) / secondsInDay) * 100 + "%",
        width: (entry.duration / secondsInDay) * 100 + "%",
      }}
    >
      {entry.label}
    </div>
  );
}


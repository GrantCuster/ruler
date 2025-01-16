import { EntryType } from "../types";
import {  secondsInHour } from "../shared/consts";

export function Entry({
  entry,
  hourWindow,
  flooredSeconds,
}: {
  entry: EntryType;
  hourWindow: number;
  flooredSeconds: number;
}) {
  const secondsWindow = hourWindow * secondsInHour;

  return (
    <div
      className="absolute left-0 top-0 w-full h-full bg-blue-500 opacity-90 text-sm"
      style={{
        top: ((entry.startTime - flooredSeconds) / secondsWindow) * 100 + "%",
        height: (entry.duration / secondsWindow) * 100 + "%",
      }}
    >
      {entry.label}
    </div>
  );
}

import { EntryType } from "../types";
import { secondsInHour } from "../shared/consts";
import { secondsToReadableDuration, secondsToReadableTime } from "../shared/utils";

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
      className="absolute w-full bg-blue-600 bg-opacity-90 text-white border-2 border-blue-600 px-3 py-2"
      style={{
        top: ((entry.startTime - flooredSeconds) / secondsWindow) * 100 + "%",
        height: (entry.duration / secondsWindow) * 100 + "%",
      }}
    >
      <div className="text-xs text-blue-300">
        {secondsToReadableTime(entry.startTime)} - {secondsToReadableDuration(entry.duration)}
      </div>
      {entry.label}
    </div>
  );
}

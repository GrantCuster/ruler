import { useAtom } from "jotai";
import { currentSecondsAtom } from "../atoms";
import { EntryType } from "../types";
import { secondsToReadableTime } from "../shared/utils";

export function TimeLineDebug({ entry }: { entry: EntryType | null }) {
  const [currentSeconds] = useAtom(currentSecondsAtom);

  return (
    <div className="absolute inset-0 flex justify-center items-center">
      {entry ? <WithEntry entry={entry} /> : <WithoutEntry />}
    </div>
  );
}

function WithoutEntry() {
  const [currentSeconds] = useAtom(currentSecondsAtom);

  return <div>{secondsToReadableTime(currentSeconds)} debug</div>;
}

function WithEntry({ entry }: { entry: EntryType }) {
  const [currentSeconds] = useAtom(currentSecondsAtom);

  const percent =
    Math.round(((currentSeconds - entry.startTime) / entry.duration) * 10000) /
    100 +
    "%";

  return (
    <div className="flex flex-col items-center font-mono">
      <div>{secondsToReadableTime(currentSeconds)}</div>
      <div>{percent}</div>
      <div>{secondsToReadableTime(entry.startTime)} - {secondsToReadableTime(entry.startTime + entry.duration)}</div>
    </div>
  );
}

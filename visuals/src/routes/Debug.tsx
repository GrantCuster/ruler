import { EntryType } from "../types";
import { secondsToReadableTime } from "../shared/utils";

export function Debug({
  entry,
  currentSeconds,
}: {
  entry: EntryType | null;
  currentSeconds: number;
}) {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      {entry ? (
        <WithEntry currentSeconds={currentSeconds} entry={entry} />
      ) : (
        <WithoutEntry currentSeconds={currentSeconds} />
      )}
    </div>
  );
}

function WithoutEntry({ currentSeconds }: { currentSeconds: number }) {
  return <div>{secondsToReadableTime(currentSeconds)} debug</div>;
}

function WithEntry({
  entry,
  currentSeconds,
}: {
  entry: EntryType;
  currentSeconds: number;
}) {
  const percent =
    Math.round(((currentSeconds - entry.startTime) / entry.duration) * 10000) /
    100 +
    "%";

  return (
    <div className="flex flex-col items-center font-mono">
      <div>{secondsToReadableTime(currentSeconds)}</div>
      <div>{entry.label}</div>
      <div>{percent}</div>
      <div>
        {secondsToReadableTime(entry.startTime)} -{" "}
        {secondsToReadableTime(entry.startTime + entry.duration)}
      </div>
    </div>
  );
}

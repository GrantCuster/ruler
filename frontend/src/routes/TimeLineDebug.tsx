import { useAtom } from "jotai";
import { currentSecondsAtom, dateNowAtom } from "../atoms";
import { EntryType } from "../types";
import { dateToReadableTime, secondsToReadableTime } from "../shared/utils";

export function TimeLineDebug({ entry }: { entry: EntryType }) {
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [dateNow] = useAtom(dateNowAtom);

  const percent =
    Math.round(((currentSeconds - entry.startTime) / entry.duration) * 1000) /
      10 +
    "%";

  return <div className="absolute inset-0 ">{currentSeconds}</div>;
}

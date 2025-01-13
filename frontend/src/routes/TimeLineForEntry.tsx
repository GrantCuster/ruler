import { useAtom } from "jotai";
import { currentSecondsAtom, dateNowAtom, timezoneOffsetAtom } from "../atoms";
import { EntryType } from "../types";
import { dateToReadableTime, secondsToReadableTime } from "../shared/utils";

export function TimeLineForEntry({ entry }: { entry: EntryType }) {
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [dateNow] = useAtom(dateNowAtom);
  const [timezoneOffset] = useAtom(timezoneOffsetAtom);

  const restoreTimezone = (seconds: number) => seconds - timezoneOffset;

  return (
    <div className="absolute inset-0 flex flex-col justify-between">
      <div
        className="absolute left-0 top-0 h-full bg-orange-700"
        style={{
          width:
            ((currentSeconds - entry.startTime) / entry.duration) * 100 + "%",
        }}
      ></div>
      <div className="relative text-2xl px-3 py-2 text-center grow flex items-center justify-center">
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.1,
          }}
        >
          {entry.label}
        </div>
      </div>
      <div className="flex relative justify-between w-full px-3 py-2">
        <div className="text-2xl text-center relative">
          <div>{secondsToReadableTime(restoreTimezone(entry.startTime))}</div>
        </div>
        <div className="text-2xl text-center relative">
          <div className="flex items-baseline">
            <div>{dateToReadableTime(dateNow).split(" ")[0]}</div>
            <div className="text-lg">
              :{(currentSeconds % 60).toString().padStart(2, "0")}
            </div>
            <div className="ml-2 text-sm uppercase">{dateToReadableTime(dateNow).split(" ")[1]}</div>
          </div>
        </div>
        <div className="text-2xl text-center relative">
          {secondsToReadableTime(
            restoreTimezone(entry.startTime + entry.duration),
          )}
        </div>
      </div>
    </div>
  );
}

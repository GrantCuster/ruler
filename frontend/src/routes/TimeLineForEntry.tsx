import { useAtom } from "jotai";
import { currentSecondsAtom, dateNowAtom } from "../atoms";
import { EntryType } from "../types";
import { dateToReadableTime, secondsToReadableTime } from "../shared/utils";

export function TimeLineForEntry({ entry }: { entry: EntryType | null }) {
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [dateNow] = useAtom(dateNowAtom);

  if (!entry) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <div>no entry</div>
      </div>
    );
  }

  const percent =
    Math.round(((currentSeconds - entry.startTime) / entry.duration) * 100) +
    "%";

  return (
    <div className="absolute inset-0 flex flex-col justify-between">
      <div className="text-center px-3 py-2 font-mono">{percent}</div>
      <div
        className="absolute left-0 top-0 h-full bg-orange-700"
        style={{
          width:
            ((currentSeconds - entry.startTime) / entry.duration) * 100 + "%",
        }}
      ></div>
      <div className="relative text-2xl px-3 py-2 text-center grow flex items-center justify-center">
        <div>
          <div>{entry.label}</div>
          <div className="hidden">{percent}</div>
        </div>
      </div>
      <div className="flex relative justify-between items-baseline w-full px-3 py-2">
        <div className="text-center relative uppercase">
          <div>
            {secondsToReadableTime(entry.startTime)
              .split(" ")
              .map((text, i) => {
                return (
                  <span className={i === 1 ? "text-base" : ""}>
                    {text}
                    {` `}
                  </span>
                );
              })}
          </div>
        </div>
        <div className="text-center relative font-mono">
          <div className="flex items-baseline">
            <div className="">{dateToReadableTime(dateNow).split(" ")[0]}</div>
            <div className="text-base">
              :{(currentSeconds % 60).toString().padStart(2, "0")}
            </div>
            <div className="ml-2 text-base uppercase">
              {dateToReadableTime(dateNow).split(" ")[1]}
            </div>
          </div>
        </div>
        <div className="text-center relative uppercase">
          {secondsToReadableTime(entry.startTime + entry.duration)
            .split(" ")
            .map((text, i) => {
              return (
                <span className={i === 1 ? "text-base" : ""}>
                  {text}
                  {` `}
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
}

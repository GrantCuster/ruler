import { useAtom } from "jotai";
import { entriesAtom, currentSecondsAtom } from "../atoms";
import { secondsInDay } from "../shared/consts";
import { Entry } from "./Entry";

export function TimelineForDay() {
  const [entries] = useAtom(entriesAtom);
  const [currentSeconds] = useAtom(currentSecondsAtom);

  // TODO figure out the timezone issue
  const flooredDay = Math.floor(currentSeconds / secondsInDay) * secondsInDay;
  const percent = (currentSeconds - flooredDay) / secondsInDay;

  return (
    <>
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full bottom-0 h-[2px] bg-neutral-700"
          style={{ top: `calc(${(i / 24) * 100}% - 1px)` }}
        ></div>
      ))}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full left-0 h-[2px] bg-neutral-800"
          style={{ top: `calc(${((i + 0.5) / 24) * 100}% - 1px)` }}
        ></div>
      ))}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full left-0 h-[2px] bg-neutral-900"
          style={{ left: `calc(${((i + 0.25) / 24) * 100}% - 1px)` }}
        ></div>
      ))}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full left-0 h-[2px] bg-neutral-900"
          style={{ top: `calc(${((i + 0.75) / 24) * 100}% - 1px)` }}
        ></div>
      ))}
      <div
        className="bg-red-500 h-[2px] w-[100%] absolute"
        style={{ top: percent * 100 + "%" }}
      ></div>
      {entries.map((entry, i) => {
        return <Entry key={i} entry={entry} />;
      })}
    </>
  );
}

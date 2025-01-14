import { useAtom } from "jotai";
import {
  showFormAtom,
  entriesAtom,
  currentSecondsAtom,
  timezoneOffsetAtom,
} from "../atoms";
import { secondsInDay, secondsInHour } from "../shared/consts";
import { AddForm } from "./AddForm";
import { Entry } from "./Entry";
import { secondsToReadableTime } from "../shared/utils";

export function TimelineForDay() {
  const [showForm] = useAtom(showFormAtom);
  const [entries] = useAtom(entriesAtom);
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [timezoneOffset] = useAtom(timezoneOffsetAtom);

  // TODO figure out the timezone issue
  const flooredDay =
    Math.floor(currentSeconds / secondsInDay) *
    secondsInDay;
  const percent = (currentSeconds - flooredDay) / secondsInDay;

  return (
    <>
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute h-full bottom-0 w-[2px] bg-neutral-700"
          style={{ left: `calc(${(i / 24) * 100}% - 1px)` }}
        ></div>
      ))}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute h-full bottom-0 w-[2px] bg-neutral-800"
          style={{ left: `calc(${((i + 0.5) / 24) * 100}% - 1px)` }}
        ></div>
      ))}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute h-full bottom-0 w-[2px] bg-neutral-900"
          style={{ left: `calc(${((i + 0.25) / 24) * 100}% - 1px)` }}
        ></div>
      ))}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute h-full bottom-0 w-[2px] bg-neutral-900"
          style={{ left: `calc(${((i + 0.75) / 24) * 100}% - 1px)` }}
        ></div>
      ))}
      <div
        className="bg-red-500 w-[2px] h-[100%] absolute top-0 left-[calc(50%-1px)]"
        style={{ left: percent * 100 + "%" }}
      ></div>
      {entries.map((entry, i) => {
        return <Entry key={i} entry={entry} />;
      })}
    </>
  );
}

import { useAtom } from "jotai";
import { entriesAtom, currentSecondsAtom } from "../atoms";
import { secondsInDay, secondsInHour } from "../shared/consts";
import { Entry } from "./Entry";
import { AddForm } from "./AddForm";

export function Calendar() {
  const [entries] = useAtom(entriesAtom);
  const [currentSeconds] = useAtom(currentSecondsAtom);

  const hourWindow = 6;
  const hourWindowSeconds = hourWindow * secondsInHour;

  // sliding four hour window
  const flooredHour =
    Math.floor(currentSeconds / secondsInHour) * secondsInHour;
  const prevHour = flooredHour - secondsInHour;
  const percent = (currentSeconds - prevHour) / hourWindowSeconds;

  return (
    <div className="flex grow relative">
      <div className="flex grow relative">
        {[...Array(hourWindow)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full bottom-0 h-[2px] bg-neutral-700"
            style={{ top: `calc(${(i / hourWindow) * 100}% - 1px)` }}
          ></div>
        ))}
        {entries.map((entry, i) => {
          return (
            <Entry
              key={i}
              entry={entry}
              hourWindow={hourWindow}
              flooredSeconds={prevHour}
            />
          );
        })}
        <div
          className="bg-red-500 h-[2px] w-[100%] absolute"
          style={{ top: percent * 100 + "%" }}
        ></div>
      </div>
      <AddForm />
    </div>
  );
}

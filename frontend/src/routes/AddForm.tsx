import { useEffect, useState } from "react";
import { currentSecondsAtom, entriesAtom, showFormAtom } from "../atoms";
import { useAtom } from "jotai";
import { v4 as uuid } from "uuid";
import { EntryType } from "../types";
import {
  secondsInDay,
  secondsInHour,
  secondsInQuarterHour,
} from "../shared/consts";

export function AddForm() {
  const [entries, setEntries] = useAtom(entriesAtom);
  const [duration, setDuration] = useState(0.5);
  const [label, setLabel] = useState("test");
  const [, setShowForm] = useAtom(showFormAtom);
  const [currentSeconds] = useAtom(currentSecondsAtom);

  const nearestFifteen =
    Math.floor(currentSeconds / secondsInQuarterHour) * secondsInQuarterHour;
  const flooredDay = Math.floor(currentSeconds / secondsInDay) * secondsInDay;

  const [startTime, setStartTime] = useState(nearestFifteen);

  function handleSubmit() {
    setEntries((prev) => {
      return [
        ...prev,
        {
          // TODO use actual start time
          startTime: nearestFifteen,
          duration: duration * secondsInHour,
          label: label,
          id: uuid(),
        } as EntryType,
      ];
    });
    setShowForm(false);
  }

  useEffect(() => {
    function keydownHandler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowForm(false);
      }
    }
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-neutral-500 bg-opacity-10 flex items-center justify-center">
      <div className="bg-neutral-800 w-full max-w-[640px] flex flex-col">
        <div className="px-3 py-2">
          <select
            className="w-full px-3 py-2"
            value={startTime.toString()}
            onChange={(e) => {
              setStartTime(parseInt(e.target.value));
            }}
          >
            {[...Array(5)].map((_, i) => {
              return (
                <option value={nearestFifteen + secondsInQuarterHour * i}>
                  {(nearestFifteen - flooredDay + secondsInQuarterHour * i) /
                    secondsInHour}
                </option>
              );
            })}
          </select>
        </div>
        <div className="px-3 py-2">
          <select className="w-full px-3 py-2" value={duration}>
            {[...Array(8)].map((_, i) => {
              return <option>{0.25 * i + 0.25}</option>;
            })}
          </select>
        </div>
        <div className="px-3 py-2">
          <input
            type="text"
            className="w-full px-3 py-2"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>
        <div className="px-3 py-2 flex justify-end">
          <button className="px-2 py-1 bg-neutral-900" onClick={handleSubmit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

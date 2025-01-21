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
import {
  secondsToReadableDurationLong,
  secondsToReadableTime,
} from "../shared/utils";

export function AddForm() {
  const [entries, setEntries] = useAtom(entriesAtom);
  const [duration, setDuration] = useState(0.5);
  const [label, setLabel] = useState("");
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
    <div className="w-[260px] h-full z-50 font-mono">
      <div className="bg-neutral-800 h-full flex flex-col gap-3 px-3">
        <div className="pt-4 px-2 text-sm uppercase">Add Timer Block</div>
        <div className="">
          <div className="text-xs mb-2 px-2 text-neutral-400 uppercase">
            Start Time
          </div>
          <select
            className="w-full py-2 px-3"
            value={startTime.toString()}
            onChange={(e) => {
              setStartTime(parseInt(e.target.value));
            }}
          >
            {[...Array(5)].map((_, i) => {
              return (
                <option value={nearestFifteen + secondsInQuarterHour * i}>
                  {secondsToReadableTime(
                    nearestFifteen - flooredDay + secondsInQuarterHour * i,
                  )}
                </option>
              );
            })}
          </select>
        </div>
        <div className="">
          <div className="text-xs mb-2 px-2 text-neutral-400 uppercase">
            Duration
          </div>
          <select
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="w-full py-2 px-3"
            value={duration}
          >
            {[...Array(8)].map((_, i) => {
              return (
                <option value={0.25 * i + 0.25}>
                  {secondsToReadableDurationLong(
                    (0.25 * i + 0.25) * secondsInHour,
                  )}
                </option>
              );
            })}
          </select>
        </div>
        <div className="">
          <div className="text-xs mb-2 px-2 text-neutral-400 uppercase">
            Label
          </div>
          <input
            type="text"
            className="w-full px-3 py-2"
            placeholder="Task name"
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
        <div className="gap-3 flex justify-end">
          <button
            className="px-3 py-2 underline text-neutral-300 hidden"
            onClick={handleSubmit}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-full bg-neutral-900"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

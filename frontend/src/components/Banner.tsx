import { useAtom } from "jotai";
import { addedTaskAtom, currentSecondsAtom } from "../atoms";
import { secondsInDay, secondsInQuarterHour } from "../shared/consts";
import { useState } from "react";
import {
  secondsToReadableDuration,
  secondsToReadableTime,
} from "../shared/utils";
import { v4 as uuid } from "uuid";

export function Banner() {
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [duration, setDuration] = useState(secondsInQuarterHour * 2);
  const nearestFifteen =
    Math.floor(currentSeconds / secondsInQuarterHour) * secondsInQuarterHour;
  const flooredDay = Math.floor(currentSeconds / secondsInDay) * secondsInDay;
  const [startTime, setStartTime] = useState(nearestFifteen);
  const [label, setLabel] = useState("");

  const [, setAddedTask] = useAtom(addedTaskAtom);

  function handleAddTask() {
    if (label.length > 0) {
      setAddedTask({
        id: uuid(),
        startTime,
        duration,
        label,
      });
    }
  }

  return (
    <div className="bg-neutral-700 px-3 py-2 text-neutral-200">
      <div className="flex gap-2 items-center justify-center">
        <div className="text-neutral-400 text-sm">Add your own task:</div>
        <select
          className="w-30 py-2 px-3 text-sm"
          value={startTime}
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
        <select
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          className="w-24 py-2 px-3 text-sm"
          value={duration}
        >
          {[...Array(4)].map((_, i) => {
            const value = (i + 1) * secondsInQuarterHour;
            return (
              <option value={value}>{secondsToReadableDuration(value)}</option>
            );
          })}
        </select>
        <input
          type="text"
          className="w-40 py-2 px-3 text-sm"
          placeholder="Label..."
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask;
            }
          }}
        />
        <button
          className="text-sm py-2 px-4 text-center rounded-full bg-neutral-900"
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>
    </div>
  );
}

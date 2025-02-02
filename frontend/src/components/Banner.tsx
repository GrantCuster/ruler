import { useAtom } from "jotai";
import { addedTaskAtom, currentSecondsAtom } from "../atoms";
import { secondsInDay, secondsInQuarterHour } from "../shared/consts";
import { useEffect, useRef, useState } from "react";
import {
  secondsToReadableDuration,
  secondsToReadableTime,
} from "../shared/utils";
import { v4 as uuid } from "uuid";

function Banner() {
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [duration, setDuration] = useState(secondsInQuarterHour * 2);
  const [label, setLabel] = useState("");
  const [startTime, setStartTime] = useState(0);

  const nearestFifteen =
    Math.floor(currentSeconds / secondsInQuarterHour) * secondsInQuarterHour;
  const flooredDay = Math.floor(currentSeconds / secondsInDay) * secondsInDay;

  const nearestFifteenRef = useRef(nearestFifteen);

  useEffect(() => {
    if (nearestFifteenRef.current !== nearestFifteen) {
      nearestFifteenRef.current = nearestFifteen;
      setStartTime(nearestFifteen);
    }
  }, [nearestFifteen]);

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
    <div className="bg-black py-2 border-b border-neutral-800">
      <div className="flex gap-2 items-center justify-center">
        <div className="text-neutral-400">Add your own task:</div>
        <select
          className="w-32 py-2 focus:outline-none"
          value={startTime}
          onChange={(e) => {
            setStartTime(parseInt(e.target.value));
          }}
        >
          {[...Array(5)].map((_, i) => {
            return (
              <option
                value={
                  nearestFifteen -
                  secondsInQuarterHour +
                  secondsInQuarterHour * i
                }
              >
                {secondsToReadableTime(
                  nearestFifteen -
                  flooredDay -
                  secondsInQuarterHour +
                  secondsInQuarterHour * i,
                )}
              </option>
            );
          })}
        </select>
        <select
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          className="w-24 py-2 focus:outline-none"
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
          className="w-40 py-2 px-3 focus:outline-none"
          placeholder="Label..."
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
        />
        <button
          className="text-center bg-neutral-900 hover:bg-neutral-800 py-2 px-3 rounded-full"
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default Banner;

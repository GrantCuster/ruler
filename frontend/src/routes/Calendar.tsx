import { useAtom } from "jotai";
import { entriesAtom, currentSecondsAtom } from "../atoms";
import {
  secondsInDay,
  secondsInHour,
  secondsInQuarterHour,
} from "../shared/consts";
import { v4 as uuid } from "uuid";
import {
  secondsToReadableDuration,
  secondsToReadableDurationLong,
  secondsToReadableTime,
} from "../shared/utils";
import { useEffect, useState } from "react";
import { EntryType } from "../types";
import { Link } from "react-router";

export function Calendar() {
  const [entries, setEntries] = useAtom(entriesAtom);
  const [duration, setDuration] = useState(0.5);
  const [label, setLabel] = useState("");
  const [currentSeconds] = useAtom(currentSecondsAtom);

  const nearestFifteen =
    Math.floor(currentSeconds / secondsInQuarterHour) * secondsInQuarterHour;
  const flooredDay = Math.floor(currentSeconds / secondsInDay) * secondsInDay;

  const [startTime, setStartTime] = useState(nearestFifteen);

  const hourWindow = 6;
  const hourWindowSeconds = hourWindow * secondsInHour;

  // sliding four hour window
  const flooredHour =
    Math.floor(currentSeconds / secondsInHour) * secondsInHour;
  const prevHour = flooredHour - secondsInHour;
  const percent = (currentSeconds - prevHour) / hourWindowSeconds;

  function handleSubmit() {
    setEntries((prev) => {
      return [
        ...prev,
        {
          startTime: startTime,
          duration: duration * secondsInHour,
          label: label,
          id: uuid(),
        } as EntryType,
      ];
    });
    setStartTime(nearestFifteen);
    setDuration(0.5);
    setLabel("");
  }

  return (
    <div className="flex grow relative flex-col md:flex-row">
      <div className="flex grow relative">
        {[...Array(hourWindow)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full bottom-0 h-[2px] bg-neutral-700"
            style={{ top: `calc(${(i / hourWindow) * 100}% - 1px)` }}
          >
            <div className="absolute left-0 top-[-6px] text-xs text-neutral-500 bg-black pl-2 pr-2">
              {i !== 0
                ? secondsToReadableTime(prevHour + i * secondsInHour)
                : ""}
            </div>
          </div>
        ))}
        {[...Array(hourWindow)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full bottom-0 h-[2px] border-b-2 border-dotted border-b-neutral-800"
            style={{ top: `calc(${((i + 0.5) / hourWindow) * 100}% - 1px)` }}
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
        {label.length > 0 ? (
          <div
            className="absolute bg-neutral-600 bg-opacity-90 text-neutral-100 border-2 border-neutral-500 px-3 py-2"
            style={{
              left: 24,
              right: 24,
              top: ((startTime - prevHour) / hourWindowSeconds) * 100 + "%",
              height: (duration / hourWindow) * 100 + "%",
            }}
          >
            <div className="text-xs text-neutral-400">
              {secondsToReadableTime(startTime)} -{" "}
              {secondsToReadableDuration(duration * secondsInHour)}
            </div>
            {label}
          </div>
        ) : null}
        <div
          className="bg-red-500 h-[2px] w-[100%] absolute"
          style={{ top: percent * 100 + "%" }}
        ></div>
      </div>
      <div className="w-full md:w-[300px] md:h-full z-50 font-mono">
        <div className="bg-neutral-800 h-full flex flex-col gap-3 px-3 pb-3">
          <div className="pt-4 px-2 text-sm uppercase">Add Timer Block</div>
          <div className="">
            <div className="text-xs mb-2 px-2 text-neutral-400 uppercase">
              Start Time
            </div>
            <select
              className="w-full py-2 px-3"
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
            <textarea
              className="w-full px-3 py-2"
              placeholder="Task name"
              rows={2}
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            ></textarea>
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
      <div className="fixed right-6 bottom-6 flex z-50">
        <div className="flex bg-neutral-800 rounded-full border border-neutral-700">
          <Link
            className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
            to="/"
          >
            ⏳
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Entry({
  entry,
  hourWindow,
  flooredSeconds,
}: {
  entry: EntryType;
  hourWindow: number;
  flooredSeconds: number;
}) {
  const secondsWindow = hourWindow * secondsInHour;

  return (
    <div
      className="absolute w-full bg-blue-600 bg-opacity-90 text-white border-2 border-blue-600 px-3 py-2"
      style={{
        top: ((entry.startTime - flooredSeconds) / secondsWindow) * 100 + "%",
        height: (entry.duration / secondsWindow) * 100 + "%",
      }}
    >
      <div className="text-xs text-blue-300">
        {secondsToReadableTime(entry.startTime)} -{" "}
        {secondsToReadableDuration(entry.duration)}
      </div>
      {entry.label}
    </div>
  );
}

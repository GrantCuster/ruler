import { useAtom } from "jotai";
import { secondsInHour, secondsInQuarterHour } from "./consts";
import { addedTaskAtom, currentSecondsAtom } from "../atoms";

export function dateToSeconds(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

// async load image
export async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}

export function getRandomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${hex.padStart(6, "0")}`;
}

export function dateToReadableTime(date: Date): string {
  let hours = date.getHours(); // Get the hour in 24-hour format
  const minutes = date.getMinutes(); // Get the minutes
  const amPm = hours >= 12 ? "pm" : "am"; // Determine am/pm

  // Convert to 12-hour format
  hours = hours % 12 || 12; // Adjust for 12-hour clock, handling midnight (0)

  // Format hours and minutes with leading zeroes if needed
  const formattedHours = hours.toString();
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

export function secondsToReadableTime(seconds: number): string {
  const timezoneOffset = new Date().getTimezoneOffset();
  const date = new Date((seconds + timezoneOffset * 60) * 1000); // Convert seconds to milliseconds

  return dateToReadableTime(date);
}

export function secondsToReadableDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let durationString = "";
  if (hours > 0) {
    durationString += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    durationString += `${minutes}m `;
  }
  if (remainingSeconds > 0 || durationString === "") {
    durationString += `${remainingSeconds}s`;
  }

  return durationString.trim();
}

export function secondsToReadableDurationLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let durationString = "";
  if (hours > 0) {
    durationString += `${hours} hours `;
  }
  if (minutes > 0) {
    durationString += `${minutes} minutes `;
  }
  if (remainingSeconds > 0 || durationString === "") {
    durationString += `${remainingSeconds}s`;
  }

  return durationString.trim();
}

export function useGetIframeData() {
  const [_currentSeconds] = useAtom(currentSecondsAtom);
  const [addedTask] = useAtom(addedTaskAtom);

  let currentSeconds = _currentSeconds;

  const nearestFifteen =
    Math.floor(currentSeconds / secondsInQuarterHour) * secondsInQuarterHour;

  let startTime = addedTask?.startTime || nearestFifteen;
  let duration = addedTask?.duration || secondsInHour / 2;
  let label = addedTask?.label || "Example";

  if (addedTask && startTime > currentSeconds) {
    startTime = nearestFifteen;
    duration = addedTask?.startTime - nearestFifteen;
    label = `Time until "${addedTask?.label}"`;
  }

  if (addedTask && startTime + duration < currentSeconds) {
    currentSeconds = startTime + duration;
  }

  return {
    type: "DATA",
    payload: {
      currentSeconds,
      startTime,
      duration,
      label,
    },
  };
}

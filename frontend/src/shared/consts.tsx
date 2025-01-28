import { ThemeType } from "../types";

export const secondsInHour = 3600;
export const secondsInQuarterHour = secondsInHour / 4;
export const secondsInDay = secondsInHour * 24;

export const standardThemes: ThemeType[] = [
  {
    name: "API",
    url: "http://localhost:4002/example-api",
  },
  {
    name: "Progress",
    url: "http://localhost:4002/progress",
  },
  {
    name: "Circle",
    url: "http://localhost:4002/circle",
  },
  {
    name: "Arc",
    url: "http://localhost:4002/arc",
  },
];

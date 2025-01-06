import { useEffect, useState } from "react";
import { getSeconds } from "../shared/utils";

export function App() {
  const [bump, setBump] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBump((bump) => bump + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const timeZoneOffset = now.getTimezoneOffset() * 60;
  const seconds = getSeconds(now) - timeZoneOffset;

  const hourSeconds = 3600;
  const daySeconds = 86400;

  const flooredDay = Math.floor(seconds / daySeconds) * daySeconds;
  const percent = (seconds - flooredDay) / daySeconds;

  return (
    <div className="w-full h-[100dvh]">
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
    </div>
  );
}

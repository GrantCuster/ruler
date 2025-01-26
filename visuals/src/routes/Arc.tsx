import { EntryType } from "../types";
import {
  dateToReadableTime,
  secondsToReadableDuration,
  secondsToReadableTime,
} from "../shared/utils";
import { useEffect, useRef } from "react";

export function Arc({
  entry,
  currentSeconds,
}: {
  entry: EntryType | null;
  currentSeconds: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!entry) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <div>{secondsToReadableTime(currentSeconds)}</div>
      </div>
    );
  }

  const fraction = (currentSeconds - entry.startTime) / entry.duration;
  const remainingTime = secondsToReadableDuration(
    entry.duration - (currentSeconds - entry.startTime),
  );
  const percent =
    Math.round(((currentSeconds - entry.startTime) / entry.duration) * 100) +
    "%";

  if (canvasRef.current) {
    const canvas = canvasRef.current!;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas?.getContext("2d")!;
    ctx.clearRect(0, 0, 400, 400);

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = "purple";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(200, 200, 180, Math.PI, fraction * 2 * Math.PI + Math.PI);
    ctx.stroke();
  }

  return (
    <div className="absolute left-0 top-0 h-full flex flex-col gap-4 w-full justify-center items-center">
      <canvas
        width={400}
        height={400}
        ref={canvasRef}
        style={{
          width: 400,
          height: 400,
        }}
      />
      <div>{percent}</div>
      <div>{entry.label}</div>
    </div>
  );
}

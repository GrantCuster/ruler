import { DataType, EntryType } from "../types";
import { dateToReadableTime, secondsToReadableTime } from "../shared/utils";

export function Progress({ data }: { data: DataType }) {
  const dateNow = new Date();

  const fraction = (data.currentSeconds - data.startTime) / data.duration;
  const percent = Math.round(((data.currentSeconds - data.startTime) / data.duration) * 100) + "%";

  return (
    <div className="absolute inset-0 flex flex-col justify-between">
      <div className="text-center px-3 py-2 font-mono">{percent}</div>
      <div
        className="absolute left-0 top-0 h-full bg-neutral-700"
        style={{
          width: fraction * 100 + "%",
        }}
      ></div>
      <div className="relative text-2xl px-3 py-2 text-center grow flex items-center justify-center">
        <div>
          <div>{data.label}</div>
          <div className="hidden">{percent}</div>
        </div>
      </div>
      <div className="flex relative justify-between items-baseline w-full px-3 py-2">
        <div className="text-center relative uppercase">
          <div>
            {secondsToReadableTime(data.startTime)
              .split(" ")
              .map((text, i) => {
                return (
                  <span className={i === 1 ? "text-base" : ""}>
                    {text}
                    {` `}
                  </span>
                );
              })}
          </div>
        </div>
        <div className="text-center relative font-mono">
          <div className="flex items-baseline">
            <div className="">{dateToReadableTime(dateNow).split(" ")[0]}</div>
            <div className="text-base">
              :{(data.currentSeconds % 60).toString().padStart(2, "0")}
            </div>
            <div className="ml-2 text-base uppercase">
              {dateToReadableTime(dateNow).split(" ")[1]}
            </div>
          </div>
        </div>
        <div className="text-center relative uppercase">
          {secondsToReadableTime(data.startTime + data.duration)
            .split(" ")
            .map((text, i) => {
              return (
                <span className={i === 1 ? "text-base" : ""}>
                  {text}
                  {` `}
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
}

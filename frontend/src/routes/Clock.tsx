import { useRef, useState, useEffect } from "react";
import { customDigitsAtom } from "../atoms";
import { useAtom } from "jotai";
import { ImageIcon } from "lucide-react";
import { ButtonLink } from "../components/Button";
import { Link } from "react-router";

export function Clock() {
  const intervalRef = useRef<number | null>(null);
  const [, setBump] = useState(0);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setBump((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const _hours = new Date().getHours();
  const minutes = new Date().getMinutes().toString().padStart(2, "0");
  const amppm = (_hours >= 12 ? "PM" : "AM").toString();
  const hours =
    _hours > 12
      ? (_hours - 12).toString().padStart(2, "0")
      : _hours.toString().padStart(2, "0");

  return (
    <div className="grow flex flex-col">
      <div className="grow px-8 flex">
        <div className="aspect-[121/40] flex items-end m-auto w-full">
          {hours[0] !== "0" ? (
            <DigitImage digit={hours[0]} />
          ) : (
            <div className="h-full w-full"></div>
          )}

          <DigitImage digit={hours[1]} />
          <Link
            to={`/creator/:`}
            className="h-full w-1/2 hover:outline hover:z-50 hover:outline-blue-500"
            style={{
              backgroundImage: 'url("/colon.jpg")',
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          ></Link>
          <DigitImage digit={minutes[0]} />
          <DigitImage digit={minutes[1]} />
          <Link
            to={`/creator/${amppm.toLowerCase()}`}
            className="h-1/2 w-full hover:outline hover:z-50 hover:outline-blue-500"
            style={{
              backgroundImage: `url("/${amppm.toLowerCase()}.jpg")`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          ></Link>
        </div>
      </div>
      <div className="justify-center hidden pb-4">
        <ButtonLink to="/chooser">
          <ImageIcon size={16} />
          Contribute
        </ButtonLink>
      </div>
    </div>
  );
}

function DigitImage({ digit }: { digit: string }) {
  const [customDigits] = useAtom(customDigitsAtom);

  const imageString =
    customDigits[digit as keyof typeof customDigits]?.replace(
      /(\r\n|\n|\r)/gm,
      "",
    ) || digit + ".jpg";

  return (
    <Link
      to={`/creator/${digit}`}
      className="h-full w-full hover:outline hover:z-50 relative hover:outline-blue-500"
      style={{
        backgroundImage: `url("${imageString}")`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    ></Link>
  );
}

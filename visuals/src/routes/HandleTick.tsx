import { useAtom } from "jotai";
import { useRef, useEffect } from "react";
import {
  currentSecondsAtom,
  dateNowAtom,
} from "../atoms";
import { dateToSeconds } from "../shared/utils";

export function HandleTick() {
  const [, setCurrentSeconds] = useAtom(currentSecondsAtom);
  const [, setDateNow] = useAtom(dateNowAtom);

  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    function update() {
      const now = new Date();
      const timeZoneOffsetInSeconds = now.getTimezoneOffset() * 60;
      const seconds = dateToSeconds(now);
      setCurrentSeconds(seconds - timeZoneOffsetInSeconds);
      setDateNow(now);
    }

    intervalRef.current = window.setInterval(() => {
      update();
    }, 1000);
    update();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}

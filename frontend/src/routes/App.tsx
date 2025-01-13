import { useEffect, useState } from "react";
import {
  dateNowAtom,
  showFormAtom,
} from "../atoms";
import { useAtom } from "jotai";
import { HandleTick } from "./HandleTick";
import { Timeline } from "./Timeline";

export function App() {
  const [, setShowForm] = useAtom(showFormAtom);
  const [dateNow] = useAtom(dateNowAtom);

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "a") {
        setShowForm(true);
      }
    }
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <>
      <HandleTick />
      <div
        className="w-full h
      -[100dvh] flex flex-col"
      >
        <div className="hidden">
          {dateNow.getHours()}:{dateNow.getMinutes()}
        </div>{" "}
        <div className="grow relative">
          <Timeline />
        </div>
      </div>
    </>
  );
}

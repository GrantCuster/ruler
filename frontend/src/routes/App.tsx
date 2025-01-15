import { useEffect } from "react";
import { focusModeAtom, showFormAtom, showToolbarAtom } from "../atoms";
import { useAtom } from "jotai";
import { HandleTick } from "./HandleTick";
import { Timeline } from "./Timeline";
import { AddForm } from "./AddForm";

export function App() {
  const [showForm, setShowForm] = useAtom(showFormAtom);

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
        <Toolbar />
        <div className="grow relative">
          <Timeline />
        </div>
      </div>
      {showForm ? <AddForm /> : null}
    </>
  );
}

function Toolbar() {
  const [showToolbar, setShowToolbar] = useAtom(showToolbarAtom);
  const [focusMode, setFocusMode] = useAtom(focusModeAtom);
  return (
    <>
      {showToolbar ? (
        <div className="w-full bg-neutral-800 bg-opacity-90 flex items-center justify-between">
          <div className="w-16 h-16"></div>
          <button
            className="flex gap-3 text-sm items-center text-neutral-400 pr-4"
            onClick={() => {
              setFocusMode(!focusMode);
            }}
          >
            <div className={!focusMode ? "text-neutral-100" : ""}>Schedule</div>
            <div className="w-8 h-4 bg-black rounded-full relative">
              <div
                className="w-4 h-4 bg-neutral-200 rounded-full"
                style={{
                  position: "absolute",
                  left: focusMode ? "50%" : 0,
                  transition: "left 0.1s",
                }}
              ></div>
            </div>
            <div className={focusMode ? "text-neutral-100" : ""}>Focus</div>
          </button>
        </div>
      ) : null}
      <button
        className="fixed left-2 top-2 z-50 p-3 flex rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
        onClick={() => setShowToolbar(!showToolbar)}
      >
        ⏳
      </button>
    </>
  );
}

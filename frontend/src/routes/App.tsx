import { useEffect } from "react";
import {
  focusModeAtom,
  selectedThemeAtom,
  showFormAtom,
  showPaletteAtom,
  showToolbarAtom,
} from "../atoms";
import { useAtom } from "jotai";
import { HandleTick } from "./HandleTick";
import { Timeline } from "./Timeline";
import { AddForm } from "./AddForm";
import { themes } from "../shared/consts";

export function App() {
  const [showForm, setShowForm] = useAtom(showFormAtom);
  const [showPalette] = useAtom(showPaletteAtom);
  const [selectedTheme, setSelectedTheme] = useAtom(selectedThemeAtom);

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
        <div className="grow flex relative h-full overflow-hidden">
          <div className="grow">
            <Timeline />
          </div>
          {showPalette ? (
            <div className="w-[260px] h-full z-50">
              <div className="bg-neutral-900 h-full">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    className="px-3 block w-full text-left py-2 text-neutral-100 hover:bg-neutral-800"
                    style={{
                      backgroundColor: selectedTheme === theme ? "#333" : "",
                    }}
                    onClick={() => {
                      setSelectedTheme(theme);
                    }}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {showForm ? <AddForm /> : null}
    </>
  );
}

function Toolbar() {
  const [showToolbar, setShowToolbar] = useAtom(showToolbarAtom);
  const [focusMode, setFocusMode] = useAtom(focusModeAtom);
  const [showForm, setShowForm] = useAtom(showFormAtom);
  const [showPalette, setShowPalette] = useAtom(showPaletteAtom);

  return (
    <>
      {showToolbar ? (
        <div className="w-full px-3 bg-neutral-800 bg-opacity-90 flex items-center justify-between">
          <div className="w-10 h-16"></div>
          <button
            className="flex gap-3 text-sm items-center text-neutral-400 pr-4 hidden"
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
          <div className="flex gap-3">
            <button
              className=" p-3 flex rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
              onClick={() => {
                setShowForm(!showForm);
              }}
            >
              ➕
            </button>
            <button
              className=" p-3 flex rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100 hover:bg-neutral-900"
              onClick={() => setShowPalette(!showPalette)}
            >
              🎨
            </button>
          </div>
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

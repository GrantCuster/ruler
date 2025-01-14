import { useEffect } from "react";
import { dateNowAtom, showFormAtom, showToolbarAtom } from "../atoms";
import { useAtom } from "jotai";
import { HandleTick } from "./HandleTick";
import { Timeline } from "./Timeline";
import { AddForm } from "./AddForm";

export function App() {
  const [showForm, setShowForm] = useAtom(showFormAtom);
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
        <div className="grow relative">
          <Timeline />
        </div>
      </div>
      <Toolbar />
      {showForm ? <AddForm /> : null}
    </>
  );
}

function Toolbar() {
  const [showToolbar, setShowToolbar] = useAtom(showToolbarAtom);
  return (
    <>
      {showToolbar ? (
        <div className="fixed left-0 top-0 w-full bg-neutral-800 flex items-center">
            <div className="w-16 h-16"></div>
          <div>hello i am toolbar</div>
        </div>
      ) : null}
      <div className="fixed left-2 top-2 z-50 p-3 flex rounded-full bg-neutral-800 bg-opacity-80 hover:bg-opacity-100">
        ⏳
      </div>
    </>
  );
}

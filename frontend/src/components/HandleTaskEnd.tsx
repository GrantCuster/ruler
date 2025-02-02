import { useAtom } from "jotai";
import { addedTaskAtom, currentSecondsAtom } from "../atoms";

function HandleExportEnd() {
  const [addedTask] = useAtom(addedTaskAtom);
  const [currentSeconds] = useAtom(currentSecondsAtom);

  const isEnded =
    addedTask && currentSeconds >= addedTask.startTime + addedTask.duration;

  console.log(isEnded)

  return isEnded ? <div className="absolute inset-0 bg-red-500"></div> : null;
}

export default HandleExportEnd;

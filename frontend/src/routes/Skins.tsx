import { useAtom } from "jotai";
import { themeIdsAtom, themeMapAtom } from "../atoms";

function Skins() {
  const [themeIds] = useAtom(themeIdsAtom);
  const [themeMap] = useAtom(themeMapAtom);

  return (
    <div>
      <div>Skins</div>
    </div>
  );
}

export default Skins

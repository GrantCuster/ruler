import { useAtom } from "jotai";
import { themeIdsAtom } from "../atoms";
import { Link } from "react-router";

function Header() {
  const [themeIds] = useAtom(themeIdsAtom);

  return (
    <div className="flex items-center justify-between bg-black">
      <div className="px-3 py-2">
        <Link to="/" className="font-bold">
          Timer
        </Link>
        <div className="text-neutral-400 italic">skinnable focus timers</div>
      </div>
      <div className="flex flex-col items-end">
        <div className="px-3 underline pr-5 text-neutral-400">
          {themeIds.length} skins
        </div>
      </div>
    </div>
  );
}

export default Header;

import { useAtom } from "jotai";
import { themeIdsAtom } from "../atoms";
import { Link, useLocation } from "react-router";
import { Grid2x2Icon, ListIcon } from "lucide-react";

function Header() {
  const [themeIds] = useAtom(themeIdsAtom);
  const location = useLocation();

  return (
    <div className="flex items-center justify-between bg-black">
      <div className="flex items-center">
        {location.pathname !== "/" ? (
          <Link
            to="/"
            className="px-3 py-2 bg-neutral-900 flex items-center hover:bg-neutral-800 text-neutral-200 hover:text-white"
          >
            <Grid2x2Icon size={14} />
          </Link>
        ) : null}
        <div className="px-3 py-2">Timer</div>
      </div>
      {location.pathname !== "/skins" ? (
        <Link
          to="/skins"
          className="px-3 gap-3 flex items-center py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200"
        >
          <ListIcon size={13} />
          <div>{themeIds.length} skins</div>{" "}
        </Link>
      ) : null}
    </div>
  );
}

export default Header;

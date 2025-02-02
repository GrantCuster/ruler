import {
  currentSecondsAtom,
  themeIdsAtom,
  themeMapAtom,
  addedTaskAtom,
} from "../atoms";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ExpandIcon,
  ShuffleIcon,
  ListIcon,
  Grid2x2Icon,
} from "lucide-react";
import Banner from "../components/Banner";
import { useGetIframeData } from "../shared/utils";

function Timer() {
  const params = useParams();
  const [currentSeconds] = useAtom(currentSecondsAtom);
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [themeMap] = useAtom(themeMapAtom);
  const [themeIds] = useAtom(themeIdsAtom);
  const [addedTask] = useAtom(addedTaskAtom);
  const iframeData = useGetIframeData();

  const otherThemeIds = themeIds.filter((id) => id !== params.encodedURL);
  const randomThemeId =
    otherThemeIds[Math.floor(Math.random() * otherThemeIds.length)];

  const url = decodeURIComponent(params.encodedURL!);
  const meta = themeMap[url];

  useEffect(() => {
    if (iframe) {
      iframe.contentWindow?.postMessage(iframeData, "*");
    }
  }, [iframe, currentSeconds]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex">
        <div className="flex">
          <Link
            to="/"
            className="px-3 py-2 bg-neutral-900 flex items-center hover:bg-neutral-800 text-neutral-200 hover:text-white"
          >
            <Grid2x2Icon size={14} />
          </Link>
          <div className="px-3 py-2">
            {meta.name}
            {` `}
            <span className="text-neutral-400">@{meta.url}</span>
          </div>
        </div>
        <div className="justify-end flex grow">
          <Link
            to={`/skins`}
            className="hover:text-white px-3 flex items-center py-2 bg-neutral-900 hover:bg-neutral-800"
          >
            <ListIcon size={13} />
          </Link>
          <Link
            to={`/skin/${encodeURIComponent(randomThemeId)}`}
            className="hover:text-white px-3 flex items-center py-2 bg-neutral-900 hover:bg-neutral-800"
          >
            <ShuffleIcon size={13} />
          </Link>
          <Link
            className="hover:text-white px-3 flex items-center py-2 bg-neutral-900 hover:bg-neutral-800"
            to={`/fullscreen/${encodeURIComponent(url)}`}
          >
            <ExpandIcon size={13} />
          </Link>
        </div>
      </div>
      <div className="grow relative">
        <iframe
          className={`w-full h-full ${iframe ? "block" : "hidden"}`}
          onLoad={(e) => {
            setIframe(e.target as HTMLIFrameElement);
          }}
          src={url}
        />
      </div>
      {addedTask ? null : <Banner />}
    </div>
  );
}

export default Timer;

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  galleryCursorAtom,
  galleryPerPageAtom,
  themeIdsAtom,
  themeMapAtom,
  addedTaskAtom,
} from "../atoms";
import { ArrowRightIcon } from "lucide-react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import { useGetIframeData } from "../shared/utils";
import HandleExportEnd from "../components/HandleTaskEnd";
import HandleTaskEnd from "../components/HandleTaskEnd";

function Gallery() {
  const [iframes, setIframes] = useState<Record<string, HTMLIFrameElement>>({});
  const [themeMap] = useAtom(themeMapAtom);
  const [themeIds] = useAtom(themeIdsAtom);
  const [galleryPerPage] = useAtom(galleryPerPageAtom);
  const [galleryCursor] = useAtom(galleryCursorAtom);
  const [addedTask] = useAtom(addedTaskAtom);
  const iframeData = useGetIframeData();

  useEffect(() => {
    const iframeKeys = Object.keys(iframes);
    for (let key of iframeKeys) {
      iframes[key].contentWindow?.postMessage(iframeData, "*");
    }
  }, [iframes, iframeData]);

  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <div
        className="grow relative grid gap-px bg-neutral-800 border border-neutral-800 w-full h-full"
        style={{
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {themeIds.slice(galleryCursor, galleryPerPage).map((id) => {
          const theme = themeMap[id];
          return (
            <div className="flex flex-col" key={theme.url}>
              <Link
                to={`/skin/${encodeURIComponent(theme.url)}`}
                className="bg-neutral-900 px-3 py-2 group flex hover:bg-neutral-800 cursor-pointer"
              >
                <div className="flex gap-2">
                  <div className="text-neutral-200 group-hover:text-white">
                    {theme.name}
                  </div>
                  <div className="text-neutral-400 group-hover:test-neutral-200">
                    @{theme.url}
                  </div>
                </div>
                <div className="text-neutral-400 justify-end flex gap-2 items-center grow text-right">
                  <div>
                    <ArrowRightIcon size={13} />
                  </div>
                </div>
              </Link>
              <div className="grow relative">
                <iframe
                  onLoad={(e) => {
                    setIframes((prev) => {
                      return {
                        ...prev,
                        [theme.url]: e.target as HTMLIFrameElement,
                      };
                    });
                  }}
                  className={`w-full h-full ${iframes[theme.url] ? "block" : "hidden"}`}
                  src={theme.url}
                />
              </div>
            </div>
          );
        })}
        <HandleTaskEnd />
      </div>
      {addedTask ? null : <Banner />}
      <GalleryFooter />
    </div>
  );
}

export function GalleryFooter() {
  const [galleryCursor, setGalleryCursor] = useAtom(galleryCursorAtom);
  const [galleryPerPage] = useAtom(galleryPerPageAtom);
  const [themeIds] = useAtom(themeIdsAtom);

  return (
    <div className="flex items-center px-3 py-2 justify-between bg-black text-neutral-400">
      <div>
        Page {galleryCursor / galleryPerPage + 1} of{" "}
        {Math.ceil(themeIds.length / galleryPerPage)}
      </div>
      <div className="flex gap-2">
        {galleryCursor > 0 && (
          <button
            onClick={() => {
              setGalleryCursor((prev) => prev - galleryPerPage);
            }}
          >
            Previous
          </button>
        )}
        {galleryCursor + galleryPerPage < themeIds.length && (
          <button
            onClick={() => {
              setGalleryCursor((prev) => prev + galleryPerPage);
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Gallery;

import { labels } from "../shared/consts";
import { XIcon } from "lucide-react";
import { Link } from "react-router";
import { ButtonLink } from "../components/Button";

export function Chooser() {
  const srcs = [
    "/0.jpg",
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
    "/7.jpg",
    "/8.jpg",
    "/9.jpg",
    "/colon.jpg",
    "/am.jpg",
    "/pm.jpg",
  ];

  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col bg-neutral-900 overflow-hidden">
      <div className="flex justify-between py-2 items-center px-2 bg-neutral-800">
        <div className="text-center px-4 py-2  ">Choose a digit</div>
        <ButtonLink to="/">
          <XIcon size={16} />
        </ButtonLink>
      </div>
      <div className="grow flex overflow-auto py-5">
        <div className="m-auto flex flex-col">
          <div className="flex flex-wrap justify-center items-center gap-4 q-4">
            {srcs.map((src, i) => {
              const width = labels[i] === ":" ? 220 : 440;
              const height =
                labels[i] === "AM" || labels[i] === "PM" ? 400 : 800;
              return (
                <Link
                  key={i}
                  className="flex flex-col items-center bg-neutral-700 hover:bg-neutral-600 p-2 rounded-xl gap-1 "
                  to={`/creator/${labels[i]}`}
                >
                  <div
                    className=""
                    style={{
                      width: width / 2,
                      height: height / 2,
                      backgroundImage: `url("${src}")`,
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <div className="text-white ">{labels[i]}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { DataType } from "../types";

export function Api({ data }: { data: DataType }) {
  return (
    <div className="font-mono w-full">
      <div className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}

import { ChevronDownIcon } from "lucide-react";

export function Select({
  children,
  onChange,
  value,
}: {
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}) {
  return (
    <label
      className={`p-0 bg-neutral-700 flex gap-2 items-center px-4 py-2 rounded-full relative text-white`}
    >
      <select
        className="opacity-0 w-full h-full absolute left-0 top-0"
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
      {value} <ChevronDownIcon size={16} />
    </label>
  );
}

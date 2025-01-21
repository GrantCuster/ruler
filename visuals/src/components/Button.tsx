import { NavLink } from "react-router";

export function Button({
  children,
  transparent = false,
  onClick = () => { },
}: {
  children?: React.ReactNode;
  transparent?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`${transparent ? "" : "bg-neutral-700"} flex gap-2 items-center hover:bg-neutral-600 rounded-full px-4 py-3`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  transparent = false,
  to,
}: {
  to: string;
  transparent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <NavLink
      className={() => {
        return `${transparent ? "" : "bg-neutral-700"} flex gap-2 items-center hover:bg-neutral-600 rounded-full px-4 py-3`;
      }}
      to={to}
    >
      {children}
    </NavLink>
  );
}

export function ButtonLabel({
  children,
  transparent = false,
}: {
  children?: React.ReactNode;
  transparent?: boolean;
}) {
  return (
    <label
      className={`${transparent ? "" : "bg-neutral-700"} flex gap-2 items-center hover:bg-neutral-600 rounded-full px-4 py-3`}
    >
      {children}
    </label>
  );
}

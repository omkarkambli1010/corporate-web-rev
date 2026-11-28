/* Icons for the text size buttons. Decorative: each button has a text label. */
const base = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/** A letter A with a minus beside it. */
export function SmallerTextIcon() {
  return (
    <svg {...base}>
      <path d="M4 25l6.5-15L17 25M6.5 20h8" />
      <path d="M21 11h8" />
    </svg>
  );
}

/** A circular arrow: back to the starting size. */
export function ResetIcon() {
  return (
    <svg {...base}>
      <path d="M7.5 12.5a9.5 9.5 0 1 1-1 5" />
      <path d="M6 6.5v6.5h6.5" />
    </svg>
  );
}

/** A letter A with a plus beside it. */
export function LargerTextIcon() {
  return (
    <svg {...base}>
      <path d="M3 26L11 7l8 19M6 19.5h10" />
      <path d="M21 11h8M25 7v8" />
    </svg>
  );
}

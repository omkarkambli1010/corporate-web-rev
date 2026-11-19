/* Line icons for the search UI, drawn in currentColor so they follow the theme.
   Shapes follow the Figma instances (Phosphor-style, 1.5 stroke). */

type IconProps = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  className,
});

export const SearchGlyph = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);

export const ArrowLeftIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
);

export const ArrowRightIcon = ({ size = 24, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const CloseIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowUpRightIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

export const ArrowDownRightIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M7 7l10 10M17 9v8H9" />
  </svg>
);

export const ClockIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

/** The 18px glyph inside each row's 36px round logo, by result type. */
export const TypeIcon = ({ type, size = 18 }: { type: string; size?: number }) => {
  switch (type) {
    case "stock":
      return (
        <svg {...base(size)}>
          <path d="M4 20h16M7 16v-4M12 16V8M17 16v-6" />
        </svg>
      );
    case "option":
      return (
        <svg {...base(size)}>
          <path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1 1" />
          <path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1-1" />
        </svg>
      );
    case "mf":
      return (
        <svg {...base(size)}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5V12l6 6" />
        </svg>
      );
    case "etf":
      return (
        <svg {...base(size)}>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
        </svg>
      );
    case "research":
      return (
        <svg {...base(size)}>
          <path d="M12 7c-1.5-1.5-4-2-8-2v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2V5c-4 0-6.5.5-8 2z" />
          <path d="M12 7v13" />
        </svg>
      );
    case "report":
      return (
        <svg {...base(size)}>
          <path d="M14 3.5H7a2 2 0 00-2 2v13a2 2 0 002 2h10a2 2 0 002-2V8.5z" />
          <path d="M14 3.5v5h5M9 13h6M9 16.5h4" />
        </svg>
      );
    default:
      return (
        <svg {...base(size)}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.5 9.5a2.5 2.5 0 114 2c-.8.5-1.5 1-1.5 2M12 17h.01" />
        </svg>
      );
  }
};

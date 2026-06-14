type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 36, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8D58F" />
          <stop offset="45%" stopColor="#C9A961" />
          <stop offset="100%" stopColor="#8C6F2E" />
        </linearGradient>
        <linearGradient id="vc-gold-soft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A961" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C9A961" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* shield base */}
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#0E1116" />
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="14"
        fill="url(#vc-gold-soft)"
      />
      <rect
        x="2.5"
        y="2.5"
        width="59"
        height="59"
        rx="13.5"
        fill="none"
        stroke="url(#vc-gold)"
        strokeWidth="1"
        opacity="0.55"
      />

      {/* ascending V mark (peak / vertex) */}
      <path
        d="M14 18 L32 50 L50 18"
        fill="none"
        stroke="url(#vc-gold)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* summit dot — the vértice */}
      <circle cx="32" cy="14" r="3" fill="url(#vc-gold)" />
      <path
        d="M28 16 L32 12 L36 16"
        fill="none"
        stroke="url(#vc-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "horizontal" | "stacked";
  className?: string;
};

const SIZES = {
  sm: { mark: 32, title: "text-sm", sub: "text-[8px]" },
  md: { mark: 40, title: "text-base", sub: "text-[9px]" },
  lg: { mark: 48, title: "text-xl", sub: "text-[10px]" },
};

export function Logo({
  size = "md",
  variant = "horizontal",
  className,
}: LogoProps) {
  const s = SIZES[size];
  return (
    <div
      className={`flex items-center gap-2.5 ${className ?? ""}`}
    >
      <LogoMark size={s.mark} />
      <div
        className={`leading-tight ${
          variant === "stacked" ? "" : ""
        }`}
      >
        <div
          className={`font-serif font-bold tracking-wide ${s.title}`}
        >
          VÉRTICE
        </div>
        <div
          className={`uppercase tracking-[0.25em] text-brand -mt-0.5 ${s.sub}`}
        >
          Carreiras
        </div>
      </div>
    </div>
  );
}

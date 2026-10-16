import { sources } from "@/data/content";
import { cn } from "@/lib/utils";

type Props = {
  sourceId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "size-5 text-[8px]",
  md: "size-9 text-[10px]",
  lg: "size-[72px] text-sm",
};

export function SourceBadge({ sourceId, size = "sm", className }: Props) {
  const source = sources[sourceId] ?? {
    id: sourceId,
    name: sourceId,
    handle: sourceId,
    kind: "logo" as const,
    color: "#111111",
    mark: sourceId.slice(0, 2).toUpperCase(),
  };

  if (source.kind === "photo" && source.image) {
    return (
      <img
        src={source.image}
        alt={source.name}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold tracking-tight text-white",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: source.color }}
      aria-hidden="true"
    >
      {source.id === "apple" ? <AppleMark size={size} /> : null}
      {source.id === "kretya" ? <KretyaMark size={size} /> : null}
      {source.id !== "apple" && source.id !== "kretya" ? (
        <span className={cn("px-0.5 leading-none", size === "lg" && "text-[11px]")}>{source.mark}</span>
      ) : null}
    </span>
  );
}

function AppleMark({ size }: { size: "sm" | "md" | "lg" }) {
  const px = size === "lg" ? 28 : size === "md" ? 16 : 10;
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M16.2 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-1-3-1c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.3c.7-1 1.2-2 1.5-3.1-3.9-1.5-3.8-6.9-3.8-7.1z" />
      <path d="M14.2 5.3c.6-.8 1.1-1.9 1-3-1 .1-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 2.9 1.1.1 2.2-.5 2.9-1.4z" />
    </svg>
  );
}

function KretyaMark({ size }: { size: "sm" | "md" | "lg" }) {
  const px = size === "lg" ? 30 : size === "md" ? 18 : 12;
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v18M5.5 6.5l13 11M18.5 6.5l-13 11" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

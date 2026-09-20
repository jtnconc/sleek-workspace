import { useEffect, useRef, useState } from "react";
import { Lock, Paintbrush, Unlock } from "lucide-react";
import { ArrowSquareIn, TextColumns } from "@phosphor-icons/react";
import type { WidgetSize } from "@/workspace/types";
import { cn } from "@/lib/utils";

const SIZES: WidgetSize[] = ["1x1", "1x2", "2x1"];

/** Graphical mini-glyph of a widget size (no text). */
function SizeGlyph({ size, active }: { size: WidgetSize; active: boolean }) {
  const [w, h] = size.split("x").map(Number) as [number, number];
  return (
    <span
      className={cn(
        "block rounded-[2px] transition-colors",
        active ? "bg-foreground/70" : "bg-muted-foreground/35",
      )}
      style={{ width: w * 5 + (w - 1) * 1, height: h * 5 + (h - 1) * 1 }}
    />
  );
}

/**
 * Inline size selector: a single dot that expands into three mini-glyphs
 * inside the widget header itself (no popup / overlay).
 */
export function SizeControl({
  value,
  onChange,
  locked = false,
  onToggleLock,
  onReturn,
  returnLabel = "Return note to Notes list",
  onCustomize,
  customizing = false,
  onToggleColumns,
  columnsOn,
  accent,
}: {
  value: WidgetSize;
  onChange: (size: WidgetSize) => void;
  /** whether the card's width AND height are currently pinned */
  locked?: boolean;
  /** shown as an extra option inside the expanded popover, after the size glyphs */
  onToggleLock?: () => void;
  /** shown as an extra option that converts a standalone sticky note back into its source list item */
  onReturn?: (() => void) | undefined;
  /** accessible label/title for the return action, tailored to the source list */
  returnLabel?: string;

  /** opens the icon/card-color customizer for this widget */
  onCustomize?: () => void;

  /** whether the customizer is currently open, for the active-state highlight */
  customizing?: boolean;

  /** toggles the two-column list layout for this widget */
  onToggleColumns?: (() => void) | undefined;

  /** whether the two-column layout is currently on, for the active-state highlight */
  columnsOn?: boolean | undefined;

  /** optional accent color used for the collapsed dot */
  accent?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={ref}
      onClick={stop}
      onPointerDown={stop}
      onDragStart={(e) => e.preventDefault()}
      className="flex shrink-0 items-center"
      style={{ ["--icon-hover" as any]: `color-mix(in srgb, ${accent ?? "var(--muted-foreground)"} 15%, transparent)` }}
    >
      {open ? (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={`Card size: ${value}. Click to change.`}
            disabled={locked}
            title={locked ? "Unlock the card to change its size" : `Size: ${value} (click to cycle)`}
            onClick={(e) => {
              e.stopPropagation();
              if (locked) return;
              const next = SIZES[(SIZES.indexOf(value) + 1) % SIZES.length];
              onChange(next);
            }}
            className="flex size-[18px] items-center justify-center rounded-[5px] transition-colors hover:bg-[var(--icon-hover)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <SizeGlyph size={value} active />
          </button>
          {onCustomize ? (
            <>
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              <button
                type="button"
                aria-label="Customize card"
                aria-pressed={customizing}
                title="Customize card"
                onClick={(e) => {
                  e.stopPropagation();
                  onCustomize();
                  setOpen(false);
                }}
                className={cn(
                  "flex size-[18px] items-center justify-center rounded-[5px] transition-colors hover:bg-[var(--icon-hover)]",
                  customizing ? "text-foreground" : "text-muted-foreground/60",
                )}
              >
                <Paintbrush className="size-[11px]" />
              </button>
            </>
          ) : null}
          {onToggleColumns ? (
            <>
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              <button
                type="button"
                aria-label="Toggle two-column layout"
                aria-pressed={!!columnsOn}
                title="Toggle two-column layout"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleColumns();
                  setOpen(false);
                }}
                className={cn(
                  "flex size-[18px] items-center justify-center rounded-[5px] transition-colors hover:bg-[var(--icon-hover)]",
                  columnsOn ? "text-foreground" : "text-muted-foreground/60",
                )}
              >
                <TextColumns className="size-[11px]" />
              </button>
            </>
          ) : null}
          {onToggleLock ? (
            <>
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              <button
                type="button"
                aria-label={locked ? "Unlock card size" : "Lock card size"}
                aria-pressed={locked}
                title={locked ? "Unlock card size" : "Lock card size"}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock();
                  setOpen(false);
                }}
                className={cn(
                  "flex size-[18px] items-center justify-center rounded-[5px] transition-colors hover:bg-[var(--icon-hover)]",
                  locked ? "text-foreground" : "text-muted-foreground/60",
                )}
              >
                {locked ? <Lock className="size-[11px]" /> : <Unlock className="size-[11px]" />}
              </button>
            </>
          ) : null}
          {onReturn ? (
            <>
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              <button
                type="button"
                aria-label={returnLabel}
                title={returnLabel}
                onClick={(e) => {
                  e.stopPropagation();
                  onReturn();
                  setOpen(false);
                }}
                className="flex size-[18px] items-center justify-center rounded-[5px] text-muted-foreground/60 transition-colors hover:bg-[var(--icon-hover)] hover:text-foreground"
              >
                <ArrowSquareIn className="size-[11px]" />
              </button>
            </>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          aria-label="Widget size"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className={cn(
            "flex size-4 items-center justify-center rounded-full transition-colors hover:text-foreground",
          )}
          style={{
            color: `color-mix(in srgb, ${accent ?? "var(--muted-foreground)"} ${locked ? 75 : 45}%, var(--muted-foreground))`,
          }}
        >
          <span className="size-[5px] rounded-full bg-current" />
        </button>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BoldIcon,
  ItalicIcon,
} from "@heroicons/react/24/outline";
import {
  ImagePlus,
  Highlighter,
  List,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  execNotesCommand,
  insertNotesImage,
  toggleNotesList,
  applyNotesHighlight,
} from "./notes-format";

const COLORS = [
  { label: "Ink", value: "#1c1c1e" },
  { label: "Blue", value: "#2563eb" },
  { label: "Green", value: "#0f766e" },
  { label: "Amber", value: "#b45309" },
  { label: "Red", value: "#b91c1c" },
  { label: "Violet", value: "#6d28d9" },
];

// Named palette (dot = true hue shown in the list; value = the soft tint
// actually applied as the highlight background, to stay legible on our
// light UI).
const HIGHLIGHTS = [
  { label: "Purple", dot: "#a855f7", value: "#f3e8ff" },
  { label: "Pink", dot: "#ec4899", value: "#fce7f3" },
  { label: "Orange", dot: "#f97316", value: "#ffedd5" },
  { label: "Mint", dot: "#14b8a6", value: "#ccfbf1" },
  { label: "Blue", dot: "#3b82f6", value: "#dbeafe" },
];

const btn =
  "flex size-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-desk transition-colors hover:bg-secondary hover:text-foreground";
const activeBtn =
  "bg-[rgba(100,116,139,0.15)] text-slate-700 border-transparent hover:bg-[rgba(100,116,139,0.15)] hover:text-slate-700";

/** Shared staggered scale+fade entrance used by every toolbar button. */
const entrance = (i: number) => ({
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring" as const, stiffness: 400, damping: 25, delay: i * 0.04 },
});

export function NotesToolbar() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    list: false,
  });

  const syncActive = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      list: document.queryCommandState("insertUnorderedList"),
    });
  };

  useEffect(() => {
    syncActive();
    document.addEventListener("selectionchange", syncActive);
    return () => document.removeEventListener("selectionchange", syncActive);
  }, []);

  const toggle = (command: "bold" | "italic") => {
    execNotesCommand(command);
    // Reflect the new state immediately so combined bold+italic both stay lit.
    syncActive();
  };

  const pickImage = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => insertNotesImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-1.5">
      <motion.button
        type="button"
        aria-label="Bold"
        aria-pressed={active.bold}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggle("bold")}
        className={cn(btn, active.bold && activeBtn)}
        {...entrance(0)}
      >
        <BoldIcon className="size-[18px]" strokeWidth={2} />
      </motion.button>
      <motion.button
        type="button"
        aria-label="Italic"
        aria-pressed={active.italic}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggle("italic")}
        className={cn(btn, active.italic && activeBtn)}
        {...entrance(1)}
      >
        <ItalicIcon className="size-[18px]" strokeWidth={2} />
      </motion.button>

      <motion.button
        type="button"
        aria-label="Bullet list"
        aria-pressed={active.list}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          toggleNotesList();
          syncActive();
        }}
        className={cn(btn, active.list && activeBtn)}
        {...entrance(2)}
      >
        <List className="size-[18px]" strokeWidth={2} />
      </motion.button>

      {/* Consolidated: highlight color, text color, insert image — grouped
          into one popover so the toolbar never overflows/scrolls out of
          view at narrow widths. */}
      <Popover>
        <PopoverTrigger asChild>
          <motion.button
            type="button"
            aria-label="Formatting"
            onMouseDown={(e) => e.preventDefault()}
            className={btn}
            {...entrance(3)}
          >
            <Highlighter className="size-[18px]" />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 space-y-3 p-3">
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Highlight
            </p>
            <div className="grid gap-1">
              {HIGHLIGHTS.map((h) => (
                <button
                  key={h.value}
                  type="button"
                  aria-label={h.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyNotesHighlight(h.value, h.dot)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
                >
                  <span
                    className="size-4 rounded-full border border-border"
                    style={{ backgroundColor: h.dot }}
                  />
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Text color
            </p>
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  aria-label={c.label}
                  title={c.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => execNotesCommand("foreColor", c.value)}
                  className="size-5 rounded-full border border-border transition-transform hover:scale-110"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
          >
            <ImagePlus className="size-[14px]" />
            Insert image
          </button>
        </PopoverContent>
      </Popover>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pickImage(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

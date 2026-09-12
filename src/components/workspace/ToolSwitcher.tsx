import { motion } from "framer-motion";
import {
  BadgePercent,
  FileSpreadsheet,
  SquarePen,
} from "lucide-react";
import { useWorkspace } from "@/workspace/store";
import type { ToolId } from "@/workspace/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TOOLS: { id: ToolId; label: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { id: "notes", label: "Notes", Icon: SquarePen },
  { id: "quote", label: "Quote", Icon: FileSpreadsheet },
  { id: "rates", label: "Rates", Icon: BadgePercent },
];

export function ToolSwitcher() {
  const { activeTool, mode, openTool } = useWorkspace();

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative flex items-center gap-2 rounded-full border border-border bg-surface p-1 shadow-desk">
        {TOOLS.map((t) => {
          const active = mode === "tool" && activeTool === t.id;
          return (
            <Tooltip key={t.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => openTool(t.id)}
                  aria-label={t.label}
                  className="relative flex size-8 items-center justify-center rounded-full"
                >
                  {active && (
                    <motion.div
                      layoutId="tool-switcher-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <t.Icon
                    strokeWidth={2}
                    className={cn(
                      "relative z-10 size-[18px] transition-colors",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{t.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

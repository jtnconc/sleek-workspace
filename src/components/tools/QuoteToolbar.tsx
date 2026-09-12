import { motion } from "framer-motion";
import { Download, Eye, History } from "lucide-react";
import { useWorkspace } from "@/workspace/store";
import { getHotel } from "@/lib/hotels";
import { generateQuotePdf } from "@/lib/quote-pdf";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const btn =
  "flex size-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-desk transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-surface";
const activeBtn =
  "bg-[rgba(100,116,139,0.15)] text-slate-700 border-transparent hover:bg-[rgba(100,116,139,0.15)] hover:text-slate-700";

interface Props {
  preview: boolean;
  onTogglePreview: () => void;
  history: boolean;
  onToggleHistory: () => void;
}

export function QuoteToolbar({ preview, onTogglePreview, history, onToggleHistory }: Props) {
  const { quote, hotelLogos, archiveQuote, resetQuote } = useWorkspace();
  const selected = quote.hotelId ? getHotel(quote.hotelId) : null;

  const download = () => {
    if (!selected) return;
    archiveQuote();
    generateQuotePdf(quote, selected, hotelLogos[quote.hotelId] ?? selected.logoUrl);
    // Fresh blank form, ready for the next quotation.
    resetQuote();
  };

  const buttons = [
    {
      key: "preview",
      icon: Eye,
      label: "Preview quotation",
      disabled: !selected,
      onClick: onTogglePreview,
      active: preview,
    },
    {
      key: "download",
      icon: Download,
      label: "Download PDF",
      disabled: !selected,
      onClick: download,
      active: false,
    },
    {
      key: "history",
      icon: History,
      label: "Quote history",
      disabled: false,
      onClick: onToggleHistory,
      active: history,
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1.5">
        {buttons.map((b, index) => (
          <Tooltip key={b.key}>
            <TooltipTrigger asChild>
              <motion.button
                type="button"
                aria-label={b.label}
                disabled={b.disabled}
                onClick={b.onClick}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.04 }}
                className={cn(btn, b.active && activeBtn)}
              >
                <b.icon className="size-[18px]" strokeWidth={2} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{b.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

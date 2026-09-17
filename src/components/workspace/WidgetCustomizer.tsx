import type { WidgetAccent, WidgetIconName } from "@/workspace/types";
import { cn } from "@/lib/utils";
import { ACCENTS, tintVar } from "./AccentControl";
import { WIDGET_ICONS, WIDGET_ICON_NAMES } from "./widget-icons";

const stop = (e: React.SyntheticEvent) => e.stopPropagation();

/**
 * Small customization area integrated inside the widget (no modal / overlay).
 * Opened via the card's paintbrush option; lets the user pick an icon and a
 * card color. The icon always renders in the app's standard navy (matching
 * how it's drawn everywhere else) — there is no separate icon-color choice.
 */
export function WidgetCustomizer({
  icon,
  tint,
  onIcon,
  onTint,
  iconEditable = true,
}: {
  icon?: WidgetIconName | undefined;
  tint?: WidgetAccent | undefined;
  onIcon: (icon: WidgetIconName) => void;
  onTint: (tint: WidgetAccent) => void;
  /** false hides the icon picker entirely, leaving only card color — used
   * for base widgets (Reminders/Contacts/Tasks/Notes) so their identifying
   * icon can't be swapped away. */
  iconEditable?: boolean;
}) {
  return (
    <div
      onClick={stop}
      onPointerDown={stop}
      onDragStart={(e) => e.preventDefault()}
      className="mb-3 space-y-2 rounded-xl bg-surface-2 p-2"
    >
      {iconEditable && (
      <div className="flex flex-wrap gap-1">
        {WIDGET_ICON_NAMES.map((name) => {
          const Icon = WIDGET_ICONS[name];
          return (
            <button
              key={name}
              type="button"
              aria-label={name}
              onClick={(e) => {
                e.stopPropagation();
                onIcon(name);
              }}
              className={cn(
                "flex size-6 items-center justify-center rounded-lg transition-colors hover:bg-secondary",
                name === icon && "bg-secondary",
              )}
            >
              <Icon size={14} className="text-primary" />
            </button>
          );
        })}
      </div>
      )}
      <div className="flex items-center gap-1.5">
        {ACCENTS.map((a) => (
          <button
            key={a}
            type="button"
            aria-label={`${a} background`}
            onClick={(e) => {
              e.stopPropagation();
              onTint(a);
            }}
            className={cn(
              "size-[14px] rounded-md border border-border transition-transform hover:scale-110",
              a === tint && "ring-1 ring-foreground/40 ring-offset-1",
            )}
            style={{ backgroundColor: tintVar(a) }}
          />
        ))}
      </div>
    </div>
  );
}

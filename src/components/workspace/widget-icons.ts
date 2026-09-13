import {
  BarChart3,
  Bookmark,
  Briefcase,
  CalendarDays,
  Coffee,
  Key,
  MapPin,
  Phone,
  Plane,
} from "lucide-react";
import { AddressBook, BellRinging, Info, ListChecks, Note } from "@phosphor-icons/react";
import type { ComponentType, CSSProperties } from "react";
import type { WidgetIconName, WidgetType } from "@/workspace/types";

export type WidgetIconComponent = ComponentType<{
  className?: string | undefined;
  style?: CSSProperties | undefined;
  size?: number | string | undefined;
}>;

/** Small curated icon set available for widget customization. */
export const WIDGET_ICONS: Record<WidgetIconName, WidgetIconComponent> = {
  bell: BellRinging,
  check: ListChecks,
  note: Note,
  info: Info,
  users: AddressBook,
  calendar: CalendarDays,
  phone: Phone,
  plane: Plane,
  key: Key,
  pin: MapPin,
  coffee: Coffee,
  briefcase: Briefcase,
  bookmark: Bookmark,
  chart: BarChart3,
};

export const WIDGET_ICON_NAMES = Object.keys(WIDGET_ICONS) as WidgetIconName[];

const DEFAULT_BY_TYPE: Record<WidgetType, WidgetIconName> = {
  reminders: "bell",
  contacts: "users",
  notes: "note",
  information: "info",
  tasks: "check",
  sticky: "bookmark",
};

export const widgetIcon = (type: WidgetType, icon?: WidgetIconName) =>
  WIDGET_ICONS[icon ?? DEFAULT_BY_TYPE[type]] ??
  WIDGET_ICONS[DEFAULT_BY_TYPE[type]] ??
  Info;

import {
  AddressBook,
  Bed,
  BellRinging,
  BookmarkSimple,
  Buildings,
  CalendarStar,
  CallBell,
  ChartBarHorizontal,
  Code,
  Image,
  Info,
  ListChecks,
  Notepad,
  PushPin,
  Star,
  Storefront,
  Tag,
} from "@phosphor-icons/react";
import type { ComponentType, CSSProperties } from "react";
import type { WidgetIconName, WidgetType } from "@/workspace/types";

export type WidgetIconComponent = ComponentType<{
  className?: string;
  style?: CSSProperties;
  size?: number | string;
}>;

/** Full icon set: the 13 selectable via the customizer, plus each base
 * widget type's classic fixed default (kept as-is, not part of the
 * customizable pool). */
export const WIDGET_ICONS: Record<WidgetIconName, WidgetIconComponent> = {
  building: Buildings,
  bed: Bed,
  star: Star,
  "calendar-star": CalendarStar,
  code: Code,
  storefront: Storefront,
  "bookmark-simple": BookmarkSimple,
  "call-bell": CallBell,
  image: Image,
  "push-pin": PushPin,
  "chart-bar-horizontal": ChartBarHorizontal,
  info: Info,
  tag: Tag,
  "bell-ringing": BellRinging,
  "address-book": AddressBook,
  "list-checks": ListChecks,
  notepad: Notepad,
};

/** Only these 13 show up in the customizer's icon picker — the 4 classic
 * base-widget defaults stay fixed and aren't offered as swappable choices. */
export const WIDGET_ICON_NAMES: WidgetIconName[] = [
  "building",
  "bed",
  "star",
  "calendar-star",
  "code",
  "storefront",
  "bookmark-simple",
  "call-bell",
  "image",
  "push-pin",
  "chart-bar-horizontal",
  "info",
  "tag",
];

const DEFAULT_BY_TYPE: Record<WidgetType, WidgetIconName> = {
  reminders: "bell-ringing",
  contacts: "address-book",
  notes: "notepad",
  tasks: "list-checks",
  sticky: "push-pin",
};

export const widgetIcon = (type: WidgetType, icon?: WidgetIconName) =>
  WIDGET_ICONS[icon ?? DEFAULT_BY_TYPE[type]] ??
  WIDGET_ICONS[DEFAULT_BY_TYPE[type]] ??
  Info;

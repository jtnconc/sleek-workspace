import {
  AddressBook,
  Bed,
  BellRinging,
  BookmarkSimple,
  Building,
  CalendarDots,
  CallBell,
  Carrot,
  ChartBarHorizontal,
  CodeBlock,
  Image,
  Info,
  ListChecks,
  MapPinSimple,
  Notepad,
  PushPinSimple,
  Rocket,
  Star,
  Tag,
} from "@phosphor-icons/react";
import type { ComponentType, CSSProperties } from "react";
import type { WidgetIconName, WidgetType } from "@/workspace/types";

export type WidgetIconComponent = ComponentType<{
  className?: string;
  style?: CSSProperties;
  size?: number | string;
}>;

/** Full icon set: the 15 selectable via the customizer, plus each base
 * widget type's classic fixed default (kept as-is, not part of the
 * customizable pool). */
export const WIDGET_ICONS: Record<WidgetIconName, WidgetIconComponent> = {
  buildings: Buildings,
  bed: Bed,
  star: Star,
  "code-block": CodeBlock,
  "bookmark-simple": BookmarkSimple,
  "call-bell": CallBell,
  image: Image,
  "push-pin-simple": PushPinSimple,
  "chart-bar-horizontal": ChartBarHorizontal,
  info: Info,
  tag: Tag,
  "map-pin-simple": MapPinSimple,
  "calendar-dots": CalendarDots,
  rocket: Rocket,
  carrot: Carrot,
  "bell-ringing": BellRinging,
  "address-book": AddressBook,
  "list-checks": ListChecks,
  notepad: Notepad,
};

/** Only these show up in the customizer's icon picker — the 4 classic
 * base-widget defaults stay fixed and aren't offered as swappable choices. */
export const WIDGET_ICON_NAMES: WidgetIconName[] = [
  "buildings",
  "bed",
  "star",
  "code-block",
  "bookmark-simple",
  "call-bell",
  "image",
  "push-pin-simple",
  "chart-bar-horizontal",
  "info",
  "tag",
  "map-pin-simple",
  "calendar-dots",
  "rocket",
  "carrot",
];

const DEFAULT_BY_TYPE: Record<WidgetType, WidgetIconName> = {
  reminders: "bell-ringing",
  contacts: "address-book",
  notes: "notepad",
  tasks: "list-checks",
  sticky: "push-pin-simple",
};

export const widgetIcon = (type: WidgetType, icon?: WidgetIconName) =>
  WIDGET_ICONS[icon ?? DEFAULT_BY_TYPE[type]] ??
  WIDGET_ICONS[DEFAULT_BY_TYPE[type]] ??
  Info;

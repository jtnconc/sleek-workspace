import {
  Bed,
  BookmarkSimple,
  Buildings,
  CalendarStar,
  CallBell,
  ChartBarHorizontal,
  Code,
  Image,
  Info,
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

/** Small curated icon set available for widget customization. */
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
};

export const WIDGET_ICON_NAMES = Object.keys(WIDGET_ICONS) as WidgetIconName[];

const DEFAULT_BY_TYPE: Record<WidgetType, WidgetIconName> = {
  reminders: "call-bell",
  contacts: "tag",
  notes: "bookmark-simple",
  tasks: "chart-bar-horizontal",
  sticky: "push-pin",
};

export const widgetIcon = (type: WidgetType, icon?: WidgetIconName) =>
  WIDGET_ICONS[icon ?? DEFAULT_BY_TYPE[type]] ??
  WIDGET_ICONS[DEFAULT_BY_TYPE[type]] ??
  Info;

import type { colors } from "../../../../types/Tasks"


export const listColorMap: Record<colors, string> = {
  blue:   "bg-blue-400",
  green:  "bg-green-400",
  red:    "bg-red-400",
  yellow: "bg-yellow-400",
  orange: "bg-orange-400",
  pink:   "bg-pink-400",
  purple: "bg-purple-400",
  gray:   "bg-gray-400",
}

export const getListColorClass = (color: colors): string => listColorMap[color]
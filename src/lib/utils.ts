import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function matchContinent(continent: string) {
  if (continent === "Afrique") {
    return "AFRICA";
  } else if (continent === "Asie") {
    return "ASIA";
  } else if (continent === "Moyen-Orient") {
    return "MIDDLE_EAST";
  } else if (continent === "Amérique du Nord") {
    return "NORTH_AMERICA";
  } else if (continent === "Amérique Centrale & Caraïbes") {
    return "CENTRAL_AMERICA";
  } else if (continent === "Amérique du Sud") {
    return "SOUTH_AMERICA";
  } else if (continent === "Océanie") {
    return "OCEANIA";
  } else if (continent === "Antarctique") {
    return "ANTARCTICA";
  }
}

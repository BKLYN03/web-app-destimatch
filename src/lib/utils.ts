import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CONTINENT_DATA: Record<string, { subtitle: string, desc: string, style: string }> = {
    "Asie": {
        subtitle: "Exotisme & Culture",
        desc: "Top choix des voyageurs",
        style: ""
    },
    "Europe": {
        subtitle: "Histoire & Charme",
        desc: "Le berceau du romantisme",
        style: ""
    },
    "Afrique": {
        subtitle: "Aventure & Nature",
        desc: "Terres sauvages inoubliables",
        style: ""
    },
    "Amérique du Sud": {
        subtitle: "Mystère & Fête",
        desc: "Des Andes à l'Amazonie",
        style: "lg:col-span-2"
    },
    "Amérique du Nord": {
        subtitle: "Grandeur & Diversité",
        desc: "Le rêve américain et au-delà",
        style: ""
    },
    "Océanie": {
        subtitle: "Paradis & Surf",
        desc: "Le bout du monde",
        style: ""
    }
};

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

export function matchContinent2(continent: string) {
  if (continent === "AFRICA") {
    return "Afrique";
  } else if (continent === "ASIA") {
    return "Asie";
  } else if (continent === "MIDDLE_EAST") {
    return "Moyen-Orient";
  } else if (continent === "NORTH_AMERICA") {
    return "Amérique du Nord";
  } else if (continent === "CENTRAL_AMERICA") {
    return "Amérique Centrale & Caraïbes";
  } else if (continent === "SOUTH_AMERICA") {
    return "Amérique du Sud";
  } else if (continent === "OCEANIA") {
    return "Océanie";
  }
}

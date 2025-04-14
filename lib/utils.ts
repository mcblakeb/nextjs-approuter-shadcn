import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates random URL slugs using adjective-noun-number pattern
 * @param wordLists Optional custom word lists
 * @returns Randomly generated slug string
 */
function generateRandomSlug(): string {
  // Default word lists (can be overridden)
  const adjectives = [
    "happy",
    "quick",
    "bright",
    "lucky",
    "clever",
    "brave",
    "calm",
    "eager",
    "fierce",
    "gentle",
    "jolly",
    "kind",
    "proud",
    "silly",
    "witty",
  ];

  const nouns = [
    "apple",
    "banana",
    "carrot",
    "dragon",
    "eagle",
    "fox",
    "giraffe",
    "honey",
    "iguana",
    "jaguar",
    "koala",
    "lemon",
    "mango",
    "ninja",
    "octopus",
  ];

  const randomFamousPerson = [
    "Einstein",
    "Curie",
    "Newton",
    "Tesla",
    "Hawking",
    "Darwin",
    "Galileo",
    "Curie",
    "Turing",
  ];

  // Get random elements from arrays
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(Math.random() * 1000); // 0-999
  const randomFamous =
    randomFamousPerson[Math.floor(Math.random() * randomFamousPerson.length)];
  // Combine into slug format (adjective-noun-number)
  return `${randomAdjective}-${randomNoun}-${randomFamous}-${randomNum}`;
}

// utils/colorUtils.ts
export function getNameColor(name: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Map hash to hue (0-360)
  const hue = Math.abs(hash) % 360;

  // Return HSL color with fixed saturation and lightness
  return `hsl(${hue}, 70%, 75%)`;
}

// Predefined set of pleasant colors as fallback
const PREDEFINED_COLORS = [
  "#FFD1DC", // Pastel Pink
  "#FFECB8", // Pastel Yellow
  "#B5EAD7", // Pastel Green
  "#C7CEEA", // Pastel Blue
  "#E2F0CB", // Pastel Mint
  "#FFDAC1", // Pastel Orange
  "#B5EAD7", // Pastel Teal
];

function getNameColorPredefined(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PREDEFINED_COLORS[Math.abs(hash) % PREDEFINED_COLORS.length];
}

export { cn, generateRandomSlug, getNameColorPredefined };

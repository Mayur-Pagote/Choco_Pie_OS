import { AppId } from "@/types/os";

export type GameGenre =
  | "Featured"
  | "Action"
  | "Arcade"
  | "Puzzle"
  | "Collection"
  | "Music"
  | "Horror";

export type GameCenterEntry = {
  id: AppId;
  title: string;
  genre: GameGenre;
  subtitle: string;
  description: string;
  accent: string;
  image: string;
  tags: string[];
};

export const GAME_CENTER_GENRES: GameGenre[] = [
  "Featured",
  "Action",
  "Arcade",
  "Puzzle",
  "Collection",
  "Music",
  "Horror",
];

export const GAME_CENTER_GAMES: GameCenterEntry[] = [
  {
    id: "whispering-shadows",
    title: "The Whispering Shadows",
    genre: "Horror",
    subtitle: "Atmospheric haunted mystery",
    description:
      "Explore a dark mansion, follow the story, and uncover what is hidden in a moody horror adventure.",
    accent: "#ff7890",
    image: "/games/The%20Whispering%20Shadows/Cover_Image.png",
    tags: ["Horror", "Story", "Adventure"],
  },
  {
    id: "neon-rush",
    title: "NeonRush",
    genre: "Action",
    subtitle: "High-speed neon reflex run",
    description:
      "Dash through a bright arcade world, dodge hazards, and keep your momentum alive in a fast reaction challenge.",
    accent: "#60e6ff",
    image: "/games/NeonRush/Cover_Image.png",
    tags: ["Action", "Runner", "Neon"],
  },
  {
    id: "riddles",
    title: "Riddles",
    genre: "Puzzle",
    subtitle: "Quick brain-teasers and clues",
    description:
      "Work through clever prompts, solve logic-based questions, and enjoy a calmer puzzle break inside GamePi.",
    accent: "#7cd0ff",
    image: "/games/Riddles/Cover_Image.png",
    tags: ["Riddles", "Logic", "Puzzle"],
  },
  {
    id: "pi-defender",
    title: "Pi Defender",
    genre: "Action",
    subtitle: "Orbital defense strategy",
    description:
      "Defend the pi core from incoming waves, place orbital turrets, and survive increasingly complex attack patterns.",
    accent: "#45d0ff",
    image: "/gamepi/pi-defender-cover.png",
    tags: ["Defense", "Action", "Pi Core"],
  },
  {
    id: "pi-snake",
    title: "Pi Snake",
    genre: "Arcade",
    subtitle: "Digit-chasing reflex challenge",
    description:
      "Guide a fast-moving snake across the board, collect the right numbers, and keep your run alive as the pace rises.",
    accent: "#63e58e",
    image: "/gamepi/pi-snake-cover.png",
    tags: ["Arcade", "Snake", "High Score"],
  },
  {
    id: "slice-the-pie",
    title: "Slice the Pie",
    genre: "Puzzle",
    subtitle: "Precision pie-cut puzzler",
    description:
      "Cut pies into exact portions, solve angle-based objectives, and improve your live accuracy through each recipe.",
    accent: "#ffb45b",
    image: "/gamepi/slice-the-pie-cover.png",
    tags: ["Puzzle", "Accuracy", "Math"],
  },
  {
    id: "games",
    title: "Pi Games",
    genre: "Collection",
    subtitle: "Mini-game hub around the digits of pi",
    description:
      "Jump into a pi-themed collection with quick memory, puzzle, and action challenges designed for fast play sessions.",
    accent: "#ff8f3d",
    image: "/gamepi/pi-games-cover.png",
    tags: ["Collection", "Mini Games", "Pi"],
  },
  {
    id: "memory-tile",
    title: "Memory Tile",
    genre: "Puzzle",
    subtitle: "Pattern memory challenge",
    description:
      "Watch the sequence, remember the order, and answer each round with sharper recall as the pattern grows longer.",
    accent: "#ff995c",
    image: "/games/Memory%20Tile/Cover_Image.png",
    tags: ["Memory", "Sequence", "Puzzle"],
  },
  {
    id: "pi-piano-tiles",
    title: "Pi Piano Tiles",
    genre: "Music",
    subtitle: "Rhythm tiles with pi flair",
    description:
      "Tap the right tiles in time, keep your combo going, and turn pi-inspired sequences into a fast musical run.",
    accent: "#9f8cff",
    image: "/games/Pi%20Piano%20Tiles/Cover_Image.png",
    tags: ["Music", "Rhythm", "Tiles"],
  },
  {
    id: "pie-ninja",
    title: "Pie Ninja",
    genre: "Arcade",
    subtitle: "Fruit-slasher energy with pies",
    description:
      "Slice airborne pies with quick swipes, chase combos, and keep the board clear in a playful arcade session.",
    accent: "#ffb85c",
    image: "/games/Pie%20Ninja/Cover_Image.png",
    tags: ["Arcade", "Slicing", "Score Attack"],
  },
];

export type HtmlGameAppId = Extract<
  AppId,
  | "memory-tile"
  | "neon-rush"
  | "pi-piano-tiles"
  | "pie-ninja"
  | "riddles"
  | "whispering-shadows"
>;

export const HTML_GAME_APP_SOURCES: Record<HtmlGameAppId, string> = {
  "memory-tile": "/games/Memory%20Tile/Memory%20Tile.html",
  "neon-rush": "/games/NeonRush/index.html",
  "pi-piano-tiles": "/games/Pi%20Piano%20Tiles/index.html",
  "pie-ninja": "/games/Pie%20Ninja/pie-ninja.html",
  riddles: "/games/Riddles/Riddles.html",
  "whispering-shadows": "/games/The%20Whispering%20Shadows/index.html",
};

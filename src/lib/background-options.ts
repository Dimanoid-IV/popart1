export const BACKGROUND_PALETTE_IDS = [
  "surprise",
  "turquoise",
  "lavender",
  "aqua",
  "coral",
  "sapphire",
] as const;

export type BackgroundPaletteId = (typeof BACKGROUND_PALETTE_IDS)[number];

const BACKGROUNDS: Record<Exclude<BackgroundPaletteId, "surprise">, string> = {
  turquoise:
    "Dream-art inspired layered background in deep turquoise, indigo and violet: luminous watercolor clouds, energetic paint splashes, fine ink lines, subtle bokeh particles and a soft radiant glow behind the subject; rich depth, brighter near the face and darker toward the edges",
  lavender:
    "Dream-art inspired layered background in magenta, lavender and electric blue: translucent watercolor blooms, expressive acrylic splatters, delicate flowing light trails, tiny glowing particles and soft atmospheric haze; vivid but harmonious, with clear separation around the subject",
  aqua:
    "Dream-art inspired layered background in teal, aqua and cool silver: abstract painted textures, dynamic white paint droplets, elegant curved linework, soft mist and scattered points of light; cinematic depth with a gentle central glow",
  coral:
    "Dream-art inspired layered background in coral, rose, purple and warm gold: watercolor washes, sweeping brush textures, controlled paint splashes, subtle sparkling dust and diffused light; dreamy, elegant and premium rather than childish",
  sapphire:
    "Dream-art inspired layered background in sapphire blue, violet and white: dramatic grunge texture softened by watercolor, radial light accents, floating bokeh, fine ornamental strokes and crisp paint splashes; balanced negative space around the head and shoulders",
};

const PALETTE_IDS = Object.keys(BACKGROUNDS) as Array<Exclude<BackgroundPaletteId, "surprise">>;

export function selectBackgrounds(
  requestedPalette: unknown,
  random: () => number = Math.random
): [string, string] {
  if (
    typeof requestedPalette === "string" &&
    requestedPalette !== "surprise" &&
    Object.hasOwn(BACKGROUNDS, requestedPalette)
  ) {
    const background = BACKGROUNDS[requestedPalette as keyof typeof BACKGROUNDS];
    return [background, background];
  }

  const firstIndex = Math.floor(random() * PALETTE_IDS.length);
  let secondIndex = Math.floor(random() * (PALETTE_IDS.length - 1));
  if (secondIndex >= firstIndex) secondIndex += 1;

  return [BACKGROUNDS[PALETTE_IDS[firstIndex]], BACKGROUNDS[PALETTE_IDS[secondIndex]]];
}

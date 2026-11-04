/**
 * The paint chart. Every car record names its factory paint ("Grijs (Moonstone Grey)"); the site
 * mounts each car on a flat field of that paint. Known paint names map to a measured tone, anything
 * else falls back on the base colour word. `light` says whether text on the field must be dark.
 */

export type Paint = { name: string; hex: string; light: boolean };

const named: [RegExp, string][] = [
  [/moonstone/i, "#a4a8aa"],
  [/dolphin/i, "#565b5f"],
  [/urano/i, "#6d7276"],
  [/pure grey|pure gray/i, "#8b8f90"],
  [/brooklyn/i, "#8e9294"],
  [/sophisto/i, "#5f6468"],
  [/mineral/i, "#666b6f"],
  [/nardo/i, "#9a9d9c"],
  [/deep black|mythos|black sapphire|saphirschwarz|panther/i, "#17181b"],
  [/lapiz|lapis/i, "#1f4c9c"],
  [/ara bla|ara blue|ascari/i, "#244f8f"],
  [/atlantic/i, "#22395c"],
  [/kings red|tornado|misano/i, "#9b1c1f"],
  [/oryx|pure white|glacier|alpine/i, "#e7e6e1"],
];

const base: [RegExp, string][] = [
  [/zwart|black/i, "#17181b"],
  [/blauw|blue/i, "#25426e"],
  [/wit|white/i, "#e7e6e1"],
  [/rood|red/i, "#9b1c1f"],
  [/groen|green/i, "#33463a"],
  [/zilver|silver/i, "#a9adb0"],
  [/grijs|grey|gray/i, "#6d7276"],
];

/** Ink of the page when a car has no paint on record. */
const fallback = "#2a2d31";

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** "Grijs (Moonstone Grey)" → { name: "Moonstone Grey", hex, light } */
export function paintOf(color: string | null | undefined): Paint {
  const value = color ?? "";
  const inner = value.match(/\(([^)]+)\)/)?.[1]?.trim();
  const hex =
    named.find(([re]) => re.test(value))?.[1] ?? base.find(([re]) => re.test(value))?.[1] ?? fallback;
  // Above a luminance of 0.2, ink reads better on the field than white does.
  return { name: inner || value.split("(")[0].trim(), hex, light: luminance(hex) > 0.2 };
}

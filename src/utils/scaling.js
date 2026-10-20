export const SCALES = [1, 2, 3, 4];

const FRACTIONS = [
  [0, ""],
  [1 / 8, "⅛"],
  [1 / 4, "¼"],
  [1 / 3, "⅓"],
  [3 / 8, "⅜"],
  [1 / 2, "½"],
  [5 / 8, "⅝"],
  [2 / 3, "⅔"],
  [3 / 4, "¾"],
  [7 / 8, "⅞"],
  [1, ""],
];

// 0.75 -> "¾", 1.5 -> "1 ½", 3 -> "3". Falls back to a rounded decimal.
export function formatAmount(value) {
  if (!(value > 0)) return "";
  if (value >= 20) return String(Math.round(value));

  let whole = Math.floor(value);
  const rest = value - whole;
  const [closest, symbol] = FRACTIONS.reduce((best, option) =>
    Math.abs(option[0] - rest) < Math.abs(best[0] - rest) ? option : best
  );

  if (Math.abs(closest - rest) > 0.04) return String(Math.round(value * 100) / 100);
  if (closest === 1) whole += 1;

  const text = [whole || "", symbol].filter(Boolean).join(" ");
  return text || String(Math.round(value * 100) / 100);
}

const PLURALS = {
  cup: "cups",
  clove: "cloves",
  can: "cans",
  slice: "slices",
  piece: "pieces",
  bunch: "bunches",
  pinch: "pinches",
  dash: "dashes",
  sprig: "sprigs",
  stalk: "stalks",
  head: "heads",
  package: "packages",
  pound: "pounds",
  ounce: "ounces",
  handful: "handfuls",
  leaf: "leaves",
};
const SINGULARS = Object.fromEntries(Object.entries(PLURALS).map(([one, many]) => [many, one]));

// Used only to decide whether two ingredients are the same item.
const unitKey = (unit = "") => {
  const lower = unit.toLowerCase();
  return SINGULARS[lower] ?? lower;
};
const nameKey = (name) => {
  const lower = name.toLowerCase();
  return lower.length > 3 && lower.endsWith("s") && !lower.endsWith("ss") ? lower.slice(0, -1) : lower;
};

function displayUnit(unit, amount) {
  if (!unit) return "";
  const lower = unit.toLowerCase();
  if (amount > 1 && PLURALS[lower]) return PLURALS[lower];
  if (amount <= 1 && SINGULARS[lower]) return SINGULARS[lower];
  return unit;
}

// One ingredient as a line of text, multiplied by the scale factor.
export function ingredientText(item, factor = 1) {
  const amount = item.amount ? item.amount * factor : 0;
  const text = [formatAmount(amount), displayUnit(item.unit, amount), item.name]
    .filter(Boolean)
    .join(" ");
  return item.note ? `${text}, ${item.note}` : text;
}

// Merges the ingredients of several recipes into one shopping list.
// Each recipe is multiplied by its own scale, and matching items are added up.
export function combineIngredients(recipes) {
  const entries = new Map();

  recipes.forEach((recipe) => {
    const factor = recipe.scale ?? 1;

    if (recipe.ingredientItems?.length) {
      recipe.ingredientItems.forEach((item) => {
        const name = (item.name || "").trim();
        if (!name) return;

        const key = `${nameKey(name)}|${unitKey(item.unit || "")}`;
        const amount = (item.amount || 0) * factor;
        const entry = entries.get(key);

        if (entry) {
          entry.amount += amount;
        } else {
          entries.set(key, { name, unit: item.unit, amount });
        }
      });
    } else {
      // Older saved recipes only have text lines, so they cannot be scaled or added up.
      (recipe.ingredients || []).forEach((line) => {
        const key = `text|${line.trim().toLowerCase()}`;
        if (!entries.has(key)) entries.set(key, { text: line.trim() });
      });
    }
  });

  return [...entries.values()].map(
    (entry) => entry.text ?? ingredientText({ amount: entry.amount, unit: entry.unit, name: entry.name })
  );
}

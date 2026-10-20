const BASE_URL = "https://api.spoonacular.com";
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

export const PAGE_SIZE = 12;

export class ApiError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind;
  }
}

// Turns an ApiError into a message a person can act on.
export function errorMessage(error) {
  switch (error.kind) {
    case "missing-key":
      return "No API key found. Add VITE_SPOONACULAR_API_KEY to your .env.local file and restart the dev server.";
    case "network":
      return "Network error. Check your connection.";
    case "auth":
      return "The API key was rejected. Check that it is correct.";
    case "quota":
      return "The daily API limit was reached. Try again tomorrow.";
    default:
      return "API error. Try again later.";
  }
}

async function request(path, params = {}) {
  if (!API_KEY) throw new ApiError("missing-key");

  const url = new URL(BASE_URL + path);
  Object.entries({ ...params, apiKey: API_KEY }).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, value);
  });

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new ApiError("network");
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new ApiError("auth");
    if (response.status === 402 || response.status === 429) throw new ApiError("quota");
    throw new ApiError("server");
  }

  return response.json();
}

const positive = (n) => (typeof n === "number" && n > 0 ? n : null);

const nutrient = (raw, name) => {
  const found = raw.nutrition?.nutrients?.find((n) => n.name === name);
  return found ? Math.round(found.amount) : null;
};

// Prefers the recipe's own ingredient lines. If the search response does not
// include them, falls back to the ingredient list inside the nutrition data.
const ingredientLines = (raw) => {
  if (raw.extendedIngredients?.length) {
    return raw.extendedIngredients.map((i) => i.original);
  }
  return (
    raw.nutrition?.ingredients?.map((i) =>
      [typeof i.amount === "number" ? Math.round(i.amount * 100) / 100 : "", i.unit, i.name]
        .filter(Boolean)
        .join(" ")
    ) ?? []
  );
};

// Ingredients with separate amount, unit, and name, so they can be scaled.
const ingredientItems = (raw) => {
  const source = raw.extendedIngredients?.length
    ? raw.extendedIngredients
    : raw.nutrition?.ingredients ?? [];

  return source
    .filter((i) => i.name)
    .map((i) => ({
      amount: typeof i.amount === "number" ? i.amount : 0,
      unit: i.unit || "",
      name: i.name,
      note: Array.isArray(i.meta) ? i.meta.join(", ") : "",
    }));
};

// Converts the API shape into the small, consistent shape the app uses
// everywhere (cards, modal, favorites, shopping list).
export function normalizeRecipe(raw) {
  return {
    id: raw.id,
    title: raw.title,
    image: raw.image || null,
    readyInMinutes: positive(raw.readyInMinutes),
    prepMinutes: positive(raw.preparationMinutes),
    cookMinutes: positive(raw.cookingMinutes),
    servings: raw.servings ?? null,
    rating:
      typeof raw.spoonacularScore === "number"
        ? Math.round((raw.spoonacularScore / 20) * 10) / 10
        : null,
    nutrition: {
      calories: nutrient(raw, "Calories"),
      protein: nutrient(raw, "Protein"),
      carbs: nutrient(raw, "Carbohydrates"),
      fat: nutrient(raw, "Fat"),
    },
    ingredients: ingredientLines(raw),
    ingredientItems: ingredientItems(raw),
    steps: raw.analyzedInstructions?.[0]?.steps?.map((s) => s.step) ?? [],
    sourceUrl: raw.sourceUrl ?? null,
  };
}

// One call returns the cards' data AND the full details, so opening a
// recipe usually costs no extra request.
export async function searchRecipes(params, offset = 0) {
  const data = await request("/recipes/complexSearch", {
    ...params,
    number: PAGE_SIZE,
    offset,
    addRecipeInformation: true,
    addRecipeNutrition: true,
  });
  return {
    recipes: data.results.map(normalizeRecipe),
    total: data.totalResults,
  };
}

// Fallback used by the modal if a recipe arrived without full details.
export async function getRecipeDetails(id) {
  const raw = await request(`/recipes/${id}/information`, {
    includeNutrition: true,
  });
  return normalizeRecipe(raw);
}

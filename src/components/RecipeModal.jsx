import { useEffect, useRef, useState } from "react";
import {
  LuHeart,
  LuX,
  LuClock,
  LuFlame,
  LuUsers,
  LuGauge,
  LuList,
  LuListOrdered,
  LuShoppingCart,
} from "react-icons/lu";
import { getRecipeDetails, errorMessage } from "../api/spoonacular";
import { SCALES, ingredientText } from "../utils/scaling";
import RecipeImage from "./RecipeImage";

// Fetches the full recipe when it is missing ingredient amounts (needed for scaling),
// ingredient lines, or nutrition.
const needsDetails = (recipe) =>
  recipe.ingredients.length === 0 ||
  recipe.nutrition.calories == null ||
  !recipe.ingredientItems?.length;

export default function RecipeModal({
  recipe,
  isFavorite,
  inShoppingList,
  onToggleFavorite,
  onToggleShoppingList,
  onUpdateFavorite,
  onClose,
}) {
  const [full, setFull] = useState(recipe);
  const [scale, setScale] = useState(recipe.scale ?? 1);
  const [loading, setLoading] = useState(needsDetails(recipe));
  const [error, setError] = useState("");
  const closeRef = useRef(null);

  // Only fetches when the search results did not include full details.
  useEffect(() => {
    if (!needsDetails(recipe)) return;
    let cancelled = false;

    getRecipeDetails(recipe.id)
      .then((details) => {
        if (!cancelled) setFull(details);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [recipe]);

  // If this recipe is a favorite and fuller details just arrived, save them onto it
  // so scaling and the shopping list can use them.
  useEffect(() => {
    if (isFavorite && full !== recipe) onUpdateFavorite({ ...full, scale });
    // Only when new details arrive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full]);

  // Focus the close button, close on Escape, and lock page scrolling.
  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const { title, image, readyInMinutes, prepMinutes, cookMinutes, servings } = full;
  const { nutrition, ingredients, ingredientItems, steps, sourceUrl } = full;
  const scalable = Boolean(ingredientItems?.length);

  // For a saved favorite, the new scale is stored so the shopping list uses it.
  const changeScale = (value) => {
    setScale(value);
    if (isFavorite) onUpdateFavorite({ ...full, scale: value });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <div className="section-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onToggleFavorite({ ...full, scale })}
            >
              <LuHeart aria-hidden="true" fill={isFavorite ? "currentColor" : "none"} />{" "}
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                onUpdateFavorite({ ...full, scale });
                onToggleShoppingList(full.id);
              }}
              disabled={!isFavorite}
              aria-describedby={isFavorite ? undefined : "shopping-hint"}
            >
              <LuShoppingCart aria-hidden="true" />{" "}
              {inShoppingList ? "Remove from Shopping List" : "Add to Shopping List"}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose} ref={closeRef}>
              <LuX aria-hidden="true" /> Close
            </button>
            {!isFavorite && (
              <p id="shopping-hint" className="modal-hint">
                Add this recipe to your favorites to put it on your shopping list.
              </p>
            )}
          </div>
        </div>

        <div className="modal-body">
          {loading && (
            <p className="loading" role="status">
              <span className="spinner" aria-hidden="true" /> Loading recipe details...
            </p>
          )}
          {error && (
            <p className="message" role="alert">
              {error}
            </p>
          )}

          <div className="modal-top">
            <RecipeImage src={image} alt={title} className="modal-image" />
            <div className="modal-info">
              <ul className="stat-list">
                {prepMinutes != null && (
                  <li>
                    <LuClock aria-hidden="true" /> Prep: {prepMinutes} min
                  </li>
                )}
                {cookMinutes != null && (
                  <li>
                    <LuFlame aria-hidden="true" /> Cook: {cookMinutes} min
                  </li>
                )}
                {prepMinutes == null && cookMinutes == null && readyInMinutes != null && (
                  <li>
                    <LuClock aria-hidden="true" /> Ready in: {readyInMinutes} min
                  </li>
                )}
                {servings != null && (
                  <li>
                    <LuUsers aria-hidden="true" /> Serves: {servings * scale}
                    {scale > 1 ? ` (${scale}x recipe)` : ""}
                  </li>
                )}
                {nutrition.calories != null && (
                  <li>
                    <LuGauge aria-hidden="true" /> Calories: {nutrition.calories} per serving
                  </li>
                )}
                {nutrition.protein != null && <li>Protein: {nutrition.protein} g</li>}
                {nutrition.carbs != null && <li>Carbs: {nutrition.carbs} g</li>}
                {nutrition.fat != null && <li>Fat: {nutrition.fat} g</li>}
              </ul>

              <div className="scale-control" role="group" aria-label="Scale recipe">
                <span className="scale-label">Make</span>
                {SCALES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="scale-btn"
                    aria-pressed={scale === value}
                    disabled={!scalable}
                    onClick={() => changeScale(value)}
                  >
                    {value}x
                  </button>
                ))}
                <p className="scale-hint">
                  {scalable
                    ? "Ingredient amounts and your shopping list change to match. Nutrition stays per serving."
                    : "Scaling is not available for this recipe. If it is an older favorite, remove it and save it again from a new search."}
                </p>
              </div>
            </div>
          </div>

          <div className="modal-columns">
            <section>
              <h3>
                <LuList aria-hidden="true" /> Ingredients
              </h3>
              {scalable ? (
                <ul className="ingredient-list">
                  {ingredientItems.map((item, index) => (
                    <li key={`${index}-${item.name}`}>{ingredientText(item, scale)}</li>
                  ))}
                </ul>
              ) : ingredients.length > 0 ? (
                <ul className="ingredient-list">
                  {ingredients.map((text, index) => (
                    <li key={`${index}-${text}`}>{text}</li>
                  ))}
                </ul>
              ) : (
                <p className="hint">No ingredients listed.</p>
              )}
            </section>

            <section>
              <h3>
                <LuListOrdered aria-hidden="true" /> Cooking Instructions
              </h3>
              {steps.length > 0 ? (
                <ol className="step-list">
                  {steps.map((step, index) => (
                    <li key={`${index}-${step}`}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="hint">No instructions available for this recipe.</p>
              )}
              {sourceUrl && (
                <p className="hint">
                  <a href={sourceUrl} target="_blank" rel="noreferrer">
                    View the original recipe
                  </a>
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

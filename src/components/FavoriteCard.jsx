import { LuEye, LuTrash2, LuCheck } from "react-icons/lu";
import RecipeImage from "./RecipeImage";

export default function FavoriteCard({ recipe, selected, onToggleSelect, onView, onRemove }) {
  const details = [
    recipe.readyInMinutes != null && `${recipe.readyInMinutes} min`,
    recipe.servings != null && `${recipe.servings * (recipe.scale ?? 1)} servings`,
    (recipe.scale ?? 1) > 1 && `${recipe.scale}x recipe`,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <article className={`favorite-card ${selected ? "selected" : ""}`}>
      {/* Clicking the picture or title selects the card for the shopping list. I might change it later */}
      <button
        type="button"
        className="favorite-select"
        aria-pressed={selected}
        title="Select for shopping list"
        onClick={() => onToggleSelect(recipe.id)}
      >
        <RecipeImage src={recipe.image} className="favorite-thumb" />
        <span className="favorite-info">
          <span className="favorite-title">{recipe.title}</span>
          <span className="favorite-details">{details}</span>
        </span>
      </button>

      {selected && (
        <span className="selected-badge" aria-hidden="true">
          <LuCheck />
        </span>
      )}

      <div className="favorite-actions">
        <button
          type="button"
          className="icon-btn view"
          aria-label={`View ${recipe.title}`}
          onClick={() => onView(recipe)}
        >
          <LuEye aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn remove"
          aria-label={`Remove ${recipe.title} from favorites`}
          onClick={() => onRemove(recipe)}
        >
          <LuTrash2 aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

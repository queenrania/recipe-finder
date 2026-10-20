import { LuClock, LuUsers, LuFlame, LuStar, LuHeart, LuEye } from "react-icons/lu";
import RecipeImage from "./RecipeImage";

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite, onView }) {
  const { title, image, readyInMinutes, servings, nutrition, rating } = recipe;

  return (
    <article className="recipe-card">
      <RecipeImage src={image} className="card-image" />
      <div className="card-body">
        <h3>{title}</h3>

        <ul className="card-meta">
          {readyInMinutes != null && (
            <li>
              <LuClock aria-hidden="true" /> {readyInMinutes} min
            </li>
          )}
          {servings != null && (
            <li>
              <LuUsers aria-hidden="true" /> {servings} servings
            </li>
          )}
          {nutrition.calories != null && (
            <li>
              <LuFlame aria-hidden="true" /> {nutrition.calories} cal
            </li>
          )}
          {rating != null && (
            <li>
              <LuStar aria-hidden="true" /> {rating.toFixed(1)}
            </li>
          )}
        </ul>

        <div className="card-actions">
          <button
            type="button"
            className={`icon-btn ${isFavorite ? "favorited" : ""}`}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
            onClick={() => onToggleFavorite(recipe)}
          >
            <LuHeart aria-hidden="true" fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onView(recipe)}>
            <LuEye aria-hidden="true" /> View Recipe
          </button>
        </div>
      </div>
    </article>
  );
}

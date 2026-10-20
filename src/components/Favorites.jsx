import { LuHeart, LuDownload, LuTrash2 } from "react-icons/lu";
import FavoriteCard from "./FavoriteCard";

export default function Favorites({
  favorites,
  onView,
  onRemove,
  onExport,
  onClear,
  selectedIds,
  onToggleSelect,
}) {
  const isEmpty = favorites.length === 0;

  return (
    <section className="results" aria-labelledby="favorites-heading">
      <div className="panel section-header">
        <h2 id="favorites-heading">
          <LuHeart aria-hidden="true" /> Your Favorite Recipes
        </h2>
        <div className="section-actions">
          <button type="button" className="btn btn-outline" onClick={onExport} disabled={isEmpty}>
            <LuDownload aria-hidden="true" /> Export Favorites
          </button>
          <button type="button" className="btn btn-outline" onClick={onClear} disabled={isEmpty}>
            <LuTrash2 aria-hidden="true" /> Clear All
          </button>
        </div>
      </div>

      <div className="panel">
        {isEmpty ? (
          <div className="empty-state" role="status">
            <LuHeart aria-hidden="true" />
            <h3>No favorite recipes yet</h3>
            <p>Search for recipes and add them to your favorites for quick access</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((recipe) => (
              <FavoriteCard
                key={recipe.id}
                recipe={recipe}
                selected={selectedIds.includes(recipe.id)}
                onToggleSelect={onToggleSelect}
                onView={onView}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

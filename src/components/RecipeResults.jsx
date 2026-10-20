import { useState } from "react";
import { LuUtensils, LuX, LuPlus, LuSearchX, LuRotateCcw } from "react-icons/lu";
import RecipeCard from "./RecipeCard";

// Sorting happens in the browser, so it costs no API requests.
const SORTERS = {
  relevance: null,
  time: (a, b) => (a.readyInMinutes ?? Infinity) - (b.readyInMinutes ?? Infinity),
  calories: (a, b) => (a.nutrition.calories ?? Infinity) - (b.nutrition.calories ?? Infinity),
  rating: (a, b) => (b.rating ?? -1) - (a.rating ?? -1),
};

export default function RecipeResults({
  results,
  status,
  message,
  hasMore,
  isFavorite,
  onToggleFavorite,
  onView,
  onLoadMore,
  onClear,
  canRelax,
  onRelax,
}) {
  const [sortBy, setSortBy] = useState("relevance");
  const sorter = SORTERS[sortBy];
  const sorted = sorter ? [...results].sort(sorter) : results;

  return (
    <section className="results" aria-labelledby="results-heading">
      <div className="panel section-header">
        <h2 id="results-heading">
          <LuUtensils aria-hidden="true" /> Recipe Results
        </h2>
        <div className="section-actions">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort recipes"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="time">Sort by Time</option>
            <option value="calories">Sort by Calories</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <button type="button" className="btn btn-outline" onClick={onClear}>
            <LuX aria-hidden="true" /> Clear Results
          </button>
        </div>
      </div>

      {status === "loading" && (
        <div className="loading" role="status">
          <span className="spinner" aria-hidden="true" /> Finding recipes...
        </div>
      )}

      {status === "empty" && (
        <div className="panel">
          <div className="empty-state" role="status">
            <LuSearchX aria-hidden="true" />
            <h3>No recipes found</h3>
            <p>Nothing in the recipe catalog matched that combo of words. Instead, try:</p>
            <ul className="tips">
              <li>Checking the spelling or use a one word, like "cake" instead of "date cake".</li>
              <li>Use fewer ingredients or filters.</li>
              <li>Try the General Search tab for a broader keyword search.</li>
            </ul>
            {canRelax && (
              <button type="button" className="btn btn-primary" onClick={onRelax}>
                <LuRotateCcw aria-hidden="true" /> Try again without filters
              </button>
            )}
          </div>
        </div>
      )}

      {message && (
        <p className="message" role="alert">
          {message}
        </p>
      )}

      {status !== "loading" && sorted.length > 0 && (
        <div className="recipe-grid">
          {sorted.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              onView={onView}
            />
          ))}
        </div>
      )}

      {hasMore && status !== "loading" && (
        <div className="load-more">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onLoadMore}
            disabled={status === "loadingMore"}
          >
            <LuPlus aria-hidden="true" />{" "}
            {status === "loadingMore" ? "Loading..." : "Load More Recipes"}
          </button>
        </div>
      )}
    </section>
  );
}

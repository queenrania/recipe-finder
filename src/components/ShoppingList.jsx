import { LuShoppingCart } from "react-icons/lu";
import { combineIngredients } from "../utils/scaling";

export default function ShoppingList({
  favoritesCount,
  selected,
  listRecipes,
  doneItems,
  onSelectAll,
  onClearAll,
  onGenerate,
  onToggleDone,
}) {
  const allSelected = favoritesCount > 0 && selected.length === favoritesCount;

  // Built from the recipes on the list, using each recipe's own scale. Selecting a
  // card does not change it: that happens when Generate is pressed or a recipe is
  // added from its window.
  const items =
    listRecipes.length > 0
      ? combineIngredients(listRecipes).map((text) => ({ text, done: doneItems.includes(text) }))
      : null;

  return (
    <section className="panel" aria-labelledby="shopping-heading">
      <div className="section-header">
        <h2 id="shopping-heading">
          <LuShoppingCart aria-hidden="true" /> Shopping List Generator
        </h2>
        <div className="section-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onSelectAll}
            disabled={favoritesCount === 0 || allSelected}
          >
            Select all
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClearAll}
            disabled={selected.length === 0 && listRecipes.length === 0}
          >
            Clear all
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onGenerate}
            disabled={selected.length === 0}
          >
            Generate from Selected ({selected.length})
          </button>
        </div>
      </div>

      <p className="hint">Select one or more cards from your favorites to generate a shopping list.</p>

      {items !== null && items.length === 0 && (
        <p className="hint">
          The selected favorites are missing ingredient details. Remove them and save them again
          from a new search.
        </p>
      )}

      {items !== null && items.length > 0 && (
        <ul className="shopping-list">
          {items.map((item, index) => (
            <li key={`${index}-${item.text}`}>
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onToggleDone(item.text)}
                />
                <span className={item.done ? "done" : ""}>{item.text}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { searchRecipes, errorMessage } from "./api/spoonacular";
import Header from "./components/Header";
import SearchPanel from "./components/SearchPanel";
import RecipeResults from "./components/RecipeResults";
import Favorites from "./components/Favorites";
import ShoppingList from "./components/ShoppingList";
import RecipeModal from "./components/RecipeModal";
import Toast from "./components/Toast";

// Used to decide whether "Try again without filters" makes sense.
const FILTER_KEYS = ["diet", "intolerances", "cuisine"];
const TEXT_KEYS = ["query", "includeIngredients"];

const canRelax = (params) =>
  Boolean(params) &&
  FILTER_KEYS.some((key) => key in params) &&
  TEXT_KEYS.some((key) => key in params);

export default function App() {
  const [favorites, setFavorites] = useLocalStorage("recipehub_favorites", []);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [lastParams, setLastParams] = useState(null);
  // idle | loading | loadingMore | done | empty | error
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  // Which favorites are ticked for the shopping list.
  const [shoppingIds, setShoppingIds] = useState([]);
  // The recipes that are on the shopping list. Selecting cards only stages them:
  // the list changes when Generate is pressed or the recipe window's button is used.
  const [listIds, setListIds] = useState([]);
  const [doneItems, setDoneItems] = useState([]);
  // Bumped to tell the search panel to clear its diet and cuisine dropdowns.
  const [filterResetCount, setFilterResetCount] = useState(0);

  // Lets a newer search win if an older one finishes late.
  const latestSearch = useRef(0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const runSearch = async (params) => {
    const searchId = ++latestSearch.current;
    setStatus("loading");
    setMessage("");
    setLastParams(params);

    try {
      const { recipes, total } = await searchRecipes(params);
      if (searchId !== latestSearch.current) return;

      setResults(recipes);
      setTotal(total);
      setStatus(recipes.length === 0 ? "empty" : "done");
    } catch (error) {
      if (searchId !== latestSearch.current) return;

      setResults([]);
      setTotal(0);
      setMessage(errorMessage(error));
      setStatus("error");
    }
  };

  const loadMore = async () => {
    setStatus("loadingMore");
    setMessage("");

    try {
      const { recipes } = await searchRecipes(lastParams, results.length);
      setResults((previous) => {
        const known = new Set(previous.map((recipe) => recipe.id));
        return [...previous, ...recipes.filter((recipe) => !known.has(recipe.id))];
      });
    } catch (error) {
      setMessage(errorMessage(error));
    }
    setStatus("done");
  };

  const clearResults = () => {
    latestSearch.current++;
    setResults([]);
    setTotal(0);
    setLastParams(null);
    setMessage("");
    setStatus("idle");
  };

  const retryWithoutFilters = () => {
    const relaxed = { ...lastParams };
    FILTER_KEYS.forEach((key) => delete relaxed[key]);
    setFilterResetCount((count) => count + 1);
    runSearch(relaxed);
  };

  const isFavorite = (id) => favorites.some((recipe) => recipe.id === id);

  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.id)) {
      setFavorites(favorites.filter((item) => item.id !== recipe.id));
      setToast("Removed from favorites");
    } else {
      setFavorites([...favorites, recipe]);
      setToast("Added to favorites");
    }
  };

  const clearFavorites = () => {
    if (window.confirm("Remove all favorite recipes?")) setFavorites([]);
  };

  const exportFavorites = () => {
    const blob = new Blob([JSON.stringify(favorites, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "favorite-recipes.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleShopping = (id) => {
    setShoppingIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  };

  const selectAllForShopping = () => setShoppingIds(favorites.map((recipe) => recipe.id));

  const clearShoppingAll = () => {
    setShoppingIds([]);
    setListIds([]);
    setDoneItems([]);
  };

  const toggleDone = (text) => {
    setDoneItems((list) => (list.includes(text) ? list.filter((item) => item !== text) : [...list, text]));
  };

  // The recipe window's button: puts the recipe on the list (and selects its card),
  // or takes it off again.
  const toggleShoppingFromModal = (id) => {
    const adding = !listIds.includes(id);
    setListIds((ids) => (adding ? [...ids, id] : ids.filter((item) => item !== id)));
    setShoppingIds((ids) => {
      if (adding) return ids.includes(id) ? ids : [...ids, id];
      return ids.filter((item) => item !== id);
    });
    setToast(adding ? "Added to shopping list" : "Removed from shopping list");
  };

  // Only favorites that still exist count, so removing one cleans up on its own.
  const selectedFavorites = favorites.filter((recipe) => shoppingIds.includes(recipe.id));
  const listFavorites = favorites.filter((recipe) => listIds.includes(recipe.id));

  // Saves newer details (like the scale or full ingredient data) onto a favorite.
  const updateFavorite = (recipe) => {
    setFavorites((list) =>
      list.map((item) => (item.id === recipe.id ? { ...item, ...recipe } : item))
    );
  };

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <>
      <Header favoritesCount={favorites.length} recipesFound={results.length} />

      <main className="container">
        <SearchPanel
          onSearch={runSearch}
          loading={status === "loading"}
          filterResetCount={filterResetCount}
        />

        {status !== "idle" && (
          <RecipeResults
            results={results}
            status={status}
            message={message}
            hasMore={results.length < total}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onView={setSelected}
            onLoadMore={loadMore}
            onClear={clearResults}
            canRelax={canRelax(lastParams)}
            onRelax={retryWithoutFilters}
          />
        )}

        <Favorites
          favorites={favorites}
          onView={setSelected}
          onRemove={toggleFavorite}
          onExport={exportFavorites}
          onClear={clearFavorites}
          selectedIds={shoppingIds}
          onToggleSelect={toggleShopping}
        />

        <ShoppingList
          favoritesCount={favorites.length}
          selected={selectedFavorites}
          listRecipes={listFavorites}
          doneItems={doneItems}
          onSelectAll={selectAllForShopping}
          onClearAll={clearShoppingAll}
          onGenerate={() => setListIds(selectedFavorites.map((recipe) => recipe.id))}
          onToggleDone={toggleDone}
        />
      </main>

      {selected && (
        <RecipeModal
          key={selected.id}
          recipe={selected}
          isFavorite={isFavorite(selected.id)}
          inShoppingList={isFavorite(selected.id) && listIds.includes(selected.id)}
          onToggleFavorite={toggleFavorite}
          onToggleShoppingList={toggleShoppingFromModal}
          onUpdateFavorite={updateFavorite}
          onClose={closeModal}
        />
      )}

      <Toast message={toast} />
    </>
  );
}

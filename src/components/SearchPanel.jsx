import { useState } from "react";
import { LuSearch, LuCarrot, LuGlobe, LuLeaf } from "react-icons/lu";
import { CUISINES, DIETS } from "../data/searchOptions";

const TABS = [
  { id: "general", label: "General Search", Icon: LuSearch },
  { id: "ingredients", label: "By Ingredients", Icon: LuCarrot },
  { id: "cuisine", label: "By Cuisine", Icon: LuGlobe },
  { id: "diet", label: "Dietary Restrictions", Icon: LuLeaf },
];

export default function SearchPanel({ onSearch, loading, filterResetCount }) {
  const [tab, setTab] = useState("ingredients");
  const [ingredients, setIngredients] = useState("");
  const [query, setQuery] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("");
  const [activeDiet, setActiveDiet] = useState("");
  // Optional filters that can be combined with the text searches.
  const [dietFilter, setDietFilter] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [error, setError] = useState("");

  // When the app asks for a reset, clear the dropdowns. Adjusting state
  // during render like this avoids an extra effect.
  const [seenReset, setSeenReset] = useState(filterResetCount);
  if (seenReset !== filterResetCount) {
    setSeenReset(filterResetCount);
    setDietFilter("");
    setCuisineFilter("");
  }

  const ingredientList = ingredients
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const changeTab = (id) => {
    setTab(id);
    setError("");
  };

  // Adds whichever optional filters are chosen to the search.
  const withFilters = (params) => {
    const result = { ...params };
    const diet = DIETS.find((option) => option.label === dietFilter);
    if (diet) result[diet.param] = diet.value;
    if (cuisineFilter) result.cuisine = cuisineFilter;
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasFilter = dietFilter !== "" || cuisineFilter !== "";

    if (tab === "ingredients") {
      if (ingredientList.length === 0) {
        setError("Enter at least one ingredient.");
        return;
      }
      onSearch(withFilters({ includeIngredients: ingredientList.join(",") }));
    } else {
      const text = query.trim();
      if (text === "" && !hasFilter) {
        setError("Enter a keyword, or choose a diet or cuisine.");
        return;
      }
      onSearch(withFilters(text ? { query: text } : {}));
    }
    setError("");
  };

  const pickCuisine = (name) => {
    setActiveCuisine(name);
    onSearch({ cuisine: name });
  };

  const pickDiet = (option) => {
    setActiveDiet(option.label);
    onSearch({ [option.param]: option.value });
  };

  return (
    <section className="panel" aria-labelledby="search-heading">
      <h2 id="search-heading" className="search-title">
        <LuSearch aria-hidden="true" /> Find Your Perfect Recipe
      </h2>

      <div className="tabs" role="tablist" aria-label="Search type">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className="tab"
            onClick={() => changeTab(id)}
          >
            <Icon aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      {(tab === "ingredients" || tab === "general") && (
        <>
          <form className="search-form" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              value={tab === "ingredients" ? ingredients : query}
              onChange={(e) => {
                if (tab === "ingredients") {
                  setIngredients(e.target.value);
                } else {
                  setQuery(e.target.value);
                }
                setError("");
              }}
              placeholder={
                tab === "ingredients" ? "bean, tofu, rice" : "Search for a recipe, like date cake"
              }
              aria-label={tab === "ingredients" ? "Ingredients, separated by commas" : "Recipe search"}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <LuSearch aria-hidden="true" /> Find Recipes
            </button>
          </form>

          <div className="filters">
            <label>
              Diet (optional)
              <select value={dietFilter} onChange={(e) => setDietFilter(e.target.value)}>
                <option value="">Any diet</option>
                {DIETS.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cuisine (optional)
              <select value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)}>
                <option value="">Any cuisine</option>
                {CUISINES.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {tab === "cuisine" && (
        <div className="option-grid">
          {CUISINES.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              className={`option-btn ${activeCuisine === name ? "active" : ""}`}
              onClick={() => pickCuisine(name)}
            >
              <Icon aria-hidden="true" /> {name}
            </button>
          ))}
        </div>
      )}

      {tab === "diet" && (
        <div className="option-grid diet">
          {DIETS.map((option) => (
            <button
              key={option.label}
              type="button"
              className={`option-btn ${activeDiet === option.label ? "active" : ""}`}
              onClick={() => pickDiet(option)}
            >
              <option.Icon aria-hidden="true" /> {option.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

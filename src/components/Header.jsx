import { LuChefHat } from "react-icons/lu";

export default function Header({ favoritesCount, recipesFound }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <h1 className="logo">
          <LuChefHat aria-hidden="true" /> RecipeRepo
        </h1>
        <div className="header-stats">
          <div>
            <span>Favorites:</span>
            <strong>{favoritesCount}</strong>
          </div>
          <div>
            <span>Recipes Found:</span>
            <strong>{recipesFound}</strong>
          </div>
        </div>
      </div>
    </header>
  );
}

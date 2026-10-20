# RecipeHub

A recipe finder built with React and Vite. Search for recipes by ingredient, cuisine, or dietary need, open a recipe to see its full details and nutrition, and save favorites that stay on your device.

## Features

- Search by ingredients, cuisine, dietary restriction, or a general keyword
- Recipe cards with images, cooking time, servings, calories, and rating
- Recipe details window with ingredients, step-by-step instructions, prep and cook time, servings, and nutrition (calories, protein, carbs, fat)
- Favorites saved to localStorage, with no duplicates, plus remove, clear all, and export to a JSON file
- Sort results by time, calories, or rating
- "Load More Recipes" button for extra results
- Scale any recipe to 1x, 2x, 3x, or 4x in the recipe window, with ingredient amounts and servings updating to match
- An Add to Shopping List button in the recipe window for saved favorites, so you don't have to scroll back down
- Shopping list generator that combines the ingredients from the favorites you select, using each recipe's scale and adding up matching items
- Loading indicators and friendly messages for empty results, network problems, an invalid key, and the daily API limit
- Responsive layout for phones and desktops, with keyboard support and screen reader labels

## Built With

- React (functional components and hooks)
- Vite
- react-icons
- [Spoonacular Food API](https://spoonacular.com/food-api)

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A free Spoonacular API key from https://spoonacular.com/food-api

### Setup

1. Clone the repository and move into the folder:
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a file named `.env.local` in the project root and add your key:
   ```
   VITE_SPOONACULAR_API_KEY=your_key_here
   ```
   You can copy `.env.example` as a starting point. `.env.local` is ignored by git, so your key will not be committed.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local URL shown in your terminal (usually http://localhost:5173).

If you change `.env.local` while the server is running, stop it and run `npm run dev` again.

## Project Structure

```
src/
  App.jsx                 Owns search results, favorites, and the open recipe
  api/spoonacular.js      API requests, error handling, and data cleanup
  hooks/useLocalStorage.js
  data/searchOptions.jsx  Cuisine, diet, and popular ingredient options
  components/
    Header.jsx            Title and the favorites and results counts
    SearchPanel.jsx       Search tabs and inputs
    RecipeResults.jsx     Results header, sorting, grid, load more
    RecipeCard.jsx        One recipe in the results grid
    RecipeModal.jsx       Full recipe details window
    Favorites.jsx         Saved recipes with export and clear all
    FavoriteCard.jsx      One saved recipe
    ShoppingList.jsx      Combined ingredient checklist
    RecipeImage.jsx       Image with a fallback placeholder
    Toast.jsx             Short confirmation messages
```

## Notes

- The free Spoonacular plan has a daily limit on requests. Each search returns full recipe details in a single request, so opening a recipe does not use extra requests.
- The API key is used in the browser, so treat it as a class project key and not as a secret for a public production app.

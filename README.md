# RecipeHub

RecipeHub is a recipe finder built with React. Search a large recipe catalog by ingredient, cuisine, diet, or keyword, open any recipe for the full details, scale it up for a crowd, and turn the recipes you save into one combined shopping list.

## What You Can Do

### Find recipes
- **Four ways to search:** by comma-separated ingredient list, by cuisine, by dietary restriction, or by general keyword.
- **Cuisines:** Italian, Mexican, Asian, American, Indian, and Mediterranean.
- **Dietary options:** Vegetarian, Vegan, Gluten-Free, Dairy-Free, Keto, and Paleo.
- **Combine filters:** the ingredients and keyword searches have optional Diet and Cuisine dropdowns, so you can ask for something like "date cake" that is also vegan. On the keyword tab you can skip the text and browse by filters alone.
- **Helpful dead ends:** when nothing matches, a friendly screen offers search tips and a "Try again without filters" button that re-runs the search with the diet and cuisine filters removed.
- **Clear feedback:** loading spinners while results arrive, and plain-language messages for network problems, an invalid API key, or a reached daily limit.

### Browse results
- Recipe cards show a photo, cooking time, servings, calories, and a rating. Recipes without a photo get a neutral placeholder.
- Sort results by relevance, cooking time, calories, or rating.
- Load more recipes in batches, or clear the results to start over.
- The header keeps a running count of your favorites and the recipes found.

### Read a recipe
- The recipe window shows a large photo, prep and cook time (or total time when the source doesn't separate them), servings, and calories per serving with protein, carbs, and fat.
- Full ingredient list and step-by-step instructions, with a link back to the original recipe.
- Close it with the Close button, the Escape key, or a click outside the window.

### Scale a recipe
- Choose **1x, 2x, 3x, or 4x** in the recipe window and every ingredient amount and the serving count change to match.
- Amounts are shown the way people cook: fractions like ¾ or 1 ½, and units that adjust ("1 cup" becomes "3 cups").
- Nutrition stays per serving, so it does not change when you scale.
- The scale you choose is saved with the recipe when it is a favorite.

### Save favorites
- Heart any recipe from a card, or use Add to Favorites in the recipe window. Duplicates are prevented.
- Favorites are saved in the browser, so they are still there after a refresh.
- Each saved card can be viewed or removed. Scaled recipes show their serving count and a "3x recipe" label.
- Export your favorites to a file, or clear them all (with a confirmation).

### Build a shopping list
- **Click a favorite card to select it** (a check badge and green highlight show what is selected), and click again to unselect. Select as many as you like, or use **Select all**.
- **Generate from Selected** builds one list from just those recipes. Selecting cards never changes the list on its own.
- **Add to Shopping List** inside the recipe window is a shortcut: it puts that recipe on the list right away, so you don't have to scroll back down. It is only available for recipes that are favorites.
- Ingredients from different recipes are added together, so "1 cup flour" and "2 cups flour" become "3 cups flour". Each recipe counts at its own scale.
- Check items off as you shop. **Clear all** empties both the selection and the list.

## Design and Accessibility

- A green palette with light and dark shades, and Lucide line icons.
- Responsive layout for phones, tablets, and desktops.
- Text and controls meet WCAG AA color contrast, form fields have clearly visible outlines, and selection is never shown by color alone.
- Keyboard-friendly: tabs, cards, and buttons can be used without a mouse, with visible focus and clear labels for screen readers.
- Short confirmation messages announce actions like adding or removing a favorite, and animation is turned off for people who prefer reduced motion.

## Built With

- React with functional components and hooks
- Vite
- react-icons (Lucide set)
- [Spoonacular Food API](https://spoonacular.com/food-api) for recipes, images, and nutrition

## Good to Know

- Favorites and their scales are stored in the browser on one device, so they don't follow you to another phone or computer, and clearing browser data removes them. The shopping list and card selections reset on refresh.
- Nutrition numbers are estimates calculated by the recipe service.
- The free Spoonacular plan has a daily limit, so heavy searching can use it up for the day.
- Recipes saved before scaling was added are updated the first time they are opened.
- Not every recipe has every detail. Missing prep times, ratings, or photos are simply left out.

<!-- ## Ideas for Later

- **Your Recipes:** add your own recipes with a photo, saved to a database.
- **Community:** share recipes with other members or keep them private, with communities for things like Mexican food, vegan, and keto.
- **Favorites in the cloud** so they follow you across devices.
- **Add a recipe from a link.**
- A custom name, logo, and a vegan-only edition. -->

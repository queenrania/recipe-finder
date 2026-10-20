import {
  LuPizza,
  LuBean,
  LuSoup,
  LuSandwich,
  LuCookingPot,
  LuSalad,
  LuLeaf,
  LuSprout,
  LuWheatOff,
  LuMilkOff,
  LuDumbbell,
  LuMountain,
} from "react-icons/lu";

export const CUISINES = [
  { name: "Italian", Icon: LuPizza },
  { name: "Mexican", Icon: LuBean },
  { name: "Asian", Icon: LuSoup },
  { name: "American", Icon: LuSandwich },
  { name: "Indian", Icon: LuCookingPot },
  { name: "Mediterranean", Icon: LuSalad },
];

// "param" and "value" are what gets sent to the API for each option.
export const DIETS = [
  { label: "Vegetarian", Icon: LuLeaf, param: "diet", value: "vegetarian" },
  { label: "Vegan", Icon: LuSprout, param: "diet", value: "vegan" },
  { label: "Gluten-Free", Icon: LuWheatOff, param: "diet", value: "gluten free" },
  { label: "Dairy-Free", Icon: LuMilkOff, param: "intolerances", value: "dairy" },
  { label: "Keto", Icon: LuDumbbell, param: "diet", value: "ketogenic" },
  { label: "Paleo", Icon: LuMountain, param: "diet", value: "paleo" },
];

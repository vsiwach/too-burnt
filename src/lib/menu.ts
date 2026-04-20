export type DishKey =
  | "waffles"
  | "toast"
  | "eggs"
  | "oj"
  | "coffee"
  | "sundayPlate";

export const DISHES: { key: DishKey; name: string; price: number }[] = [
  { key: "sundayPlate", name: "The Sunday Plate (toast + eggs + OJ)", price: 20 },
  { key: "waffles", name: "Belgian Waffles", price: 14 },
  { key: "toast", name: "Toasted Bread & Butter", price: 8 },
  { key: "eggs", name: "Eggs, Black Pepper", price: 10 },
  { key: "oj", name: "Fresh-squeezed OJ", price: 6 },
  { key: "coffee", name: "Black Coffee", price: 5 },
];

export const DISH_KEYS: DishKey[] = DISHES.map((d) => d.key);

export function emptyDishOrder(): Record<DishKey, number> {
  return DISH_KEYS.reduce(
    (acc, k) => ({ ...acc, [k]: 0 }),
    {} as Record<DishKey, number>,
  );
}

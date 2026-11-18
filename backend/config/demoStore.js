import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");
const storePath = path.join(directory, "demo-store.json");
let writeQueue = Promise.resolve();
let initialization;

export const seedRestaurants = [
  { _id: "amber-kitchen", name: "Amber Kitchen", cuisine: "Fresh bowls & wraps", description: "Colorful salads, warm wraps and lighter favorites made fresh.", deliveryTime: "25-35 min", rating: 4.8, image: "1722865444288food_1.png" },
  { _id: "spice-route", name: "Spice Route", cuisine: "Indian comfort food", description: "Comforting Indian classics with a little extra kick.", deliveryTime: "20-30 min", rating: 4.7, image: "1722866830901food_22.png" },
  { _id: "pasta-bella", name: "Pasta Bella", cuisine: "Pasta & sandwiches", description: "Creamy pasta bowls and toasted sandwiches for any time of day.", deliveryTime: "30-40 min", rating: 4.9, image: "1722867018540food_26.png" },
  { _id: "sweet-crumbs", name: "Sweet Crumbs", cuisine: "Desserts & bakery", description: "A little something sweet: cakes, scoops and baked treats.", deliveryTime: "15-25 min", rating: 4.6, image: "1722866694357food_19.png" },
];

// [restaurantId, name, description, price, category, image filename]
const menuRows = [
  [0, "Greek Salad", "Crisp greens, olives, cucumber and a tangy dressing.", 12, "Salad", "1722865444288food_1.png"],
  [0, "Garden Veg Salad", "A fresh garden salad with seasonal vegetables.", 10, "Salad", "1722865514626food_2.png"],
  [0, "Clover Salad", "Crunchy greens with a bright, herby dressing.", 11, "Salad", "1722865628915food_3.png"],
  [0, "Chicken Salad", "Grilled chicken served over a crisp garden salad.", 16, "Salad", "1722865668073food_4.png"],
  [0, "Lasagna Rolls", "Golden baked rolls with a savoury filling.", 14, "Rolls", "1722865738489food_5.png"],
  [0, "Peri Peri Rolls", "Spiced rolls served warm with a creamy dip.", 12, "Rolls", "1722865934153food_6.png"],
  [0, "Chicken Rolls", "Tender chicken and crunchy vegetables in a soft wrap.", 15, "Rolls", "1722865976487food_7.png"],
  [0, "Veg Rolls", "A hearty wrap packed with fresh vegetables.", 11, "Rolls", "1722866043779food_8.png"],
  [1, "Garlic Mushroom", "Sizzling mushrooms tossed with garlic and herbs.", 14, "Pure Veg", "1722866777756food_21.png"],
  [1, "Crispy Cauliflower", "Golden cauliflower bites with a spiced coating.", 12, "Pure Veg", "1722866830901food_22.png"],
  [1, "Mix Veg Pulao", "Fragrant rice cooked with vegetables and spices.", 13, "Pure Veg", "1722866871307food_23.png"],
  [1, "Zucchini Rice Bowl", "Seasoned rice with tender zucchini and herbs.", 14, "Pure Veg", "1722866909328food_24.png"],
  [1, "Butter Noodles", "Comforting noodles tossed in a buttery sauce.", 12, "Noodles", "1722867144188food_29.png"],
  [1, "Veg Noodles", "Wok-tossed noodles with crisp vegetables.", 13, "Noodles", "1722867222977food_30.png"],
  [1, "Somen Noodles", "Light Japanese-style noodles with vegetables.", 16, "Noodles", "1722867254829food_31.png"],
  [1, "Chilli Garlic Noodles", "A spicy noodle bowl with chilli and garlic.", 15, "Noodles", "1722867630288food_32.png"],
  [2, "Cheese Pasta", "Creamy pasta finished with parmesan.", 12, "Pasta", "1722866948105food_25.png"],
  [2, "Tomato Basil Pasta", "Tomato sauce, basil and a sprinkle of parmesan.", 14, "Pasta", "1722867018540food_26.png"],
  [2, "Creamy Alfredo Pasta", "Silky cream sauce with herbs and cracked pepper.", 16, "Pasta", "1722867053413food_27.png"],
  [2, "Chicken Pasta", "Pasta tossed with chicken in a rich house sauce.", 19, "Pasta", "1722867110108food_28.png"],
  [2, "Chicken Sandwich", "Toasted sandwich with a warm, savoury filling.", 12, "Sandwich", "1722866412882food_13.png"],
  [2, "Vegan Sandwich", "A plant-based sandwich with fresh greens.", 13, "Sandwich", "1722866469319food_14.png"],
  [2, "Grilled Sandwich", "Golden grilled bread with a melty filling.", 14, "Sandwich", "1722866504992food_15.png"],
  [2, "Garden Club Sandwich", "A stacked sandwich with crisp vegetables and sauce.", 15, "Sandwich", "1722866560218food_16.png"],
  [3, "Ripple Ice Cream", "Smooth ice cream with a rich ripple swirl.", 8, "Desserts", "1722866109947food_9.png"],
  [3, "Fruit Ice Cream", "Cool, creamy ice cream with bright fruit flavour.", 9, "Desserts", "1722866148130food_10.png"],
  [3, "Ice Cream Sundae", "A chilled sundae with sauce and crunchy toppings.", 10, "Desserts", "1722866329894food_11.png"],
  [3, "Vanilla Bean Scoop", "Classic vanilla bean ice cream.", 7, "Desserts", "1722866385025food_12.png"],
  [3, "Cupcake", "A soft cupcake topped with a swirl of frosting.", 8, "Cake", "1722866610567food_17.png"],
  [3, "Vegan Chocolate Cake", "Moist chocolate cake made without dairy.", 11, "Cake", "1722866647952food_18.png"],
  [3, "Butterscotch Cake", "Soft cake layered with butterscotch cream.", 12, "Cake", "1722866694357food_19.png"],
  [3, "Sliced Celebration Cake", "A generous slice of soft celebration cake.", 10, "Cake", "1722866729053food_20.png"],
];

export const seedFoods = menuRows.map(([restaurantIndex, name, description, price, category, image]) => ({
  _id: randomUUID(), restaurantId: seedRestaurants[restaurantIndex]._id, name, description, price, category, image,
}));

const freshStore = () => ({
  restaurants: seedRestaurants.map((restaurant) => ({ ...restaurant })),
  users: [],
  foods: seedFoods.map((food) => ({ ...food, _id: randomUUID() })),
  orders: [],
});

async function saveStore(store) {
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

async function initializeStore() {
  await mkdir(directory, { recursive: true });
  let store;
  try { store = JSON.parse((await readFile(storePath, "utf8")).replace(/^\uFEFF/, "")); }
  catch (error) {
    if (error.code !== "ENOENT") throw error;
    await saveStore(freshStore());
    return;
  }

  let changed = false;
  if (!Array.isArray(store.restaurants)) {
    store.restaurants = seedRestaurants.map((restaurant) => ({ ...restaurant }));
    changed = true;
  }
  store.users ||= [];
  store.foods ||= [];
  store.orders ||= [];
  for (const food of store.foods) {
    if (!food.restaurantId) {
      const seed = menuRows.find((row) => row[1].toLowerCase() === String(food.name).trim().toLowerCase());
      const normalizedCategory = food.category === "Deserts" ? "Desserts" : food.category;
      food.category = normalizedCategory;
      const categoryRestaurant = ["Noodles", "Pure Veg"].includes(normalizedCategory) ? seedRestaurants[1]
        : ["Pasta", "Sandwich"].includes(normalizedCategory) ? seedRestaurants[2]
          : ["Cake", "Desserts"].includes(normalizedCategory) ? seedRestaurants[3]
            : seedRestaurants[0];
      food.restaurantId = seed ? seedRestaurants[seed[0]]._id : categoryRestaurant._id;
      changed = true;
    }
  }
  const knownFoods = new Set(store.foods.map((food) => `${food.restaurantId}:${food.name.trim().toLowerCase()}`));
  for (const food of seedFoods) {
    const key = `${food.restaurantId}:${food.name.trim().toLowerCase()}`;
    if (!knownFoods.has(key)) {
      store.foods.push({ ...food, _id: randomUUID() });
      knownFoods.add(key);
      changed = true;
    }
  }
  if (changed) await saveStore(store);
}

export async function readStore() {
  if (!initialization) {
    initialization = initializeStore().catch((error) => { initialization = undefined; throw error; });
  }
  await initialization;
  return JSON.parse((await readFile(storePath, "utf8")).replace(/^\uFEFF/, ""));
}

export async function updateStore(update) {
  const operation = writeQueue.then(async () => {
    const store = await readStore();
    const result = await update(store);
    await saveStore(store);
    return result;
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

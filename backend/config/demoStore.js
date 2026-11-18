import { randomUUID } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");
const storePath = path.join(directory, "demo-store.json");
let writeQueue = Promise.resolve();
let initialization;

async function saveStore(store) {
  const temporaryPath = `${storePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(store, null, 2));
  await rename(temporaryPath, storePath);
}

const seedFoods = [
  ["Greek salad", "Crisp lettuce, olives, cucumber and feta.", 12, "Salad", "1722865444288food_1.png"],
  ["Veg salad", "A fresh garden salad with seasonal vegetables.", 18, "Salad", "1722865514626food_2.png"],
  ["Lasagna Rolls", "Golden baked rolls with a rich savoury filling.", 14, "Rolls", "1722865738489food_5.png"],
  ["Peri Peri Rolls", "Spiced rolls served warm and ready to enjoy.", 12, "Rolls", "1722865934153food_6.png"],
  ["Fruit Ice Cream", "Smooth ice cream with a bright fruit flavour.", 22, "Deserts", "1722866148130food_10.png"],
  ["Chicken Sandwich", "Toasted sandwich with a hearty filling.", 12, "Sandwich", "1722866329894food_13.png"],
  ["Butterscotch Cake", "Soft cake layered with butterscotch cream.", 20, "Cake", "1722866694357food_19.png"],
  ["Cheese Pasta", "Creamy pasta finished with parmesan.", 12, "Pasta", "1722866948105food_25.png"],
  ["Hakka Noodles", "Wok-tossed noodles with vegetables.", 16, "Noodles", "1722867630288food_32.png"],
];

const freshStore = () => ({
  users: [],
  foods: seedFoods.map(([name, description, price, category, image]) => ({
    _id: randomUUID(), name, description, price, category, image,
  })),
  orders: [],
});

export async function readStore() {
  if (!initialization) {
    initialization = (async () => {
      await mkdir(directory, { recursive: true });
      try { await readFile(storePath, "utf8"); }
      catch (error) {
        if (error.code !== "ENOENT") throw error;
        await saveStore(freshStore());
      }
    })().catch((error) => { initialization = undefined; throw error; });
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

import { getProducts, getCategories } from "./src/app/actions/products";

async function main() {
  const cats = await getCategories();
  console.log("Categories:", JSON.stringify(cats, null, 2));

  const prods = await getProducts();
  console.log("Products:", JSON.stringify(prods, null, 2));
}

main();

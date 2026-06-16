import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGES = {
  blush: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  wildflower: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  white: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  sunflower: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  burgundy: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  lavender: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  peach: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  tropical: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  garden: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  classic: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  dusty: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  coral: "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
};

const ALL_BOUQUETS = [
  {
    name: "Blush Reverie",
    slug: "blush-reverie",
    price: 385000,
    occasion: "Anniversary",
    colors: ["Pink", "White"],
    flowers: ["Rose"],
    tags: ["romantic", "soft"],
    inStock: true,
    isNew: false,
    isBestseller: true,
    image: IMAGES.blush,
    description: "Soft blush roses arranged in a cloud-like dome, wrapped in handmade rice paper.",
  },
  {
    name: "Meadow Wild",
    slug: "meadow-wild",
    price: 275000,
    occasion: "Birthday",
    colors: ["Purple", "Yellow", "White"],
    flowers: ["Wildflower", "Daisy"],
    tags: ["casual", "colorful"],
    inStock: true,
    isNew: true,
    isBestseller: false,
    image: IMAGES.wildflower,
    description: "A hand-tied gathering of seasonal wildflowers, as if picked straight from a field.",
  },
  {
    name: "Lily & Dew",
    slug: "lily-and-dew",
    price: 420000,
    occasion: "Wedding",
    colors: ["White", "Green"],
    flowers: ["Lily", "Eucalyptus"],
    tags: ["elegant"],
    inStock: true,
    isNew: false,
    isBestseller: true,
    image: IMAGES.white,
    description: "White oriental lilies with cascading eucalyptus for a timeless, minimalist elegance.",
  },
  {
    name: "Golden Hour",
    slug: "golden-hour",
    price: 310000,
    occasion: "Birthday",
    colors: ["Yellow", "Orange"],
    flowers: ["Sunflower", "Daisy"],
    tags: ["bright", "cheerful"],
    inStock: true,
    isNew: false,
    isBestseller: true,
    image: IMAGES.sunflower,
    description: "A burst of sunflowers and daisies to brighten any room and any occasion.",
  },
  {
    name: "Velvet Dusk",
    slug: "velvet-dusk",
    price: 510000,
    occasion: "Anniversary",
    colors: ["Burgundy", "Red"],
    flowers: ["Peony", "Rose"],
    tags: ["dramatic", "luxury"],
    inStock: true,
    isNew: false,
    isBestseller: false,
    image: IMAGES.burgundy,
    description: "Deep burgundy peonies and garden roses — richly layered, deeply romantic.",
  },
  {
    name: "Provence Dream",
    slug: "provence-dream",
    price: 290000,
    occasion: "Just Because",
    colors: ["Purple", "White"],
    flowers: ["Lavender", "Baby's Breath"],
    tags: ["airy"],
    inStock: false,
    isNew: false,
    isBestseller: false,
    image: IMAGES.lavender,
    description: "Fragrant lavender bundles and clouds of baby's breath. Countryside in a wrap.",
  },
  {
    name: "Peach Blossom",
    slug: "peach-blossom",
    price: 345000,
    occasion: "Sympathy",
    colors: ["Peach", "Pink"],
    flowers: ["Rose", "Ranunculus"],
    tags: ["soft", "gentle", "comforting"],
    inStock: true,
    isNew: true,
    isBestseller: false,
    image: IMAGES.peach,
    description: "Gentle peach spray roses and ranunculus, wrapped in soft linen ribbon.",
  },
  {
    name: "Tropicana",
    slug: "tropicana",
    price: 460000,
    occasion: "Birthday",
    colors: ["Orange", "Pink", "Yellow"],
    flowers: ["Bird of Paradise", "Protea"],
    tags: ["tropical", "bold", "statement"],
    inStock: true,
    isNew: true,
    isBestseller: false,
    image: IMAGES.tropical,
    description: "Bird of paradise, protea and heliconia — a bold tropical statement piece.",
  },
  {
    name: "Garden Gathering",
    slug: "garden-gathering",
    price: 325000,
    occasion: "Just Because",
    colors: ["Pink", "Purple", "White"],
    flowers: ["Sweet Pea", "Cosmos", "Foxglove"],
    tags: ["garden", "mixed", "lush"],
    inStock: true,
    isNew: false,
    isBestseller: false,
    image: IMAGES.garden,
    description: "A lush garden-style arrangement with sweet peas, cosmos, and foxgloves.",
  },
  {
    name: "Classic Red",
    slug: "classic-red",
    price: 395000,
    occasion: "Anniversary",
    colors: ["Red"],
    flowers: ["Rose"],
    tags: ["classic", "romantic"],
    inStock: true,
    isNew: false,
    isBestseller: true,
    image: IMAGES.classic,
    description: "Long-stemmed red roses, the eternal symbol of love. Dozen or half-dozen.",
  },
  {
    name: "Dusty Miller",
    slug: "dusty-miller",
    price: 265000,
    occasion: "Just Because",
    colors: ["White", "Green", "Purple"],
    flowers: ["Scabiosa", "Dried Grass"],
    tags: ["boho", "textured", "unique"],
    inStock: true,
    isNew: true,
    isBestseller: false,
    image: IMAGES.dusty,
    description: "Dusty miller, scabiosa and dried grasses — textured and bohemian.",
  },
  {
    name: "Coral Sunset",
    slug: "coral-sunset",
    price: 375000,
    occasion: "Wedding",
    colors: ["Orange", "Peach", "Pink"],
    flowers: ["Peony", "Rose", "Ranunculus"],
    tags: ["warm", "romantic"],
    inStock: false,
    isNew: false,
    isBestseller: false,
    image: IMAGES.coral,
    description: "Coral charm peonies, garden roses and orange ranunculus in a sunset gradient.",
  },
];

async function main() {
  console.log("Starting database seed with categorized tags...");

  // Clean up existing data
  console.log("Cleaning existing data...");
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();

  // Create Categories (we only have Bouquets basically, but let's make a few)
  console.log("Creating categories...");
  const catBouquets = await prisma.category.create({
    data: { name: "Bouquets", slug: "bouquets" },
  });

  // Collect unique colors, flowers, occasions, and general tags
  const colors = [...new Set(ALL_BOUQUETS.flatMap(b => b.colors))];
  const flowers = [...new Set(ALL_BOUQUETS.flatMap(b => b.flowers))];
  const occasions = [...new Set(ALL_BOUQUETS.map(b => b.occasion))];
  const generalTags = [...new Set(ALL_BOUQUETS.flatMap(b => b.tags))];

  generalTags.push("New Arrival");
  generalTags.push("Best Seller");

  console.log("Creating tags...");
  // Maps to store created tags by their name so we can link them later
  const tagMap = new Map<string, string>(); // name -> id

  // Colors
  for (const c of colors) {
    const t = await prisma.tag.create({
      data: { name: c, slug: `color-${c.toLowerCase().replace(/\s+/g, '-')}`, type: "COLOR" },
    });
    tagMap.set(c, t.id);
  }

  // Flowers
  for (const f of flowers) {
    const t = await prisma.tag.create({
      data: { name: f, slug: `flower-${f.toLowerCase().replace(/\s+/g, '-')}`, type: "FLOWER" },
    });
    tagMap.set(f, t.id);
  }

  // Occasions
  for (const o of occasions) {
    const t = await prisma.tag.create({
      data: { name: o, slug: `occasion-${o.toLowerCase().replace(/\s+/g, '-')}`, type: "OCCASION" },
    });
    tagMap.set(o, t.id);
  }

  // General Tags
  for (const gt of generalTags) {
    const t = await prisma.tag.create({
      data: { name: gt, slug: gt.toLowerCase().replace(/\s+/g, '-'), type: "GENERAL" },
    });
    tagMap.set(gt, t.id);
  }

  console.log("Creating products from ALL_BOUQUETS mock data...");

  for (const b of ALL_BOUQUETS) {
    // Gather all tag IDs for this product
    const productTagIds = new Set<string>();

    b.colors.forEach(c => productTagIds.add(tagMap.get(c)!));
    b.flowers.forEach(f => productTagIds.add(tagMap.get(f)!));
    productTagIds.add(tagMap.get(b.occasion)!);
    b.tags.forEach(t => productTagIds.add(tagMap.get(t)!));
    if (b.isNew) productTagIds.add(tagMap.get("New Arrival")!);
    if (b.isBestseller) productTagIds.add(tagMap.get("Best Seller")!);

    await prisma.product.create({
      data: {
        categoryId: catBouquets.id,
        name: b.name,
        slug: b.slug,
        description: b.description,
        price: b.price,
        isAvailable: b.inStock,
        status: "ACTIVE",
        images: {
          create: [
            {
              imageUrl: b.image,
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: [
            {
              variantName: "Standard",
              additionalPrice: 0,
              isAvailable: b.inStock,
            },
          ],
        },
        tags: {
          create: Array.from(productTagIds).map(id => ({ tagId: id })),
        },
      },
    });
  }

  console.log("Seed complete! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

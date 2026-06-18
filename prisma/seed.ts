import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMAGES = {
  blush:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  wildflower:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  white:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  sunflower:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  burgundy:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  lavender:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  peach:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  tropical:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  garden:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  classic:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  dusty:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
  coral:
    "https://media.istockphoto.com/id/2164207000/photo/summer-bouquet-beautiful-multi-colored-fresh-flower-arrangement-birthday-bouquet-made-of.jpg?s=612x612&w=0&k=20&c=7lLUdkx91ZDl-Lw801VIbE6IywD6ULH4B09ZiwoulfQ=",
};

const ALL_BOUQUETS = [
  // FRESH FLOWERS
  {
    name: "Blush Reverie",
    slug: "blush-reverie",
    categorySlug: "fresh-flowers",
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
    categorySlug: "fresh-flowers",
    price: 275000,
    occasion: "Birthday",
    colors: ["Purple", "Yellow", "White"],
    flowers: ["Wildflower", "Daisy"],
    tags: ["casual", "colorful"],
    inStock: true,
    isNew: true,
    isBestseller: false,
    image: IMAGES.wildflower,
    description:
      "A hand-tied gathering of seasonal wildflowers, as if picked straight from a field.",
  },
  {
    name: "Lily & Dew",
    slug: "lily-and-dew",
    categorySlug: "fresh-flowers",
    price: 420000,
    occasion: "Wedding",
    colors: ["White", "Green"],
    flowers: ["Lily", "Eucalyptus"],
    tags: ["elegant"],
    inStock: true,
    isNew: false,
    isBestseller: true,
    image: IMAGES.white,
    description:
      "White oriental lilies with cascading eucalyptus for a timeless, minimalist elegance.",
  },
  {
    name: "Golden Hour",
    slug: "golden-hour",
    categorySlug: "fresh-flowers",
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
    name: "Garden Gathering",
    slug: "garden-gathering",
    categorySlug: "fresh-flowers",
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

  // ARTIFICIAL FLOWERS
  {
    name: "Velvet Dusk",
    slug: "velvet-dusk",
    categorySlug: "artificial-flowers",
    price: 510000,
    occasion: "Anniversary",
    colors: ["Burgundy", "Red"],
    flowers: ["Peony", "Rose"],
    tags: ["dramatic", "luxury"],
    inStock: true,
    isNew: false,
    isBestseller: false,
    image: IMAGES.burgundy,
    description:
      "Deep burgundy artificial peonies and garden roses — richly layered, deeply romantic.",
  },
  {
    name: "Provence Dream",
    slug: "provence-dream",
    categorySlug: "artificial-flowers",
    price: 290000,
    occasion: "Just Because",
    colors: ["Purple", "White"],
    flowers: ["Lavender", "Baby's Breath"],
    tags: ["airy"],
    inStock: true,
    isNew: false,
    isBestseller: false,
    image: IMAGES.lavender,
    description: "Long-lasting artificial lavender bundles and clouds of baby's breath.",
  },
  {
    name: "Peach Blossom",
    slug: "peach-blossom",
    categorySlug: "artificial-flowers",
    price: 345000,
    occasion: "Sympathy",
    colors: ["Peach", "Pink"],
    flowers: ["Rose", "Ranunculus"],
    tags: ["soft", "gentle", "comforting"],
    inStock: true,
    isNew: true,
    isBestseller: true,
    image: IMAGES.peach,
    description: "Faux peach spray roses and ranunculus, wrapped in soft linen ribbon.",
  },
  {
    name: "Tropicana",
    slug: "tropicana",
    categorySlug: "artificial-flowers",
    price: 460000,
    occasion: "Birthday",
    colors: ["Orange", "Pink", "Yellow"],
    flowers: ["Bird of Paradise", "Protea"],
    tags: ["tropical", "bold", "statement"],
    inStock: true,
    isNew: true,
    isBestseller: false,
    image: IMAGES.tropical,
    description:
      "Artificial bird of paradise, protea and heliconia — a bold tropical statement piece.",
  },
  {
    name: "Coral Sunset",
    slug: "coral-sunset",
    categorySlug: "artificial-flowers",
    price: 375000,
    occasion: "Wedding",
    colors: ["Orange", "Peach", "Pink"],
    flowers: ["Peony", "Rose", "Ranunculus"],
    tags: ["warm", "romantic"],
    inStock: true,
    isNew: false,
    isBestseller: false,
    image: IMAGES.coral,
    description:
      "Faux coral charm peonies, garden roses and orange ranunculus in a sunset gradient.",
  },

  // PAPAN BUNGA
  {
    name: "Bunga 2 Titik",
    slug: "bunga-2-titik",
    categorySlug: "papan-bunga",
    price: 1500000,
    occasion: "Sympathy",
    colors: ["Red", "Yellow"],
    flowers: ["Rose", "Daisy"],
    tags: ["grand", "formal"],
    inStock: true,
    isNew: true,
    isBestseller: true,
    image: "/images/landing/pb_bunga-2-titik.png",
    description: "Traditional papan bunga with 2 points of fresh flower arrangements.",
  },
  {
    name: "Bunga 2 Titik 2 Kuping",
    slug: "bunga-2-titik-2-kuping",
    categorySlug: "papan-bunga",
    price: 2000000,
    occasion: "Wedding",
    colors: ["Pink", "White"],
    flowers: ["Lily", "Rose"],
    tags: ["luxury", "grand"],
    inStock: true,
    isNew: true,
    isBestseller: true,
    image: "/images/landing/pb_2-titik-2-kuping.png",
    description: "Premium papan bunga with top and bottom side arrangements.",
  },
  {
    name: "Classic Red Papan",
    slug: "classic-red-papan",
    categorySlug: "papan-bunga",
    price: 1200000,
    occasion: "Anniversary",
    colors: ["Red"],
    flowers: ["Rose"],
    tags: ["classic", "romantic"],
    inStock: true,
    isNew: false,
    isBestseller: false,
    image: IMAGES.classic,
    description: "A vibrant red papan bunga design perfect for grand openings.",
  },
  {
    name: "Dusty Miller Papan",
    slug: "dusty-miller-papan",
    categorySlug: "papan-bunga",
    price: 1800000,
    occasion: "Just Because",
    colors: ["White", "Green", "Purple"],
    flowers: ["Scabiosa", "Dried Grass"],
    tags: ["boho", "textured", "unique"],
    inStock: true,
    isNew: false,
    isBestseller: false,
    image: IMAGES.dusty,
    description: "Modern papan bunga with dusty miller, scabiosa and dried grasses.",
  },
];

async function main() {
  console.log("Starting database seed with upserts...");

  // Clean up existing nested data so we don't duplicate tags, variants or images
  // We explicitly DO NOT delete products or categories, preserving foreign keys for existing orders
  console.log("Cleaning nested product relations...");
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productTag.deleteMany();

  // Create or update Categories
  console.log("Upserting categories...");
  const catBouquets = await prisma.category.upsert({
    where: { slug: "bouquets" },
    update: { name: "Bouquets", description: "Beautiful bouquets for all occasions" },
    create: {
      name: "Bouquets",
      slug: "bouquets",
      description: "Beautiful bouquets for all occasions",
    },
  });

  const catFreshFlowers = await prisma.category.upsert({
    where: { slug: "fresh-flowers" },
    update: { name: "Fresh Flowers", description: "Fresh cut flowers and arrangements" },
    create: {
      name: "Fresh Flowers",
      slug: "fresh-flowers",
      description: "Fresh cut flowers and arrangements",
    },
  });

  const catArtificialFlowers = await prisma.category.upsert({
    where: { slug: "artificial-flowers" },
    update: {
      name: "Artificial Flowers",
      description: "Long-lasting artificial flowers and plants",
    },
    create: {
      name: "Artificial Flowers",
      slug: "artificial-flowers",
      description: "Long-lasting artificial flowers and plants",
    },
  });

  const catPapanBunga = await prisma.category.upsert({
    where: { slug: "papan-bunga" },
    update: { name: "Papan Bunga", description: "Floral wreaths and board arrangements" },
    create: {
      name: "Papan Bunga",
      slug: "papan-bunga",
      description: "Floral wreaths and board arrangements",
    },
  });

  // Map slugs to category IDs for easy lookup
  const categoryMap = new Map<string, string>();
  categoryMap.set("bouquets", catBouquets.id);
  categoryMap.set("fresh-flowers", catFreshFlowers.id);
  categoryMap.set("artificial-flowers", catArtificialFlowers.id);
  categoryMap.set("papan-bunga", catPapanBunga.id);

  // Collect unique colors, flowers, occasions, and general tags
  const colors = [...new Set(ALL_BOUQUETS.flatMap((b) => b.colors))];
  const flowers = [...new Set(ALL_BOUQUETS.flatMap((b) => b.flowers))];
  const occasions = [...new Set(ALL_BOUQUETS.map((b) => b.occasion))];
  const generalTags = [...new Set(ALL_BOUQUETS.flatMap((b) => b.tags))];

  generalTags.push("New Arrival");
  generalTags.push("Best Seller");

  console.log("Upserting tags...");
  // Maps to store created tags by their name so we can link them later
  const tagMap = new Map<string, string>(); // name -> id

  // Helper for upserting tags
  async function upsertTag(name: string, type: "COLOR" | "FLOWER" | "OCCASION" | "GENERAL") {
    const slug =
      type === "GENERAL"
        ? name.toLowerCase().replace(/\s+/g, "-")
        : `${type.toLowerCase()}-${name.toLowerCase().replace(/\s+/g, "-")}`;

    const t = await prisma.tag.upsert({
      where: { slug },
      update: { name, type },
      create: { name, slug, type },
    });
    tagMap.set(name, t.id);
  }

  for (const c of colors) await upsertTag(c, "COLOR");
  for (const f of flowers) await upsertTag(f, "FLOWER");
  for (const o of occasions) await upsertTag(o, "OCCASION");
  for (const gt of generalTags) await upsertTag(gt, "GENERAL");

  console.log("Upserting products...");

  for (const b of ALL_BOUQUETS) {
    // Gather all tag IDs for this product
    const productTagIds = new Set<string>();

    b.colors.forEach((c) => productTagIds.add(tagMap.get(c)!));
    b.flowers.forEach((f) => productTagIds.add(tagMap.get(f)!));
    productTagIds.add(tagMap.get(b.occasion)!);
    b.tags.forEach((t) => productTagIds.add(tagMap.get(t)!));
    if (b.isNew) productTagIds.add(tagMap.get("New Arrival")!);
    if (b.isBestseller) productTagIds.add(tagMap.get("Best Seller")!);

    const SIZES = [
      { name: "xs", factor: -0.3 },
      { name: "s", factor: -0.15 },
      { name: "m", factor: 0 },
      { name: "l", factor: 0.2 },
      { name: "xl", factor: 0.4 },
      { name: "human size", factor: 1.0 },
    ];

    // Pick a random subset of sizes for this bouquet, always ensuring 'm' is present
    const availableSizes = SIZES.filter((s) => s.name === "m" || Math.random() > 0.4);

    const categoryId = categoryMap.get(b.categorySlug) ?? catBouquets.id;

    const productData = {
      categoryId,
      name: b.name,
      description: b.description,
      price: b.price,
      isAvailable: b.inStock,
      status: "ACTIVE" as const,
      images: {
        create: [
          {
            imageUrl: b.image,
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: availableSizes.map((s) => ({
          variantName: s.name,
          additionalPrice: Math.round(b.price * s.factor),
          isAvailable: b.inStock,
        })),
      },
      tags: {
        create: Array.from(productTagIds).map((id) => ({ tagId: id })),
      },
    };

    await prisma.product.upsert({
      where: { slug: b.slug },
      update: productData,
      create: {
        slug: b.slug,
        ...productData,
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

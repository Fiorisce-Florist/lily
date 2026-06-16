import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Clean up existing catalog data
  console.log("Cleaning existing catalog data...");
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();

  // Create Categories
  console.log("Creating categories...");
  const catBouquets = await prisma.category.create({
    data: {
      name: "Fresh Bouquets",
      slug: "fresh-bouquets",
      description: "Beautifully arranged fresh flowers for any occasion.",
    },
  });

  const catIndoorPlants = await prisma.category.create({
    data: {
      name: "Indoor Plants",
      slug: "indoor-plants",
      description: "Green your space with our curated selection of indoor plants.",
    },
  });

  const catVases = await prisma.category.create({
    data: {
      name: "Vases & Accessories",
      slug: "vases-and-accessories",
      description: "Elegant vases and accessories to complement your blooms.",
    },
  });

  // Create Tags
  console.log("Creating tags...");
  const tagBestSeller = await prisma.tag.create({
    data: {
      name: "Best Seller",
      slug: "best-seller",
      description: "Our most popular items.",
    },
  });

  const tagNewArrival = await prisma.tag.create({
    data: {
      name: "New Arrival",
      slug: "new-arrival",
      description: "Freshly added to our catalog.",
    },
  });

  const tagSale = await prisma.tag.create({
    data: {
      name: "Sale",
      slug: "sale",
      description: "Items currently on discount.",
    },
  });

  // Create Products
  console.log("Creating products...");

  // Product 1: Classic Red Roses Bouquet
  await prisma.product.create({
    data: {
      categoryId: catBouquets.id,
      name: "Classic Red Roses Bouquet",
      slug: "classic-red-roses-bouquet",
      description: "A timeless expression of love. Hand-tied bouquet of premium long-stemmed red roses.",
      price: 65.0,
      stock: 50,
      status: "ACTIVE",
      tags: {
        create: [
          { tagId: tagBestSeller.id },
          { tagId: tagNewArrival.id },
        ],
      },
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1548094990-c16ca90f1f0c?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          {
            variantName: "Standard (12 Roses)",
            additionalPrice: 0,
            stock: 30,
          },
          {
            variantName: "Premium (24 Roses)",
            additionalPrice: 40.0,
            stock: 20,
          },
        ],
      },
    },
  });

  // Product 2: Spring Pastel Mix
  await prisma.product.create({
    data: {
      categoryId: catBouquets.id,
      name: "Spring Pastel Mix",
      slug: "spring-pastel-mix",
      description: "A soft, cheerful arrangement of seasonal pastel blooms including tulips, ranunculus, and sweet peas.",
      price: 55.0,
      stock: 40,
      status: "ACTIVE",
      tags: {
        create: [
          { tagId: tagNewArrival.id },
        ],
      },
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          {
            variantName: "Standard",
            additionalPrice: 0,
            stock: 25,
          },
          {
            variantName: "Large",
            additionalPrice: 20.0,
            stock: 15,
          },
        ],
      },
    },
  });

  // Product 3: Monstera Deliciosa
  await prisma.product.create({
    data: {
      categoryId: catIndoorPlants.id,
      name: "Monstera Deliciosa",
      slug: "monstera-deliciosa",
      description: "The iconic Swiss Cheese plant. Perfect for adding a tropical vibe to any bright indoor space.",
      price: 45.0,
      stock: 20,
      status: "ACTIVE",
      tags: {
        create: [
          { tagId: tagBestSeller.id },
        ],
      },
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          {
            variantName: 'Medium (6" Pot)',
            additionalPrice: 0,
            stock: 15,
          },
          {
            variantName: 'Large (8" Pot)',
            additionalPrice: 25.0,
            stock: 5,
          },
        ],
      },
    },
  });

  // Product 4: Minimalist Ceramic Vase
  await prisma.product.create({
    data: {
      categoryId: catVases.id,
      name: "Minimalist Ceramic Vase",
      slug: "minimalist-ceramic-vase",
      description: "A sleek, matte white ceramic vase that lets your floral arrangements take center stage.",
      price: 35.0,
      stock: 100,
      status: "ACTIVE",
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          {
            variantName: "One Size",
            additionalPrice: 0,
            stock: 100,
          },
        ],
      },
    },
  });

  // Product 5: Sunflower Sunshine Bouquet
  await prisma.product.create({
    data: {
      categoryId: catBouquets.id,
      name: "Sunflower Sunshine Bouquet",
      slug: "sunflower-sunshine-bouquet",
      description: "Brighten someone's day with this vibrant arrangement of fresh sunflowers and complementary greens.",
      price: 48.0,
      stock: 35,
      status: "ACTIVE",
      tags: {
        create: [
          { tagId: tagSale.id },
        ],
      },
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop", // placeholder
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          {
            variantName: "Standard (5 Stems)",
            additionalPrice: 0,
            stock: 20,
          },
          {
            variantName: "Large (10 Stems)",
            additionalPrice: 15.0,
            stock: 15,
          },
        ],
      },
    },
  });

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

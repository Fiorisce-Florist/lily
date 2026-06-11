export interface Bouquet {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  occasion: string;
  colors: string[];
  flowers: string[];
  tags: string[];
  inStock: boolean;
  soldCount: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  image: string;
  description: string;
}

// Placeholder gradient images per bouquet color theme
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

export const ALL_BOUQUETS: Bouquet[] = [
  {
    id: 1,
    name: "Blush Reverie",
    slug: "blush-reverie",
    price: 385000,
    occasion: "Anniversary",
    colors: ["Pink", "White"],
    flowers: ["Rose"],
    tags: ["romantic", "soft"],
    inStock: true,
    soldCount: 324,
    rating: 4.9,
    reviewCount: 218,
    isNew: false,
    isBestseller: true,
    image: IMAGES.blush,
    description: "Soft blush roses arranged in a cloud-like dome, wrapped in handmade rice paper.",
  },
  {
    id: 2,
    name: "Meadow Wild",
    slug: "meadow-wild",
    price: 275000,
    occasion: "Birthday",
    colors: ["Purple", "Yellow", "White"],
    flowers: ["Wildflower", "Daisy"],
    tags: ["casual", "colorful"],
    inStock: true,
    soldCount: 187,
    rating: 4.7,
    reviewCount: 134,
    isNew: true,
    isBestseller: false,
    image: IMAGES.wildflower,
    description:
      "A hand-tied gathering of seasonal wildflowers, as if picked straight from a field.",
  },
  {
    id: 3,
    name: "Lily & Dew",
    slug: "lily-and-dew",
    price: 420000,
    occasion: "Wedding",
    colors: ["White", "Green"],
    flowers: ["Lily", "Eucalyptus"],
    tags: ["elegant"],
    inStock: true,
    soldCount: 256,
    rating: 5.0,
    reviewCount: 89,
    isNew: false,
    isBestseller: true,
    image: IMAGES.white,
    description:
      "White oriental lilies with cascading eucalyptus for a timeless, minimalist elegance.",
  },
  {
    id: 4,
    name: "Golden Hour",
    slug: "golden-hour",
    price: 310000,
    occasion: "Birthday",
    colors: ["Yellow", "Orange"],
    flowers: ["Sunflower", "Daisy"],
    tags: ["bright", "cheerful"],
    inStock: true,
    soldCount: 412,
    rating: 4.8,
    reviewCount: 301,
    isNew: false,
    isBestseller: true,
    image: IMAGES.sunflower,
    description: "A burst of sunflowers and daisies to brighten any room and any occasion.",
  },
  {
    id: 5,
    name: "Velvet Dusk",
    slug: "velvet-dusk",
    price: 510000,
    occasion: "Anniversary",
    colors: ["Burgundy", "Red"],
    flowers: ["Peony", "Rose"],
    tags: ["dramatic", "luxury"],
    inStock: true,
    soldCount: 143,
    rating: 4.9,
    reviewCount: 97,
    isNew: false,
    isBestseller: false,
    image: IMAGES.burgundy,
    description: "Deep burgundy peonies and garden roses — richly layered, deeply romantic.",
  },
  {
    id: 6,
    name: "Provence Dream",
    slug: "provence-dream",
    price: 290000,
    occasion: "Just Because",
    colors: ["Purple", "White"],
    flowers: ["Lavender", "Baby's Breath"],
    tags: ["airy"],
    inStock: false,
    soldCount: 98,
    rating: 4.6,
    reviewCount: 72,
    isNew: false,
    isBestseller: false,
    image: IMAGES.lavender,
    description: "Fragrant lavender bundles and clouds of baby's breath. Countryside in a wrap.",
  },
  {
    id: 7,
    name: "Peach Blossom",
    slug: "peach-blossom",
    price: 345000,
    occasion: "Sympathy",
    colors: ["Peach", "Pink"],
    flowers: ["Rose", "Ranunculus"],
    tags: ["soft", "gentle", "comforting"],
    inStock: true,
    soldCount: 211,
    rating: 4.7,
    reviewCount: 158,
    isNew: true,
    isBestseller: false,
    image: IMAGES.peach,
    description: "Gentle peach spray roses and ranunculus, wrapped in soft linen ribbon.",
  },
  {
    id: 8,
    name: "Tropicana",
    slug: "tropicana",
    price: 460000,
    occasion: "Birthday",
    colors: ["Orange", "Pink", "Yellow"],
    flowers: ["Bird of Paradise", "Protea"],
    tags: ["tropical", "bold", "statement"],
    inStock: true,
    soldCount: 76,
    rating: 4.5,
    reviewCount: 41,
    isNew: true,
    isBestseller: false,
    image: IMAGES.tropical,
    description: "Bird of paradise, protea and heliconia — a bold tropical statement piece.",
  },
  {
    id: 9,
    name: "Garden Gathering",
    slug: "garden-gathering",
    price: 325000,
    occasion: "Just Because",
    colors: ["Pink", "Purple", "White"],
    flowers: ["Sweet Pea", "Cosmos", "Foxglove"],
    tags: ["garden", "mixed", "lush"],
    inStock: true,
    soldCount: 189,
    rating: 4.8,
    reviewCount: 127,
    isNew: false,
    isBestseller: false,
    image: IMAGES.garden,
    description: "A lush garden-style arrangement with sweet peas, cosmos, and foxgloves.",
  },
  {
    id: 10,
    name: "Classic Red",
    slug: "classic-red",
    price: 395000,
    originalPrice: 450000,
    occasion: "Anniversary",
    colors: ["Red"],
    flowers: ["Rose"],
    tags: ["classic", "romantic"],
    inStock: true,
    soldCount: 538,
    rating: 4.9,
    reviewCount: 412,
    isNew: false,
    isBestseller: true,
    image: IMAGES.classic,
    description: "Long-stemmed red roses, the eternal symbol of love. Dozen or half-dozen.",
  },
  {
    id: 11,
    name: "Dusty Miller",
    slug: "dusty-miller",
    price: 265000,
    occasion: "Just Because",
    colors: ["White", "Green", "Purple"],
    flowers: ["Scabiosa", "Dried Grass"],
    tags: ["boho", "textured", "unique"],
    inStock: true,
    soldCount: 64,
    rating: 4.6,
    reviewCount: 38,
    isNew: true,
    isBestseller: false,
    image: IMAGES.dusty,
    description: "Dusty miller, scabiosa and dried grasses — textured and bohemian.",
  },
  {
    id: 12,
    name: "Coral Sunset",
    slug: "coral-sunset",
    price: 375000,
    occasion: "Wedding",
    colors: ["Orange", "Peach", "Pink"],
    flowers: ["Peony", "Rose", "Ranunculus"],
    tags: ["warm", "romantic"],
    inStock: false,
    soldCount: 152,
    rating: 4.8,
    reviewCount: 93,
    isNew: false,
    isBestseller: false,
    image: IMAGES.coral,
    description: "Coral charm peonies, garden roses and orange ranunculus in a sunset gradient.",
  },
];

export const OCCASIONS = [...new Set(ALL_BOUQUETS.map((b) => b.occasion))];
export const COLORS = [...new Set(ALL_BOUQUETS.flatMap((b) => b.colors))].sort();
export const FLOWERS = [...new Set(ALL_BOUQUETS.flatMap((b) => b.flowers))].sort();
export const MAX_PRICE = Math.max(...ALL_BOUQUETS.map((b) => b.price));

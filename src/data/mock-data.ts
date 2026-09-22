import { Category, Product } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Featured Collection",
    slug: "featured",
    description: "Curated selection of top-rated items",
    itemCount: 24,
  },
  {
    id: "cat-2",
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "The latest products just added to our catalog",
    itemCount: 18,
  },
  {
    id: "cat-3",
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Customer favorites and trending essentials",
    itemCount: 32,
  },
  {
    id: "cat-4",
    name: "Special Offers",
    slug: "special-offers",
    description: "Limited-time deals and promotional values",
    itemCount: 15,
  },
];

export const sampleProducts: Product[] = [
  {
    id: "prod-1",
    name: "Minimalist Essential Item A",
    slug: "minimalist-essential-a",
    description: "Engineered with premium materials for maximum durability and timeless style.",
    price: 89.0,
    compareAtPrice: 110.0,
    images: ["/placeholder.svg"],
    categoryId: "cat-1",
    tags: ["popular", "essential"],
    inStock: true,
    featured: true,
  },
  {
    id: "prod-2",
    name: "Contemporary Everyday Item B",
    slug: "contemporary-everyday-b",
    description: "Sleek and versatile, designed to seamlessly fit into your daily routine.",
    price: 145.0,
    images: ["/placeholder.svg"],
    categoryId: "cat-2",
    tags: ["new"],
    inStock: true,
    featured: true,
  },
  {
    id: "prod-3",
    name: "Precision Crafted Item C",
    slug: "precision-crafted-c",
    description: "Meticulous craftsmanship with functional ergonomics and clean aesthetics.",
    price: 220.0,
    images: ["/placeholder.svg"],
    categoryId: "cat-3",
    tags: ["bestseller"],
    inStock: true,
    featured: true,
  },
];

import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { Product } from "@/types";
import coverMap from "../../data/book-cover-map.json";
import replacements from "../../data/book-replacements.json";

function verifiedCover(id: string, name: unknown, author: unknown) {
  return [...coverMap.books, ...replacements.books].find((book) => book.productId === id && book.title === name &&
    book.author === author && book.verificationStatus === "verified" && book.imageUrl);
}

function mapDocToProduct(docId: string, data: Record<string, unknown>): Product {
  return {
    id: docId,
    name: (data.name as string) ?? "",
    slug: (data.slug as string) ?? "",
    price: Number(data.price) || 0,
    imageUrl: verifiedCover(docId, data.name, data.author)?.imageUrl ||
      (typeof data.imageUrl === "string" ? data.imageUrl.trim() : "/placeholder.svg"),
    coverMetadata: mapCoverMetadata(data.coverMetadata),
    categoryId: (data.categoryId as string) ?? "",
    description: (data.description as string) ?? "",
    stock: Number(data.stock) || 0,
    author: (data.author as string) ?? "",
    originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
    discount: data.discount ? Number(data.discount) : undefined,
    rating: data.rating ? Number(data.rating) : 5,
    reviewCount: data.reviewCount ? Number(data.reviewCount) : 0,
    isHot: Boolean(data.isHot),
    isNew: Boolean(data.isNew),
    isFeatured: Boolean(data.isFeatured),
    isUpcoming: Boolean(data.isUpcoming),
    badge: (data.badge as string) ?? "",
  };
}

function mapCoverMetadata(value: unknown): Product["coverMetadata"] {
  if (!value || typeof value !== "object") return undefined;
  const data = value as Record<string, unknown>;
  if (["isbn", "edition", "source", "sourceUrl", "verifiedAt"].some((key) => typeof data[key] !== "string")) return undefined;
  if (!/^https:\/\//.test(data.sourceUrl as string)) return undefined;
  return { isbn: data.isbn as string, edition: data.edition as string, source: data.source as string,
    sourceUrl: data.sourceUrl as string, verifiedAt: data.verifiedAt as string };
}

/**
 * Lấy danh sách sản phẩm từ Firestore
 * Nếu có truyền categoryId thì chỉ lấy các sản phẩm thuộc danh mục đó
 */
export async function getProducts(categoryId?: string): Promise<Product[]> {
  const productsRef = collection(db, "products");

  const q = categoryId
    ? query(productsRef, where("categoryId", "==", categoryId))
    : productsRef;

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => mapDocToProduct(doc.id, doc.data()));
}

/**
 * Lấy thông tin chi tiết một cuốn sách bằng slug
 * Trả về null nếu không tìm thấy sách
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return mapDocToProduct(doc.id, doc.data());
}

/**
 * Lấy sách khuyến mãi HOT cho section 1
 */
export async function getHotProducts(max = 10): Promise<Product[]> {
  const products = await getProducts();
  // Use existing books with verified covers, retaining their actual prices and identity.
  return products.filter((p) => verifiedCover(p.id, p.name, p.author) && p.stock > 0 &&
    (p.isHot || (p.originalPrice && p.originalPrice > p.price)))
    .sort((a, b) => Number(b.isHot) - Number(a.isHot))
    .slice(0, max);
}

/**
 * Lấy sách mới phát hành cho section 2
 */
export async function getNewProducts(max = 10): Promise<Product[]> {
  const products = await getProducts();
  const newProds = products.filter((p) => p.isNew);
  return newProds.length >= 4 ? newProds.slice(0, max) : products.slice(10, 10 + max);
}

/**
 * Lấy sách hay tuyển chọn cho section 3
 */
export async function getFeaturedProducts(max = 10): Promise<Product[]> {
  const products = await getProducts();
  const featured = products.filter((p) => p.isFeatured);
  return featured.length >= 4 ? featured.slice(0, max) : products.slice(20, 20 + max);
}

/**
 * Lấy sách sắp phát hành / đặt trước cho section 4
 */
export async function getUpcomingProducts(max = 10): Promise<Product[]> {
  const products = await getProducts();
  const upcoming = products.filter((p) => p.isUpcoming || (p.badge && p.badge.length > 0));
  return upcoming.length >= 2 ? upcoming.slice(0, max) : products.slice(30, 30 + max);
}

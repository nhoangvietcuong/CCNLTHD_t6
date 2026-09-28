import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { Product } from "@/types";

/**
 * Lấy danh sách sản phẩm từ Firestore
 * Nếu có truyền categoryId thì chỉ lấy các sản phẩm thuộc danh mục đó
 */
export async function getProducts(categoryId?: string): Promise<Product[]> {
  const productsRef = collection(db, "products");

  // Nếu có categoryId thì dùng query + where để lọc, ngược lại lấy tất cả
  const q = categoryId
    ? query(productsRef, where("categoryId", "==", categoryId))
    : productsRef;

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name ?? "",
      slug: data.slug ?? "",
      price: Number(data.price) || 0,
      imageUrl: data.imageUrl ?? "/placeholder.svg",
      categoryId: data.categoryId ?? "",
      description: data.description ?? "",
      stock: Number(data.stock) || 0,
    };
  });
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
  const data = doc.data();

  return {
    id: doc.id,
    name: data.name ?? "",
    slug: data.slug ?? "",
    price: Number(data.price) || 0,
    imageUrl: data.imageUrl ?? "/placeholder.svg",
    categoryId: data.categoryId ?? "",
    description: data.description ?? "",
    stock: Number(data.stock) || 0,
  };
}

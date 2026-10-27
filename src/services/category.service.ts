import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Category } from "@/types";

/**
 * Lấy danh sách tất cả các danh mục sách từ Firestore
 */
export async function getCategories(): Promise<Category[]> {
  const querySnapshot = await getDocs(collection(db, "categories"));
  
  return querySnapshot.docs.flatMap((doc) => {
    const data = doc.data();
    if (typeof data.name !== "string" || !data.name.trim() || !doc.id.trim() || doc.id.includes("/")) return [];
    return [{
      id: doc.id,
      name: data.name.trim(),
      slug: typeof data.slug === "string" ? data.slug.trim() : "",
      description: data.description,
      itemCount: data.itemCount,
      subcategories: Array.isArray(data.subcategories)
        ? [...new Set(data.subcategories.filter((value: unknown): value is string => typeof value === "string" && !!value.trim()).map((value: string) => value.trim()))]
        : [],
    }];
  });
}

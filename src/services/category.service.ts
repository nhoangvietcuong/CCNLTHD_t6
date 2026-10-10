import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Category } from "@/types";

/**
 * Lấy danh sách tất cả các danh mục sách từ Firestore
 */
export async function getCategories(): Promise<Category[]> {
  const querySnapshot = await getDocs(collection(db, "categories"));
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name ?? "",
      slug: data.slug ?? "",
      description: data.description,
      itemCount: data.itemCount,
      subcategories: data.subcategories || [],
    };
  });
}

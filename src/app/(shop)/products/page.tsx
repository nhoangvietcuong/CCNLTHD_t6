import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Tất Cả Sách - nextBooks.vn",
  description: "Tuyển chọn hơn 20.000 tựa sách hay với mức giá tốt nhất tại nextBooks.vn",
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string; filter?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category: selectedCategory, search: searchQuery, filter } = await searchParams;

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  // Lọc sản phẩm theo danh mục hoặc từ khóa tìm kiếm
  let products = allProducts;

  if (selectedCategory) {
    // Tìm category tương ứng qua id hoặc slug
    const matchedCategory = categories.find(
      (c) => c.id === selectedCategory || c.slug === selectedCategory
    );
    const targetCatId = matchedCategory ? matchedCategory.id : selectedCategory;

    products = products.filter(
      (p) =>
        p.categoryId === targetCatId ||
        (matchedCategory && p.categoryId === matchedCategory.slug)
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (filter === "sale") {
    products = products.filter((p) => (p.discount && p.discount > 0) || p.isHot);
  } else if (filter === "new") {
    products = products.filter((p) => p.isNew);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              {searchQuery
                ? `Kết quả tìm kiếm cho: "${searchQuery}"`
                : selectedCategory
                ? categories.find(
                    (c) => c.id === selectedCategory || c.slug === selectedCategory
                  )?.name || "Danh mục sách"
                : filter === "sale"
                ? "Sách Khuyến Mãi Hot"
                : filter === "new"
                ? "Sách Mới Tuyển Chọn"
                : "Tất Cả Tựa Sách"}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Tìm thấy {products.length} tựa sách tuyển chọn
            </p>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold text-[#c92127] hover:underline"
          >
            &larr; Về Trang Chủ
          </Link>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5 pb-2">
        <Link
          href="/products"
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            !selectedCategory && !searchQuery && !filter
              ? "bg-[#c92127] text-white shadow-2xs font-semibold"
              : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
          }`}
        >
          Tất cả ({allProducts.length})
        </Link>

        {categories.map((cat) => {
          const isSelected =
            selectedCategory === cat.id || selectedCategory === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug || cat.id}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                isSelected
                  ? "bg-[#c92127] text-white shadow-2xs font-semibold"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-[#c92127]"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <span className="text-3xl">🔍</span>
          <p className="mt-2 text-sm font-semibold text-gray-700">
            Không tìm thấy cuốn sách nào phù hợp.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Hãy thử tìm kiếm với từ khóa khác hoặc khám phá các danh mục khác.
          </p>
          <div className="mt-4">
            <Link
              href="/products"
              className="inline-block rounded bg-[#c92127] px-4 py-2 text-xs font-semibold text-white hover:bg-[#a81a1f]"
            >
              Xem tất cả sách
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

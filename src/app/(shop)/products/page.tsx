import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export const metadata: Metadata = {
  title: "All Products - E-Commerce Store",
  description: "Browse our comprehensive collection of quality products.",
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Đọc query param từ URL (Next.js 16 yêu cầu await searchParams)
  const { category: selectedCategory } = await searchParams;

  // Lấy danh mục và sách (nếu có category thì lọc theo category đó)
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(selectedCategory),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Products Page
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Explore our wide range of books across all categories.
        </p>
      </div>

      {/* Filter / Category tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {/* Nút All Products */}
        <Link
          href="/products"
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            !selectedCategory
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          All Products
        </Link>

        {/* Các nút Danh mục lấy từ Firestore */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="mt-12 text-center py-12 border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-500 text-sm">Chưa có cuốn sách nào trong danh mục này.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="flex h-48 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-slate-200/70 transition-colors">
                  <span className="text-sm font-medium">Book Cover Placeholder</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {product.name}
                  </h3>
                </div>
              </Link>
              <div>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-2 text-xs text-slate-400">
                  Còn lại: <span className="font-medium text-slate-700">{product.stock}</span> cuốn
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                  <div>
                    <AddToCartButton product={product} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

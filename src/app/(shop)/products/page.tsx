import type { Metadata } from "next";
import Link from "next/link";
import { categories, sampleProducts } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All Products - E-Commerce Store",
  description: "Browse our comprehensive collection of quality products.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Products Page
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Explore our wide range of products across all categories.
        </p>
      </div>

      {/* Filter / Category tabs placeholder */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white">
          All Products
        </span>
        {categories.map((cat) => (
          <span
            key={cat.id}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 transition-colors cursor-pointer"
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Products placeholder grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleProducts.map((product) => (
          <div
            key={product.id}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
          >
            <div className="flex h-48 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              <span className="text-sm font-medium">Product Image Placeholder</span>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-700">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">
                  {formatPrice(product.price)}
                </span>
                <Link
                  href="/cart"
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Add to Cart
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

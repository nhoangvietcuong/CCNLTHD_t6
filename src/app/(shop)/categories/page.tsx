import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Categories - E-Commerce Store",
  description: "Browse product categories and discover curated collections.",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Categories Page
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Browse items organized by category to easily find what you are looking for.
        </p>
      </div>

      {/* Categories grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href="/products"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-slate-200/70 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-slate-400 group-hover:text-slate-600 transition-colors"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">
                  {category.name}
                </h3>
                <span className="text-xs font-medium text-slate-400">
                  {category.itemCount} items
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

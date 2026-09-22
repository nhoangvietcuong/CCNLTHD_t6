import type { Metadata } from "next";
import Link from "next/link";
import ShopLayout from "./(shop)/layout";
import { categories, sampleProducts } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "E-Commerce Store - Home",
  description: "Modern e-commerce platform built with Next.js 16 and TypeScript.",
};

export default function HomePage() {
  return (
    <ShopLayout>
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center">
          <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            Next.js 16 &bull; App Router &bull; Tailwind CSS
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Modern E-Commerce Platform
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Clean, modular architecture designed for high performance, versatility, and seamless customer shopping experiences.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/categories"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Preview */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Popular Categories
            </h2>
            <Link
              href="/categories"
              className="text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
            >
              See all categories &rarr;
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href="/products"
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:shadow-md hover:border-slate-300"
              >
                <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {cat.description}
                </p>
                <span className="mt-3 inline-block text-xs font-medium text-slate-400">
                  {cat.itemCount} items available
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
            >
              View all products &rarr;
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sampleProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div className="flex h-44 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                  <span className="text-sm font-medium">Product Image Placeholder</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-700">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
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
      </section>
    </ShopLayout>
  );
}

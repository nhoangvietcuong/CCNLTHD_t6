import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us - E-Commerce Store",
  description: "Learn more about our philosophy, architecture, and team.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          About Page
        </h1>
        <p className="mt-3 text-base text-slate-500">
          Building a scalable, robust, and modern shopping foundation.
        </p>
      </div>

      <div className="mt-8 space-y-8 text-slate-600 leading-relaxed">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900">Our Vision</h2>
          <p className="mt-3 text-sm sm:text-base">
            We are engineering a domain-agnostic e-commerce solution that seamlessly scales
            regardless of the product line. By decoupling product types from the core layout
            and architecture, this platform can adapt to digital goods, physical items,
            apparel, electronics, or lifestyle goods.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-lg font-semibold text-slate-900">Architecture Highlights</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 list-disc list-inside">
              <li>Next.js 16 App Router hierarchy</li>
              <li>Type-safe with TypeScript</li>
              <li>Utility-first styling with Tailwind CSS</li>
              <li>Unified shared layout for Header &amp; Footer</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-lg font-semibold text-slate-900">Customer Commitments</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 list-disc list-inside">
              <li>Fast &amp; reliable delivery</li>
              <li>Transparent order processing</li>
              <li>Dedicated customer support</li>
              <li>Hassle-free return policy</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Explore Catalog &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

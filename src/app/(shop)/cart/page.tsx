import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shopping Cart - E-Commerce Store",
  description: "View items in your cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Cart Page
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Review your selected items before proceeding to checkout.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Cart items list placeholder */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-semibold text-slate-900">Cart Items (1)</h2>
            <div className="mt-6 divide-y divide-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                    Image
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Sample Product In Cart
                    </h3>
                    <p className="text-xs text-slate-500">Category: Featured</p>
                    <span className="text-xs text-emerald-600 font-medium">In Stock</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center rounded-lg border border-slate-200">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-sm"
                      disabled
                    >
                      -
                    </button>
                    <span className="px-2 text-sm font-medium text-slate-800">1</span>
                    <button
                      type="button"
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-sm"
                      disabled
                    >
                      +
                    </button>
                  </div>
                  <span className="text-base font-bold text-slate-900">
                    {formatPrice(89.0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between">
              <Link
                href="/products"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary placeholder */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal</dt>
                <dd className="font-medium text-slate-900">{formatPrice(89.0)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Estimated Shipping</dt>
                <dd className="font-medium text-slate-900">{formatPrice(0.0)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Tax</dt>
                <dd className="font-medium text-slate-900">{formatPrice(7.12)}</dd>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
                <dt>Total</dt>
                <dd>{formatPrice(96.12)}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product.service";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/AddToCartButton";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Không tìm thấy sách - Bookstore",
    };
  }

  return {
    title: `${product.name} | Bookstore`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  // Next.js 16 yêu cầu await params
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Nếu không tìm thấy sách trong Firestore thì trả về trang 404
  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs điều hướng */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-slate-900 transition-colors">
          Sách
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-900 truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Chi tiết sách */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Cột trái: Ảnh bìa sách */}
        <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200">
          <div className="text-center p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-16 w-16 text-slate-300 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-sm font-medium">Bìa sách: {product.name}</span>
          </div>
        </div>

        {/* Cột phải: Thông tin & Thao tác */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {product.name}
          </h1>

          {/* Tình trạng kho */}
          <div className="mt-3 flex items-center gap-3">
            {product.stock > 0 ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Còn hàng ({product.stock} cuốn)
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                Tạm hết hàng
              </span>
            )}
            <span className="text-xs text-slate-400">Mã sách: {product.id}</span>
          </div>

          {/* Giá sách */}
          <div className="mt-6 border-b border-slate-200 pb-6">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Mô tả nội dung sách */}
          <div className="py-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Giới thiệu nội dung
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Thao tác mua hàng */}
          <div className="mt-auto pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="flex-1">
                <AddToCartButton product={product} showQuantity={true} size="lg" />
              </div>
              <Link
                href="/products"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Tiếp tục xem sách
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      title: "Không tìm thấy sách - nextBooks.vn",
    };
  }

  return {
    title: `${product.name} | nextBooks.vn`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const discountPercent =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center space-x-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#c92127] transition">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#c92127] transition">
          Sách
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-800 truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main detail card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          {/* Cột trái: Ảnh bìa sách (Col 5 / 12) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative flex h-80 sm:h-96 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4">
              {product.imageUrl && product.imageUrl !== "/placeholder.svg" ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain drop-shadow-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-orange-50 rounded h-full w-full">
                  <span className="text-4xl mb-2">📖</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {product.name}
                  </span>
                </div>
              )}

              {discountPercent && discountPercent > 0 && (
                <span className="absolute top-3 right-3 rounded bg-[#c92127] px-2 py-1 text-xs font-bold text-white shadow-xs">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Dịch vụ đi kèm */}
            <div className="mt-4 w-full rounded-lg bg-gray-50 p-3 text-xs text-gray-600 space-y-1.5 border border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Bao sách màng co đẹp miễn phí</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Giao hàng toàn quốc nhanh chóng</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Đổi trả sách trong 7 ngày nếu lỗi</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Thông tin & Thao tác (Col 7 / 12) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>

              {/* Tác giả & Đánh giá */}
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-gray-500 border-b border-gray-100 pb-3">
                <div>
                  Tác giả:{" "}
                  <span className="font-semibold text-gray-800">
                    {product.author || "Nhiều Tác Giả"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span>({product.reviewCount ?? 0} nhận xét)</span>
                </div>
                {product.badge && (
                  <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Giá sách */}
              <div className="my-4 rounded-lg bg-red-50/50 p-4 border border-red-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#c92127]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {discountPercent && discountPercent > 0 && (
                    <span className="rounded bg-[#c92127] px-2 py-0.5 text-xs font-bold text-white">
                      Tiết kiệm {discountPercent}%
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  (Giá đã bao gồm VAT và ưu đãi từ nextBooks.vn)
                </p>
              </div>

              {/* Tình trạng kho */}
              <div className="mb-4 text-xs">
                {product.stock > 0 ? (
                  <span className="font-medium text-emerald-700">
                    ✓ Còn hàng trong kho ({product.stock} cuốn)
                  </span>
                ) : product.badge ? (
                  <span className="font-medium text-amber-700">
                    ⏰ {product.badge} - Quý khách có thể đặt hàng trước
                  </span>
                ) : (
                  <span className="font-medium text-red-600">
                    Tạm hết hàng
                  </span>
                )}
              </div>

              {/* Giới thiệu nội dung */}
              <div className="border-t border-gray-100 pt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Giới thiệu sách
                </h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Mua hàng */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="flex-1">
                  <AddToCartButton
                    product={product}
                    showQuantity={true}
                    size="lg"
                    className="w-full"
                  />
                </div>
                <Link
                  href="/products"
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-center text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Xem thêm sách khác
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

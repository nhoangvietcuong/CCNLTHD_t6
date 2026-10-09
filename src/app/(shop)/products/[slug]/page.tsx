import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sampleProducts } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";
import QuantityBox from "@/components/QuantityBox";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = sampleProducts.find((item) => item.slug === slug);


  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
      description: "Không tìm thấy thông tin sản phẩm.",
    };
  }
  

  return {
    title: `${product.name} - E-Commerce Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}
 
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const product = sampleProducts.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        "{product.name}"
      </h1>
      <h2 className="mt-2 text-sm text-slate-500">
        {product.description} 
      </h2>
      <Link 
        href="/products" 
        className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        ← Quay lại danh sách
      </Link>





      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Khối hiển thị ảnh sản phẩm bằng next/image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Khối thông tin chi tiết */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {product.name}
          </h1>
          
          <p className="mt-4 text-2xl font-bold text-slate-900">
            {formatPrice(product.price)}
          </p>

          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {product.description}
          </p>

          <div className="mt-8">
           {/* Khối chọn số lượng và nút mua */}
          <div className="mt-8 flex items-center gap-4">
            <QuantityBox />
            
            <button className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Thêm vào giỏ hàng
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** cách để thêm nút button chi tiết sản phẩm, sau đó khi click vào sẽ ra chi tiết sản phẩm
    <div className="mt-3 flex items-center justify-between">
  <span className="text-lg font-bold text-slate-900">
    {formatPrice(product.price)}
  </span>

  <div className="flex gap-2">
    {/* Link dẫn đến trang chi tiết sản phẩm 
    <Link
      href={`/products/${product.slug}`}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
    >
      Xem chi tiết
    </Link>

    <Link
      href="/cart"
      className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
    >
      Add to Cart
    </Link>
  </div>
</div> */



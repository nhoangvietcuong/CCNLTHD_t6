import type { Metadata } from "next";
import ShopLayout from "./(shop)/layout";
import { getCategories } from "@/services/category.service";
import {
  getHotProducts,
  getNewProducts,
  getFeaturedProducts,
  getUpcomingProducts,
} from "@/services/product.service";
import { HomeHero } from "@/components/home/HomeHero";
import { HotPromotionSection } from "@/components/home/HotPromotionSection";
import { NewBooksSection } from "@/components/home/NewBooksSection";
import { FeaturedBooksSection } from "@/components/home/FeaturedBooksSection";
import { UpcomingBooksSection } from "@/components/home/UpcomingBooksSection";
import { BookNewsSection } from "@/components/home/BookNewsSection";
import { PublishersSection } from "@/components/home/PublishersSection";

export const metadata: Metadata = {
  title: "Mua Sách Hay Trực Tuyến Giá tốt Tại nextBooks.vn",
  description:
    "Nhà sách Online đa dạng với hơn 20.000 tựa sách tuyển chọn. ✅Sách Hay Giá Tốt. Giao hàng Nhanh chóng. Quà tặng Bookmark và Bao sách đẹp miễn phí.",
  keywords: [
    "Nhà sách online",
    "nextbooks",
    "nextbook",
    "sách next",
    "sách tuyển chọn",
    "sách hay nên đọc"
  ],
};

export default async function HomePage() {
  const [categories, hotProducts, newProducts, featuredProducts, upcomingProducts] =
    await Promise.all([
      getCategories(),
      getHotProducts(12),
      getNewProducts(12),
      getFeaturedProducts(12),
      getUpcomingProducts(12),
    ]);

  return (
    <ShopLayout>
      <div className="bg-[#f5f5f5] min-h-screen py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-6">
          {/* Section 1: Hero Banner + Categories Sidebar */}
          <HomeHero categories={categories} />

          {/* Section 2: Khuyến Mãi HOT */}
          <HotPromotionSection products={hotProducts} />

          {/* Section 3: Sách Mới */}
          <NewBooksSection products={newProducts} />

          {/* Section 4: Sách Hay Tuyển Chọn */}
          <FeaturedBooksSection products={featuredProducts} />

          {/* Section 5: Sách Sắp Phát Hành */}
          <UpcomingBooksSection products={upcomingProducts} />

          {/* Section 6: Tin Sách */}
          <BookNewsSection />

          {/* Section 7: Các Nhà Xuất Bản & Đối Tác */}
          <PublishersSection />
        </div>
      </div>
    </ShopLayout>
  );
}

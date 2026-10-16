import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modern E-Commerce Platform",
  description: "Nền tảng thương mại điện tử hiện đại",
};



// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function Header() {
//   // 1. Quản lý trạng thái đóng/mở menu di động
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const pathname = usePathname();

//   const navLinks = [
//     { label: "Home", href: "/" },
//     { label: "Products", href: "/products" },
//     { label: "Categories", href: "/categories" },
//     { label: "About", href: "/about" },
//   ];

//   const isActive = (href: string) => {
//     if (href === "/") return pathname === "/";
//     return pathname.startsWith(href);
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full bg-white/95 border-b border-slate-200">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
//         {/* Logo thương hiệu */}
//         <Link href="/" className="font-bold text-slate-900">
//           COMMERCE
//         </Link>

//         {/* Nút bấm chuyển đổi trạng thái menu trên di động */}
//         <button
//           type="button"
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="md:hidden"
//           aria-label="Toggle menu"
//         >
//           {mobileMenuOpen ? "Đóng" : "Menu"}
//         </button>

//         {/* Giao diện menu di động hiển thị có điều kiện */}
//         {mobileMenuOpen && (
//           <div className="absolute left-0 top-16 w-full border-b border-slate-200 bg-white px-4 pb-4 md:hidden">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setMobileMenuOpen(false)}
//                 className={`block py-3 ${
//                   isActive(link.href)
//                     ? "font-semibold bg-slate-100"
//                     : ""
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }


// import type { Metadata } from "next";
// import Link from "next/link";
// import { categories, sampleProducts } from "@/data/mock-data";
// import { formatPrice } from "@/lib/utils";

// export const metadata: Metadata = {
//   title: "All Products - E-Commerce Store",
//   description: "Browse our comprehensive collection of quality products.",
// };

// export default function ProductsPage() {
//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//       {/* Header section */}
//       <div className="border-b border-slate-200 pb-5">
//         <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//           Products Page
//         </h1>

//         <p className="mt-2 text-sm text-slate-500">
//           Explore our wide range of products across all categories.
//         </p>
//       </div>

//       {/* Filter / Category tabs */}
//       <div className="mt-6 flex flex-wrap gap-2">
//         <span className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white">
//           All Products
//         </span>

//         {categories.map((cat) => (
//           <span
//             key={cat.id}
//             className="cursor-pointer rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300"
//           >
//             {cat.name}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }


// {/* Products placeholder grid */}
//       <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {sampleProducts.map((product) => (
//           <div
//             key={product.id}
//             className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
//           >
//             <div className="flex h-48 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-400">
//               <span className="text-sm font-medium">
//                 Product Image Placeholder
//               </span>
//             </div>

//             <div className="mt-4">
//               <h3 className="text-base font-semibold text-slate-900 group-hover:text-slate-700">
//                 {product.name}
//               </h3>

//               <p className="mt-1 text-sm text-slate-500 line-clamp-2">
//                 {product.description}
//               </p>

//               <div className="mt-3 flex items-center justify-between">
//                 <span className="text-lg font-bold text-slate-900">
//                   {formatPrice(product.price)}
//                 </span>

//                 <Link
//                   href="/cart"
//                   className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
//                 >
//                   Add to Cart
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






// import Link from "next/link";
// import { ShoppingCart } from "lucide-react";


// export default function Header() {
//   return (
//     <header className="w-full bg-[#111827] text-white shadow-sm">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//         {/* Logo thương hiệu về trang chủ */}
//         <Link
//           href="/"
//           className="text-xl font-bold tracking-tight text-white hover:text-gray-300"
//         >
//           COMMERCE STORE
//         </Link>

//         {/* Danh sách các liên kết điều hướng nội bộ */}
//         <nav className="flex items-center gap-6 text-sm font-medium">
//           <Link
//             href="/"
//             className="transition-colors hover:text-indigo-400"
//           >
//             Trang chủ
//           </Link>
//           <Link
//             href="/products"
//             className="transition-colors hover:text-indigo-400"
//           >
//             Sản phẩm
//           </Link>
//           <Link
//             href="/categories"
//             className="transition-colors hover:text-indigo-400"
//           >
//             Danh mục
//           </Link>
//           <Link
//             href="/about"
//             className="transition-colors hover:text-indigo-400"
//           >
//             Giới thiệu
//           </Link>
//           {/* Liên kết đến giỏ hàng kèm icon */}
//           <Link
//             href="/cart"
//             className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-white transition-colors hover:bg-indigo-500"
//           >
//             <ShoppingCart className="h-4 w-4" />
//             <span>Giỏ hàng</span>
//           </Link>
//         </nav>
//       </div>
//     </header>
//   );
// }
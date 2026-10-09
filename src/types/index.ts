// 1. Category Schema: categories/{categoryId}
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string; // Tùy chọn để tương thích UI hiện tại
  itemCount?: number;   // Tùy chọn để tương thích UI hiện tại
  subcategories?: string[];
  icon?: string;
}

// 2. Product Schema: products/{productId}
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  description: string;
  stock: number;
  author?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  isHot?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isUpcoming?: boolean;
  badge?: string;
}

// 3. Cart Item (Lưu ở client / localStorage)
export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number; // Chỉ dùng để tạm tính hiển thị UI
  product?: Product; // Tùy chọn để tiện lấy thông tin hiển thị (tên, ảnh)
}

// 4. Order Item (Snapshot nhúng trong Order Document trên Firestore)
export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
}

// 5. Order Status
export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";

// 6. Order Schema: orders/{orderId}
export interface Order {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: unknown; // Sẽ là Firestore Timestamp
  items: OrderItem[];
}

// 7. Navigation Link
export interface NavItem {
  label: string;
  href: string;
}

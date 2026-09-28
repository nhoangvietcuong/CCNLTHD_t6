import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { OrderItem } from "@/types";

interface RequestOrderItem {
  productId: string;
  quantity: number;
}

interface CreateOrderRequestBody {
  customerName: string;
  phone: string;
  address: string;
  items: RequestOrderItem[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequestBody = await request.json();
    const { customerName, phone, address, items } = body;

    // 1. Kiểm tra tính hợp lệ của thông tin khách hàng (Server-side Validation)
    if (!customerName?.trim() || !phone?.trim() || !address?.trim()) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ giao hàng." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Giỏ hàng của bạn đang trống, không thể tạo đơn hàng." },
        { status: 400 }
      );
    }

    // 2. Chạy Firestore Transaction để đảm bảo tính toàn vẹn (Atomic Transaction)
    const result = await runTransaction(db, async (transaction) => {
      let calculatedTotalAmount = 0;
      const orderItemsSnapshot: OrderItem[] = [];
      const productsToUpdate: { ref: any; newStock: number }[] = [];

      // A. ĐỌC DỮ LIỆU & KIỂM TRA TỒN KHO TRÊN FIRESTORE
      for (const item of items) {
        if (!item.productId || typeof item.quantity !== "number" || item.quantity <= 0) {
          throw new Error("Dữ liệu sản phẩm trong giỏ hàng không hợp lệ.");
        }

        const productRef = doc(db, "products", item.productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error(`Sản phẩm với mã "${item.productId}" không tồn tại trong hệ thống.`);
        }

        const productData = productDoc.data();
        const currentStock = Number(productData.stock) || 0;
        const actualPrice = Number(productData.price) || 0;
        const productName = productData.name ?? "Sách không tên";
        const imageUrl = productData.imageUrl ?? "/placeholder.svg";

        // Kiểm tra tồn kho
        if (currentStock < item.quantity) {
          throw new Error(
            `Sách "${productName}" chỉ còn ${currentStock} cuốn trong kho, không đủ số lượng ${item.quantity} bạn yêu cầu.`
          );
        }

        // Tính tiền bằng GIÁ GỐC LẤY TỪ FIRESTORE (Server-calculated Price)
        const subtotal = actualPrice * item.quantity;
        calculatedTotalAmount += subtotal;

        // Lưu snapshot thông tin sản phẩm tại thời điểm mua
        orderItemsSnapshot.push({
          productId: item.productId,
          productName,
          unitPrice: actualPrice,
          quantity: item.quantity,
          subtotal,
          imageUrl,
        });

        // Đánh dấu sản phẩm cần trừ kho
        productsToUpdate.push({
          ref: productRef,
          newStock: currentStock - item.quantity,
        });
      }

      // B. GHI DỮ LIỆU ĐỒNG THỜI (Atomic Writes)
      // 1. Cập nhật trừ kho cho tất cả sản phẩm
      for (const item of productsToUpdate) {
        transaction.update(item.ref, { stock: item.newStock });
      }

      // 2. Tạo document Order mới trong collection "orders"
      const newOrderRef = doc(collection(db, "orders"));
      transaction.set(newOrderRef, {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        totalAmount: calculatedTotalAmount,
        status: "pending",
        createdAt: serverTimestamp(),
        items: orderItemsSnapshot,
      });

      return {
        orderId: newOrderRef.id,
        totalAmount: calculatedTotalAmount,
      };
    });

    // Trả về kết quả thành công cho Client
    return NextResponse.json(
      {
        message: "Đặt hàng thành công!",
        orderId: result.orderId,
        totalAmount: result.totalAmount,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi xử lý đặt hàng:", error);
    return NextResponse.json(
      {
        message: error.message || "Đã xảy ra lỗi trong quá trình tạo đơn hàng.",
      },
      { status: 400 }
    );
  }
}

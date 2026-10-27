export class OrderError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = 'OrderError';
  }
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new OrderError('Dữ liệu đơn hàng không hợp lệ.', 400);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, min: number, max: number, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    throw new OrderError(`Thông tin ${fieldName} không hợp lệ.`, 400);
  }
  return value.trim();
}

/**
 * 1. Gộp các item trùng productId
 * 2. Kiểm tra Number.isInteger(quantity)
 * 3. Giới hạn trên cho quantity (kiểm tra cả từng item và tổng số lượng sau gộp)
 */
export function parseOrder(value: unknown) {
  const body = record(value);
  const customerName = text(body.customerName, 2, 120, 'người nhận');
  const phone = text(body.phone, 10, 12, 'số điện thoại');
  const address = text(body.address, 5, 500, 'địa chỉ');

  if (!/^(?:0|\+?84)[35789]\d{8}$/.test(phone)) {
    throw new OrderError('Số điện thoại không hợp lệ.', 400);
  }

  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 100) {
    throw new OrderError('Giỏ hàng phải có từ 1 đến 100 dòng.', 400);
  }

  // Map để gộp các item có cùng productId
  const quantities = new Map<string, number>();

  for (const raw of body.items) {
    const item = record(raw);
    const productId = typeof item.productId === 'string' ? item.productId.trim() : '';

    if (
      !/^[^/\s\u0000-\u001f\u007f]{1,128}$/.test(productId) ||
      productId === '.' ||
      productId === '..' ||
      /^__.*__$/.test(productId)
    ) {
      throw new OrderError('Mã sản phẩm không hợp lệ.', 400);
    }

    // 2. Kiểm tra Number.isInteger(quantity) và số nguyên dương
    if (
      typeof item.quantity !== 'number' ||
      !Number.isInteger(item.quantity) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw new OrderError('Số lượng sản phẩm không hợp lệ (phải là số nguyên dương).', 400);
    }

    // 3. Giới hạn trên cho quantity của từng item trước khi gộp (tối đa 999 cuốn)
    if (item.quantity > 999) {
      throw new OrderError('Mỗi sản phẩm tối đa 999 cuốn.', 400);
    }

    // 1 & 3. Gộp các item trùng productId và kiểm tra tổng số lượng sau gộp
    const mergedQuantity = (quantities.get(productId) ?? 0) + item.quantity;
    if (mergedQuantity > 999) {
      throw new OrderError('Tổng số lượng sản phẩm sau khi gộp vượt giới hạn tối đa (999 cuốn).', 400);
    }

    quantities.set(productId, mergedQuantity);
  }

  // Kiểm tra tổng số lượng của toàn bộ đơn hàng sau khi gộp
  const totalOrderQuantity = [...quantities.values()].reduce((sum, q) => sum + q, 0);
  if (totalOrderQuantity > 9999) {
    throw new OrderError('Tổng số lượng sách trong toàn đơn hàng vượt giới hạn cho phép (9999 cuốn).', 400);
  }

  // Whitelist only: không nhận giá từ client, sắp xếp danh sách sản phẩm đã gộp
  return {
    customerName,
    phone,
    address,
    items: [...quantities]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([productId, quantity]) => ({ productId, quantity })),
  };
}

export function validateKey(key: string | null): string {
  if (!key || !/^[a-f0-9]{64}$/.test(key)) {
    throw new OrderError('Thiếu khóa xác nhận đơn hàng hợp lệ.', 400);
  }
  return key;
}

/**
 * 4. Kiểm tra giá bán (lấy từ CSDL Firestore, không tin client)
 * 5. Phân biệt HTTP 400, 404, 409, 500
 */
export function priceLine(data: Record<string, unknown> | undefined, quantity: number) {
  // HTTP 404: Sản phẩm không tồn tại trong CSDL Firestore
  if (!data) {
    throw new OrderError('Sản phẩm không còn tồn tại.', 404);
  }

  // HTTP 500: Dữ liệu tồn kho bị lỗi / corrupt trong CSDL
  if (
    typeof data.stock !== 'number' ||
    !Number.isInteger(data.stock) ||
    !Number.isSafeInteger(data.stock) ||
    data.stock < 0
  ) {
    throw new OrderError('Dữ liệu tồn kho không hợp lệ.', 500);
  }

  // HTTP 409: Xung đột tồn kho (kho không đủ số lượng yêu cầu)
  if (data.stock < quantity) {
    throw new OrderError('Sản phẩm không đủ tồn kho.', 409);
  }

  // HTTP 500: Kiểm tra giá bán từ CSDL - Giá bán phải là số nguyên dương hợp lệ
  if (
    typeof data.price !== 'number' ||
    !Number.isInteger(data.price) ||
    !Number.isSafeInteger(data.price) ||
    data.price <= 0 ||
    !Number.isSafeInteger(data.price * quantity) ||
    typeof data.name !== 'string' ||
    !data.name.trim()
  ) {
    throw new OrderError('Dữ liệu sản phẩm chưa sẵn sàng để đặt hàng.', 500);
  }

  return {
    productName: data.name.trim(),
    unitPrice: data.price,
    quantity,
    subtotal: data.price * quantity,
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : '/placeholder.svg',
  };
}

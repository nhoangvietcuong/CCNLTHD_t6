# nextBooks - Website Bán Sách Trực Tuyến

Đồ án môn học: **Các công nghệ lập trình hiện đại**
Khoa Công nghệ Thông tin - Trường Đại học Sài Gòn (SGU)
Giảng viên hướng dẫn: **ThS. Phạm Thi Vương**
Nhóm thực hiện: **Nhóm 7**
---

## Thành viên thực hiện

- Nguyễn Hoàng Việt Cường - MSSV: 3122410045
- Nguyễn Tuấn Khanh - MSSV: 3123410160
- Nguyễn Huỳnh Yến Linh - MSSV: 3123410196
- Lê Ngọc Nữ - MSSV: 3123410257

---

## Công nghệ sử dụng (Tech Stack)

- **Framework:** Next.js 16 (App Router, Server Components & Client Components)
- **Ngôn ngữ & Giao diện:** TypeScript, Tailwind CSS
- **Cơ sở dữ liệu & Dịch vụ máy chủ:** Firebase Firestore, Firebase Admin SDK
- **Quản lý trạng thái:** Zustand (kết hợp middleware persist)

---

## Hướng dẫn cài đặt và chạy mã nguồn

### 1. Yêu cầu môi trường
- Node.js phiên bản LTS (khuyến nghị 20.x trở lên)
- Trình quản lý gói npm, pnpm hoặc yarn

### 2. Cài đặt các gói phụ thuộc
Tại thư mục gốc của dự án, mở terminal và thực thi lệnh cài đặt toàn bộ gói phụ thuộc từ `package.json`:

```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo tệp .env.local ở thư mục gốc (tham khảo từ .env.example hoặc .env.cloud-test.example) và thiết lập các biến môi trường kết nối Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Khởi chạy môi trường phát triển
Chạy lệnh khởi động development server:
```bash
npm run dev
```

Sau khi máy chủ khởi động thành công, truy cập đường dẫn [http://localhost:3000](http://localhost:3000) trên trình duyệt để trải nghiệm hệ thống.

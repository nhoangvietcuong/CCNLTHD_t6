/** Chạy ở thư mục gốc dự án để nối phần đăng nhập với Header hiện có. */
import fs from "node:fs";
import path from "node:path";

const headerPath = path.resolve(process.cwd(), "src/components/layout/Header.tsx");
if (!fs.existsSync(headerPath)) {
  console.error("Không tìm thấy src/components/layout/Header.tsx. Hãy chạy script ở thư mục gốc dự án.");
  process.exit(1);
}
let source = fs.readFileSync(headerPath, "utf8");
if (source.includes("<AccountMenu />")) {
  console.log("Header đã tích hợp AccountMenu. Không cần sửa thêm.");
  process.exit(0);
}
const start = source.indexOf("            {/* Account Login */}");
const end = source.indexOf("            {/* Shopping Cart Button */}", start);
if (start < 0 || end < 0 || !source.includes('import Link from "next/link";')) {
  console.error("Không tìm được vị trí Account Login trong Header hiện tại. Chưa thay đổi file nào.");
  process.exit(1);
}
source = source.slice(0, start) + '            {/* Tài khoản đăng nhập/đăng ký */}\n            <AccountMenu />\n\n' + source.slice(end);
source = source.replace('import Link from "next/link";', 'import Link from "next/link";\nimport AccountMenu from "@/components/auth/AccountMenu";');
source = source.replace(/^  const \[loginModalOpen, setLoginModalOpen\] = useState\(false\);\r?\n/m, "");
fs.writeFileSync(headerPath, source, "utf8");
console.log("Đã nối AccountMenu vào Header.tsx thành công.");

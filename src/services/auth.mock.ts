import { DEMO_ACCOUNT } from "@/data/mock-users";

/** Mock authentication chạy hoàn toàn trên trình duyệt; KHÔNG dùng production. */
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

type LocalUser = AuthUser & {
  passwordHash: string;
  salt: string;
  createdAt: string;
};

const USERS_KEY = "nextbooks_mock_users_v1";
const SESSION_KEY = "nextbooks_mock_session_v1";
export const AUTH_CHANGE_EVENT = "nextbooks-mock-auth-change";

function readLocalUsers(): LocalUser[] {
  if (typeof window === "undefined") return [];
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter(
      (entry): entry is LocalUser =>
        !!entry &&
        typeof entry.id === "string" &&
        typeof entry.fullName === "string" &&
        typeof entry.email === "string" &&
        typeof entry.passwordHash === "string" &&
        typeof entry.salt === "string"
    );
  } catch {
    return [];
  }
}

async function digestPassword(password: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const result = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(result))
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}

function toPublicUser(user: AuthUser): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    ...(user.phone ? { phone: user.phone } : {}),
  };
}

function saveSession(user: AuthUser): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(toPublicUser(user)));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function getMockSessionSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function subscribeMockSession(callback: () => void): () => void {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
}

export function getMockSession(): AuthUser | null {
  try {
    const raw = getMockSessionSnapshot();
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (
      !value ||
      typeof value !== "object" ||
      !("id" in value) ||
      !("email" in value) ||
      !("fullName" in value) ||
      typeof value.id !== "string" ||
      typeof value.email !== "string" ||
      typeof value.fullName !== "string"
    ) return null;
    return value as AuthUser;
  } catch {
    return null;
  }
}

export async function mockLogin(email: string, password: string): Promise<AuthUser> {
  // Delay nhỏ để UI có trạng thái loading giống gửi API.
  await new Promise((resolve) => setTimeout(resolve, 450));
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
    const user: AuthUser = {
      id: DEMO_ACCOUNT.id,
      fullName: DEMO_ACCOUNT.fullName,
      email: DEMO_ACCOUNT.email,
    };
    saveSession(user);
    return user;
  }

  const existingUser = readLocalUsers().find((user) => user.email === normalizedEmail);
  if (existingUser) {
    const actualHash = await digestPassword(password, existingUser.salt);
    if (actualHash === existingUser.passwordHash) {
      const user = toPublicUser(existingUser);
      saveSession(user);
      return user;
    }
  }

  throw new Error("Email hoặc mật khẩu không chính xác.");
}

export async function mockRegister(input: RegisterInput): Promise<AuthUser> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const users = readLocalUsers();

  if (email === DEMO_ACCOUNT.email || users.some((user) => user.email === email)) {
    throw new Error("Email này đã được đăng ký. Vui lòng sử dụng email khác.");
  }

  const salt = crypto.randomUUID();
  const newUser: LocalUser = {
    id: crypto.randomUUID(),
    fullName,
    email,
    phone: input.phone?.trim() || undefined,
    passwordHash: await digestPassword(input.password, salt),
    salt,
    createdAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  } catch {
    throw new Error("Không thể lưu tài khoản thử nghiệm. Hãy kiểm tra bộ nhớ trình duyệt.");
  }

  const publicUser = toPublicUser(newUser);
  saveSession(publicUser);
  return publicUser;
}

export function mockLogout(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/** Đặt lại mật khẩu cho tài khoản mock lưu trong trình duyệt hiện tại.
 *  Không có xác thực email: CHỈ dùng để kiểm thử giao diện, không dùng production.
 */
export async function mockResetLocalPassword(emailInput: string, newPassword: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  const email = emailInput.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Email không hợp lệ.");
  }
  if (newPassword.length < 8) {
    throw new Error("Mật khẩu mới cần ít nhất 8 ký tự.");
  }
  if (email === DEMO_ACCOUNT.email) {
    throw new Error("Tài khoản demo cố định không đổi được mật khẩu. Hãy tạo tài khoản mới để thử.");
  }
  const users = readLocalUsers();
  const index = users.findIndex((user) => user.email === email);
  if (index < 0) {
    throw new Error("Không tìm thấy tài khoản mock này trên trình duyệt hiện tại.");
  }
  const salt = crypto.randomUUID();
  users[index] = {
    ...users[index],
    salt,
    passwordHash: await digestPassword(newPassword, salt),
  };
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    throw new Error("Không thể cập nhật dữ liệu demo trong trình duyệt.");
  }
}

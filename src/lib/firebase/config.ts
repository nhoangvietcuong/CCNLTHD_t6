import { initializeApp, getApps } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
if (useEmulator && (process.env.NODE_ENV === 'production' || !firebaseConfig.projectId?.startsWith('demo-'))) {
  throw new Error('UNSAFE_EMULATOR_CONFIGURATION');
}
// Separate app names keep local test configuration isolated during Fast Refresh.
const appName = useEmulator ? 'nextbooks-catalog-emulator' : '[DEFAULT]';
const existingApp = getApps().find((entry) => entry.name === appName);
const app = existingApp ?? initializeApp(firebaseConfig, appName);

// Khởi tạo Firestore Database
const db = getFirestore(app);

if (useEmulator && !existingApp) connectFirestoreEmulator(db, '127.0.0.1', 8080);

// Khởi tạo Firebase Storage (lưu trữ ảnh)
const storage = getStorage(app);

export { app, db, storage };

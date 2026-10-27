import 'server-only';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function getAdminDb() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
  const catalogProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (projectId && catalogProjectId && projectId !== catalogProjectId) {
    throw new Error('FIREBASE_PROJECT_MISMATCH');
  }
  const testProjectId = process.env.FIREBASE_CLOUD_TEST_PROJECT_ID;
  if (testProjectId && (process.env.NODE_ENV !== 'development' || projectId !== testProjectId || emulatorHost)) {
    throw new Error('UNSAFE_CLOUD_TEST_CONFIGURATION');
  }
  if (emulatorHost) {
    // Explicit local demo environment only; never silently redirect production.
    if (process.env.NODE_ENV === 'production' || !projectId?.startsWith('demo-')
      || !/^(localhost|127\.0\.0\.1):\d{1,5}$/.test(emulatorHost)) {
      throw new Error('UNSAFE_EMULATOR_CONFIGURATION');
    }
    const existing = getApps().find((app) => app.name === 'nextbooks-orders-emulator');
    return getFirestore(existing ?? initializeApp({ projectId }, 'nextbooks-orders-emulator'));
  }
  if (!projectId || !clientEmail || !privateKey) throw new Error('ADMIN_CONFIGURATION_MISSING');
  const existing = getApps().find((app) => app.name === 'nextbooks-orders');
  const app = existing ?? initializeApp({ credential: cert({ projectId, clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n') }) }, 'nextbooks-orders');
  return getFirestore(app);
}

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import { CloudTestConfigError, loadCloudTestEnv } from './cloud-test-config.mjs';

const require = createRequire(import.meta.url);
const mode = process.argv[2];
const projectFlag = process.argv.indexOf('--project');
try {
  if (!['dev', 'seed', 'check'].includes(mode)) throw new CloudTestConfigError('Chọn dev, seed hoặc check.');
  const { project, env } = loadCloudTestEnv(projectFlag < 0 ? undefined : process.argv[projectFlag + 1]);
  console.log(`Cloud development project: ${project}. Không xác minh gói billing tự động.`);
  if (mode === 'dev') {
    const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', '--webpack', '--hostname', '127.0.0.1'], {
      cwd: fileURLToPath(new URL('../', import.meta.url)), env, stdio: 'inherit',
    });
    child.on('error', () => { console.error('Không khởi động được Next.js.'); process.exitCode = 1; });
    child.on('exit', (code) => { process.exitCode = code ?? 1; });
  } else {
    // The SDKs see only the explicitly selected cloud test configuration.
    for (const key of Object.keys(process.env)) if (!(key in env)) delete process.env[key];
    Object.assign(process.env, env);
    const { cert, initializeApp, deleteApp } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');
    const app = initializeApp({ credential: cert({ projectId: project, clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n') }) }, 'nextbooks-cloud-test');
    const db = getFirestore(app);
    try {
      if (mode === 'seed') {
        // Unique IDs + create: never overwrite existing catalog or customer data.
        const id = `report-book-${randomUUID()}`;
        await db.collection('products').doc(id).create({ name: 'Sách kiểm thử báo cáo', slug: id,
          categoryId: 'report-test', price: 10000, stock: 10, description: 'Dữ liệu giả trong project development.',
          imageUrl: '', author: 'Kiểm thử', isHot: true });
        console.log(`Đã tạo sản phẩm giả: products/${id}`);
        console.log(`Mở http://127.0.0.1:3000/products/${id} để đặt đơn bằng giao diện.`);
      } else {
        const { initializeApp: initClient, deleteApp: deleteClient } = await import('firebase/app');
        const { getFirestore: getClientDb, collection, query, limit, doc, getDocFromServer, getDocsFromServer, setDoc, updateDoc, deleteDoc, terminate } = await import('firebase/firestore');
        const client = initClient({ projectId: project, apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY, appId: env.NEXT_PUBLIC_FIREBASE_APP_ID }, 'cloud-rules-check');
        const publicDb = getClientDb(client);
        const probeId = `rules-probe-${randomUUID()}`;
        const probes = ['products', 'categories', 'orders'].map((name) => db.collection(name).doc(probeId));
        const createdProbes = [];
        try {
          // Synthetic probes only; finally deletes these exact IDs, never real orders.
          for (const probe of probes) {
            await probe.create({ rulesProbe: true });
            createdProbes.push(probe);
          }
          assert.equal((await getDocFromServer(doc(publicDb, 'products', probeId))).exists(), true);
          assert.equal((await getDocFromServer(doc(publicDb, 'categories', probeId))).exists(), true);
          // List permissions are needed by the actual catalog services.
          await getDocsFromServer(query(collection(publicDb, 'products'), limit(1)));
          await getDocsFromServer(query(collection(publicDb, 'categories'), limit(1)));
          const denied = (action) => assert.rejects(action, (error) => error.code === 'permission-denied');
          for (const name of ['products', 'categories', 'orders']) {
            const ref = doc(publicDb, name, probeId);
            await denied(() => setDoc(ref, { forged: true }));
            await denied(() => updateDoc(ref, { forged: true }));
            await denied(() => deleteDoc(ref));
          }
          await denied(() => getDocFromServer(doc(publicDb, 'orders', probeId)));
          await denied(() => getDocsFromServer(query(collection(publicDb, 'orders'), limit(1))));
          await denied(() => updateDoc(doc(publicDb, 'products', probeId), { price: 1, stock: 999 }));
          for (const change of [{ totalAmount: 1 }, { status: 'delivered' }, { paymentStatus: 'paid' }, { ownerId: 'forged' }]) {
            await denied(() => updateDoc(doc(publicDb, 'orders', probeId), change));
          }
          console.log('PASS Rules online: catalog public get/list; client không get/list orders, không ghi/sửa/xóa catalog/orders hoặc sửa giá, kho, owner, trạng thái.');
          console.log('Đây là kiểm tra client chưa đăng nhập, không phải kiểm thử mọi trường hợp auth.');
        } finally {
          const cleanup = await Promise.allSettled([
            terminate(publicDb).then(() => deleteClient(client)),
            ...createdProbes.map((probe) => probe.delete()),
          ]);
          if (cleanup.some((result) => result.status === 'rejected')) {
            throw new CloudTestConfigError(`Không cleanup hết probe. Kiểm tra đúng ID ${probeId} trên project ${project}; chưa coi lần kiểm thử này hoàn tất.`);
          }
        }
      }
    } finally { await db.terminate(); await deleteApp(app); }
  }
} catch (error) {
  // SDK errors can carry request details. Never print credentials, stacks or SDK objects.
  console.error(error instanceof CloudTestConfigError ? error.message : 'Cloud test thất bại. Kiểm tra cấu hình, IAM, kết nối và Rules trên đúng project development.');
  process.exitCode = 1;
}

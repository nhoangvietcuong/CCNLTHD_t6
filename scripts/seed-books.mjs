import { existsSync } from 'node:fs';
import { buildCatalog, groups } from './data/books-catalog.mjs';
import { generateBookCovers } from './book-covers.mjs';
import { parseSeedOptions, seedBooksHelp, planBookSeed, validateCatalog, summarizePlan, writeSeedPlan, verifySeedPlan, assertBookSeedTarget, SeedError } from './books-seed-core.mjs';
import { loadCloudTestEnv, CloudTestConfigError } from './cloud-test-config.mjs';

async function main() {
  const options = parseSeedOptions(process.argv.slice(2));
  if (options.help) { console.log(seedBooksHelp()); return; }
  console.log(`Chế độ: ${options.apply ? 'APPLY CLOUD — có ghi Firestore' : options.inspect ? 'DRY-RUN CLOUD — chỉ đọc' : 'DRY-RUN OFFLINE — không kết nối Cloud'}.`);
  if (!options.apply) console.log('Dry-run là mặc định. Muốn ghi thật, dùng: npm run seed:books -- --project nextbooks-dev --apply');
  const catalog = buildCatalog();
  validateCatalog(catalog);
  const assets = generateBookCovers();
  if (catalog.products.some((product) => !existsSync(new URL(`../public${product.imageUrl}`, import.meta.url)))) throw new SeedError('Thiếu ảnh bìa local.');
  console.log(`Project duy nhất được phép: ${options.project}; ${catalog.products.length} sách, ${catalog.categories.length} danh mục; ${assets.count} bìa SVG tự thiết kế.`);
  console.table(groups.map((group) => ({ category: group.name, count: group.books.length })));
  let db;
  let app;
  try {
    let products = [];
    let categories = [];
    if (options.apply || options.inspect) {
      const { project, env } = loadCloudTestEnv(options.project);
      assertBookSeedTarget(options.project, env, project);
      for (const name of Object.keys(process.env)) if (!(name in env)) delete process.env[name];
      Object.assign(process.env, env);
      const { cert, initializeApp } = await import('firebase-admin/app');
      const { getFirestore } = await import('firebase-admin/firestore');
      app = initializeApp({ projectId: project, credential: cert({ projectId: project,
        clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL, privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n') }) }, 'nextbooks-books-seed');
      // Explicit database selection: never inherit a named database from env.
      db = getFirestore(app, '(default)');
      assertBookSeedTarget(options.project, env, db.projectId, db.databaseId);
      if (app.options.projectId !== options.project) throw new SeedError('Firebase Admin App trỏ sai Project ID; không đọc/ghi dữ liệu.');
      console.log(`Firebase Admin target: ${db.projectId}; database: ${db.databaseId}.`);
      const [productDocs, categoryDocs] = await Promise.all([db.collection('products').get(), db.collection('categories').get()]);
      const map = (snapshot) => snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data(), updateTime: doc.updateTime }));
      products = map(productDocs); categories = map(categoryDocs);
      console.log(`Đã đọc catalog để đối chiếu: ${products.length} products, ${categories.length} categories. Chưa ghi dữ liệu.`);
    } else console.log('DRY-RUN OFFLINE: không đọc credentials, không kết nối Cloud; số dự kiến bên dưới giả sử catalog rỗng.');
    const plan = planBookSeed(catalog, products, categories, options);
    console.log(`Chọn ${plan.selected.length} sách (round-robin qua danh mục). Kế hoạch:`, summarizePlan(plan));
    if (plan.duplicates.length) console.log('Dữ liệu trùng có sẵn, giữ nguyên để bạn kiểm tra:', plan.duplicates);
    if (plan.issues.length) throw new SeedError(plan.issues.join('\n'));
    if (!options.apply) console.log(`DRY-RUN: created=0 updated=0 skipped=0 errors=0; KHÔNG ghi Firestore.${options.inspect ? ' Đã đối chiếu Cloud chỉ đọc.' : ' Muốn đối chiếu Cloud read-only: thêm --check-existing.'}`);
    else {
      const result = await writeSeedPlan(db, plan);
      console.log('Kết quả ghi thực tế (products + categories):', result);
      if (result.errors) { console.error('Một batch thất bại. Các batch trước có thể đã ghi; chạy dry-run đối chiếu lại trước khi tiếp tục.'); process.exitCode = 1; }
      const verification = await verifySeedPlan(db, plan);
      console.log('Đọc lại xác minh document tồn tại (không ghi thêm):', verification);
      if (!verification.verified) {
        console.error('Chưa xác minh đủ document. Dữ liệu đã commit không bị rollback; kiểm tra kết nối và chạy dry-run --check-existing.');
        process.exitCode = 1;
      } else if (!result.errors) console.log('SEED HOÀN TẤT: ghi/bỏ qua theo kế hoạch và đã đọc lại đủ document catalog.');
    }
  } finally {
    if (db) await db.terminate();
    if (app) { const { deleteApp } = await import('firebase-admin/app'); await deleteApp(app); }
  }
}

await main().catch((error) => {
  console.error(error instanceof SeedError || error instanceof CloudTestConfigError ? error.message : 'Seed thất bại. Kiểm tra cấu hình nextbooks-dev, IAM và kết nối. Không in credentials hoặc SDK stack.');
  process.exitCode = 1;
});

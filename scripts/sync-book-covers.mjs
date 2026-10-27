import { readFileSync } from 'node:fs';
import { loadCloudTestEnv } from './cloud-test-config.mjs';
import { assertBookSeedTarget } from './books-seed-core.mjs';
import { parseCoverOptions, validateCoverMap, planCoverSync } from './book-cover-sync-core.mjs';
import { createCoverContext, coverStep, safeCoverFailure, CoverDiagnosticError } from './cover-sync-diagnostics.mjs';
import { assertCoverServiceAccount, checkCoverIam, executeCoverPlan } from './cover-sync-runtime.mjs';

const context = createCoverContext();
function step(stage, operation) {
  coverStep(context, stage, operation);
  console.log({ event: 'step', stage, operation });
}

async function main() {
  const options = parseCoverOptions(process.argv.slice(2));
  if (options.help) {
    console.log(`Đồng bộ ảnh, không tạo sản phẩm; chỉ nextbooks-dev/(default).
npm run sync:covers -- --project nextbooks-dev --dry-run
npm run sync:covers -- --project nextbooks-dev --dry-run --check-existing
npm run sync:covers -- --project nextbooks-dev --dry-run --diagnose
npm run sync:covers -- --project nextbooks-dev --apply
Dry-run mặc định dùng snapshot audit local, không đọc credentials.
--check-existing chỉ đọc Cloud.
--diagnose chỉ dry-run: đọc Cloud, test IAM chỉ đọc và kiểm tra toàn bộ URL ảnh.
--apply kiểm tra URL, cập nhật và đọc lại. Không kết hợp --diagnose với --apply.
Chỉ ghi imageUrl/coverMetadata cho mục verified; mục needs_manual giữ nguyên.
Log lỗi chỉ dùng code/category/stage/documentId và kết quả commit, không in SDK error/credentials.`);
    return;
  }
  step('mapping', 'load-and-validate-cover-map');
  const mapping = JSON.parse(readFileSync(new URL('../data/book-cover-map.json', import.meta.url), 'utf8'));
  validateCoverMap(mapping);
  context.plannedIds = mapping.books.filter((book) => book.verificationStatus === 'verified').map((book) => book.productId);
  let app, db;
  try {
    let snapshots;
    if (options.apply || options.inspect) {
      step('configuration', 'load-cloud-test-env-and-check-target');
      const { project, env } = loadCloudTestEnv(options.project);
      assertBookSeedTarget(options.project, env, project);
      assertCoverServiceAccount(project, env.FIREBASE_ADMIN_CLIENT_EMAIL);
      for (const name of ['FIRESTORE_EMULATOR_HOST', 'FIREBASE_AUTH_EMULATOR_HOST']) delete process.env[name];
      step('admin-init', 'initialize-explicit-service-account');
      const { cert, initializeApp } = await import('firebase-admin/app');
      const { getFirestore } = await import('firebase-admin/firestore');
      app = initializeApp({ projectId: project, credential: cert({ projectId: project,
        clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL, privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n') }) }, 'nextbooks-cover-sync');
      db = getFirestore(app, '(default)');
      assertBookSeedTarget(options.project, env, db.projectId, db.databaseId);
      if (app.options.projectId !== project) throw new CoverDiagnosticError('ADMIN_PROJECT_MISMATCH', 'configuration');
      console.log({ event: 'admin-target-ok', project, database: db.databaseId, serviceAccountProjectMatches: true });
      if (options.diagnose) {
        step('iam-test', 'test-project-read-update-permissions-no-write');
        const permissions = await checkCoverIam(app.options.credential);
        console.log({ event: 'iam-permissions', ...permissions });
        if (!permissions.canRead || !permissions.canUpdate) throw new CoverDiagnosticError('IAM_PERMISSION_MISSING', 'iam');
      }
      step('read', 'batchGet-existing-products');
      const ids = context.plannedIds;
      const docs = ids.length ? await db.getAll(...ids.map((id) => db.collection('products').doc(id))) : [];
      snapshots = docs.map((doc) => ({ id: doc.id, exists: doc.exists, data: doc.exists ? doc.data() : {}, updateTime: doc.updateTime }));
    } else {
      step('read', 'load-offline-audit-snapshot');
      const audit = JSON.parse(readFileSync(new URL('../data/book-products-audit.json', import.meta.url), 'utf8'));
      snapshots = audit.products.map(({ productId, ...data }) => ({ id: productId, data }));
      console.log(`DRY-RUN OFFLINE: dùng snapshot audit ${audit.checkedAt}; không xác nhận dữ liệu Cloud hiện tại.`);
    }
    step('plan', 'compare-document-identity-and-image-fields');
    const plan = planCoverSync(mapping, snapshots);
    console.log({ mode: options.apply ? 'APPLY' : 'DRY-RUN', project: options.project, database: '(default)',
      total: mapping.books.length, plannedUpdates: plan.updates.length, skipped: plan.skipped, pending: plan.pending, errors: plan.issues.length });
    if (plan.issues.length) {
      context.documentId = context.plannedIds.find((id) => plan.issues.some((issue) => issue.endsWith(id))) ?? null;
      throw new CoverDiagnosticError('PLAN_CONFLICT', 'validation');
    }
    await executeCoverPlan(db, plan, context, { apply: options.apply, checkImages: options.diagnose });
    if (!options.apply) console.log({ event: 'dry-run-complete', created: 0, updated: 0, writes: 0,
      plannedUpdates: plan.updates.length, pending: plan.pending, skipped: plan.skipped });
  } finally {
    // Cleanup must not replace the original failure or obscure a successful commit.
    if (db) await db.terminate().catch(() => console.error({ event: 'cleanup-warning', code: 'FIRESTORE_TERMINATE_FAILED' }));
    if (app) {
      const { deleteApp } = await import('firebase-admin/app');
      await deleteApp(app).catch(() => console.error({ event: 'cleanup-warning', code: 'ADMIN_CLEANUP_FAILED' }));
    }
  }
}

await main().catch((error) => {
  console.error(safeCoverFailure(error, context));
  process.exitCode = 1;
});

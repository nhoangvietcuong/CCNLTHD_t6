import { bookIdentity, buildCatalog } from './data/books-catalog.mjs';

export const MAX_SEED_BOOKS = buildCatalog().products.length;

export class SeedError extends Error {}

export function seedBooksHelp() {
  return `Seed catalog NextBooks — chỉ project nextbooks-dev, database (default).

Cách dùng:
  npm run seed:books -- --help
  npm run seed:books -- --project nextbooks-dev [tùy chọn]

Tùy chọn:
  --help, -h          Hiện hướng dẫn rồi thoát; không đọc credentials hoặc kết nối Cloud.
  --dry-run          Không ghi dữ liệu (mặc định khi thiếu --apply).
  --check-existing   Đối chiếu catalog Cloud chỉ đọc trong dry-run.
  --apply            Cho phép ghi Cloud thật, rồi đọc lại xác minh document.
  --limit N          Chọn 1–${MAX_SEED_BOOKS} sách; mặc định ${MAX_SEED_BOOKS}, rải qua các danh mục.
  --update           Cập nhật metadata document seed đã có; vẫn giữ nguyên stock.
  --project ID       Bắt buộc là nextbooks-dev, trừ khi chỉ xem --help.

Ví dụ dry-run:
  npm run seed:books -- --project nextbooks-dev --dry-run --check-existing

Ví dụ seed thật (chỉ tự chạy khi đã kiểm tra đúng project development):
  npm run seed:books -- --project nextbooks-dev --apply

Nhánh Cloud đọc credentials từ .env.cloud-test.local; không in private key.
CLI, Admin và client phải cùng nextbooks-dev. Chỉ ghi products/categories trong
namespace seed, ID ổn định; chạy lại bỏ qua dữ liệu đã có nếu không có --update.
Không xóa hoặc sửa report-book-*, orders, users. Không kết hợp --apply và --dry-run.
Log ghi thực tế và xác minh đọc lại được tách riêng; lỗi xác minh không rollback commit.`;
}

export function assertBookSeedTarget(project, env, adminProject = env.FIREBASE_ADMIN_PROJECT_ID, databaseId = '(default)') {
  if (project !== 'nextbooks-dev' || env.FIREBASE_ADMIN_PROJECT_ID !== project
    || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== project || env.FIREBASE_CLOUD_TEST_PROJECT_ID !== project
    || adminProject !== project) throw new SeedError('Từ chối seed: CLI, Admin, client và project test phải cùng là nextbooks-dev.');
  if (databaseId !== '(default)') throw new SeedError('Seed chỉ được phép trên database (default).');
  if (env.FIRESTORE_EMULATOR_HOST || env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR !== 'false') {
    throw new SeedError('Cloud seed không chấp nhận cấu hình Emulator.');
  }
}
export function parseSeedOptions(args) {
  const options = { project: '', limit: MAX_SEED_BOOKS, apply: false, inspect: false, update: false, dryRun: false, help: false };
  // Help always wins, including --apply --help: it can never trigger a Cloud action.
  if (args.includes('--help') || args.includes('-h')) return { ...options, help: true };
  const seen = new Set();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (seen.has(arg)) throw new SeedError('Tham số lặp. Dùng --help để xem cú pháp.');
    seen.add(arg);
    if (arg === '--project') options.project = args[++i] ?? '';
    else if (arg === '--limit') {
      const value = args[++i] ?? '';
      if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > MAX_SEED_BOOKS) throw new SeedError(`--limit phải là số nguyên từ 1 đến ${MAX_SEED_BOOKS}.`);
      options.limit = Number(value);
    } else if (arg === '--apply') options.apply = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--check-existing') options.inspect = true;
    else if (arg === '--update') options.update = true;
    else throw new SeedError('Tham số không được hỗ trợ. Dùng --help để xem cú pháp.');
  }
  if (options.project !== 'nextbooks-dev') throw new SeedError('Seed chỉ được phép trên --project nextbooks-dev.');
  if (options.apply && options.dryRun) throw new SeedError('Không kết hợp --apply và --dry-run.');
  return options;
}

export function validateCatalog(catalog) {
  const issues = [];
  for (const key of ['id', 'slug']) {
    const values = catalog.products.map((product) => product[key]);
    if (new Set(values).size !== values.length) issues.push(`Trùng product ${key}.`);
    const categories = catalog.categories.map((category) => category[key]);
    if (new Set(categories).size !== categories.length) issues.push(`Trùng category ${key}.`);
  }
  const identities = new Set();
  const categoryIds = new Set(catalog.categories.map((category) => category.id));
  for (const product of catalog.products) {
    const identity = bookIdentity(product.name, product.author ?? '');
    if (identities.has(identity)) issues.push(`Trùng đầu sách: ${product.name}`);
    identities.add(identity);
    if (!categoryIds.has(product.categoryId) || !product.name || !product.author || !product.description.includes('DỮ LIỆU DEMO')) issues.push(`Thiếu dữ liệu: ${product.id}`);
    if (!Number.isSafeInteger(product.price) || product.price <= 0 || !Number.isSafeInteger(product.originalPrice)
      || product.originalPrice < product.price || Math.round((1 - product.price / product.originalPrice) * 100) !== product.discount) issues.push(`Giá sai: ${product.id}`);
    if (!Number.isSafeInteger(product.stock) || product.stock < 0 || product.stock > 999) issues.push(`Tồn kho sai: ${product.id}`);
    if (!Number.isFinite(product.rating) || product.rating < 0 || product.rating > 5
      || !Number.isSafeInteger(product.reviewCount) || product.reviewCount < 0) issues.push(`Đánh giá demo sai: ${product.id}`);
    if (!/^seed-book-[a-z0-9-]+$/.test(product.id) || !/^[a-z0-9-]+$/.test(product.slug)
      || product.imageUrl !== `/demo-covers/${product.slug}.svg`) issues.push(`ID/ảnh sai: ${product.id}`);
  }
  if (issues.length) throw new SeedError(issues.join('\n'));
}

export function selectBooks(catalog, limit) {
  // Small demo runs still exercise all categories instead of just the first one.
  const buckets = catalog.categories.map((category) => catalog.products.filter((product) => product.categoryId === category.id));
  const selected = [];
  for (let row = 0; selected.length < Math.min(limit, catalog.products.length); row++) {
    for (const bucket of buckets) if (bucket[row] && selected.length < limit) selected.push(bucket[row]);
  }
  return selected;
}
function indexRecords(records, field) {
  const result = new Map();
  for (const record of records) {
    const key = typeof record.data[field] === 'string' ? record.data[field] : '';
    if (key) result.set(key, [...(result.get(key) ?? []), record]);
  }
  return result;
}
function stripId(record) { return Object.fromEntries(Object.entries(record).filter(([key]) => key !== 'id')); }
function changedFields(desired, existing) {
  return Object.fromEntries(Object.entries(desired).filter(([key, value]) => JSON.stringify(value) !== JSON.stringify(existing[key])));
}
export function planBookSeed(catalog, existingProducts = [], existingCategories = [], options = { limit: MAX_SEED_BOOKS, update: false }) {
  validateCatalog(catalog);
  const entries = [];
  const issues = [];
  const categoryMap = new Map();
  const categoryById = new Map(existingCategories.map((entry) => [entry.id, entry]));
  const categoryBySlug = indexRecords(existingCategories, 'slug');
  const selected = selectBooks(catalog, options.limit);
  const requiredCategories = new Set(selected.map((product) => product.categoryId));
  for (const category of catalog.categories.filter((entry) => requiredCategories.has(entry.id))) {
    const byId = categoryById.get(category.id);
    const matches = categoryBySlug.get(category.slug) ?? [];
    if (matches.length > 1 || (byId && byId.data.slug !== category.slug)) {
      issues.push(`Danh mục xung đột: ${category.slug}`); continue;
    }
    const existing = byId ?? matches[0];
    const id = existing?.id ?? category.id;
    categoryMap.set(category.id, id);
    const patch = existing ? changedFields(stripId(category), existing.data) : stripId(category);
    const action = !existing ? 'create' : options.update && id === category.id && Object.keys(patch).length ? 'update' : 'skip';
    entries.push({ collection: 'categories', id, action, data: patch, updateTime: existing?.updateTime,
      reason: existing ? (id === category.id ? 'existing seed category' : 'reuse existing category slug') : 'new category' });
  }
  const productById = new Map(existingProducts.map((entry) => [entry.id, entry]));
  const productBySlug = indexRecords(existingProducts, 'slug');
  const identityIndex = new Map();
  for (const entry of existingProducts) {
    if (typeof entry.data.name !== 'string') continue;
    const identity = bookIdentity(entry.data.name, typeof entry.data.author === 'string' ? entry.data.author : '');
    identityIndex.set(identity, [...(identityIndex.get(identity) ?? []), entry]);
  }
  const duplicates = [...identityIndex.values()].filter((matches) => matches.length > 1)
    .map((matches) => ({ name: matches[0].data.name, ids: matches.map((entry) => entry.id) }));
  for (const product of selected) {
    const categoryId = categoryMap.get(product.categoryId);
    if (!categoryId) continue;
    const identity = bookIdentity(product.name, product.author);
    const byId = productById.get(product.id);
    const slugMatches = productBySlug.get(product.slug) ?? [];
    const identityMatches = identityIndex.get(identity) ?? [];
    if (byId && (typeof byId.data.name !== 'string' || bookIdentity(byId.data.name, byId.data.author ?? '') !== identity || byId.data.slug !== product.slug)) {
      issues.push(`ID seed đang thuộc dữ liệu khác: ${product.id}`); continue;
    }
    if (slugMatches.some((entry) => typeof entry.data.name !== 'string' || bookIdentity(entry.data.name, entry.data.author ?? '') !== identity)) {
      issues.push(`Slug đang thuộc đầu sách khác: ${product.slug}`); continue;
    }
    const aliases = [...new Set([...slugMatches, ...identityMatches].map((entry) => entry.id))].filter((id) => id !== product.id);
    if (aliases.length || (!byId && identityMatches.length)) {
      entries.push({ collection: 'products', id: product.id, verificationId: aliases[0], action: 'skip', reason: `existing title/slug at ${aliases.join(', ')}` }); continue;
    }
    const desired = stripId({ ...product, categoryId });
    if (byId) delete desired.stock; // Never restock a book already used by checkout.
    // A later catalog --update must not replace a manually supplied or verified cover with demo artwork.
    if (byId && typeof byId.data.imageUrl === 'string' && !byId.data.imageUrl.startsWith('/demo-covers/')) delete desired.imageUrl;
    const patch = byId ? changedFields(desired, byId.data) : desired;
    const action = !byId ? 'create' : options.update && Object.keys(patch).length ? 'update' : 'skip';
    entries.push({ collection: 'products', id: product.id, action, data: patch, updateTime: byId?.updateTime,
      reason: byId ? 'existing managed product; stock preserved' : 'new product' });
  }
  return { entries, issues, duplicates, selected };
}
export function summarizePlan(plan) {
  return Object.fromEntries(['create', 'update', 'skip'].map((action) => [action, plan.entries.filter((entry) => entry.action === action).length]));
}
export async function writeSeedPlan(db, plan, batchSize = 100) {
  if (plan.issues.length) throw new SeedError('Kế hoạch có xung đột; không ghi dữ liệu.');
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 100) throw new SeedError('Batch phải từ 1 đến 100 writes.');
  const writes = plan.entries.filter((entry) => entry.action !== 'skip');
  for (const entry of writes) {
    const validNamespace = entry.collection === 'products' ? /^seed-book-[a-z0-9-]+$/.test(entry.id)
      : entry.collection === 'categories' && /^seed-cat-[a-z0-9-]+$/.test(entry.id);
    if (!validNamespace) throw new SeedError('Từ chối ghi ngoài namespace catalog seed.');
    if (!['create', 'update'].includes(entry.action)) throw new SeedError('Seed chỉ chấp nhận create hoặc update.');
    if (entry.action === 'update' && !entry.updateTime) throw new SeedError('Thiếu precondition cho update; không ghi dữ liệu.');
  }
  const result = { created: 0, updated: 0, skipped: plan.entries.length - writes.length, errors: 0, unattempted: 0 };
  for (let start = 0; start < writes.length; start += batchSize) {
    const chunk = writes.slice(start, start + batchSize);
    const batch = db.batch();
    for (const entry of chunk) {
      if (!['products', 'categories'].includes(entry.collection)) throw new SeedError('Từ chối ghi ngoài catalog.');
      const ref = db.collection(entry.collection).doc(entry.id);
      if (entry.action === 'create') batch.create(ref, entry.data);
      else {
        if (!entry.updateTime) throw new SeedError('Thiếu precondition cho update; không ghi batch.');
        batch.update(ref, entry.data, { lastUpdateTime: entry.updateTime });
      }
    }
    try {
      await batch.commit();
      result.created += chunk.filter((entry) => entry.action === 'create').length;
      result.updated += chunk.filter((entry) => entry.action === 'update').length;
    } catch {
      result.errors = chunk.length;
      result.unattempted = writes.length - start - chunk.length;
      return result; // Previous batches may have committed; never report full success.
    }
  }
  return result;
}

export async function verifySeedPlan(db, plan) {
  if (plan.issues.length) throw new SeedError('Không xác minh kế hoạch có xung đột.');
  const targets = new Map();
  for (const entry of plan.entries) {
    const id = entry.verificationId ?? entry.id;
    if (!['products', 'categories'].includes(entry.collection) || typeof id !== 'string' || !id || id.includes('/')) {
      throw new SeedError('Từ chối xác minh path ngoài catalog.');
    }
    targets.set(`${entry.collection}/${id}`, { collection: entry.collection, id });
  }
  const records = [...targets.values()];
  const result = { expected: { products: 0, categories: 0 }, found: { products: 0, categories: 0 }, missing: [], errors: 0 };
  for (const record of records) result.expected[record.collection]++;
  for (let start = 0; start < records.length; start += 100) {
    const chunk = records.slice(start, start + 100);
    try {
      const snapshots = await db.getAll(...chunk.map((record) => db.collection(record.collection).doc(record.id)));
      for (let index = 0; index < chunk.length; index++) {
        const record = chunk[index];
        if (snapshots[index]?.exists) result.found[record.collection]++;
        else result.missing.push(`${record.collection}/${record.id}`);
      }
    } catch {
      // Read failures do not undo successful commits. Keep these counts separate.
      result.errors += chunk.length;
    }
  }
  return { ...result, verified: result.errors === 0 && result.missing.length === 0 };
}

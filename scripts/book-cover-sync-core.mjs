import { bookIdentity } from './data/books-catalog.mjs';

export class CoverSyncError extends Error {}

export function parseCoverOptions(args) {
  if (args.includes('--help') || args.includes('-h')) return { help: true, apply: false };
  const result = { project: '', apply: false, inspect: false, dryRun: false, diagnose: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--project') result.project = args[++i] ?? '';
    else if (arg === '--apply') result.apply = true;
    else if (arg === '--dry-run') result.dryRun = true;
    else if (arg === '--check-existing') result.inspect = true;
    else if (arg === '--diagnose') { result.diagnose = true; result.inspect = true; }
    else throw new CoverSyncError(`Tham số không hỗ trợ: ${arg}`);
  }
  if (result.project !== 'nextbooks-dev') throw new CoverSyncError('Bắt buộc --project nextbooks-dev.');
  if (result.apply && result.dryRun) throw new CoverSyncError('Không kết hợp --apply và --dry-run.');
  if (result.apply && result.diagnose) throw new CoverSyncError('--diagnose chỉ được dùng trong dry-run.');
  return result;
}

export function validateCoverMap(mapping) {
  if (mapping.version !== 1 || mapping.project !== 'nextbooks-dev' || mapping.database !== '(default)' || !Array.isArray(mapping.books)) {
    throw new CoverSyncError('Mapping phải thuộc nextbooks-dev, database (default), version 1.');
  }
  const ids = new Set();
  for (const book of mapping.books) {
    if (typeof book.productId !== 'string' || !/^seed-book-[a-z0-9-]+$/.test(book.productId) || ids.has(book.productId)) throw new CoverSyncError('Product ID không hợp lệ hoặc trùng trong mapping.');
    ids.add(book.productId);
    if (![book.title, book.author].every((value) => typeof value === 'string' && value.trim())) throw new CoverSyncError('Thiếu tên sách/tác giả.');
    if (!['verified', 'needs_manual'].includes(book.verificationStatus)) throw new CoverSyncError('Trạng thái xác minh không hợp lệ.');
    if (book.verificationStatus !== 'verified') continue;
    const remote = typeof book.imageUrl === 'string' && /^https:\/\/covers\.openlibrary\.org\/b\/id\/[1-9][0-9]*-L\.jpg\?default=false$/.test(book.imageUrl);
    const local = typeof book.imageUrl === 'string' && /^\/books\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(book.imageUrl);
    if (!remote && !local) throw new CoverSyncError('Ảnh phải từ Covers API đã xác minh hoặc asset /books/ an toàn.');
    if (remote && (book.rightsStatus !== 'api_display_permitted' || !/^https:\/\/openlibrary\.org\/books\/OL[0-9]+M$/.test(book.sourceUrl))) throw new CoverSyncError('Thiếu bằng chứng nguồn/điều kiện Covers API.');
    if (local && book.rightsStatus !== 'owner_authorized') throw new CoverSyncError('Ảnh local cần xác nhận quyền sử dụng.');
    if (![book.edition, book.source, book.sourceUrl, book.checkedAt].every((value) => typeof value === 'string' && value.trim())) throw new CoverSyncError('Thiếu metadata ấn bản đã xác minh.');
    if (!/^https:\/\//.test(book.sourceUrl) || Number.isNaN(Date.parse(book.checkedAt))) throw new CoverSyncError('Nguồn hoặc thời điểm xác minh không hợp lệ.');
    if (book.isbn !== null && !/^(97[89][0-9]{10}|[0-9]{9}[0-9X])$/.test(book.isbn)) throw new CoverSyncError('ISBN không hợp lệ.');
  }
}

export function coverPatch(book) {
  return { imageUrl: book.imageUrl, coverMetadata: {
    isbn: book.isbn ?? '', edition: book.edition, source: book.source, sourceUrl: book.sourceUrl, verifiedAt: book.checkedAt,
  } };
}

export function planCoverSync(mapping, snapshots) {
  validateCoverMap(mapping);
  const byId = new Map(snapshots.map((snapshot) => [snapshot.id, snapshot]));
  const plan = { updates: [], skipped: 0, pending: 0, issues: [] };
  for (const book of mapping.books) {
    if (book.verificationStatus !== 'verified') { plan.pending++; continue; }
    const snapshot = byId.get(book.productId);
    if (!snapshot || snapshot.exists === false) { plan.issues.push(`Không tồn tại: ${book.productId}`); continue; }
    const data = snapshot.data;
    if (typeof data.name !== 'string' || typeof data.author !== 'string' || bookIdentity(data.name, data.author) !== bookIdentity(book.title, book.author)) {
      plan.issues.push(`Tên/tác giả đã thay đổi: ${book.productId}`); continue;
    }
    const patch = coverPatch(book);
    const sameMetadata = Object.entries(patch.coverMetadata).every(([key, value]) => data.coverMetadata?.[key] === value);
    if (data.imageUrl === patch.imageUrl && sameMetadata) { plan.skipped++; continue; }
    plan.updates.push({ id: book.productId, patch, updateTime: snapshot.updateTime });
  }
  return plan;
}

export async function writeCoverPlan(db, plan, { beforeCommit = () => {} } = {}) {
  if (plan.issues.length) throw new CoverSyncError('Có lỗi đối chiếu; không ghi bất kỳ sản phẩm nào.');
  if (plan.updates.length > 450) throw new CoverSyncError('Vượt giới hạn batch an toàn.');
  if (!plan.updates.length) return { created: 0, updated: 0, skipped: plan.skipped, pending: plan.pending, errors: 0 };
  const batch = db.batch();
  for (const entry of plan.updates) {
    if (!/^seed-book-[a-z0-9-]+$/.test(entry.id) || !entry.updateTime || Object.keys(entry.patch).sort().join(',') !== 'coverMetadata,imageUrl') throw new CoverSyncError('Từ chối patch ngoài phạm vi ảnh hoặc thiếu precondition.');
    batch.update(db.collection('products').doc(entry.id), entry.patch, { lastUpdateTime: entry.updateTime });
  }
  beforeCommit();
  await batch.commit();
  return { created: 0, updated: plan.updates.length, skipped: plan.skipped, pending: plan.pending, errors: 0 };
}

export async function verifyCoverPlan(db, plan) {
  if (!plan.updates.length) return { checked: 0, mismatched: [], verified: true };
  const docs = await db.getAll(...plan.updates.map((entry) => db.collection('products').doc(entry.id)));
  const mismatched = docs.flatMap((doc, index) => {
    const expected = plan.updates[index];
    const data = doc.exists ? doc.data() : {};
    return data.imageUrl === expected.patch.imageUrl && Object.entries(expected.patch.coverMetadata).every(([key, value]) => data.coverMetadata?.[key] === value) ? [] : [expected.id];
  });
  return { checked: docs.length, mismatched, verified: mismatched.length === 0 };
}

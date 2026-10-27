import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import { CoverDiagnosticError, coverStep } from './cover-sync-diagnostics.mjs';
import { writeCoverPlan, verifyCoverPlan } from './book-cover-sync-core.mjs';

function allowedImageTarget(url) {
  return url.protocol === 'https:' && !url.username && !url.password && (!url.port || url.port === '443') &&
    (url.hostname === 'covers.openlibrary.org' || url.hostname === 'archive.org' || url.hostname.endsWith('.archive.org'));
}

export async function checkCoverImage(imageUrl, { fetchImpl = fetch, decode = (bytes) => sharp(bytes).metadata(), timeoutMs = 30000 } = {}) {
  let bytes;
  let redirects = 0;
  let url = new URL(imageUrl, 'https://covers.openlibrary.org');
  if (imageUrl.startsWith('/books/')) {
    if (!/^\/books\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(imageUrl)) throw new CoverDiagnosticError('LOCAL_IMAGE_PATH_INVALID', 'image');
    const path = new URL(`../public${imageUrl}`, import.meta.url);
    if (!existsSync(path)) throw new CoverDiagnosticError('LOCAL_IMAGE_MISSING', 'image');
    bytes = readFileSync(path);
    if (bytes.length > 8 * 1024 * 1024) throw new CoverDiagnosticError('IMAGE_TOO_LARGE', 'image');
  } else {
    const signal = AbortSignal.timeout(timeoutMs);
    let response;
    for (;;) {
      if (!allowedImageTarget(url)) throw new CoverDiagnosticError('IMAGE_REDIRECT_BLOCKED', 'image');
      response = await fetchImpl(url.href, { redirect: 'manual', signal });
      if (![301, 302, 303, 307, 308].includes(response.status)) break;
      await response.body?.cancel();
      if (redirects++ >= 5) throw new CoverDiagnosticError('IMAGE_REDIRECT_LIMIT', 'image');
      const location = response.headers.get('location');
      if (!location) throw new CoverDiagnosticError('IMAGE_REDIRECT_MISSING_LOCATION', 'image');
      try { url = new URL(location, url); } catch { throw new CoverDiagnosticError('IMAGE_REDIRECT_INVALID', 'image'); }
    }
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().startsWith('image/')) {
      await response.body?.cancel();
      throw new CoverDiagnosticError('IMAGE_HTTP_OR_CONTENT_TYPE', 'image', response.status);
    }
    if (!response.body) throw new CoverDiagnosticError('IMAGE_BODY_MISSING', 'image');
    const reader = response.body.getReader();
    const chunks = []; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.length;
        if (size > 8 * 1024 * 1024) throw new CoverDiagnosticError('IMAGE_TOO_LARGE', 'image');
        chunks.push(value);
      }
    } finally { await reader.cancel().catch(() => {}); }
    bytes = Buffer.concat(chunks);
  }
  let metadata;
  try { metadata = await decode(bytes); } catch { throw new CoverDiagnosticError('IMAGE_DECODE_FAILED', 'image'); }
  if (!metadata.width || !metadata.height || metadata.width < 100 || metadata.height < 100) throw new CoverDiagnosticError('IMAGE_TOO_SMALL', 'image');
  return { width: metadata.width, height: metadata.height, redirects, finalHost: url.hostname };
}

export function assertCoverServiceAccount(project, clientEmail) {
  if (project !== 'nextbooks-dev' || typeof clientEmail !== 'string' || !/^[a-z0-9-]+@nextbooks-dev\.iam\.gserviceaccount\.com$/.test(clientEmail)) {
    throw new CoverDiagnosticError('SERVICE_ACCOUNT_PROJECT_MISMATCH', 'configuration');
  }
}

export async function checkCoverIam(credential, { fetchImpl = fetch } = {}) {
  const { access_token: token } = await credential.getAccessToken();
  const response = await fetchImpl('https://cloudresourcemanager.googleapis.com/v1/projects/nextbooks-dev:testIamPermissions', {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ permissions: ['datastore.entities.get', 'datastore.entities.update'] }), signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new CoverDiagnosticError(response.status === 403 ? 'IAM_TEST_FORBIDDEN' : 'IAM_TEST_FAILED', 'iam', response.status);
  const data = await response.json();
  const permissions = new Set(Array.isArray(data.permissions) ? data.permissions : []);
  return { project: 'nextbooks-dev', scope: 'project-permission-test',
    canRead: permissions.has('datastore.entities.get'), canUpdate: permissions.has('datastore.entities.update') };
}

export async function executeCoverPlan(db, plan, context, { apply = false, checkImages = false, checkImage = checkCoverImage, log = console.log } = {}) {
  context.plannedIds = plan.updates.map((entry) => entry.id);
  if (checkImages || apply) {
    for (const entry of plan.updates) {
      coverStep(context, 'image-check', 'GET-and-decode-cover', entry.id);
      const result = await checkImage(entry.patch.imageUrl);
      log({ event: 'image-ok', documentId: entry.id, ...result });
    }
  }
  if (!apply) return;
  coverStep(context, 'prepare', 'prepare-image-only-batch');
  const result = await writeCoverPlan(db, plan, { beforeCommit: () => {
    coverStep(context, 'commit', 'atomic-batch-update-image-fields');
    context.writeState = 'committing';
  } });
  context.writeState = 'committed';
  context.confirmedUpdatedIds = [...context.plannedIds];
  log({ event: 'commit-ok', ...result, updatedIds: context.confirmedUpdatedIds });
  coverStep(context, 'verify', 'read-back-image-fields');
  const verification = await verifyCoverPlan(db, plan);
  log({ event: 'read-back', ...verification });
  if (!verification.verified) throw new CoverDiagnosticError('READ_BACK_MISMATCH', 'verification');
}

export class CoverDiagnosticError extends Error {
  constructor(code, category, status) {
    super(code);
    this.code = code;
    this.category = category;
    if (status) this.httpStatus = status;
  }
}

const codes = {
  7: ['PERMISSION_DENIED', 'iam'], 16: ['UNAUTHENTICATED', 'credentials'],
  9: ['FAILED_PRECONDITION', 'concurrency'], 10: ['ABORTED', 'concurrency'],
  5: ['NOT_FOUND', 'document'], 4: ['DEADLINE_EXCEEDED', 'network'],
  14: ['UNAVAILABLE', 'network'], 13: ['INTERNAL', 'firestore'],
  'app/invalid-credential': ['INVALID_CREDENTIAL', 'credentials'],
  invalid_grant: ['INVALID_GRANT', 'credentials'],
  'permission-denied': ['PERMISSION_DENIED', 'iam'],
  unauthenticated: ['UNAUTHENTICATED', 'credentials'],
  'failed-precondition': ['FAILED_PRECONDITION', 'concurrency'],
  aborted: ['ABORTED', 'concurrency'],
  unavailable: ['UNAVAILABLE', 'network'],
  'deadline-exceeded': ['DEADLINE_EXCEEDED', 'network'],
  ENOTFOUND: ['ENOTFOUND', 'network'], EAI_AGAIN: ['EAI_AGAIN', 'network'],
  ECONNRESET: ['ECONNRESET', 'network'], ECONNREFUSED: ['ECONNREFUSED', 'network'],
  ETIMEDOUT: ['ETIMEDOUT', 'network'], UND_ERR_CONNECT_TIMEOUT: ['CONNECT_TIMEOUT', 'network'],
  CERT_HAS_EXPIRED: ['CERT_HAS_EXPIRED', 'tls'], UNABLE_TO_VERIFY_LEAF_SIGNATURE: ['TLS_CERTIFICATE_ERROR', 'tls'],
};

export function classifyCoverError(error, stage) {
  if (error instanceof CoverDiagnosticError) return { code: error.code, category: error.category,
    ...(error.httpStatus ? { httpStatus: error.httpStatus } : {}) };
  const candidate = error?.code ?? error?.cause?.code ?? error?.response?.data?.error;
  const known = codes[candidate] ?? codes[String(candidate).toLowerCase().replaceAll('_', '-')];
  if (known) return { code: known[0], category: known[1] };
  if (error?.name === 'TimeoutError' || error?.name === 'AbortError') return { code: 'TIMEOUT', category: 'network' };
  if (stage === 'admin-init') return { code: 'ADMIN_INIT_FAILED', category: 'credentials' };
  if (stage === 'configuration' || stage === 'mapping' || stage === 'plan') return { code: 'VALIDATION_FAILED', category: 'configuration' };
  return { code: 'UNCLASSIFIED_ERROR', category: stage === 'image-check' ? 'image' : 'firestore' };
}

export function createCoverContext() {
  return { stage: 'configuration', operation: 'parse-options', documentId: null,
    plannedIds: [], confirmedUpdatedIds: [], writeState: 'not-started' };
}

export function coverStep(context, stage, operation, documentId = null) {
  Object.assign(context, { stage, operation, documentId });
}

export function safeCoverFailure(error, context) {
  const detail = classifyCoverError(error, context.stage);
  // A failed atomic commit with a definite rejection writes nothing. Timeouts
  // and transport failures may hide an acknowledged commit: do not claim zero.
  const definiteRejection = ['PERMISSION_DENIED', 'UNAUTHENTICATED', 'FAILED_PRECONDITION', 'ABORTED', 'NOT_FOUND', 'INVALID_CREDENTIAL', 'INVALID_GRANT'].includes(detail.code);
  const unknownCommit = context.writeState === 'committing' && !definiteRejection;
  const confirmed = [...context.confirmedUpdatedIds];
  return { event: 'sync-failed', errors: 1, ...detail,
    stage: context.stage, operation: context.operation, documentId: context.documentId,
    updated: unknownCommit ? null : confirmed.length, confirmedUpdatedIds: confirmed,
    notUpdatedIds: context.writeState === 'committed' || unknownCommit ? [] : [...context.plannedIds],
    unknownIds: unknownCommit ? [...context.plannedIds] : [],
    writeState: unknownCommit ? 'unknown-confirm-with-cloud-dry-run' : context.writeState === 'committing' ? 'rejected' : context.writeState,
  };
}

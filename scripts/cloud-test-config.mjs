import { parseEnv } from 'node:util';
import { readFileSync } from 'node:fs';

export class CloudTestConfigError extends Error {}

export function validateCloudTestEnv(values, confirmedProject) {
  const project = values.FIREBASE_CLOUD_TEST_PROJECT_ID;
  if (!project || !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(project) || project.startsWith('demo-')) {
    throw new CloudTestConfigError('Điền project development thật trong .env.cloud-test.local.');
  }
  if (confirmedProject !== project) throw new CloudTestConfigError('Thêm --project PROJECT_ID trùng project development trong file cấu hình.');
  if (values.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== project || values.FIREBASE_ADMIN_PROJECT_ID !== project) {
    throw new CloudTestConfigError('Project client, Admin và project test phải trùng nhau.');
  }
  if (values.NEXT_PUBLIC_USE_FIREBASE_EMULATOR !== 'false' || values.FIRESTORE_EMULATOR_HOST) {
    throw new CloudTestConfigError('Cloud test yêu cầu NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false và không có FIRESTORE_EMULATOR_HOST trong file.');
  }
  for (const key of ['NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_APP_ID', 'FIREBASE_ADMIN_CLIENT_EMAIL', 'FIREBASE_ADMIN_PRIVATE_KEY']) {
    if (!values[key] || /YOUR_|PLACEHOLDER/.test(values[key])) throw new CloudTestConfigError(`Chưa cấu hình ${key}.`);
  }
  return project;
}

export function loadCloudTestEnv(confirmedProject) {
  let values;
  try { values = parseEnv(readFileSync(new URL('../.env.cloud-test.local', import.meta.url), 'utf8')); }
  catch { throw new CloudTestConfigError('Tạo .env.cloud-test.local từ .env.cloud-test.example trước.'); }
  return buildCloudTestEnv(values, confirmedProject, process.env);
}

export function buildCloudTestEnv(values, confirmedProject, inherited) {
  const project = validateCloudTestEnv(values, confirmedProject);
  const env = { ...inherited };
  // Do not inherit project/credential/emulator selections from another terminal.
  for (const key of Object.keys(env)) {
    if (/^(NEXT_PUBLIC_FIREBASE_|FIREBASE_ADMIN_|FIREBASE_CLOUD_TEST_|FIRESTORE_|FIREBASE_AUTH_EMULATOR_HOST|GOOGLE_APPLICATION_CREDENTIALS)/.test(key)) delete env[key];
  }
  return { project, env: { ...env, ...values, NODE_ENV: 'development', NEXT_PUBLIC_USE_FIREBASE_EMULATOR: 'false',
    FIRESTORE_EMULATOR_HOST: '', FIREBASE_AUTH_EMULATOR_HOST: '', GOOGLE_APPLICATION_CREDENTIALS: '' } };
}

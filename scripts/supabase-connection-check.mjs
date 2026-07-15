/* eslint-disable no-console */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { Pool } from 'pg';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(rootDir, '.env.supabase.local');

function parseEnvFile(content) {
  return Object.fromEntries(
    content
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separatorIndex = line.indexOf('=');

        if (separatorIndex === -1) {
          return [line, ''];
        }

        const key = line.slice(0, separatorIndex).trim();
        const rawValue = line.slice(separatorIndex + 1).trim();
        const value = rawValue.replace(/^['"]|['"]$/gu, '');

        return [key, value];
      }),
  );
}

function redact(message, secrets) {
  return secrets.reduce(
    (redacted, secret) => (secret ? redacted.replaceAll(secret, '<redacted>') : redacted),
    message,
  );
}

if (!existsSync(envPath)) {
  console.error('Missing .env.supabase.local.');
  process.exit(1);
}

const envValues = parseEnvFile(readFileSync(envPath, 'utf8'));
const secrets = [envValues['DATABASE_URL'], envValues['DIRECT_URL']];
let hasError = false;

for (const key of ['DATABASE_URL', 'DIRECT_URL']) {
  const value = envValues[key];

  if (!value) {
    console.error(`${key}: missing`);
    hasError = true;
    continue;
  }

  if (/\[YOUR-PASSWORD\]|YOUR-PASSWORD|\[|\]/u.test(value)) {
    console.error(`${key}: placeholder remains`);
    hasError = true;
  }

  try {
    const parsed = new URL(value);
    console.log(
      `${key}: protocol=${parsed.protocol} host=${parsed.hostname} port=${parsed.port || '(default)'} db=${parsed.pathname.replace('/', '')}`,
    );
  } catch {
    console.error(`${key}: invalid URL`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

for (const key of ['DATABASE_URL', 'DIRECT_URL']) {
  const pool = new Pool({
    connectionString: envValues[key],
    connectionTimeoutMillis: 10_000,
    max: 1,
  });

  try {
    await pool.query('select 1 as ok');
    console.log(`${key}: SELECT 1 ok`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const code =
      typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'ERROR';
    console.error(`${key}: connection failed: ${code} ${redact(message, secrets).slice(0, 220)}`);
    hasError = true;
  } finally {
    await pool.end().catch(() => {});
  }
}

if (hasError) {
  process.exit(1);
}

/* eslint-disable no-console */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(rootDir, '.env.supabase.local');
const apiDir = path.join(rootDir, 'apps', 'api');
const prismaCliPath = path.join(rootDir, 'node_modules', 'prisma', 'build', 'index.js');

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

if (!existsSync(envPath)) {
  console.error('Missing .env.supabase.local.');
  console.error(
    'Copy .env.supabase.local.example to .env.supabase.local and fill DATABASE_URL and DIRECT_URL.',
  );
  process.exit(1);
}

const envValues = parseEnvFile(readFileSync(envPath, 'utf8'));
const databaseUrl = envValues['DATABASE_URL'];
const directUrl = envValues['DIRECT_URL'];

if (!databaseUrl || !directUrl) {
  console.error('DATABASE_URL and DIRECT_URL are required in .env.supabase.local.');
  process.exit(1);
}

if (!databaseUrl.includes('supabase') || !directUrl.includes('supabase')) {
  console.error(
    'DATABASE_URL and DIRECT_URL must point to Supabase before running cloud migrations.',
  );
  process.exit(1);
}

const child = spawn(process.execPath, [prismaCliPath, 'migrate', 'deploy'], {
  cwd: apiDir,
  env: {
    ...process.env,
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
  },
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`Prisma migration stopped by signal ${signal}.`);
    process.exit(1);
  }

  process.exit(code ?? 1);
});

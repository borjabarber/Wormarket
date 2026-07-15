/* eslint-disable no-console */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

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

function runNpm(args, env) {
  const command = process.platform === 'win32' ? (process.env['ComSpec'] ?? 'cmd.exe') : 'npm';
  const commandArgs =
    process.platform === 'win32' ? ['/d', '/s', '/c', ['npm', ...args].join(' ')] : args;

  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      cwd: rootDir,
      env,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`npm stopped by signal ${signal}.`));
        return;
      }

      if (code !== 0) {
        reject(new Error(`npm exited with code ${code ?? 1}.`));
        return;
      }

      resolve();
    });
  });
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
  console.error('DATABASE_URL and DIRECT_URL must point to Supabase before seeding demo data.');
  process.exit(1);
}

if (/\[YOUR-PASSWORD\]|YOUR-PASSWORD|\[|\]/u.test(databaseUrl + directUrl)) {
  console.error('DATABASE_URL or DIRECT_URL still contains a placeholder.');
  process.exit(1);
}

const childEnv = {
  ...process.env,
  DATABASE_URL: databaseUrl,
  DIRECT_URL: directUrl,
};

try {
  console.log('Generating Prisma client before Supabase demo seed...');
  await runNpm(['run', 'db:generate', '--workspace=@wormarket/api', '--if-present'], childEnv);

  console.log('Loading controlled Wormarket demo seed into Supabase...');
  await runNpm(['run', 'db:seed', '--workspace=@wormarket/api', '--if-present'], childEnv);
} catch (error) {
  console.error('Supabase demo seed failed.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

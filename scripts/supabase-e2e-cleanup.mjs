/* eslint-disable no-console */

import { existsSync, readFileSync } from 'node:fs';

import { cleanupE2eArtifacts } from './local-e2e-cleanup.mjs';

const envFilePath = '.env.supabase.local';

function loadSupabaseEnv() {
  if (!existsSync(envFilePath)) {
    throw new Error(`Falta ${envFilePath}; no se puede limpiar Supabase.`);
  }

  const content = readFileSync(envFilePath, 'utf8');

  for (const line of content.split(/\r?\n/u)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts
      .join('=')
      .trim()
      .replace(/^["']|["']$/gu, '');

    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }

  if (!process.env.DATABASE_URL?.includes('supabase')) {
    throw new Error('DATABASE_URL no apunta a Supabase.');
  }
}

function printSummary(result) {
  console.log(`Limpieza e2e Supabase (${result.scope})`);
  console.log(`Detectados: ${JSON.stringify(result.detected)}`);

  for (const item of result.deleted) {
    console.log(`- ${item.table}: ${item.count}`);
  }
}

try {
  loadSupabaseEnv();

  const runId = process.argv[2];
  const result = await cleanupE2eArtifacts({ runId });

  printSummary(result);
} catch (error) {
  console.error('No se pudieron limpiar los artefactos e2e de Supabase.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

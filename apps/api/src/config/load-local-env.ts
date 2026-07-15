import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envFileCandidates = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '..', '..', '.env'),
];

export function loadLocalEnv(): void {
  for (const envFilePath of envFileCandidates) {
    if (!existsSync(envFilePath)) {
      continue;
    }

    const content = readFileSync(envFilePath, 'utf8');

    for (const line of content.split(/\r?\n/)) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf('=');

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine.slice(separatorIndex + 1).trim();

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

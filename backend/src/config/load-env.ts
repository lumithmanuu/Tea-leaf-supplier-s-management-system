import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const envFilePath = join(process.cwd(), '.env');

if (existsSync(envFilePath)) {
  const envFile = readFileSync(envFilePath, 'utf8');

  for (const rawLine of envFile.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

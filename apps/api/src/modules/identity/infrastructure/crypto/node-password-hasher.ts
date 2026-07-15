import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import type { PasswordHasher } from '../../application/ports/password-hasher';

const algorithm = 'sha256';
const iterations = 120_000;
const keyLength = 32;

@Injectable()
export class NodePasswordHasher implements PasswordHasher {
  hash(password: string): string {
    const salt = randomBytes(16).toString('base64url');
    const derivedKey = pbkdf2Sync(password, salt, iterations, keyLength, algorithm).toString(
      'base64url',
    );

    return `pbkdf2_${algorithm}$${iterations}$${salt}$${derivedKey}`;
  }

  verify(password: string, hash: string): boolean {
    const [name, rawIterations, salt, storedKey] = hash.split('$');

    if (name !== `pbkdf2_${algorithm}` || !rawIterations || !salt || !storedKey) {
      return false;
    }

    const parsedIterations = Number(rawIterations);

    if (!Number.isInteger(parsedIterations) || parsedIterations <= 0) {
      return false;
    }

    const candidateKey = pbkdf2Sync(password, salt, parsedIterations, keyLength, algorithm);
    const storedBuffer = Buffer.from(storedKey, 'base64url');

    return (
      storedBuffer.length === candidateKey.length && timingSafeEqual(storedBuffer, candidateKey)
    );
  }
}

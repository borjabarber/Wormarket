const defaultFrontendOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'] as const;

export function getAllowedFrontendOrigins(): string[] {
  const configuredOrigin = process.env['FRONTEND_URL']?.trim();

  if (!configuredOrigin) {
    return [...defaultFrontendOrigins];
  }

  return Array.from(new Set([configuredOrigin, ...defaultFrontendOrigins]));
}

export function isAllowedFrontendOrigin(origin: string | undefined): boolean {
  return !origin || getAllowedFrontendOrigins().includes(origin);
}

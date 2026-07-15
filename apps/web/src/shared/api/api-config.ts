const defaultApiUrl = 'http://localhost:3001';

export function getApiBaseUrl(): string {
  return (process.env['NEXT_PUBLIC_API_URL'] ?? defaultApiUrl).replace(/\/$/, '');
}

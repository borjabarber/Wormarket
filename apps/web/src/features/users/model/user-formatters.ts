import type { UserRole, UserStatus } from './user-types';

export const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administracion',
  MODERATOR: 'Moderacion',
  USER: 'Usuario',
};

export const statusLabels: Record<UserStatus, string> = {
  ACTIVE: 'Activo',
  BLOCKED: 'Bloqueado',
};

export function formatReputation(reputation: number): string {
  return `${Math.round(reputation)} puntos`;
}

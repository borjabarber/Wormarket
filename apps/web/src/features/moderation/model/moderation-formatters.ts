import type { ReportReason, ReportStatus, ReportTargetType } from './moderation-types';

export const reportReasonLabels: Record<ReportReason, string> = {
  FORBIDDEN_OBJECT: 'Objeto prohibido',
  FRAUD: 'Fraude o estafa',
  HARASSMENT: 'Acoso',
  SPAM: 'Spam',
  OTHER: 'Otro motivo',
};

export const reportStatusLabels: Record<ReportStatus, string> = {
  DISMISSED: 'Descartada',
  PENDING: 'Pendiente',
  RESOLVED: 'Resuelta',
};

export const reportTargetTypeLabels: Record<ReportTargetType, string> = {
  LISTING: 'Anuncio',
  USER: 'Usuario',
};

export function formatReportDate(value: string | null): string {
  if (!value) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

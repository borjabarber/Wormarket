'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button, EmptyState, Skeleton, Textarea } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { moderationClient } from '../api/moderation-client';
import {
  formatReportDate,
  reportReasonLabels,
  reportStatusLabels,
  reportTargetTypeLabels,
} from '../model/moderation-formatters';
import { resolveReportSchema } from '../model/moderation-schemas';
import type { ReportSummary, ResolveReportInput } from '../model/moderation-types';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo cargar la moderacion.';
}

function getTargetTitle(report: ReportSummary): string {
  if (report.targetType === 'LISTING') {
    return report.listing?.title ?? 'Anuncio desconocido';
  }

  return report.reportedUser?.displayName ?? 'Usuario desconocido';
}

function getTargetHref(report: ReportSummary): string | null {
  if (report.targetType === 'LISTING' && report.listing) {
    return `/listings/${report.listing.slug}`;
  }

  if (report.targetType === 'USER' && report.reportedUser) {
    return `/users/${report.reportedUser.username}`;
  }

  return null;
}

function ReportCard({
  isBlocking,
  isResolving,
  onBlockListing,
  onBlockUser,
  onResolve,
  report,
}: {
  isBlocking: boolean;
  isResolving: boolean;
  onBlockListing: (slug: string) => void;
  onBlockUser: (username: string) => void;
  onResolve: (reportId: string, input: ResolveReportInput) => void;
  report: ReportSummary;
}) {
  const [resolution, setResolution] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const targetHref = getTargetHref(report);
  const isPending = report.status === 'PENDING';

  function submitResolution(status: ResolveReportInput['status']): void {
    const result = resolveReportSchema.safeParse({ resolution });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Revisa la resolucion.');
      return;
    }

    setValidationError(null);
    onResolve(report.id, {
      resolution: result.data.resolution,
      status,
    });
  }

  return (
    <li className="moderation-report-item">
      <article aria-labelledby={`report-${report.id}`}>
        <div className="moderation-report-header">
          <div>
            <p className="notification-type">{reportTargetTypeLabels[report.targetType]}</p>
            <h2 id={`report-${report.id}`}>{getTargetTitle(report)}</h2>
          </div>
          <span className="listing-status-badge">{reportStatusLabels[report.status]}</span>
        </div>

        <dl className="moderation-report-facts">
          <div>
            <dt>Motivo</dt>
            <dd>{reportReasonLabels[report.reason]}</dd>
          </div>
          <div>
            <dt>Reporta</dt>
            <dd>
              {report.reporter.displayName} (@{report.reporter.username})
            </dd>
          </div>
          <div>
            <dt>Fecha</dt>
            <dd>{formatReportDate(report.createdAt)}</dd>
          </div>
        </dl>

        <p className="moderation-report-description">{report.description}</p>

        {targetHref ? (
          <div className="offer-item-actions">
            <Button href={targetHref} size="sm" variant="secondary">
              Ver objetivo
            </Button>
            {isPending && report.listing ? (
              <Button
                disabled={isBlocking}
                onClick={() => onBlockListing(report.listing?.slug ?? '')}
                size="sm"
                variant="ghost"
              >
                Bloquear anuncio
              </Button>
            ) : null}
            {isPending && report.reportedUser ? (
              <Button
                disabled={isBlocking}
                onClick={() => onBlockUser(report.reportedUser?.username ?? '')}
                size="sm"
                variant="ghost"
              >
                Bloquear usuario
              </Button>
            ) : null}
          </div>
        ) : null}

        {isPending ? (
          <form
            className="moderation-resolution-form"
            method="post"
            onSubmit={(event) => {
              event.preventDefault();
              submitResolution('RESOLVED');
            }}
          >
            <Textarea
              error={validationError ?? undefined}
              label="Resolucion interna"
              onChange={(event) => setResolution(event.target.value)}
              value={resolution}
            />
            <div className="offer-item-actions">
              <Button disabled={isResolving} type="submit">
                Marcar como resuelta
              </Button>
              <Button
                disabled={isResolving}
                onClick={() => submitResolution('DISMISSED')}
                type="button"
                variant="secondary"
              >
                Descartar denuncia
              </Button>
            </div>
          </form>
        ) : (
          <p className="moderation-resolution-note">
            Resolucion: {report.resolution ?? 'Sin detalle registrado.'}
          </p>
        )}
      </article>
    </li>
  );
}

export function ModerationPage() {
  const { session, user } = useAuth();
  const accessToken = session?.accessToken;
  const queryClient = useQueryClient();
  const canModerate = user?.role === 'MODERATOR' || user?.role === 'ADMIN';

  const reportsQuery = useQuery({
    enabled: Boolean(accessToken && canModerate),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      return moderationClient.listReports(accessToken);
    },
    queryKey: ['moderation', 'reports'],
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ input, reportId }: { input: ResolveReportInput; reportId: string }) => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return moderationClient.resolveReport(reportId, input, accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['moderation', 'reports'] });
    },
  });

  const blockListingMutation = useMutation({
    mutationFn: async (slug: string) => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return moderationClient.blockListing(slug, accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['moderation', 'reports'] });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: async (username: string) => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return moderationClient.blockUser(username, accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['moderation', 'reports'] });
    },
  });

  if (!accessToken) {
    return (
      <section className="moderation-page" aria-labelledby="moderation-title">
        <div className="moderation-intro">
          <p className="eyebrow">Custodia dimensional</p>
          <h1 id="moderation-title">Moderacion</h1>
        </div>
        <EmptyState
          action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
          title="Necesitas una identidad dimensional"
        >
          Inicia sesion con un perfil moderador o admin para revisar denuncias del mercado.
        </EmptyState>
      </section>
    );
  }

  if (!canModerate) {
    return (
      <section className="moderation-page" aria-labelledby="moderation-title">
        <div className="moderation-intro">
          <p className="eyebrow">Custodia dimensional</p>
          <h1 id="moderation-title">Moderacion</h1>
        </div>
        <EmptyState title="Panel reservado">
          Solo moderadores y administradores pueden revisar denuncias, bloquear anuncios o bloquear
          usuarios.
        </EmptyState>
      </section>
    );
  }

  if (reportsQuery.isPending) {
    return (
      <section className="moderation-page" aria-busy="true" aria-label="Cargando moderacion">
        <Skeleton label="Cargando moderacion" />
        <Skeleton />
      </section>
    );
  }

  if (reportsQuery.isError) {
    return (
      <section className="moderation-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudo abrir la cola de moderacion</h1>
          <p>{getErrorMessage(reportsQuery.error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => void reportsQuery.refetch()}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const reports = reportsQuery.data;
  const pendingCount = reports.filter((report) => report.status === 'PENDING').length;

  return (
    <section className="moderation-page" aria-labelledby="moderation-title">
      <div className="moderation-intro">
        <p className="eyebrow">Custodia dimensional</p>
        <h1 id="moderation-title">Moderacion</h1>
        <p>
          Revisa denuncias enviadas por la comunidad, registra una resolucion y bloquea objetivos
          cuando el mercado local lo necesite.
        </p>
      </div>

      <p className="explorer-count" aria-live="polite">
        {pendingCount === 1 ? '1 denuncia pendiente' : `${pendingCount} denuncias pendientes`}
      </p>

      {resolveMutation.isError || blockListingMutation.isError || blockUserMutation.isError ? (
        <p className="auth-error" role="alert">
          {getErrorMessage(
            resolveMutation.error ?? blockListingMutation.error ?? blockUserMutation.error,
          )}
        </p>
      ) : null}

      {reports.length > 0 ? (
        <ol className="moderation-report-list" aria-label="Denuncias">
          {reports.map((report) => (
            <ReportCard
              isBlocking={blockListingMutation.isPending || blockUserMutation.isPending}
              isResolving={resolveMutation.isPending}
              key={report.id}
              onBlockListing={(slug) => blockListingMutation.mutate(slug)}
              onBlockUser={(username) => blockUserMutation.mutate(username)}
              onResolve={(reportId, input) => resolveMutation.mutate({ input, reportId })}
              report={report}
            />
          ))}
        </ol>
      ) : (
        <EmptyState title="No hay denuncias">
          La cola esta limpia. Por ahora ningun objeto imposible ha intentado pasarse de listo.
        </EmptyState>
      )}
    </section>
  );
}

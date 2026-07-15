'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Button, Select, Textarea } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { moderationClient } from '../api/moderation-client';
import { reportReasonLabels } from '../model/moderation-formatters';
import { createReportSchema } from '../model/moderation-schemas';
import {
  reportReasons,
  type CreateReportInput,
  type ReportTargetType,
} from '../model/moderation-types';

type ReportFormProps = {
  targetId: string;
  targetLabel: string;
  targetType: ReportTargetType;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo enviar la denuncia.';
}

export function ReportForm({ targetId, targetLabel, targetType }: ReportFormProps) {
  const { session } = useAuth();
  const accessToken = session?.accessToken;
  const [reason, setReason] = useState<CreateReportInput['reason']>('OTHER');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const reportMutation = useMutation({
    mutationFn: async (input: CreateReportInput) => {
      if (!accessToken) {
        throw new Error('Inicia sesion para enviar una denuncia.');
      }

      return targetType === 'LISTING'
        ? moderationClient.reportListing(targetId, input, accessToken)
        : moderationClient.reportUser(targetId, input, accessToken);
    },
    onSuccess: () => {
      setDescription('');
      setReason('OTHER');
      setValidationError(null);
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const result = createReportSchema.safeParse({ description, reason });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Revisa la denuncia.');
      return;
    }

    reportMutation.mutate(result.data);
  }

  return (
    <section className="report-form-panel" aria-labelledby={`report-${targetType}-${targetId}`}>
      <div>
        <p className="eyebrow">Moderacion comunitaria</p>
        <h2 id={`report-${targetType}-${targetId}`}>Denunciar {targetLabel}</h2>
        <p>
          Usa esta denuncia si detectas fraude, acoso, spam u objetos que no deberian cruzar el
          portal local.
        </p>
      </div>

      {!accessToken ? (
        <Button href="/auth" variant="secondary">
          Iniciar sesion para denunciar
        </Button>
      ) : (
        <form className="auth-form" method="post" onSubmit={handleSubmit}>
          <Select
            label="Motivo"
            onChange={(event) => setReason(event.target.value as CreateReportInput['reason'])}
            value={reason}
          >
            {reportReasons.map((reportReason) => (
              <option key={reportReason} value={reportReason}>
                {reportReasonLabels[reportReason]}
              </option>
            ))}
          </Select>
          <Textarea
            error={validationError ?? undefined}
            label="Descripcion"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />

          {reportMutation.isSuccess ? (
            <p className="moderation-success" role="status">
              Denuncia enviada a la cola de moderacion.
            </p>
          ) : null}
          {reportMutation.isError ? (
            <p className="auth-error" role="alert">
              {getErrorMessage(reportMutation.error)}
            </p>
          ) : null}

          <Button disabled={reportMutation.isPending} type="submit">
            {reportMutation.isPending ? 'Enviando denuncia...' : 'Enviar denuncia'}
          </Button>
        </form>
      )}
    </section>
  );
}

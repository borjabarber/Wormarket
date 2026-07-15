import { getApiBaseUrl } from '../../../shared/api/api-config';
import type {
  BlockListingResult,
  BlockUserResult,
  CreateReportInput,
  ReportSummary,
  ResolveReportInput,
} from '../model/moderation-types';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export class ModerationApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ModerationApiError';
  }
}

async function parseError(response: Response): Promise<ModerationApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new ModerationApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudo completar la accion de moderacion.',
    response.status,
  );
}

async function request<TResponse>(
  path: string,
  accessToken: string,
  options: RequestInit & {
    body?: string;
  } = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${accessToken}`);

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ModerationApiError(
      'NETWORK_ERROR',
      'No se pudo conectar con la API local de Wormarket.',
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export const moderationClient = {
  blockListing(slug: string, accessToken: string): Promise<BlockListingResult> {
    return request<BlockListingResult>(
      `/moderation/listings/${encodeURIComponent(slug)}/block`,
      accessToken,
      { method: 'POST' },
    );
  },
  blockUser(username: string, accessToken: string): Promise<BlockUserResult> {
    return request<BlockUserResult>(
      `/moderation/users/${encodeURIComponent(username)}/block`,
      accessToken,
      { method: 'POST' },
    );
  },
  listReports(accessToken: string): Promise<ReportSummary[]> {
    return request<ReportSummary[]>('/moderation/reports', accessToken);
  },
  reportListing(
    slug: string,
    input: CreateReportInput,
    accessToken: string,
  ): Promise<ReportSummary> {
    return request<ReportSummary>(
      `/moderation/reports/listings/${encodeURIComponent(slug)}`,
      accessToken,
      {
        body: JSON.stringify(input),
        method: 'POST',
      },
    );
  },
  reportUser(
    username: string,
    input: CreateReportInput,
    accessToken: string,
  ): Promise<ReportSummary> {
    return request<ReportSummary>(
      `/moderation/reports/users/${encodeURIComponent(username)}`,
      accessToken,
      {
        body: JSON.stringify(input),
        method: 'POST',
      },
    );
  },
  resolveReport(
    reportId: string,
    input: ResolveReportInput,
    accessToken: string,
  ): Promise<ReportSummary> {
    return request<ReportSummary>(
      `/moderation/reports/${encodeURIComponent(reportId)}/resolve`,
      accessToken,
      {
        body: JSON.stringify(input),
        method: 'POST',
      },
    );
  },
};

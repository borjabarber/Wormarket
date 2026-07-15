import { getApiBaseUrl } from '../../../shared/api/api-config';
import type {
  ConversationMessage,
  ConversationSummary,
  CreateConversationInput,
  SendMessageInput,
} from '../model/conversation-types';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export class ConversationsApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ConversationsApiError';
  }
}

async function parseError(response: Response): Promise<ConversationsApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new ConversationsApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudieron cargar las conversaciones.',
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
    throw new ConversationsApiError(
      'NETWORK_ERROR',
      'No se pudo conectar con la API local de Wormarket.',
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export const conversationsClient = {
  create(input: CreateConversationInput, accessToken: string): Promise<ConversationSummary> {
    return request<ConversationSummary>('/conversations', accessToken, {
      body: JSON.stringify(input),
      method: 'POST',
    });
  },
  get(conversationId: string, accessToken: string): Promise<ConversationSummary> {
    return request<ConversationSummary>(
      `/conversations/${encodeURIComponent(conversationId)}`,
      accessToken,
    );
  },
  listMine(accessToken: string): Promise<ConversationSummary[]> {
    return request<ConversationSummary[]>('/conversations', accessToken);
  },
  listMessages(conversationId: string, accessToken: string): Promise<ConversationMessage[]> {
    return request<ConversationMessage[]>(
      `/conversations/${encodeURIComponent(conversationId)}/messages`,
      accessToken,
    );
  },
  markAsRead(conversationId: string, accessToken: string): Promise<ConversationMessage[]> {
    return request<ConversationMessage[]>(
      `/conversations/${encodeURIComponent(conversationId)}/read`,
      accessToken,
      { method: 'POST' },
    );
  },
  sendMessage(
    conversationId: string,
    input: SendMessageInput,
    accessToken: string,
  ): Promise<ConversationMessage> {
    return request<ConversationMessage>(
      `/conversations/${encodeURIComponent(conversationId)}/messages`,
      accessToken,
      {
        body: JSON.stringify(input),
        method: 'POST',
      },
    );
  },
};

'use client';

import { useQuery } from '@tanstack/react-query';

import { EmptyState, Skeleton } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { conversationsClient } from '../api/conversations-client';
import {
  formatConversationDate,
  getOtherParticipant,
  hasUnreadMessages,
} from '../model/conversation-formatters';
import type { ConversationSummary } from '../model/conversation-types';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar las conversaciones.';
}

function ConversationListItem({
  conversation,
  currentUserId,
}: {
  conversation: ConversationSummary;
  currentUserId: string | undefined;
}) {
  const otherParticipant = getOtherParticipant(conversation, currentUserId);
  const lastMessage = conversation.lastMessage;
  const unread = hasUnreadMessages(conversation, currentUserId);

  return (
    <li className="conversation-item">
      <a href={`/conversations/${conversation.id}`}>
        <div>
          <p className="conversation-item-title">{conversation.listing.title}</p>
          <p>
            Con {otherParticipant.displayName} · {conversation.listing.dimension.name}
          </p>
          <p className="conversation-preview">
            {lastMessage ? lastMessage.content : 'Aun no hay mensajes en esta conversacion.'}
          </p>
        </div>
        <div className="conversation-item-meta">
          <span>{formatConversationDate(conversation.updatedAt)}</span>
          {unread ? <strong>Nuevo</strong> : null}
        </div>
      </a>
    </li>
  );
}

export function ConversationsPage() {
  const { session, user } = useAuth();
  const accessToken = session?.accessToken;

  const conversationsQuery = useQuery({
    enabled: Boolean(accessToken),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      return conversationsClient.listMine(accessToken);
    },
    queryKey: ['conversations', 'mine', session?.user.id],
  });

  if (!accessToken) {
    return (
      <section className="conversations-page" aria-labelledby="conversations-title">
        <div className="conversations-intro">
          <p className="eyebrow">Chat</p>
          <h1 id="conversations-title">Conversaciones</h1>
        </div>
        <EmptyState
          action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
          title="Necesitas una identidad dimensional"
        >
          Inicia sesion para hablar con compradores y vendedores del mercado local.
        </EmptyState>
      </section>
    );
  }

  if (conversationsQuery.isPending) {
    return (
      <section className="conversations-page" aria-busy="true" aria-label="Cargando chat">
        <Skeleton label="Cargando chat" />
        <Skeleton />
      </section>
    );
  }

  if (conversationsQuery.isError) {
    return (
      <section className="conversations-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudieron abrir tus conversaciones</h1>
          <p>{getErrorMessage(conversationsQuery.error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => void conversationsQuery.refetch()}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const conversations = conversationsQuery.data;

  return (
    <section className="conversations-page" aria-labelledby="conversations-title">
      <div className="conversations-intro">
        <p className="eyebrow">Chat</p>
        <h1 id="conversations-title">Conversaciones</h1>
        <p>
          Habla con vendedores y compradores sobre objetos imposibles antes de cerrar una
          transaccion.
        </p>
      </div>

      <p className="explorer-count" aria-live="polite">
        {conversations.length === 1
          ? '1 conversacion activa'
          : `${conversations.length} conversaciones activas`}
      </p>

      {conversations.length > 0 ? (
        <ul className="conversation-list" aria-label="Conversaciones">
          {conversations.map((conversation) => (
            <ConversationListItem
              conversation={conversation}
              currentUserId={user?.id}
              key={conversation.id}
            />
          ))}
        </ul>
      ) : (
        <EmptyState
          action={{ children: 'Explorar objetos', href: '/#explorar' }}
          title="Aun no hay conversaciones"
        >
          Abre el detalle de un anuncio ajeno y contacta con su vendedor para iniciar el chat.
        </EmptyState>
      )}
    </section>
  );
}

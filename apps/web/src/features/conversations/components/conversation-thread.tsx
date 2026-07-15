'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Button, EmptyState, Skeleton, Textarea } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { conversationsClient } from '../api/conversations-client';
import { createConversationSocket } from '../realtime/conversation-socket';
import { formatConversationDate, getOtherParticipant } from '../model/conversation-formatters';
import {
  messageFormSchema,
  type MessageFormValues,
  type ParsedMessageFormValues,
} from '../model/conversation-schemas';
import type { ConversationMessage } from '../model/conversation-types';

type ConversationThreadProps = {
  conversationId: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo cargar la conversacion.';
}

function upsertMessage(messages: ConversationMessage[] | undefined, message: ConversationMessage) {
  const currentMessages = messages ?? [];

  if (currentMessages.some((currentMessage) => currentMessage.id === message.id)) {
    return currentMessages;
  }

  return [...currentMessages, message];
}

export function ConversationThread({ conversationId }: ConversationThreadProps) {
  const { session, user } = useAuth();
  const accessToken = session?.accessToken;
  const queryClient = useQueryClient();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<MessageFormValues>({
    defaultValues: {
      content: '',
    },
  });

  const conversationQuery = useQuery({
    enabled: Boolean(accessToken),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return conversationsClient.get(conversationId, accessToken);
    },
    queryKey: ['conversations', conversationId],
  });

  const messagesQuery = useQuery({
    enabled: Boolean(accessToken),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      return conversationsClient.listMessages(conversationId, accessToken);
    },
    queryKey: ['conversations', conversationId, 'messages'],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (values: ParsedMessageFormValues) => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return conversationsClient.sendMessage(conversationId, values, accessToken);
    },
    onSuccess: async (message) => {
      queryClient.setQueryData<ConversationMessage[]>(
        ['conversations', conversationId, 'messages'],
        (messages) => upsertMessage(messages, message),
      );
      reset();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['conversations', 'mine'] }),
        queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] }),
      ]);
    },
  });

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const socket = createConversationSocket(accessToken);

    socket.emit('conversation:join', { conversationId });
    socket.on('message:sent', (message) => {
      if (message.conversationId !== conversationId) {
        return;
      }

      queryClient.setQueryData<ConversationMessage[]>(
        ['conversations', conversationId, 'messages'],
        (messages) => upsertMessage(messages, message),
      );
      void queryClient.invalidateQueries({ queryKey: ['conversations', 'mine'] });
    });
    socket.on('message:read', (payload) => {
      if (payload.conversationId === conversationId) {
        void queryClient.invalidateQueries({
          queryKey: ['conversations', conversationId, 'messages'],
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, conversationId, queryClient]);

  useEffect(() => {
    if (!accessToken || !messagesQuery.data) {
      return;
    }

    if (
      messagesQuery.data.some(
        (message) => message.sender.id !== user?.id && message.readAt === null,
      )
    ) {
      void conversationsClient.markAsRead(conversationId, accessToken).then((messages) => {
        queryClient.setQueryData(['conversations', conversationId, 'messages'], messages);
      });
    }
  }, [accessToken, conversationId, messagesQuery.data, queryClient, user?.id]);

  if (!accessToken) {
    return (
      <section className="conversation-thread-page" aria-labelledby="conversation-title">
        <div className="conversations-intro">
          <p className="eyebrow">Chat</p>
          <h1 id="conversation-title">Conversacion</h1>
        </div>
        <EmptyState
          action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
          title="Necesitas una identidad dimensional"
        >
          Inicia sesion para leer y enviar mensajes.
        </EmptyState>
      </section>
    );
  }

  if (conversationQuery.isPending || messagesQuery.isPending) {
    return (
      <section
        className="conversation-thread-page"
        aria-busy="true"
        aria-label="Cargando conversacion"
      >
        <Skeleton label="Cargando conversacion" />
        <Skeleton />
      </section>
    );
  }

  if (conversationQuery.isError || messagesQuery.isError) {
    const error = conversationQuery.error ?? messagesQuery.error;

    return (
      <section className="conversation-thread-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudo abrir la conversacion</h1>
          <p>{getErrorMessage(error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => {
              void conversationQuery.refetch();
              void messagesQuery.refetch();
            }}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const conversation = conversationQuery.data;
  const messages = messagesQuery.data;
  const otherParticipant = getOtherParticipant(conversation, user?.id);

  return (
    <section className="conversation-thread-page" aria-labelledby="conversation-title">
      <a className="listing-back-link" href="/conversations">
        Volver a conversaciones
      </a>

      <header className="conversation-thread-header">
        <div>
          <p className="eyebrow">Chat</p>
          <h1 id="conversation-title">{conversation.listing.title}</h1>
          <p>
            Conversacion con {otherParticipant.displayName} sobre{' '}
            <a href={`/listings/${conversation.listing.slug}`}>este anuncio</a>.
          </p>
        </div>
      </header>

      <ol className="message-list" aria-label="Mensajes">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isMine = message.sender.id === user?.id;

            return (
              <li
                className={isMine ? 'message-item message-item-mine' : 'message-item'}
                key={message.id}
              >
                <article aria-label={`Mensaje de ${message.sender.displayName}`}>
                  <p className="message-author">
                    {message.sender.displayName} · {formatConversationDate(message.createdAt)}
                  </p>
                  <p>{message.content}</p>
                  {isMine ? (
                    <span className="message-read-state">
                      {message.readAt ? 'Leido' : 'Enviado'}
                    </span>
                  ) : null}
                </article>
              </li>
            );
          })
        ) : (
          <li>
            <EmptyState title="Aun no hay mensajes">
              Escribe el primer mensaje para iniciar la conversacion.
            </EmptyState>
          </li>
        )}
      </ol>

      <form
        className="message-form"
        onSubmit={(event) => {
          void handleSubmit((values) => {
            const parsed = messageFormSchema.safeParse(values);

            if (!parsed.success) {
              parsed.error.issues.forEach((issue) => {
                if (issue.path[0] === 'content') {
                  setError('content', { message: issue.message, type: 'manual' });
                }
              });

              return Promise.resolve();
            }

            return sendMessageMutation.mutateAsync(parsed.data);
          })(event);
        }}
      >
        <Textarea
          error={errors.content?.message}
          hint="Maximo 2000 caracteres."
          id="message-content"
          label="Mensaje"
          rows={4}
          {...register('content')}
        />

        {sendMessageMutation.isError ? (
          <p className="auth-error" role="alert">
            {getErrorMessage(sendMessageMutation.error)}
          </p>
        ) : null}

        <div className="listing-form-actions">
          <Button disabled={isSubmitting || sendMessageMutation.isPending} type="submit">
            {sendMessageMutation.isPending ? 'Enviando mensaje' : 'Enviar mensaje'}
          </Button>
        </div>
      </form>
    </section>
  );
}

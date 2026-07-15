'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Button } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import type { ListingSummary } from '../../listings/model/listing-types';
import { conversationsClient } from '../api/conversations-client';

type StartConversationButtonProps = {
  listing: ListingSummary;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo abrir la conversacion.';
}

export function StartConversationButton({ listing }: StartConversationButtonProps) {
  const { session, user } = useAuth();
  const [conversationHref, setConversationHref] = useState<string | null>(null);
  const accessToken = session?.accessToken;
  const isOwner = user?.id === listing.seller.id;
  const isAvailable = listing.status !== 'BLOCKED' && listing.status !== 'CANCELLED';

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return conversationsClient.create({ listingSlug: listing.slug }, accessToken);
    },
    onSuccess: (conversation) => {
      setConversationHref(`/conversations/${conversation.id}`);
    },
  });

  if (isOwner) {
    return null;
  }

  if (!accessToken) {
    return (
      <Button href="/auth" variant="secondary">
        Iniciar sesion para chatear
      </Button>
    );
  }

  return (
    <span className="conversation-start-control">
      {conversationHref ? (
        <Button href={conversationHref} variant="secondary">
          Abrir chat
        </Button>
      ) : (
        <Button
          disabled={!isAvailable || createConversationMutation.isPending}
          onClick={() => createConversationMutation.mutate()}
          variant="secondary"
        >
          {createConversationMutation.isPending ? 'Abriendo chat' : 'Contactar vendedor'}
        </Button>
      )}
      {createConversationMutation.isError ? (
        <span className="conversation-inline-error" role="alert">
          {getErrorMessage(createConversationMutation.error)}
        </span>
      ) : null}
    </span>
  );
}

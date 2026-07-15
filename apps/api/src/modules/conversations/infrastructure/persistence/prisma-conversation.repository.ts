import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { ConversationError } from '../../application/errors/conversation-error';
import type { Conversation } from '../../domain/entities/conversation';
import type { Message } from '../../domain/entities/message';
import type {
  ConversationRepository,
  CreateConversationInput,
} from '../../domain/repositories/conversation.repository';
import { PrismaConversationMapper } from './prisma-conversation.mapper';

const messageInclude = {
  sender: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
} as const;

const conversationInclude = {
  buyer: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  seller: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  listing: {
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          displayName: true,
        },
      },
      dimension: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  },
  messages: {
    include: messageInclude,
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  },
} as const;

@Injectable()
export class PrismaConversationRepository implements ConversationRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Conversation | null> {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id,
      },
      include: conversationInclude,
    });

    return conversation ? PrismaConversationMapper.toDomain(conversation) : null;
  }

  async findByParticipantId(userId: string): Promise<Conversation[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new ConversationError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: conversationInclude,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return conversations.map((conversation) => PrismaConversationMapper.toDomain(conversation));
  }

  async create(input: CreateConversationInput): Promise<Conversation> {
    const [participant, listing] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: input.participantId,
        },
        select: {
          id: true,
        },
      }),
      this.prisma.listing.findUnique({
        where: {
          slug: input.listingSlug,
        },
        select: {
          id: true,
          sellerId: true,
          status: true,
        },
      }),
    ]);

    if (!participant) {
      throw new ConversationError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    if (!listing) {
      throw new ConversationError('LISTING_NOT_FOUND', 'El anuncio no existe.', 404);
    }

    if (listing.sellerId === participant.id) {
      throw new ConversationError(
        'CANNOT_CONVERSE_OWN_LISTING',
        'No puedes iniciar una conversacion contigo mismo sobre tu propio anuncio.',
        400,
      );
    }

    if (listing.status === 'BLOCKED' || listing.status === 'CANCELLED') {
      throw new ConversationError(
        'LISTING_NOT_AVAILABLE_FOR_CONVERSATION',
        'Este anuncio no acepta conversaciones en este momento.',
        409,
      );
    }

    const conversation = await this.prisma.conversation.upsert({
      where: {
        listingId_buyerId_sellerId: {
          listingId: listing.id,
          buyerId: participant.id,
          sellerId: listing.sellerId,
        },
      },
      update: {},
      create: {
        listingId: listing.id,
        buyerId: participant.id,
        sellerId: listing.sellerId,
      },
      include: conversationInclude,
    });

    return PrismaConversationMapper.toDomain(conversation);
  }

  async findMessages(conversationId: string, participantId: string): Promise<Message[]> {
    await this.findRequiredConversationForParticipant(conversationId, participantId);

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
      },
      include: messageInclude,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((message) => PrismaConversationMapper.messageToDomain(message));
  }

  async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    const conversation = await this.findRequiredConversationForParticipant(
      conversationId,
      senderId,
    );
    const normalizedContent = content.trim();

    if (!normalizedContent) {
      throw new ConversationError(
        'INVALID_MESSAGE_CONTENT',
        'El mensaje no puede estar vacio.',
        400,
      );
    }

    if (normalizedContent.length > 2000) {
      throw new ConversationError(
        'INVALID_MESSAGE_CONTENT',
        'El mensaje no puede superar 2000 caracteres.',
        400,
      );
    }

    const message = await this.prisma.$transaction(async (tx) => {
      const createdMessage = await tx.message.create({
        data: {
          conversationId: conversation.id.toString(),
          senderId,
          content: normalizedContent,
        },
        include: messageInclude,
      });

      await tx.conversation.update({
        where: {
          id: conversation.id.toString(),
        },
        data: {
          updatedAt: createdMessage.createdAt,
        },
      });

      return createdMessage;
    });

    return PrismaConversationMapper.messageToDomain(message);
  }

  async markMessagesAsRead(conversationId: string, readerId: string): Promise<Message[]> {
    await this.findRequiredConversationForParticipant(conversationId, readerId);

    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: {
          not: readerId,
        },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return this.findMessages(conversationId, readerId);
  }

  private async findRequiredConversationForParticipant(
    conversationId: string,
    participantId: string,
  ): Promise<Conversation> {
    const conversation = await this.findById(conversationId);

    if (!conversation) {
      throw new ConversationError('CONVERSATION_NOT_FOUND', 'La conversacion no existe.', 404);
    }

    if (!conversation.canBeAccessedBy(participantId)) {
      throw new ConversationError(
        'CONVERSATION_NOT_ACCESSIBLE',
        'No puedes acceder a esta conversacion.',
        403,
      );
    }

    return conversation;
  }
}

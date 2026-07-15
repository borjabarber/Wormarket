import type {
  Conversation as PrismaConversation,
  Dimension as PrismaDimension,
  Listing as PrismaListing,
  Message as PrismaMessage,
  User as PrismaUser,
} from '../../../../generated/prisma/client';
import { Conversation } from '../../domain/entities/conversation';
import { Message } from '../../domain/entities/message';

type PrismaUserSummary = Pick<PrismaUser, 'id' | 'username' | 'displayName'>;

export type PrismaMessageWithRelations = PrismaMessage & {
  sender: PrismaUserSummary;
};

export type PrismaConversationWithRelations = PrismaConversation & {
  buyer: PrismaUserSummary;
  seller: PrismaUserSummary;
  listing: PrismaListing & {
    seller: PrismaUserSummary;
    dimension: Pick<PrismaDimension, 'id' | 'slug' | 'name'>;
  };
  messages: PrismaMessageWithRelations[];
};

export class PrismaConversationMapper {
  static toDomain(record: PrismaConversationWithRelations): Conversation {
    return Conversation.create({
      id: record.id,
      listing: {
        id: record.listing.id,
        slug: record.listing.slug,
        seller: {
          id: record.listing.seller.id,
          username: record.listing.seller.username,
          displayName: record.listing.seller.displayName,
        },
        dimension: {
          id: record.listing.dimension.id,
          slug: record.listing.dimension.slug,
          name: record.listing.dimension.name,
        },
        title: record.listing.title,
        price: {
          amount: record.listing.price,
          currencyCode: record.listing.currencyCode,
        },
        rarity: record.listing.rarity,
        status: record.listing.status,
      },
      buyer: {
        id: record.buyer.id,
        username: record.buyer.username,
        displayName: record.buyer.displayName,
      },
      seller: {
        id: record.seller.id,
        username: record.seller.username,
        displayName: record.seller.displayName,
      },
      lastMessage: record.messages[0]
        ? PrismaConversationMapper.messageToDomain(record.messages[0])
        : null,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static messageToDomain(record: PrismaMessageWithRelations): Message {
    return Message.create({
      id: record.id,
      conversationId: record.conversationId,
      sender: {
        id: record.sender.id,
        username: record.sender.username,
        displayName: record.sender.displayName,
      },
      content: record.content,
      createdAt: record.createdAt,
      readAt: record.readAt,
    });
  }
}

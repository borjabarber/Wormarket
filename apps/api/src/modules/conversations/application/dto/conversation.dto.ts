import type { ListingRarity, ListingStatus } from '../../../listings/domain/entities/listing';

export type ConversationUserDto = {
  id: string;
  username: string;
  displayName: string;
};

export type ConversationListingDto = {
  id: string;
  slug: string;
  seller: ConversationUserDto;
  dimension: {
    id: string;
    slug: string;
    name: string;
  };
  title: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  rarity: ListingRarity;
  status: ListingStatus;
};

export type MessageDto = {
  id: string;
  conversationId: string;
  sender: ConversationUserDto;
  content: string;
  createdAt: string;
  readAt: string | null;
};

export type ConversationDto = {
  id: string;
  listing: ConversationListingDto;
  buyer: ConversationUserDto;
  seller: ConversationUserDto;
  lastMessage: MessageDto | null;
  createdAt: string;
  updatedAt: string;
};

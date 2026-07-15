import type {
  ListingDimension,
  ListingPrice,
  ListingSeller,
  ListingStatus,
} from '../../listings/model/listing-types';
import type { Rarity } from '../../../shared/components';

export type ConversationUser = {
  displayName: string;
  id: string;
  username: string;
};

export type ConversationListing = {
  dimension: ListingDimension;
  id: string;
  price: ListingPrice;
  rarity: Rarity;
  seller: ListingSeller;
  slug: string;
  status: ListingStatus;
  title: string;
};

export type ConversationMessage = {
  content: string;
  conversationId: string;
  createdAt: string;
  id: string;
  readAt: string | null;
  sender: ConversationUser;
};

export type ConversationSummary = {
  buyer: ConversationUser;
  createdAt: string;
  id: string;
  lastMessage: ConversationMessage | null;
  listing: ConversationListing;
  seller: ConversationUser;
  updatedAt: string;
};

export type CreateConversationInput = {
  listingSlug: string;
};

export type SendMessageInput = {
  content: string;
};

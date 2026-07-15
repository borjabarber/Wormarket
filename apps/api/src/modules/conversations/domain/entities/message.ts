import type { OfferBuyer } from '../../../offers/domain/entities/offer';
import { MessageId } from '../value-objects/message-id';

export type MessageSender = OfferBuyer;

type MessageProperties = {
  id: MessageId;
  conversationId: string;
  sender: MessageSender;
  content: string;
  createdAt: Date;
  readAt: Date | null;
};

type CreateMessageInput = Omit<MessageProperties, 'id'> & {
  id: string;
};

export class Message {
  private constructor(private readonly properties: MessageProperties) {}

  static create(input: CreateMessageInput): Message {
    const content = input.content.trim();

    if (!content) {
      throw new Error('Message content cannot be empty.');
    }

    if (content.length > 2000) {
      throw new Error('Message content cannot be longer than 2000 characters.');
    }

    return new Message({
      ...input,
      id: MessageId.create(input.id),
      sender: { ...input.sender },
      content,
    });
  }

  get id(): MessageId {
    return this.properties.id;
  }

  get conversationId(): string {
    return this.properties.conversationId;
  }

  get sender(): MessageSender {
    return { ...this.properties.sender };
  }

  get content(): string {
    return this.properties.content;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get readAt(): Date | null {
    return this.properties.readAt;
  }
}

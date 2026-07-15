import { ConversationThread } from '../../../features/conversations/components/conversation-thread';

type ConversationThreadPageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function ConversationThreadPage({ params }: ConversationThreadPageProps) {
  const { conversationId } = await params;

  return <ConversationThread conversationId={conversationId} />;
}

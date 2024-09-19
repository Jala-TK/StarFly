import { fetchServer } from '@/service/fetchServer';
import ChatClient from '@/components/chat/ChatClient';

async function getMessages() {
  try {
    const response = await fetchServer('/api/messages', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar mensagens');
    }

    const data = await response.json();
    return data.map((msg: { content: string }) => msg.content)
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
  }
}

const ChatPage = async () => {
  const initialMessages = await getMessages();

  return (
    <div>
      <ChatClient initialMessages={initialMessages} />
    </div>
  );
};

export default ChatPage;

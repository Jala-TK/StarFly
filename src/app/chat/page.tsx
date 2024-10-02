import { fetchServer } from '@/services/fetchServer';
import ChatClient from '@/components/chat/ChatClient';
import { getServerSession } from 'next-auth';

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
  const session = await getServerSession();
  const initialMessages = await getMessages();

  return (
    <div>
      <h1>Olá, {session?.user?.email}</h1>
      <ChatClient initialMessages={initialMessages} />
    </div>
  );
};

export default ChatPage;

import { Message } from '@prisma/client';
import { MessageWithUser } from '@/utils/types';

const API_URL = '/api/messages';

export const createMessage = async (
  message: string,
  groupId: string
): Promise<Message> => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message, groupId: groupId }),
    });
    if (!response.ok) {
      throw new Error('Erro ao enviar mensagem');
    }
    const newMessage = await response.json();
    return newMessage;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
};

export const getAllMessages = async (
  groupId: string
): Promise<MessageWithUser[]> => {
  try {
    const response = await fetch(`${API_URL}/group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupId: groupId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar mensagens');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    throw error;
  }
};

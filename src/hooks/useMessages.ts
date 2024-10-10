import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { createMessage, getAllMessages } from '@/services/messageService';
import { Message } from '@prisma/client';

interface UseMessagesReturn {
  messages: MessageWithUser[];
  sendMessage: (message: string, groupId: string) => void;
  input: string;
  setInput: (input: string) => void;
}

interface SendMessagePayload {
  groupId: string;
  message: MessageWithUser;
  userId: string;
}

interface MessageWithUser {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  groupId: string;
  email: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
}

export const useMessages = (groupId: string): UseMessagesReturn => {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [input, setInput] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesFromApi = await getAllMessages(groupId);
        setMessages(messagesFromApi);
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    fetchMessages(); // Carrega as mensagens ao montar o componente

    const newSocket = io('http://localhost'); // Altere aqui conforme necessário

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    newSocket.on('message', (newMessage: SendMessagePayload) => {
      console.log('Nova mensagem recebida:', newMessage);
      if (newMessage.groupId === groupId) {
        setMessages((prevMessages) => [...prevMessages, newMessage.message]);
      }
    });

    return () => {
      newSocket.disconnect(); // Desconecta o socket ao desmontar
    };
  }, [groupId]);

  const sendMessage = async (message: string, groupId: string) => {
    if (message.trim() !== '') {
      try {
        const newMessage = await createMessage(message, groupId); // Usa o service para enviar a mensagem
        const sendMessage = {
          groupId: groupId,
          message: newMessage,
          userId: newMessage.userId,
        };
        if (socket) {
          socket.emit('message', sendMessage); // Envia a nova mensagem via Socket.IO
        }
        setInput(''); // Limpa o input
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

  return { messages, sendMessage, input, setInput };
};

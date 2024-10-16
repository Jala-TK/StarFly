import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { createMessage, getAllMessages } from '@/services/messageService';
import {
  MessageWithUser,
  SendMessagePayload,
  UseMessagesReturn,
} from '@/utils/types';

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

    fetchMessages();

    const newSocket = io();

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
      newSocket.disconnect();
    };
  }, [groupId]);

  const sendMessage = async (message: string, groupId: string) => {
    if (message.trim() !== '') {
      try {
        const newMessage = await createMessage(message, groupId);
        const sendMessage = {
          groupId: groupId,
          message: newMessage,
          userId: newMessage.userId,
        };
        if (socket) {
          socket.emit('message', sendMessage);
        }
        setInput('');
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

  return { messages, sendMessage, input, setInput };
};

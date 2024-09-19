'use client';

import { handleSendMessageSocketIo } from '@/socketio/handleSendMessages';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from './ChatClient.module.css'

interface ChatClientProps {
  initialMessages: string[];
}

const ChatClient = ({ initialMessages }: ChatClientProps) => {
  const [messages, setMessages] = useState<string[]>(initialMessages);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    try {
      const socket = io();

      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      socket.on("message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.log(err);
    }
  }, []);

  function sendMessage() {
    if (input.trim() !== '') {
      handleSendMessageSocketIo(input);
      setInput('');
    }
  }

  return (
    <div className="flex flex-col h-screen justify-between bg-black text-white">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={styles.containerMessage}
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-800 flex">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-grow bg-white text-white placeholder-gray-400 border-none focus:ring-0 focus:outline-none p-2 rounded-l-md"
        />
        <Button
          variant="outline"
          onClick={sendMessage}
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default ChatClient;

'use client';

import { handleSendMessageSocketIo } from '@/socketio/handleSendMessages';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

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
      <div className="flex-grow px-10 py-5 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
          >
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <div className="chat-bubble">
                {msg}
              </div>
            </div>

          </div>
        ))}
      </div>

      <div className="flex items-center justify-center bg-transparent px-10 py-5 border-none" >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="input input-bordered input-md w-full" />
        <div>
          <button className="btn btn-primary" onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default ChatClient;

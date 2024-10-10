/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { format } from 'date-fns';
import { User } from 'next-auth';
import { useSession } from "next-auth/react"

interface ChatClientProps {
  groupId: string;
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

const ChatClient = ({ groupId }: ChatClientProps) => {
  const { data: session } = useSession();
  const user = session?.user as User | null;
  const { messages, sendMessage, input, setInput } = useMessages(groupId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col max-h-full">
      <div className="flex-grow px-10 py-20 overflow-y-auto ">
        {messages.map((msg: MessageWithUser) => (
          <div key={msg.id}>
            <div
              className={`chat ${msg.email !== user?.email ? 'chat-start' : 'chat-end'}`}
            >
              {msg.user.image ? (

                <div className="chat-image avatar">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <img
                      alt="User avatar"
                      src={msg.user.image}
                    />
                  </div>
                </div>
              ) : (
                <div className="chat-image">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-700">
                      {msg.user.name ? msg.user.name.split(' ').slice(0, 2).map(namePart => namePart[0].toUpperCase()).join('') : ''}
                    </span>
                  </div>
                </div>
              )}

              <div className="chat-header">
                {msg.userId === user?.id ? 'Você ' : msg.email}
                <time className="text-xs opacity-50">{format(msg.createdAt, 'HH:mm')}</time>
              </div>
              <div className="chat-bubble">{msg.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center justify-center bg-transparent px-10 py-5 border-none w-full fixed bottom-0 z-10">
        <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage(input, groupId);
              }
            }}
            placeholder="Digite sua mensagem..."
            className="input input-bordered input-md w-full pr-12"
          />
          <button className="absolute right-0 top-0 h-full btn bg-transparent border-none" onClick={() => sendMessage(input, groupId)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16" transform="rotate(45)">
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatClient;

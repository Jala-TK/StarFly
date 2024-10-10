import { Group, Message } from '@prisma/client';

export interface GroupWithMessage {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: Message;
}

export interface MessageWithUser {
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

export interface UseGroupsReturn {
  groups: Group[];
  userGroups: GroupWithMessage[];
  createNewGroup: (groupName: string) => Promise<void>;
  joinGroupById: (groupId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface UseMessagesReturn {
  messages: MessageWithUser[];
  sendMessage: (message: string, groupId: string) => void;
  input: string;
  setInput: (input: string) => void;
}

export interface SendMessagePayload {
  groupId: string;
  message: MessageWithUser;
  userId: string;
}

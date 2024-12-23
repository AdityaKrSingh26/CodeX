export interface User {
  id: string;
  name: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  username: string;
  userId: string;
  content: string;
  timestamp: Date | string;
  isPrivate?: boolean;
  recipientId?: string;
}

export interface CodeSnippet {
  id: string;
  userId: string;
  content: string;
  language: string;
  timestamp: Date;
}
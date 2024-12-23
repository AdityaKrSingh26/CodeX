import { MessageList } from './chat/MessageList';
import { MessageInput } from './chat/MessageInput';
import type { Message, User } from '../types';

interface ChatProps {
  messages: Message[];
  users: User[];
  currentUser: User;
  onSendMessage: (content: string) => void;
}

export function Chat({
  messages,
  users,
  onSendMessage
}: ChatProps) {

  console.log(users);
  console.log(messages);
  
  const processedMessages = messages.map(msg => ({
    ...msg,
    timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
  }));

  
  return (

    <div className="w-80 h-full bg-white border-l border-slate-200 flex flex-col">

      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-700">Chat</h2>
      </div>

      <MessageList
        messages={processedMessages}
        users={users}
      />
      <MessageInput
        onSendMessage={onSendMessage}
      />

    </div>
  );
}
// import React from 'react';
import type { Message, User } from '../../types';

interface MessageListProps {
  messages: Message[];
  users: User[];
}

export function MessageList({ messages}: MessageListProps) {

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const timestamp =
          message.timestamp instanceof Date
            ? message.timestamp
            : new Date(message.timestamp); // Convert if necessary

        return (
          <div
            key={message.id}
            className={`${
              message.isPrivate ? 'bg-purple-50' : 'bg-slate-50'
            } rounded-lg p-3`}
          >
            <div className="flex justify-between items-start">
              <span className="font-medium text-sm text-slate-700">
                {message.username}
              </span>
              <span className="text-xs text-slate-400">
                {timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{message.content}</p>
          </div>
        );
      })}
    </div>
  );
}

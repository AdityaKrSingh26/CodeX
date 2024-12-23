import React from 'react';
import { Users } from 'lucide-react';
import type { User } from '../../types';

interface UserListProps {
  users: User[];
  currentUserId: string;
  onUserSelect?: (userId: string) => void;
}

export function UserList({ users, currentUserId, onUserSelect }: UserListProps) {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">
        <Users className="w-5 h-5" />
        <span>{users.filter(u => u.isOnline).length} Online</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block z-10">
        <div className="p-2">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Online Users</h3>
          <ul className="space-y-1">
            {users.map(user => (
              <li 
                key={user.id}
                onClick={() => onUserSelect?.(user.id)}
                className={`text-sm p-2 rounded cursor-pointer ${
                  user.id === currentUserId 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span>{user.name}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import { Code2 } from 'lucide-react';

interface RoomInfoProps {
  roomName: string;
  userName: string;
}

export function RoomInfo({ roomName, userName }: RoomInfoProps) {
  return (
    <div className="flex items-center space-x-4">
      <Code2 className="w-8 h-8 text-blue-400" />
      <div>
        <h1 className="text-xl font-bold">{roomName}</h1>
        <p className="text-sm text-slate-300">Welcome, {userName}</p>
      </div>
    </div>
  );
}
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { RoomInfo } from './header/RoomInfo';
import { UserList } from './header/UserList';
import {
  LogOut,
  Copy
} from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  roomName: string;
  username: string;
  users: User[];
  onUserSelect?: (userId: string) => void;
}

export function Header({ roomName, username, users, onUserSelect }: HeaderProps) {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const copyRoomId = async () => {
    try {
      console.log("room : ", roomId);
      if (roomId) {
        await navigator.clipboard.writeText(roomId);
        toast.success('Room ID has been copied to your clipboard');
      } else {
        toast.error('Room ID is not available');
      }
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  };


  const leaveRoom = () => {
    navigate('/');
  };


  return (
    <header className="bg-slate-800 text-white py-2 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <RoomInfo roomName={roomName} userName={username} />

        <div className='flex items-center space-x-4'>
          <UserList
            users={users}
            currentUserId={"current"}
            onUserSelect={onUserSelect}
          />
          <button onClick={copyRoomId}>
            <Copy className="w-6 h-6 text-blue-400" />
          </button>
          <button onClick={leaveRoom}>
            <LogOut className="w-6 h-6 text-blue-400" />
          </button>
        </div>

      </div>
    </header>
  );
}
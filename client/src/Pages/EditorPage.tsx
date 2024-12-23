import { 
  useState,
  useRef, 
  useEffect, 
  useCallback 
} from 'react';
import { 
  useLocation, 
  useNavigate, 
  useParams 
} from 'react-router-dom';
import toast from 'react-hot-toast';
import { initSocket } from '../Socket';
import ACTIONS from '../Actions';

// import components
import { Header } from '../components/Header';
import { CodeEditor } from '../components/CodeEditor';
import { Chat } from '../components/Chat';
import type { User, Message } from '../types';
import { DEFAULT_CODE } from '../utils/constants';
import type { Language } from '../utils/constants';

const currentUser: User = { id: 'current', name: 'You', isOnline: true };

export default function App() {
  const socketRef = useRef<any>(null);
  const codeRef = useRef<string | null>(null);
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState<User[]>([]);
  const location = useLocation();
  const username = location.state?.username || "Anonymous";

  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err: Error) => handleErrors(err));
      socketRef.current.on('connect_failed', (err: Error) => handleErrors(err));

      function handleErrors(e: Error) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      // Join the room
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username,
      });

      // Listen for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }: { clients: User[], username: string, socketId: string }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
          
          // Sync code for new joinee
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listen for disconnected
      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, username }: { socketId: string, username: string }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter(client => client.id !== socketId);
          });
        }
      );
    };

    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, [username, reactNavigator, roomId, location.state]);

  // Code sync functionality
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code: newCode }: { code: string }) => {
        if (newCode !== null) {
          setCode(newCode);
        }
      });

      // Listen for language changes
      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language: newLanguage }: { language: Language }) => {
        if (newLanguage !== null) {
          setLanguage(newLanguage);
        }
      });
    }

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
      socketRef.current?.off(ACTIONS.LANGUAGE_CHANGE);
    };
  }, [socketRef.current]);

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string) => {
    codeRef.current = newCode;
    setCode(newCode);
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
  }, [roomId]);

  // Handle language changes
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    socketRef.current?.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: newLanguage,
    });
  }, [roomId]);

  // Chat functionality
  const handleSendMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username : username,
      userId: currentUser.id,
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    socketRef.current?.emit(ACTIONS.SEND_MESSAGE, {
      roomId,
      message: newMessage,
    });
  }, [roomId]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.RECEIVE_MESSAGE, ({ message }: { message: Message }) => {
        setMessages(prev => [...prev, message]);
      });
    }
    return () => {
      socketRef.current?.off(ACTIONS.RECEIVE_MESSAGE);
    };
  }, [socketRef.current]);

  const handleUserSelect = (userId: string) => {
    const selectedUser = clients.find(client => client.id === userId);
    if (selectedUser) {
      toast.success(`Selected ${selectedUser.name}`);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50">
      <Header
        roomName={"CodeX"}
        username={username}
        users={clients}
        onUserSelect={handleUserSelect}
      />

      <main className="flex-1 flex min-h-0">
        <CodeEditor
          code={code}
          language={language}
          onCodeChange={handleCodeChange}
          onLanguageChange={handleLanguageChange}
        />
        <div className={`transition-all duration-300 ${isChatOpen ? 'w-80' : 'w-0'}`}>
          {isChatOpen && (
            <Chat
              messages={messages}
              users={clients}
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
            />
          )}
        </div>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-slate-700 text-white p-2 rounded-l-lg hover:bg-slate-600 transition-colors"
        >
          {isChatOpen ? '→' : '←'}
        </button>
      </main>
    </div>
  );
}
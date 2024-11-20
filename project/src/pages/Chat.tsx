import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import UserList from '../components/UserList';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';

interface Message {
  type: 'system' | 'user';
  username?: string;
  content: string;
}

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    const newSocket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      toast.success('Connected to chat!');
      newSocket.emit('user_join', username);
    });

    newSocket.on('connect_error', () => {
      toast.error('Connection failed. Retrying...');
      setIsConnected(false);
    });

    newSocket.on('disconnect', () => {
      toast.error('Disconnected from chat');
      setIsConnected(false);
    });

    newSocket.on('chat_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      if (message.type === 'user' && message.username !== username) {
        toast.success(`New message from ${message.username}`);
      }
    });

    newSocket.on('user_list', (userList: string[]) => {
      setUsers(userList);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [username, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (socket && isConnected) {
      socket.emit('send_message', message);
    } else {
      toast.error('Not connected to chat');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen bg-gray-100"
    >
      <Toaster position="top-right" />
      
      <UserList users={users} currentUser={username} />

      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Chat Room</h1>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              type={msg.type}
              username={msg.username}
              content={msg.content}
              currentUser={username}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </motion.div>
  );
}
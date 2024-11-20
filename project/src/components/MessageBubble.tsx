import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MessageBubbleProps {
  type: 'system' | 'user';
  username?: string;
  content: string;
  currentUser: string | null;
}

export default function MessageBubble({ type, username, content, currentUser }: MessageBubbleProps) {
  const [timeAgo, setTimeAgo] = useState('just now');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeAgo('just now');
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (type === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center text-gray-500 text-sm"
      >
        <span className="bg-gray-100 px-4 py-2 rounded-full inline-block">
          {content}
        </span>
      </motion.div>
    );
  }

  const isCurrentUser = username === currentUser;

  return (
    <motion.div
      initial={{ opacity: 0, x: isCurrentUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] ${
          isCurrentUser
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200'
        } rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200`}
      >
        {!isCurrentUser && (
          <div className="text-xs text-gray-500 mb-1">{username}</div>
        )}
        <div className="break-words">{content}</div>
        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'}`}>
          {timeAgo}
        </div>
      </div>
    </motion.div>
  );
}
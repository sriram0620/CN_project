import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';

interface UserListProps {
  users: string[];
  currentUser: string | null;
}

export default function UserList({ users, currentUser }: UserListProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-gray-200"
      >
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Online Users</h2>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {users.length}
          </span>
        </div>
      </motion.div>
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {users.map((user, index) => (
            <motion.div
              key={user}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className={`flex items-center space-x-2 py-2 px-3 rounded-lg ${
                user === currentUser ? 'bg-blue-50' : 'hover:bg-gray-50'
              } transition-colors duration-200`}
            >
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full absolute top-0 left-0 opacity-75"
                ></motion.div>
              </div>
              <span className={`text-gray-700 ${user === currentUser ? 'font-medium' : ''}`}>
                {user} {user === currentUser && '(You)'}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('user_join', (username) => {
    users.set(socket.id, username);
    io.emit('user_list', Array.from(users.values()));
    io.emit('chat_message', {
      type: 'system',
      content: `${username} joined the chat`
    });
  });

  socket.on('send_message', (message) => {
    const username = users.get(socket.id);
    io.emit('chat_message', {
      type: 'user',
      username,
      content: message
    });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('user_list', Array.from(users.values()));
    if (username) {
      io.emit('chat_message', {
        type: 'system',
        content: `${username} left the chat`
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
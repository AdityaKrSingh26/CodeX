export const rooms = new Map();

const ACTIONS = {
  JOIN: 'join',
  JOINED: 'joined',
  DISCONNECTED: 'disconnected',
  CODE_CHANGE: 'code-change',
  SYNC_CODE: 'sync-code',
  LANGUAGE_CHANGE: 'language-change',
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'receive-message',
};

const getAllConnectedClients = (roomId) => {
  const room = rooms.get(roomId);
  if (!room) return [];
  return Array.from(room.clients.values()).map(client => ({
    id: client.socketId,
    name: client.username,
    isOnline: true
  }));
};

export const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { code: '', language: 'javascript', clients: new Map(), messages: [] });
      }
      const room = rooms.get(roomId);
      room.clients.set(socket.id, { username, socketId: socket.id });
      socket.join(roomId);

      const clients = getAllConnectedClients(roomId);
      io.to(roomId).emit(ACTIONS.JOINED, { clients, username, socketId: socket.id });
      socket.emit('ROOM_STATE', { code: room.code, language: room.language, messages: room.messages });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.code = code;
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
      }
    });

    socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.language = language;
        socket.to(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
      }
    });

    socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.messages.push(message);
        socket.to(roomId).emit(ACTIONS.RECEIVE_MESSAGE, { message });
      }
    });

    socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnect', () => {
      rooms.forEach((room, roomId) => {
        const client = room.clients.get(socket.id);
        if (client) {
          room.clients.delete(socket.id);
          io.to(roomId).emit(ACTIONS.DISCONNECTED, { socketId: socket.id, username: client.username });
          if (room.clients.size === 0) rooms.delete(roomId);
        }
      });
    });
  });
};

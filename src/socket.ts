import { Server } from 'socket.io';
import http from 'http';
import { verifyAccessToken } from './utils/token';

let io: Server | null = null;

export const initSocket = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.accessToken;
    if (!token) {
      return next(new Error('부적절한 접근입니다.'));
    }

    try {
      const payload = verifyAccessToken(token);
      (socket as any).userId = payload.userId;
      next();
    } catch (err) {
      next(new Error('부적절한 접근입니다.'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected', (socket as any).userId);
  });
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};

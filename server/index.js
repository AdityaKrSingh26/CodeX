import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { socketHandlers } from './sockets/socketHandler.js';
import errorHandler from './middlewares/errorHandler.js';


import healthRoutes from './routes/healthRoutes.js';
import compilerRoute from './routes/compilerRoute.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/api/compile', compilerRoute);

// Socket Handlers
socketHandlers(io);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
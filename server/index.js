import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { socketHandlers } from './sockets/socketHandler.js';
import errorHandler from './middlewares/errorHandler.js';

import path from 'path';
import { fileURLToPath } from 'url';

import healthRoutes from './routes/healthRoutes.js';
import compilerRoute from './routes/compilerRoute.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route for client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});


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
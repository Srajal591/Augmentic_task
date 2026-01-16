const app = require('./src/app');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const { PORT, NODE_ENV } = require('./src/config/env');
const initializeSocketHandlers = require('./src/sockets/inventory.socket');

let server;
let io;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server
    const httpServer = createServer(app);
    
    // Initialize Socket.IO
    io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
      },
    });

    // Store io instance in app for access in controllers
    app.set('io', io);

    // Initialize socket handlers
    initializeSocketHandlers(io);

    // Start server - Listen on all network interfaces (0.0.0.0)
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
      console.log(`Server accessible at:`);
      console.log(`  - Local:   http://localhost:${PORT}`);
      console.log(`  - Network: http://192.168.31.48:${PORT}`);
      console.log(`Real-time updates enabled via Socket.IO`);
    });

    server = httpServer;
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

startServer();

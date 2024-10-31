require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('message', (data) => {
    io.emit('message', data);
    console.log('Message received:', data);
  });
});

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Basic error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
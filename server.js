// Import the express module (backend server)
const express = require('express');

// Import the socket.io module (real-time game functionality)
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app
const app = express();

// Set up the HTTP server (this is used to serve your website and handle socket communication)
const server = http.createServer(app);

// Set up the socket.io server on top of the HTTP server
const io = socketIo(server);

// Serve static files (like HTML, CSS, JS) from the 'public' folder
app.use(express.static('public'));

// Game state to track moves and board state
let gameState = {
  fen: 'start',
  history: []
};

// Handle new socket connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send the current game state to the new user
  socket.emit('gameState', gameState);

  // Handle moves from users
  socket.on('move', (move) => {
    gameState.history = move.history;
    gameState.fen = move.fen;
    
    // Broadcast the updated game state to all connected users
    io.emit('gameState', gameState);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
console.log('Socket.io server is running');
io.on('error', (error) => {
  console.error('Socket.io error:', error);
});
console.log('Web server is running');
server.on('error', (error) => {
    console.error('HTTP server error:', error);
    process.exit(1);
    });
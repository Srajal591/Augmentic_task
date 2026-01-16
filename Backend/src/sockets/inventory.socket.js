module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join inventory room
    socket.on('join-inventory', () => {
      socket.join('inventory');
      console.log(`${socket.id} joined inventory room`);
    });

    // Leave inventory room
    socket.on('leave-inventory', () => {
      socket.leave('inventory');
      console.log(`${socket.id} left inventory room`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

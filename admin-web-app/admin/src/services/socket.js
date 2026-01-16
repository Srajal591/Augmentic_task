import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.31.48:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.joinInventoryRoom();
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinInventoryRoom() {
    if (this.socket?.connected) {
      this.socket.emit('join-inventory');
    }
  }

  leaveInventoryRoom() {
    if (this.socket?.connected) {
      this.socket.emit('leave-inventory');
    }
  }

  onStockUpdate(callback) {
    if (this.socket) {
      this.socket.on('stock-updated', callback);
      
      // Store listener for cleanup
      if (!this.listeners.has('stock-updated')) {
        this.listeners.set('stock-updated', []);
      }
      this.listeners.get('stock-updated')?.push(callback);
    }
  }

  offStockUpdate(callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off('stock-updated', callback);
      } else {
        this.socket.off('stock-updated');
      }
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.listeners.clear();
    }
  }
}

export default new SocketService();

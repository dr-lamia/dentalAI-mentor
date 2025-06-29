import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    this.token = token;
    
    this.socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001', {
      auth: {
        token: token
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  // Session events
  joinSession(roomId: string) {
    if (this.socket) {
      this.socket.emit('session:join', { roomId });
    }
  }

  leaveSession() {
    if (this.socket) {
      this.socket.emit('session:leave');
    }
  }

  sendChatMessage(roomId: string, message: string) {
    if (this.socket) {
      this.socket.emit('session:chat', { roomId, message });
    }
  }

  submitQuizAnswer(roomId: string, questionId: string, answer: number, timeSpent: number) {
    if (this.socket) {
      this.socket.emit('quiz:answer', { roomId, questionId, answer, timeSpent });
    }
  }

  updateLeaderboard(roomId: string, score: number) {
    if (this.socket) {
      this.socket.emit('leaderboard:update', { roomId, score });
    }
  }

  // Typing indicators
  startTyping(roomId: string) {
    if (this.socket) {
      this.socket.emit('typing:start', { roomId });
    }
  }

  stopTyping(roomId: string) {
    if (this.socket) {
      this.socket.emit('typing:stop', { roomId });
    }
  }

  // Event listeners
  onSessionJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('session:user-joined', callback);
    }
  }

  onSessionLeft(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('session:user-left', callback);
    }
  }

  onSessionState(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('session:state', callback);
    }
  }

  onChatMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('session:chat-message', callback);
    }
  }

  onQuizAnswer(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('quiz:user-answered', callback);
    }
  }

  onLeaderboardUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('leaderboard:updated', callback);
    }
  }

  onTypingStart(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('typing:user-start', callback);
    }
  }

  onTypingStop(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('typing:user-stop', callback);
    }
  }

  // Global events
  onQuizCreated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('quiz:created', callback);
    }
  }

  onQuizCompleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('quiz:completed', callback);
    }
  }

  onSessionCreated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('session:created', callback);
    }
  }

  onSessionEnded(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('session:ended', callback);
    }
  }

  // Remove event listeners
  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
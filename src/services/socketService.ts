import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private mockMode = process.env.NODE_ENV === 'development';

  connect(token: string) {
    this.token = token;
    
    if (this.mockMode) {
      console.log('Using mock Socket.io in development mode');
      this.setupMockConnection();
      return null;
    }
    
    try {
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
    } catch (error) {
      console.error('Error connecting to Socket.io:', error);
      this.setupMockConnection();
      return null;
    }
  }

  private setupMockConnection() {
    // Simulate connection events
    setTimeout(() => {
      console.log('Mock Socket.io connected');
      this.emitEvent('connect');
    }, 500);
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
    if (this.mockMode) {
      console.log('Mock joining session:', roomId);
      setTimeout(() => {
        this.emitEvent('session:state', { 
          session: {
            roomId,
            host: { name: 'Mock Host' },
            participants: [{ user: { name: 'Current User', level: 5, xp: 1000 } }],
            content: null
          } 
        });
      }, 500);
      return;
    }

    if (this.socket) {
      this.socket.emit('session:join', { roomId });
    }
  }

  leaveSession() {
    if (this.mockMode) {
      console.log('Mock leaving session');
      return;
    }

    if (this.socket) {
      this.socket.emit('session:leave');
    }
  }

  sendChatMessage(roomId: string, message: string) {
    if (this.mockMode) {
      console.log('Mock sending chat message:', { roomId, message });
      setTimeout(() => {
        this.emitEvent('session:chat-message', {
          id: Date.now().toString(),
          userId: 'current-user',
          userName: 'Current User',
          message,
          timestamp: new Date()
        });
      }, 500);
      return;
    }

    if (this.socket) {
      this.socket.emit('session:chat', { roomId, message });
    }
  }

  submitQuizAnswer(roomId: string, questionId: string, answer: number, timeSpent: number) {
    if (this.mockMode) {
      console.log('Mock submitting quiz answer:', { roomId, questionId, answer, timeSpent });
      setTimeout(() => {
        this.emitEvent('quiz:user-answered', {
          userId: 'current-user',
          userName: 'Current User',
          questionId,
          timeSpent
        });
      }, 500);
      return;
    }

    if (this.socket) {
      this.socket.emit('quiz:answer', { roomId, questionId, answer, timeSpent });
    }
  }

  updateLeaderboard(roomId: string, score: number) {
    if (this.mockMode) {
      console.log('Mock updating leaderboard:', { roomId, score });
      setTimeout(() => {
        this.emitEvent('leaderboard:updated', {
          leaderboard: [
            { rank: 1, userId: 'user1', score: score + 50 },
            { rank: 2, userId: 'current-user', score: score },
            { rank: 3, userId: 'user3', score: score - 30 }
          ]
        });
      }, 500);
      return;
    }

    if (this.socket) {
      this.socket.emit('leaderboard:update', { roomId, score });
    }
  }

  // Typing indicators
  startTyping(roomId: string) {
    if (this.mockMode) {
      console.log('Mock start typing:', roomId);
      return;
    }

    if (this.socket) {
      this.socket.emit('typing:start', { roomId });
    }
  }

  stopTyping(roomId: string) {
    if (this.mockMode) {
      console.log('Mock stop typing:', roomId);
      return;
    }

    if (this.socket) {
      this.socket.emit('typing:stop', { roomId });
    }
  }

  // Event listeners
  onSessionJoined(callback: (data: any) => void) {
    this.addListener('session:user-joined', callback);
  }

  onSessionLeft(callback: (data: any) => void) {
    this.addListener('session:user-left', callback);
  }

  onSessionState(callback: (data: any) => void) {
    this.addListener('session:state', callback);
  }

  onChatMessage(callback: (data: any) => void) {
    this.addListener('session:chat-message', callback);
  }

  onQuizAnswer(callback: (data: any) => void) {
    this.addListener('quiz:user-answered', callback);
  }

  onLeaderboardUpdate(callback: (data: any) => void) {
    this.addListener('leaderboard:updated', callback);
  }

  onTypingStart(callback: (data: any) => void) {
    this.addListener('typing:user-start', callback);
  }

  onTypingStop(callback: (data: any) => void) {
    this.addListener('typing:user-stop', callback);
  }

  // Global events
  onQuizCreated(callback: (data: any) => void) {
    this.addListener('quiz:created', callback);
  }

  onQuizCompleted(callback: (data: any) => void) {
    this.addListener('quiz:completed', callback);
  }

  onSessionCreated(callback: (data: any) => void) {
    this.addListener('session:created', callback);
  }

  onSessionEnded(callback: (data: any) => void) {
    this.addListener('session:ended', callback);
  }

  // Helper for adding listeners
  private addListener(event: string, callback: (data: any) => void) {
    if (this.mockMode) {
      // Store callback for mock events
      if (!this.mockListeners.has(event)) {
        this.mockListeners.set(event, []);
      }
      this.mockListeners.get(event)!.push(callback);
      return;
    }

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Mock listeners storage
  private mockListeners: Map<string, Function[]> = new Map();

  // Helper for emitting mock events
  private emitEvent(event: string, data: any) {
    if (this.mockListeners.has(event)) {
      this.mockListeners.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in mock ${event} listener:`, error);
        }
      });
    }
  }

  // Remove event listeners
  off(event: string, callback?: (data: any) => void) {
    if (this.mockMode) {
      if (!callback) {
        this.mockListeners.delete(event);
      } else if (this.mockListeners.has(event)) {
        const callbacks = this.mockListeners.get(event)!;
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
      return;
    }

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
    if (this.mockMode) {
      return true; // Always return connected in mock mode
    }
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
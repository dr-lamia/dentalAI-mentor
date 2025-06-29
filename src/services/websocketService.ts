// WebSocket Service for Real-time Score Updates
class WebSocketService {
  private ws: WebSocket | null = null;
  private baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();
  private mockMode = process.env.NODE_ENV === 'development';

  // Connect to WebSocket endpoint /ws/scores
  connect(studentId: string) {
    try {
      if (this.mockMode) {
        console.log('Using mock WebSocket in development mode');
        this.setupMockConnection(studentId);
        return;
      }

      this.ws = new WebSocket(`${this.baseUrl}/ws/scores?student_id=${studentId}`);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected for score updates');
        this.reconnectAttempts = 0;
        this.emit('connected', { studentId });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.emit('disconnected', {});
        this.attemptReconnect(studentId);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', { error });
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      if (this.mockMode) {
        this.setupMockConnection(studentId);
      }
    }
  }

  private setupMockConnection(studentId: string) {
    // Simulate connection events
    setTimeout(() => {
      console.log('Mock WebSocket connected');
      this.emit('connected', { studentId });
      
      // Simulate periodic updates
      setInterval(() => {
        this.emit('scoreUpdate', {
          type: 'score_update',
          studentId,
          score: Math.floor(Math.random() * 10) + 1,
          timestamp: new Date().toISOString()
        });
      }, 30000);
      
      // Simulate leaderboard updates
      setInterval(() => {
        this.emit('leaderboardUpdate', {
          type: 'leaderboard_update',
          leaderboard: [
            { rank: 1, studentId: '1', name: 'Sarah Chen', score: 3200, level: 12, isOnline: true },
            { rank: 2, studentId: '2', name: 'Michael Rodriguez', score: 2950, level: 11, isOnline: true },
            { rank: 3, studentId: '3', name: 'Emily Zhang', score: 2800, level: 10, isOnline: false },
            { rank: 4, studentId: studentId, name: 'Current User', score: 2500, level: 9, isOnline: true }
          ],
          timestamp: new Date().toISOString()
        });
      }, 60000);
    }, 500);
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'score_update':
        this.emit('scoreUpdate', data);
        break;
      case 'leaderboard_update':
        this.emit('leaderboardUpdate', data);
        break;
      case 'user_joined':
        this.emit('userJoined', data);
        break;
      case 'user_left':
        this.emit('userLeft', data);
        break;
      default:
        this.emit('message', data);
    }
  }

  private attemptReconnect(studentId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(studentId);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  // Send score update
  sendScoreUpdate(studentId: string, score: number, questionId?: string) {
    if (this.mockMode) {
      console.log('Mock sending score update:', { studentId, score, questionId });
      // Simulate response
      setTimeout(() => {
        this.emit('scoreUpdate', {
          type: 'score_update',
          studentId,
          score,
          questionId,
          timestamp: new Date().toISOString()
        });
      }, 500);
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'score_update',
        studentId,
        score,
        questionId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback?: Function) {
    if (!this.listeners.has(event)) return;
    
    if (callback) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }
  }

  // Emit events to listeners
  private emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  // Check connection status
  isConnected(): boolean {
    if (this.mockMode) {
      return true; // Always return connected in mock mode
    }
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
// WebSocket Service for Real-time Score Updates
class WebSocketService {
  private ws: WebSocket | null = null;
  private baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  // Connect to WebSocket endpoint /ws/scores
  connect(studentId: string) {
    try {
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
    }
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
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
import { useEffect } from 'react';
import { websocketService } from '../services/websocketService';
import { useGame } from '../contexts/GameContext';

// Custom hook to manage AI integration and WebSocket connections
export const useAIIntegration = () => {
  const { state, dispatch } = useGame();

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    if (state.user.id) {
      websocketService.connect(state.user.id);

      // Subscribe to score updates
      websocketService.on('scoreUpdate', (data: any) => {
        if (data.studentId === state.user.id) {
          dispatch({ type: 'EARN_XP', payload: data.score });
        }
      });

      // Subscribe to leaderboard updates
      websocketService.on('leaderboardUpdate', (data: any) => {
        // Handle leaderboard updates in the UI
        console.log('Leaderboard updated:', data);
      });

      // Subscribe to user events
      websocketService.on('userJoined', (data: any) => {
        console.log('User joined:', data);
      });

      websocketService.on('userLeft', (data: any) => {
        console.log('User left:', data);
      });

      return () => {
        websocketService.disconnect();
      };
    }
  }, [state.user.id, dispatch]);

  return {
    isConnected: websocketService.isConnected(),
    sendScoreUpdate: (score: number, questionId?: string) => {
      websocketService.sendScoreUpdate(state.user.id, score, questionId);
    }
  };
};
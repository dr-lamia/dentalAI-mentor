import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const setupSocketHandlers = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error'));
      }

      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.userName = user.name;
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userName} connected (${socket.userId})`);

    // Join user to their personal room for notifications
    socket.join(`user:${socket.userId}`);

    // Handle joining study sessions
    socket.on('session:join', async (data) => {
      try {
        const { roomId } = data;
        const session = await Session.findOne({ roomId, isActive: true });
        
        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Join the room
        socket.join(roomId);
        socket.currentRoom = roomId;

        // Notify others in the room
        socket.to(roomId).emit('session:user-joined', {
          userId: socket.userId,
          userName: socket.userName
        });

        // Send current session state
        const populatedSession = await Session.findById(session._id)
          .populate('host', 'name')
          .populate('participants.user', 'name level xp')
          .populate('content');

        socket.emit('session:state', { session: populatedSession });

      } catch (error) {
        console.error('Session join error:', error);
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    // Handle leaving study sessions
    socket.on('session:leave', () => {
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit('session:user-left', {
          userId: socket.userId,
          userName: socket.userName
        });
        socket.leave(socket.currentRoom);
        socket.currentRoom = null;
      }
    });

    // Handle real-time quiz answers
    socket.on('quiz:answer', async (data) => {
      try {
        const { roomId, questionId, answer, timeSpent } = data;
        
        if (socket.currentRoom !== roomId) {
          socket.emit('error', { message: 'Not in this session' });
          return;
        }

        // Broadcast answer to room (for live quiz sessions)
        socket.to(roomId).emit('quiz:user-answered', {
          userId: socket.userId,
          userName: socket.userName,
          questionId,
          timeSpent
        });

      } catch (error) {
        console.error('Quiz answer error:', error);
        socket.emit('error', { message: 'Failed to process answer' });
      }
    });

    // Handle chat messages in sessions
    socket.on('session:chat', async (data) => {
      try {
        const { roomId, message } = data;
        
        if (socket.currentRoom !== roomId) {
          socket.emit('error', { message: 'Not in this session' });
          return;
        }

        const chatMessage = {
          id: Date.now().toString(),
          userId: socket.userId,
          userName: socket.userName,
          message,
          timestamp: new Date()
        };

        // Broadcast to all users in the room
        io.to(roomId).emit('session:chat-message', chatMessage);

      } catch (error) {
        console.error('Chat message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle real-time leaderboard updates
    socket.on('leaderboard:update', async (data) => {
      try {
        const { roomId, score } = data;
        
        if (socket.currentRoom !== roomId) {
          socket.emit('error', { message: 'Not in this session' });
          return;
        }

        // Update session participant score
        const session = await Session.findOne({ roomId });
        if (session) {
          const participant = session.participants.find(
            p => p.user.toString() === socket.userId
          );
          
          if (participant) {
            participant.score = score;
            await session.save();

            // Generate and broadcast updated leaderboard
            const leaderboard = session.participants
              .filter(p => p.isActive)
              .sort((a, b) => b.score - a.score)
              .map((p, index) => ({
                rank: index + 1,
                userId: p.user,
                score: p.score
              }));

            io.to(roomId).emit('leaderboard:updated', { leaderboard });
          }
        }

      } catch (error) {
        console.error('Leaderboard update error:', error);
        socket.emit('error', { message: 'Failed to update leaderboard' });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (data) => {
      const { roomId } = data;
      if (socket.currentRoom === roomId) {
        socket.to(roomId).emit('typing:user-start', {
          userId: socket.userId,
          userName: socket.userName
        });
      }
    });

    socket.on('typing:stop', (data) => {
      const { roomId } = data;
      if (socket.currentRoom === roomId) {
        socket.to(roomId).emit('typing:user-stop', {
          userId: socket.userId
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userName} disconnected`);
      
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit('session:user-left', {
          userId: socket.userId,
          userName: socket.userName
        });
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Global event emitters for system-wide notifications
  io.broadcastToRole = (role, event, data) => {
    io.emit('role:' + role, { event, data });
  };

  io.notifyUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  };

  console.log('Socket.IO handlers initialized');
};
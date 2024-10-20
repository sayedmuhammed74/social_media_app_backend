const User = require('../models/userModel');

let onlineUsers = {};

const offlineUser = async (userId) => {
  delete onlineUsers[userId];
  await User.findOneAndUpdate({ _id: userId }, { isOnline: false });
};

const findUserBySocketId = (socketId) => {
  for (let userId in onlineUsers) {
    if (onlineUsers[userId] === socketId) {
      return userId;
    }
  }
  return null; // Return null if the socket ID is not found
};

module.exports = (io) =>
  io.on('connection', (socket) => {
    // Listen to New User Online
    socket.on('userOnline', async (userId) => {
      onlineUsers[userId] = socket.id;
      // Update user status in DB
      await User.findOneAndUpdate({ _id: userId }, { isOnline: true });
    });

    // Get Online Friends
    socket.on('getOnlineFriends', ({ friends }) => {
      try {
        const onlineFriends = friends.filter(
          (friend) => onlineUsers[friend._id]
        );
        io.to(socket.id).emit('recieveOnlineFriends', onlineFriends);
      } catch (error) {
        console.error(error.message);
        io.to(socket.id).emit('recieveOnlineFriends', []); // Emit empty array in case of an error
      }
    });

    // Send & Recieve Messages
    socket.on('sendMessage', ({ message, to }) => {
      io.to(onlineUsers[to]).emit('recieveMessage', message);
    });

    // Send Notifications
    socket.on('handleNotification', ({ notification }) => {
      io.to(onlineUsers[notification.user]).emit(
        'sendNotification',
        notification
      );
    });

    // User has Lefted
    socket.on('disconnected', (userId) => {
      offlineUser(userId);
    });
  });

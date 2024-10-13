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

    socket.on('getOnlineFriends', ({ friends }) => {
      try {
        const onlineFriends = friends.filter(
          (friend) => onlineUsers[friend._id]
        );
        console.log(onlineFriends);
        io.to(socket.id).emit('recieveOnlineFriends', onlineFriends);
      } catch (error) {
        console.error(error.message);
        io.to(socket.id).emit('recieveOnlineFriends', []); // Emit empty array in case of an error
      }
    });

    socket.on('sendMessage', ({ message, to }) => {
      console.log(onlineUsers[to]);
      io.to(onlineUsers[to]).emit('recieveMessage', message);
    });

    // User has Lefted
    socket.on('disconnected', (userId) => offlineUser(userId));
  });

//   try {
//     await User.findOneAndUpdate({ _id: userId }, { isOnline: true });

//     // Get friends of the user
//     const user = await User.findOne({ userId });
//     if (user && user.friends) {
//       const onlineFriends = user.friends.filter(
//         (friendId) => onlineUsers[friendId]
//       );

//       // Notify only the online friends
//       onlineFriends.forEach((friendId) => {
//         io.to(onlineUsers[friendId]).emit('friendOnline', userId);
//       });
//     }

//     const requests = await Request.find({
//       $or: [{ to: req.user._id }, { from: req.user._id }],
//       status: 'accepted',
//     })
//       .populate({
//         path: 'from',
//         select: '-role -createdAt -updatedAt -__v -id',
//       })
//       .populate({
//         path: 'to',
//         select: '-role -createdAt -updatedAt -__v -id',
//       });

//     // Extract friends from the requests
//     const friends = requests.map((request) => {
//       if (request.from._id.equals(req.user._id)) {
//         return request.to; // The 'to' field is the friend
//       } else {
//         return request.from; // The 'from' field is the friend
//       }
//     });
//   } catch (error) {
//     console.error('Error updating user status:', error);
//   }
// });

// socket.on('getOnlineUsers', (friends) => {
//   const onlineFriends = sendOnlineUsers(friends);
//   io.to(socket.id).emit('onlineFriends', onlineFriends);
// });

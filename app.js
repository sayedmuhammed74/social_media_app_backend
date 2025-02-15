const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const hemlet = require('helmet');
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      'https://full-stack-social-app.vercel.app',
      'http://localhost:5173',
    ],
  },
});

app.use(hemlet());
// Routes
const userRoute = require('./routes/user.route');
const postRoute = require('./routes/post.route');
const conversationRoute = require('./routes/conversation.route');
const notificationRoute = require('./routes/notification.route');
// utils
const AppError = require('./utils/AppError');
// Global Error Controller
const globalErrorHandler = require('./controllers/errorController');

require('dotenv').config();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// CORs
// app.use(cors());
const allowedOrigins = [
  'https://full-stack-social-app.vercel.app',
  'http://localhost:5173', // Your React app's URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    // credentials: true, // This allows cookies to be sent and received
  })
);

app.options('*', cors());
// Parse incoming JSON data
app.use(express.json());
// Parse incoming FormData or URL-encoded data
app.use(express.urlencoded({ extended: true }));
// Parse Cookies
app.use(cookieParser());

// routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/conversations', conversationRoute);
app.use('/api/v1/notifications', notificationRoute);

// Socket.io
require('./socket/socket')(io);

// Errors handling (route doen't exist)
app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

// Global handling middleware
app.use(globalErrorHandler);

// connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('connection success'))
  .catch(() => console.log('failed to connect to DB'));

// listen
server.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);

// Handle all unrejection async errors
process.on('unhandledRejection', (err) => {
  // 0  stands for success
  // 1  stands for uncaught exeption
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! 🔥 Shutting down...');
  // to give the server time to finish the pending requests
  server.close(() => process.exit(1));
});

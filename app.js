const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// Routes
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
// utils
const AppError = require('./utils/AppError');
// Global Error Controller
const globalErrorHandler = require('./controllers/errorController');

require('dotenv').config();
// app.use(morgan('dev'));
app.use(
  cors(
    {
      origin: 'http://localhost:5173', // Your React app's URL
      credentials: true,
    },
    {
      origin: 'https://social-media-app-backend-hsgm.onrender.com',
      credentials: true,
    }
  )
);
app.use(express.json());
app.use(cookieParser());
// routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);

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
const server = app.listen(process.env.PORT, () =>
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

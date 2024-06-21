const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const keepServerAlive = require('./keep-alive');
// Routes
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');

// utils
const AppError = require('./utils/AppError');
// Global Error Controller
const globalErrorHandler = require('./controllers/errorController');

require('dotenv').config();
app.use(cors());
// body parser
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Hello from the server</h1>');
});

app.get('/keep-alive', (req, res) => {
  console.log('keep alive response');
  res.send('keep alive response');
});

// routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);

setInterval(() => {
  keepServerAlive();
}, 1000 * 60 * 10);

// Errors handling (route doen't exist)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global handling middleware
app.use(globalErrorHandler);

// connection
const DB = process.env.DB_URL;
mongoose.connect(DB).then(() => console.log('connection success'));

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

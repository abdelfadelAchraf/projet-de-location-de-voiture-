// // require('dotenv').config();
// // const app = require('./src/app');
// // const connectDB = require('./src/config/database');
// // const logger = require('./src/utils/logger');
// import "dotenv/config";
// import app from './src/app.js';
// import connectDB from './src/config/database.js';
// import logger from './src/utils/logger.js';

// const PORT = process.env.PORT || 5000;

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   logger.error('UNCAUGHT EXCEPTION! Shutting down...');
//   logger.error(err.name, err.message);
//   process.exit(1);
// });

// // Connect to database
// connectDB();

// // Start server
// const server = app.listen(PORT, () => {
//   logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
//   console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   logger.error('UNHANDLED REJECTION! Shutting down...');
//   logger.error(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// // Handle SIGTERM
// process.on('SIGTERM', () => {
//   logger.info('SIGTERM received. Shutting down gracefully...');
//   server.close(() => {
//     logger.info('Process terminated!');
//   });
// });
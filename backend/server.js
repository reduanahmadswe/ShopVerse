import app from './app.js';
import dotenv from 'dotenv';
import {connectMOngoDatabase} from './config/db.js';
dotenv.config({ path: 'backend/config/config.env' });

connectMOngoDatabase();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  console.error('Shutting down the server due to uncaught exception');
  server.close(() => {
    process.exit(1);
  });
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  console.error('Shutting down the server due to unhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});
import express from 'express';
import product from './routes/productRoutes.js';
import errorHandlingMiddleware from './middleware/error.js';
const app = express();


// Middleware
app.use(express.json()); // To parse JSON bodies

//Routes
app.use('/api/v1', product);

// Error handling middleware

app.use(errorHandlingMiddleware);

export default app;


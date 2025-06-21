import express from 'express';
import product from './routes/productRoutes.js';
// import errorHandlingMiddleware from './middleware/error.js';
import user from './routes/userRoutes.js';
const app = express();


// Middleware
app.use(express.json()); // To parse JSON bodies

//Routes
app.use('/api/v1', product);
app.use('/api/v1', user);

// Error handling middleware

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});


export default app;


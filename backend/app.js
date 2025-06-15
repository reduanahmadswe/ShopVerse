import express from 'express';
import product from './routes/productRoutes.js';
const app = express();




//Routes
app.use('/api/v1', product);


export default app;


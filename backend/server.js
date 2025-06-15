import app from './app.js';
import dotenv from 'dotenv';
import {connectMOngoDatabase} from './config/db.js';
dotenv.config({ path: 'backend/config/config.env' });

connectMOngoDatabase();
const port = process.env.PORT || 3000;



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
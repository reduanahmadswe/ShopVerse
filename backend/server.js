import app from './app.js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/config/config.env' });
const port = process.env.PORT || 3000;

const getAllProducts = (req, res) => {
  res.status(200).json({
    message: "All products are listed here",
  });
};

const getSingleProduct = (req, res) => {
  res.status(200).json({
    message: "Single product details",
  });
}

app.get('/api/v1/products', getAllProducts);

app.get("/api/v1/product", getSingleProduct);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
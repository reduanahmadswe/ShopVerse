import express from 'express';
import { createProducts, deleteProduct, getAllProducts, getSingleProduct, updateProduct} from '../Controller/productController.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
const router = express.Router();



//Routes
router.route('/products')
.get(verifyUserAuth,getAllProducts)
.post(verifyUserAuth,roleBasedAccess('admin') ,createProducts);



router.route('/product/:id')
.put(verifyUserAuth,updateProduct)
.delete(verifyUserAuth,deleteProduct)
.get(verifyUserAuth,getSingleProduct);



export default router;
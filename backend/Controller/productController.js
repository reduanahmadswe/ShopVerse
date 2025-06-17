import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";

//http://localhost:8000/api/v1/product/684ea26bee0d2f0c94da76c2?kyeword=Shart


//Creating Product
export const createProducts = handleAsyncError(async (req, res, next) => {


        const product = await Product.create(req.body);

        if (!product) {
            return next(new HandleError("Product creation failed", 400));
        }

        res.status(201).json({
            success: true,
            product,
        });

});



//Getting all products
export const getAllProducts = handleAsyncError(async (req, res, next) => {

    const resultPerPage = 3; // Number of products per page

    const apiFeatures =  new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

    //Getting filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    //calculete total pages
    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;

    if(page > totalPages && productCount > 0) {
        return next(new HandleError("This page does not exist", 404));
    }

    //Applying pagination
    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;

    if (!products || products.length === 0) {
        return next(new HandleError("No products found", 404));
    }

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        totalPages,
        currentPage: page
    });
});

//Update product
export const updateProduct = handleAsyncError(async (req, res, next) => {
    const products = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!products) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        products,
        //message: "Product updated successfully",
    });
});

//Delete product
export const deleteProduct = handleAsyncError(async (req, res, next) => {

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});


//Accessing a single product
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});



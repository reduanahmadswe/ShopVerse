import Product from "../models/productModel.js";

//Creating Product
export const createProducts = async (req, res) => {

    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};



//Getting all products
export const getAllProducts = async (req, res) => {
    const products = await Product.find();
    if (!products || products.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No products found",
        });
    }
    res.status(200).json({
        success: true,
        products: products,
        // count: products.length,
        // message: "All products fetched successfully",

    });
};

//Update product
export const updateProduct = async (req, res) => {
    const products = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!products) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    res.status(200).json({
        success: true,
        products,
        //message: "Product updated successfully",
    });
};

//Delete product
export const deleteProduct = async (req, res) => {

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
};


//Accessing a single product
export const getSingleProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    res.status(200).json({
        success: true,
        product,
    });
};



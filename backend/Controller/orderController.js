import Order from "../models/orderModel.js"
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";


//Create New Order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (
        !shippingInfo ||
        !orderItems ||
        !paymentInfo ||
        itemsPrice == null ||
        taxPrice == null ||
        shippingPrice == null ||
        totalPrice == null
    ) {
        return next(new HandleError("Please provide all required order details", 400));
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order
    });
});

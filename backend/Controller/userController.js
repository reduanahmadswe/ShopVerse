import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";

// Register
export const registerUser = handleAsyncError(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "this is a sample url",
        }
    });

    const token = user.getJWTToken();
    user.password = undefined;

    res.status(201).json({
        success: true,
        user,
        token,
    });
});


// Login 
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    console.log(email,password);

    if (!email || !password) {
        return next(new HandleError("Email or password cannot be empty", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new HandleError("Invalid email or password", 401));
    }

    const isPasswordValid = await user.verifyPassword(password);


    if (!isPasswordValid) {
        return next(new HandleError("Invalid email or password", 401));
    }

    // const token = user.getJWTToken();
    // //user.password = undefined;

    // res.status(200).json({
    //     success: true,
    //     user,
    //     token
    // });
    sendToken(user,200,res);
});

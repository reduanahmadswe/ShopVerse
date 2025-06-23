import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

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

    sendToken(user, 201, res)
});


// Login 
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

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

    sendToken(user, 200, res);
});


// logout
export const logout = handleAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        httpOnly: true,
        expires: new Date(Date.now()), // expire immediately
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({
        success: true,
        message: "Successfully Logged out"
    });
});

//Forgot Password 
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new HandleError("Please provide an email", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new HandleError("User doesn't exist", 404));
    }

    try {
        const resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${req.protocol}://localhost/api/v1/reset/${resetToken}`;

        const message = `Use the following link to reset your password:\n\n
        ${resetPasswordUrl}\n\nThis link will expire in 30 minutes.\n\n
        If you didn't request a password reset, please ignore this message.`;

        try {
            // Send email logic here
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                message
            });


            //console.log("Reset password link:", resetPasswordUrl); 

            return res.status(200).json({
                success: true,
                message: `Email is sent to ${user.email} succesfully`
            });

        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return next(new HandleError("Failed to send reset email. Try again later.", 500));
        }
    } catch (err) {
        return next(new HandleError("Could not save reset token. Please try again later.", 500));
    }
});


//Reset Password
export const resetPassword = handleAsyncError(async (req, res, next) => {

    // console.log(req.params.token);

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new HandleError("Reset token is invalid or has expired", 400));
    }

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
        return next(new HandleError("Please provide both password and confirm password", 400));
    }

    if (password !== confirmPassword) {
        return next(new HandleError("Passwords do not match", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
///////////////////////////////////////
///////////    06:38:43      ///////////
///////////////////////////////////////


})


// Get User details 
export const getUserDetails = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new HandleError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});


// Update password
export const updatePassword = handleAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(new HandleError("Please provide old password, new password, and confirm password", 400));
    }

    if (newPassword !== confirmPassword) {
        return next(new HandleError("New password and confirm password do not match", 400));
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
        return next(new HandleError("User not found", 404));
    }

    const checkPasswordMatch = await user.verifyPassword(oldPassword);

    if (!checkPasswordMatch) {
        return next(new HandleError("Old password is incorrect", 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

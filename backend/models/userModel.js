///////////////////////////////////////
///////////    04:06:43      ///////////
///////////////////////////////////////
//user model
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [25, "Name cannot exceed 25 characters"],
        minLength: [3, "Name should have more than 3  characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],

    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,


}, { timestamps: true });

//password hashing
userSchema.pre("save", async function (next) {
    // Skip re-hashing if password is unchanged
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next(); // Make sure to call next()
});


userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.
        JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    });
}


userSchema.methods.verifyPassword = async function (userEnteredPassword) {
    return await bcrypt.compare(userEnteredPassword, this.password);
};

//generation token
userSchema.methods.generatePasswordResetToken = function () {
    // Generate raw reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash the token and store it in the database
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set token expiration time (e.g., 30 minutes from now)
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    // Return the original (non-hashed) token for sending via email
    return resetToken;
};



export default mongoose.model("User", userSchema);

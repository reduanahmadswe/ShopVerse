///////////////////////////////////////
///////////    04:06:43      ///////////
///////////////////////////////////////
//user model
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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
userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 10);

    //1st - updating profile (name,email,image)
    if (!this.isModified("password")) {
        return next();
    }


});

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.
        JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    });
}




export default mongoose.model("User", userSchema);

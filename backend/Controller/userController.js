import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";





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

    res.status(201).json({
        success: true,
        user,
        token,
    });
});


// Login 
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new HandleError("Email or passowed cannot be empty ",400));
       
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new handleAsyncError("Invalid email or password ",401));
    }

    const token = user.getJWTToken();
    res.status(200).json({
        success : true,
        user,
        token
    })

   

})



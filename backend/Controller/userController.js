import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";


export const registerUser = handleAsyncError(async (req, res) => {
    try {
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
    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    

   
});


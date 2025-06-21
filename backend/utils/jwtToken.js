// export const sendToken = (user, statusCode, res) => {
//     const token = user.getJWTToken();


//     //option for cookies
//     const options = {
//         expires: new Date(Date.now() + process.env
//             .EXPIRE_COOKIE * 24 * 60 * 60 * 1000),
//         httpOnly: true
//     }


//     res.status(statusCode)
//         .cookie('token', token, options)
//         .json({
//             success: true,
//             user,
//             token
//         })
// }

export const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const days = Number(process.env.EXPIRE_COOKIE || 3); 

    if (isNaN(days)) {
        console.error("Invalid EXPIRE_COOKIE value in .env");
        return res.status(500).json({
            success: false,
            message: "Server configuration error: EXPIRE_COOKIE must be a number",
        });
    }

    
    const options = {
        expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };


    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            user,
            token,
        });
};

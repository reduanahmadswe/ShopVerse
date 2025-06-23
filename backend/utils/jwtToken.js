export const sendToken = (user, statusCode, res) => {

    const token = user.getJWTToken();

    const days = Number(process.env.EXPIRE_COOKIE || 3);

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

import HandleError from '../utils/handleError.js';
import handleAsyncError from './handleAsyncError.js';


export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    console.log(token);

    if(!token){
        return next(new HandleError("Authentication is missing ! p\Plwase login to acces resource",401))
    }
});

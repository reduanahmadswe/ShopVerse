import express from "express";
import {

    getUserDetails,
    loginUser,
    logout,
    registerUser,
    requestPasswordReset,
    resetPassword
} from "../Controller/userController.js";

import { verifyUserAuth } from './../middleware/userAuth.js';


const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/password/forgot").post(requestPasswordReset);

router.route("/reset/:token").post(resetPassword);
router.route("/profile").post(verifyUserAuth,getUserDetails);



export default router;
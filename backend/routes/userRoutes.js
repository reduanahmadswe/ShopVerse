import express from "express";
import {
    loginUser,
    logout,
    registerUser,
    requestPasswordReset,
    resetPassword
} from "../Controller/userController.js";


const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/password/forgot").post(requestPasswordReset);

router.route("/reset/:token").post(resetPassword);



export default router;
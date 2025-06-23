import express from "express";
import {

    getUserDetails,
    loginUser,
    logout,
    registerUser,
    requestPasswordReset,
    resetPassword,
    updatePassword,
    updateProfile
} from "../Controller/userController.js";

import { roleBasedAccess, verifyUserAuth } from './../middleware/userAuth.js';
import { getUsersList } from "../Controller/productController.js";


const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/password/forgot").post(requestPasswordReset);

router.route("/reset/:token").post(resetPassword);
router.route("/profile").post(verifyUserAuth,getUserDetails);
router.route("/password/update").post(verifyUserAuth,updatePassword);
router.route("/profile/update").post(verifyUserAuth,updateProfile);
router.route("/admin/users").get(verifyUserAuth,roleBasedAccess('admin'),getUsersList);


export default router;
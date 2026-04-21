import express from "express";

const router = express.Router();

import type { Request, Response } from "express";
import { userController } from "../controllers/userController.js";
import { validateuser } from "../middleware/auth.js";
import { verify_reset_pass_token, verifyToken } from "../utils/jwtUtils.js";

router.get("/register", userController.userRegister);
router.post("/register",validateuser.registervalidation,userController.insertuser);

router.get("/capcha", userController.capchaloader);
router.get("/login",userController.userLogin);
router.post("/login",userController.userverification);
router.get("/user",verifyToken,userController.userpage);
router.get("/logout",userController.logout);

router.get("/forgotpassword",userController.getforgotpassword)
router.post("/forgotpassword",userController.postforgotpassword);

router.get("/reset-password",verify_reset_pass_token,userController.getresetpassword)
router.post("/reset-password",validateuser.newpassvalidation, userController.postresetpassword);




export { router as userRoute };

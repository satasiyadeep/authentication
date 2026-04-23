import express from "express";

import passport from "../auth/passport.js";

const router = express.Router();

import type { Request, Response, NextFunction } from "express";
import { userController } from "../controllers/userController.js";
import { validateuser } from "../middleware/auth.js";
import { verify_reset_pass_token, verifyToken } from "../utils/jwtUtils.js";

router.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/auth/google",{scope: ["profile", "email"]});

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", { failureRedirect: "/login" }),userController.insertGoogleuser
);



router.get("/register", userController.userRegister);
router.post(
  "/register",
  validateuser.registervalidation,
  userController.insertuser,
);


router.get("/capcha", userController.capchaloader);
router.get("/login", userController.userLogin);
router.post("/login", userController.userverification);
router.get("/user", verifyToken, userController.userpage);
router.get("/logout", verifyToken, userController.logout);

router.get("/forgotpassword", userController.getforgotpassword);
router.post("/forgotpassword", userController.postforgotpassword);


router.get(
  "/reset-password",
  verify_reset_pass_token,
  userController.getresetpassword,
);

router.post(
  "/reset-password",
  validateuser.newpassvalidation,
  userController.postresetpassword,
);

router.get("/admin", verifyToken, userController.adminpage);

export { router as userRoute };

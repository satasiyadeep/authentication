// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import { error } from "console";
dotenv.config();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Read from cookies
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    // If no cookie, they aren't logged in. Redirect to login.
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
    req.user = decoded;
    // console.log(decoded)
    
    next();
  } catch (err: any) {
    res.clearCookie("token");
    if (err.name === "TokenExpiredError") {
      // This runs after 10s because the cookie is sent but the JWT is "dead"
      return res
        .status(401)
        .send("JWT Expired! Even though browser sent the cookie.");
    }
    return res.redirect("/login");
  }
};

const verify_reset_pass_token = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const reset_token = req.query.password_token;
  // console.log(reset_token);

  if (!reset_token) {
    return res.json({
      error: "expiry of your password token reset you password again",
    });
  }

  try {
    const decoded = jwt.verify(String(reset_token) , String(process.env.JWT_SECRET));
    req.user = decoded;
    next();
  } catch (err: any) {

    if (err.name === "TokenExpiredError") {
      // This runs after 10s because the cookie is sent but the JWT is "dead"
      return res
        .status(401)
        .send("expiry of your password link reset you password again");
    }
    return res.redirect("/login");
  }
};

// module.exports = verifyToke;
export { verifyToken, verify_reset_pass_token };

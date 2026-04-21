import type { Request, Response, NextFunction } from "express";
import { create } from "svg-captcha";
import { generatehash, comparepasword } from "../utils/bcryptUtils.js";
import { usermodel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { error } from "console";

const userController = {
  userRegister: async (req: Request, res: Response) => {
    try {
      return res.render("signuppage");
      // res.send("hello")
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  userLogin: async (req: Request, res: Response) => {
    try {
      return res.render("loginpage");
      // res.send("hello")
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  userverification: async (req: Request, res: Response) => {
    try {
      // verification os user
      // console.log(req.body);
      const { email, password, rememberme, role } = req.body;
      // console.log(req.body);
      if (!email || !password) {
        throw new Error(" email and password require ");
      }

      const [userdata] = await usermodel.emailexist([email, role]);

      //  const password_expiry_time=userdata[0]?.password_updated_at- (new Date())

      if (userdata.length > 0) {
        // check password expiry
        const d1: any = new Date();
        const d2: any = new Date(userdata[0]?.password_updated_at);
        const expiry_time = (d1 - d2) / (1000 * 60); // devide by mili seconds it gives in mili,sec,min,hr,day
        // console.log(expiry_time/(1000*(60)));
        if (expiry_time > 30) {
          //  password expiry in 30 minutes
          return res
            .status(400)
            .json({ error: "password is expiry generate new password" });
        }
          // password right or not check
        const is_passwordvalid = await comparepasword(
          password,
          userdata[0]?.user_password,
        );

        const is_lock = userdata[0]?.is_lock;
        const login_attempt = userdata[0]?.login_attempt;
        // check is user lock
        if (is_lock) {
          return res
            .status(400)
            .json({ error: "user lock due to many login attempts" });
        }
        //  token generation for login
        if (is_passwordvalid) {
          const tokenExpiry = rememberme ? "30d" : "1h";

          const token = jwt.sign(
            { id: userdata[0].user_id, email: userdata[0].email },
            String(process.env.JWT_SECRET),
            { expiresIn: tokenExpiry },
          );

          res.cookie("token", token, {
            httpOnly: true, // Prevents JavaScript access (More Secure!)
            secure: true, // Set to true if using HTTPS
            maxAge: rememberme ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // in mili second
          });

          // set remember me functionality
            // reset login attempt 0 

          login_attempt > 0 ? await usermodel.updateloginattempt([0,userdata[0].email]) : "";
          
          // Now you can safely redirect directly from the backend
            res.redirect(`/user`);
        } else {
          // increment in user login attempt
          const new_login_attempt = login_attempt + 1;

          await usermodel.updateloginattempt([
            new_login_attempt,
            userdata[0].email,
          ]);
          // user lock if wrong attemp is greater than 2
          if (new_login_attempt > 2) {
            await usermodel.lockuser(userdata[0].email);
          }
          return res
            .status(400)
            .json({ error: `you have last ${3 - new_login_attempt} attemps` });
        }
      } else {
        return res.status(400).json("invalid credentials");
      }

      // res.send("hello")
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  userpage: async (req: Request, res: Response) => {

    try {
      interface JwtUser {
        id: number;
        email: string;
        // add other fields you put in the token here
      }

      const user = req.user as JwtUser;
      const userEmail = user.email;
      const [data] =  await usermodel.emailexist_only(userEmail)
      if (data.length>0) {

        return res.render("userpage", { userEmail });
      } else {
        res.redirect("/login");
      }
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  insertuser: async (req: Request, res: Response) => {
    // console.log(req.body);
    const { firstname, lastname, email, password, capcha } = req.body;
    const encrypt_password = await generatehash(password);
    const data = [firstname, lastname, email, encrypt_password];
    const result = await usermodel.insertuser(data);
    // console.log(data);
    res.status(200).redirect("/login");
  },

  capchaloader: async (req: Request, res: Response) => {
    try {
      const capcha = create();
      const text = capcha["text"];
      const data = capcha["data"];
      res.json(capcha);
    } catch (error) {
      res.send("error in capcha generation");
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      res.clearCookie("token");
      return res.redirect("/login");
    } catch (error) {
      res.send("error logout ");
    }
  },

  getforgotpassword: async (req: Request, res: Response) => {
    try {
      // const token = req.cookies.token;
      //  res.clearCookie("token");

      return res.render("forgotpasswordpage");
    } catch (error) {
      res.send("error in forgot password  ");
    }
  },

  postforgotpassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      // console.log(req.user);

      const [userdata] = await usermodel.emailexist_only(email);
      // const name = userdata[0].first_name + userdata[0].last_name;
      if (userdata.length === 0) {
        throw new Error("invalid credentials  ");
      }

      const reset_password_token = jwt.sign(
        { id: userdata[0].user_id, email: userdata[0].email },
        String(process.env.JWT_SECRET),
        { expiresIn: "1h" },
      );
      const data = [reset_password_token, userdata[0].user_id];
      // insert reset_password_token
      await usermodel.insert_reset_password_token(data);

      // console.log("pass");

      return res.redirect(
        `/reset-password?password_token=${reset_password_token}`,
      );
    } catch (error: any) {
      res.send("error  " + error.message);
    }
  },

  getresetpassword: async (req: Request, res: Response) => {
    try {
      interface JwtUser {
        id: number;
        email: string;
        // add other fields you put in the token here
      }
      const user = req.user as JwtUser;

      const email: any = user.email;

      const [database_reset_password_token]: any =
        await usermodel.getresettoken(email);
      // const token1 : any =JSON.stringify(database_reset_password_token);
      const user_request_password_token = req.query.password_token;
      // console.log("at the getresetpassword after middleware" )
      // console.log("1 : "+database_reset_password_token[0]?.reset_password_token);
      // console.log("2 : "+user_request_password_token)

      if (
        database_reset_password_token[0]?.reset_password_token ==
        user_request_password_token
      ) {
        return res.render("resetpasswordpage", { email });
      }
      res.status(401).json({ error: "error in password reset token" });
    } catch (error: any) {
      res.send("error  " + error.message);
    }
  },

  postresetpassword: async (req: Request, res: Response) => {
    try {
      const { email, rewritenewpassword } = req.body;
      const encrypt_password = await generatehash(rewritenewpassword);

      const data = [encrypt_password, email];
      await usermodel.setnewpassword(data);
      return res.render("succes_resetpassword");
    } catch (error: any) {
      res.send("error  " + error.message);
    }
  },
};

export { userController };

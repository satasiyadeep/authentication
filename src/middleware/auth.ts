import { error } from "console";
import type { Request, Response, NextFunction } from "express";

const validateuser = {
  registervalidation: (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, password } = req.body;
    // console.log(req.body);
    if (!firstname || !lastname || !email) {
      return res.status(400).json({
        message: "enter valid detail ",
      });
    }

    // Source - https://stackoverflow.com/a/26322921
    // Posted by user663031, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-04-16, License - CC BY-SA 3.0
    const pass = validatePassword(password);
    function validatePassword(pw: string) {
      return (
        /[A-Z]/.test(pw) &&
        /[a-z]/.test(pw) &&
        /[0-9]/.test(pw) &&
        /[^A-Za-z0-9]/.test(pw) &&
        pw.length > 4
      );
    }

    if(!pass){
        return res.status(400).json({
        message: `At least one uppercase letter  At least one lowercase letter At least one digit At least one special symbol should be more than 4 character`,
      });
    }

    // console.log("auth");
    next();
  },

  newpassvalidation : (req: Request, res: Response, next: NextFunction)=>{
      try {
        const{email,newpassword,rewritenewpassword}=req.body;

        if(!newpassword || !rewritenewpassword ){
          return res.status(400).json({error : "pls fill all feilds"});
        }
            
         if(newpassword!==rewritenewpassword){
         return res.status(400).json({error : "mismatch password"});
         }

         next();



           
      } catch (error : any) {
         res.status(400).json({error:" error in  new password"})
      }
  }
};

export { validateuser };

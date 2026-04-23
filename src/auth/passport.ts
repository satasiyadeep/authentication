// var GoogleStrategy = require('passport-google-oauth20').Strategy;
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import {Stratergy as GoogleStrategy} from "authenticate-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "http://localhost:5555/oauth2/redirect/google"
  },
  function(accessToken, refreshToken, profile, cb) {
    //   console.log(profile);
    //   cb(null, profile);
      return cb(null, profile);
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user : Express.User, cb) => {
    cb(null, user);
    });

export default passport;
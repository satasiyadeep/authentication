import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
// import { generatehash } from './utils/bcryptUtils.js';
import { userRoute } from './routes/userRoutes.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from "passport";
import expressSession from "express-session";



const app=express();
app.use(
  expressSession({
    secret: 'sffws',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
dotenv.config();


const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const PORT = process.env.PORT || 3000 ;



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRoute);


app.set("view engine","ejs");
app.set("views",path.join(import.meta.dirname,"views"));



app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

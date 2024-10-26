import express from "express";
import { userSignIn, userSignUp, companySignUp, signOut, companySignIn } from "../controllers/auth.controler.js";

const app = express();

app.post('/user/sign-up', userSignUp);
app.post('/user/sign-in', userSignIn);
app.post('/company/sign-up', companySignUp);
app.post('/company/sign-in', companySignIn);
app.post('/sign-out', signOut);

export default app;
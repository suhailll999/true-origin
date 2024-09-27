import express from "express";
import { userSignOut, userSignIn, userSignUp } from "../controllers/auth.controler.js";

const app = express();

app.post('/user/sign-up', userSignUp);
app.post('/user/sign-in', userSignIn);
app.post('/user/sign-out', userSignOut);

export default app;
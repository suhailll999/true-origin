import express from "express";
import { signIn, signOut, signUp,  } from "../controllers/auth.controler.js";

const app = express();

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);
app.post('/sign-out', signOut);

export default app;
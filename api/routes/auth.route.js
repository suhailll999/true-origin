import express from "express";
const router = express();
import { signIn, signOut, signUp } from "../controllers/auth.controler.js"

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);

export default router;
import express from "express";
import { getProduct } from "../controllers/user.controler.js";
import { verifyToken } from "../utils/index.js";

const app=express()

app.get('/product/:productId', verifyToken, getProduct);

export default app;
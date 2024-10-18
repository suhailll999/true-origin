import express from "express";
import { addProduct } from "../controllers/company.controller.js";
import { verifyToken } from "../utils/index.js";

const app = express();

app.post('/add-product', verifyToken, addProduct);

export default app;
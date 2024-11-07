import express from "express";
import { addProduct, deleteProduct, getProduct, getProducts } from "../controllers/company.controller.js";
import { verifyToken } from "../utils/index.js";

const app = express();

app.post('/add-product', verifyToken, addProduct);
app.get('/all-products', verifyToken, getProducts);
app.get('/product/:id?', verifyToken, getProduct);
app.delete('/delete-product/:id?', verifyToken, deleteProduct);

export default app;
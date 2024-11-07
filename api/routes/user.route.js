import express from "express";
import {
  addToCart,
  checkout,
  getCart,
  getMyOrders,
  getProduct,
  getProducts,
} from "../controllers/user.controler.js";
import { verifyToken } from "../utils/index.js";

const router = express();

router.get("/products", getProducts);
router.get("/product/:productId", verifyToken, getProduct);
router.post("/add-to-cart", verifyToken, addToCart);
router.get("/cart", verifyToken, getCart);
router.post("/order", verifyToken, checkout);
router.get("/my-orders", verifyToken, getMyOrders);

export default router;

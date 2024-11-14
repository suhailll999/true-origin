import express from "express";
import {
  addToCart,
  checkout,
  getCart,
  getMyOrders,
  getMyReports,
  getProduct,
  getProducts,
  submitReport,
} from "../controllers/user.controler.js";
import { verifyToken } from "../utils/index.js";

const router = express();

router.get("/products", getProducts);
router.get("/product/:productId", verifyToken, getProduct);
router.post("/add-to-cart", verifyToken, addToCart);
router.get("/cart", verifyToken, getCart);
router.post("/order", verifyToken, checkout);
router.get("/my-orders", verifyToken, getMyOrders);
router.post("/report-product", verifyToken, submitReport);
router.get("/my-reports", verifyToken, getMyReports);

export default router;

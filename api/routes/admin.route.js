import express from "express";
import { verifyToken } from "../utils/index.js";
import { getAllOrders, getAllReports, getOrder, updateOrderStatus } from "../controllers/admin.controler.js";


const router = express();

router.get("/all-orders", verifyToken, getAllOrders); 
router.get("/all-reports", verifyToken, getAllReports); 
router.get("/order/:id?", verifyToken, getOrder); 
router.put("/update-order/:id?", verifyToken, updateOrderStatus);

export default router;

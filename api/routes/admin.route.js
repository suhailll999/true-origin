import express from "express";
import { verifyToken } from "../utils/index.js";
import { getAllCompanies, getAllOrders, getAllReports, getOrder, updateAccountStatus, updateOrderStatus } from "../controllers/admin.controler.js";


const router = express();

router.get("/all-orders", verifyToken, getAllOrders); 
router.get("/all-companies", verifyToken, getAllCompanies); 
router.patch("/update-company-account-status", verifyToken, updateAccountStatus); 
router.get("/all-reports", verifyToken, getAllReports); 
router.get("/order/:id?", verifyToken, getOrder); 
router.put("/update-order/:id?", verifyToken, updateOrderStatus);

export default router;

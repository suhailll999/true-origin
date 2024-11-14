import { isValidObjectId } from "mongoose";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import ProductReport from "../models/productReport.model.js";
import { errorHandler } from "../utils/index.js";

export const getAllOrders = async (req, res, next) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find().sort({createdAt: -1});

    // If no orders are found, return a message
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Send the fetched orders as a response
    res.status(200).json(orders);
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Return a generic error response
    res.status(500).json({
      message: "Error fetching orders. Please try again later.",
    });
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return next(errorHandler(400, id ? "Invalid Order ID" : "Order Id is required"));
    }
    // Fetch order from the database
    const order = await Order.findById(id);

    // If no orders are found, return a message
    if (!order) {
      return next(errorHandler(404, `Order not found with ID ${id}`));
    }

    // Send the fetched orders as a response
    res.status(200).json(order);
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Return a generic error response
    res.status(500).json({
      message: "Error fetching orders. Please try again later.",
    });
  }
};


export const updateOrderStatus = async(req, res, next) => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;

    if (!id || !isValidObjectId(id)) {
      return next(errorHandler(400, id ? "Invalid Order ID" : "Order Id is required"));
    }
    
    // Fetch and update the order in one query
    const order = await Order.findByIdAndUpdate(
      id,
      { deliveryStatus },
      { new: true }
    );

    // If no orders are found, return a message
    if (!order) {
      return next(errorHandler(404, "Order not found"));
    } 

    res.status(200).json({success: true, message: "Order Status Updated!"});

  } catch (error) {
    console.log(error);
    next(errorHandler(500, error.message));
  }
}


export const getAllReports = async (req, res, next) => {
  try {
    // Fetch all orders from the database
    const reports = await ProductReport.find().populate("userId", "name").sort({createdAt: -1});

    // If no orders are found, return a message
    if (reports.length === 0) {
      return res.status(404).json({ message: "No Reports Found" });
    }

    // Send the fetched orders as a response
    res.status(200).json({success: true, reports});
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Return a generic error response
    res.status(500).json({
      message: "Error fetching orders. Please try again later.",
    });
  }
}


export const getAllCompanies = async (req, res, next) => {
  try {
    // Fetch all orders from the database
    const companies = await User.find({role: "company"}).select("-password").sort({createdAt: -1});

    // If no orders are found, return a message
    if (companies.length === 0) {
      return res.status(404).json({ message: "No companies found" });
    }

    // Send the fetched orders as a response
    res.status(200).json(companies);
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Return a generic error response
    res.status(500).json({
      message: "Error fetching orders. Please try again later.",
    });
  }
};

export const updateAccountStatus = async (req, res, next) => {
  try {
    const {companyId, status} = req.query;
    
    if(!companyId || !status){
      return next(errorHandler(400, "Company ID and Status is required!"));
    }

    if(!["pending", "approved", "rejected"].includes(status)){
      return next(errorHandler(400, "Status must be pending, approved or rejected!"));
    }

    const updatedCompany = await User.findByIdAndUpdate(companyId, {accountStatus: status});

    if(!updatedCompany){
      return next(errorHandler(404, "Company is not found, May be deleted."));
    }

    res.status(200).json({success: true, message: `Company Account Status Updated to ${status}`});

  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Return a generic error response
    res.status(500).json({
      message: "Error fetching orders. Please try again later.",
    });
  }
};
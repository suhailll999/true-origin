import mongoose from "mongoose";
import { errorHandler } from "../utils/index.js";
import Product from "../models/product.model.js";

export const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return next(errorHandler(400, "Product Id is required"));
    }
    if (!mongoose.isValidObjectId(productId)) {
      return next(errorHandler(400, "Invalid Product Id"));
    }
    const product = await Product.findById(productId);
    if (!product) {
      return next(errorHandler(400, "Product not found"));
    }
    res.status(200).json(product);
  } catch (e) {
    return next(errorHandler(500, e.message));
  }
};

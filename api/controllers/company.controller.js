import Product from "../models/product.model.js";
import { errorHandler } from "../utils/index.js";

export const addProduct = async (req, res, next) => {
  try {
    const {
      productName,
      manufacturer,
      distributer,
      manufacturingDate,
      expiryDate,
      description
    } = req.body;
    if (!productName || !manufacturer || !distributer || !manufacturingDate || !description) {
      return next(errorHandler(400, "All feilds are required!"));
    }
    const newProduct = new Product({
      productName,
      manufacturer,
      distributer,
      manufacturingDate,
      expiryDate,
      description
    });
    await newProduct.save();
    return res.status(200).json("Product Saved");
  } catch (e) {
    next(errorHandler(500, e.message));
  }
};
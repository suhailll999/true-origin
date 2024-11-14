import { isValidObjectId } from "mongoose";
import Product from "../models/product.model.js";
import { errorHandler } from "../utils/index.js";

export const addProduct = async (req, res, next) => {
  console.log(req.body);
  try {
    const {
      productName,
      manufacturer,
      distributer,
      price,
      manufacturingDate,
      expiringDate,
      description,
    } = req.body;
    if (
      !productName ||
      !manufacturer ||
      !price ||
      !distributer ||
      !manufacturingDate ||
      !description
    ) {
      return next(errorHandler(400, "All feilds are required!"));
    }
    const newProduct = new Product({
      productName,
      manufacturer,
      distributer,
      price,
      manufacturingDate,
      expiringDate,
      description,
    });
    await newProduct.save();
    return res.status(200).json({message: "New Product Added Successfully", newProduct});
  } catch (e) {
    next(errorHandler(500, e.message));
  }
};

export const getProducts = async (req, res, next) => {
  try {
    // Check if the user has permission to access the products
    if (!["admin", "company"].includes(req.user?.role)) {
      return next(
        errorHandler(403, "You do not have permission to access this API.")
      );
    }

    // Get the manufacturer id from the query, or use the user's id if not provided
    const { id } = req.query;

    // Query the database to get products by manufacturer id or user id
    const products = await Product.find({ manufacturer: id || req.user.id }).populate("manufacturer", "name");

    // If no products are found, send an empty array or custom message
    if (products.length === 0) {
      return res.status(200).json({ message: "No products found." });
    }

    // Send the products in the response
    res.status(200).json(products);
  } catch (error) {
    // Send a detailed error response
    next(errorHandler(500, error.message));
  }
};


export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if ID is provided and valid
    if (!id || !isValidObjectId(id)) {
      return next(
        errorHandler(400, id ? "Invalid Product ID" : "Product ID is required.")
      );
    }

    // Find the product by its ID
    const product = await Product.findById(id).populate("manufacturer", "name");;

    // If no product is found, return an error
    if (!product) {
      return next(errorHandler(404, "Product not found, maybe deleted."));
    }

    // Send the product details in the response
    res.status(200).json(product);
  } catch (error) {
    // Send a detailed error response
    next(errorHandler(500, error.message));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the user has permission to access the products
    if (!["admin", "company"].includes(req.user?.role)) {
      return next(
        errorHandler(403, "You do not have permission to access this API.")
      );
    }

    // Check if ID is provided and valid
    if (!id || !isValidObjectId(id)) {
      return next(
        errorHandler(400, id ? "Invalid Product ID" : "Product ID is required.")
      );
    }

    // Find the product by its ID
    const product = await Product.findByIdAndDelete(id);

    // If no product is found, return an error
    if (!product) {
      return next(errorHandler(404, "Product not found, maybe deleted."));
    }

    // Send the product details in the response
    res.status(200).json("Product Deleted Successfully");
  } catch (error) {
    // Send a detailed error response
    next(errorHandler(500, error.message));
  }
};


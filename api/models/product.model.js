import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    distributer: {
      type: String,
      required: true,
    },
    manufacturingDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", ProductSchema);

export default Product;

import mongoose, { isValidObjectId } from "mongoose";
import { errorHandler } from "../utils/index.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Productreport from "../models/productReport.model.js";
import Stripe from "stripe"

const stripe = new Stripe("sk_test_51QLHAuSJkaLKYIXLaNFVvkPc42nlw4Gl9fnFzLlOkaotV87fbfMTiZlkyfRSVCufNxGMTcvYWcrul3i2uU4OgJ8n00JOYWp9Bz");

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
      return next(errorHandler(404, "Product not found"));
    }
    res
      .status(200)
      .json({ success: true, message: "Product Is Authentic", product });
  } catch (e) {
    return next(errorHandler(500, e.message));
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    if (!products) {
      return next(errorHandler(400, "No Products Found"));
    }
    res.status(200).json(products);
  } catch (e) {
    return next(errorHandler(500, e.message));
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body; // Extracting productId and quantity from the request body

    // Ensure productId and quantity are provided
    if (!productId || !quantity) {
      return next(errorHandler(400, "Product ID and quantity are required."));
    }

    // Validate that the quantity is a positive integer
    if (quantity <= 0) {
      return next(errorHandler(400, "Quantity must be a positive integer."));
    }

    // Check if the product exists in the database
    const product = await Product.findById(productId);
    if (!product) {
      return next(errorHandler(404, "Product not found."));
    }

    const userId = req.user.id;

    // Find or create a cart for the user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({
        user: userId,
        products: [],
        totalPrice: 0,
      });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // If the product is already in the cart, update the quantity
      cart.products[existingProductIndex].quantity += Number(quantity);
    } else {
      // Otherwise, add the new product to the cart
      cart.products.unshift({
        product: productId,
        quantity: quantity,
        price: product.price, // Store the product's price at the time of adding
      });
    }

    // Save the cart to the database
    await cart.save();

    // Return the updated cart
    res
      .status(200)
      .json({ message: "Product added to cart successfully!", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return next(errorHandler(500, "Failed to add product to cart."));
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.query.id || req.user.id;

    // Find the cart and populate the product details within each product entry
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product", // Populate the 'product' field in each item in 'products' array
      model: "Product", // Specify the model to use for population
      select: "image productName",
    });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found for the specified user" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the cart" });
  }
};

export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phoneNumber, pincode, address } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    // Prepare the products array for the order
    const products = cart.products.map((item) => ({
      product: item.product._id, // Reference to the product
      quantity: item.quantity,
      price: item.price,
    }));

    // Calculate the total amount
    const totalAmount = cart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create a description for the payment intent
    const description = products
      .map(
        (item) =>
          `${item.product.name} (x${item.quantity}) - ₹${item.price * item.quantity}`
      )
      .join(", ");

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert to cents
      currency: "INR", // Change currency as per your needs
      description, // Add a meaningful description for export compliance
      metadata: { userId, cartId: cart._id.toString() },
    });

    // Create a new order with the cart's details and copied products
    const newOrder = new Order({
      products, // Adding products from the cart to the order
      userId,
      name,
      phoneNumber,
      pincode,
      address,
      deliveryStatus: "not dispatched",
      paymentStatus: "unpaid", // Initially unpaid
      paymentIntentId: paymentIntent.id, // Save the PaymentIntent ID
    });

    // Save the new order
    await newOrder.save();

    // Clear the cart after successful checkout
    await Cart.findByIdAndUpdate(cart._id, { products: [], totalPrice: 0 });

    res.status(201).json({
      message: "Order placed successfully. Proceed to payment.",
      orderId: newOrder._id,
      clientSecret: paymentIntent.client_secret, // Send the clientSecret to the frontend for payment
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "An error occurred during checkout" });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `user` is attached to `req` after authentication

    // Find all orders for the user and populate the products details
    const orders = await Order.find({ userId })
      .populate({
        path: "products.product", // Populate each product within the order's products array
        model: "Product", // Reference to the Product model
        select: "productName image price", // Only select necessary fields from Product
      })
      .sort({ createdAt: -1 }); // Sort orders by most recent

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching orders" });
  }
};

export const submitReport = async (req, res, next) => {
  try {
    const { productName, productDescription, productId, userId } = req.body;

    if (!productName || !userId || !productDescription || !productId) {
      return next(errorHandler(400, "All fields are required!"));
    }

    Productreport.create({
      productId,
      userId,
      productName,
      productDescription,
    });

    res
      .status(200)
      .json({ success: true, message: "Your report has been submitted." });
  } catch (error) {
    console.log(error);
    next(errorHandler(error.status, error.message));
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if(userId && !isValidObjectId(userId)) {
      return next(errorHandler(400, "User ID is invalid."));
    }

    const reports = await Productreport.find({ userId: userId || req.user.id }).sort({createdAt: -1});

    if (!reports) {
      return next(errorHandler(400, "No reports found"));
    }

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.log(error);
    next(errorHandler(error.status, error.message));
  }
};


export const createPaymentIntent = async (req, res) => {
  try {
    // Get the items and amount from the request body
    const cart = await Cart.findOne({user: req.user.id});

    const totalAmount  = cart.totalPrice;

    console.log(totalAmount);

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount, // Amount in cents
      currency: "usd", // Change this to the currency you want
      payment_method_types: ["card",], // Support card payments
    });

    // Return the clientSecret to the client
    res.send({
      clientSecret: paymentIntent.client_secret,
      // Optional: Add additional debug information for testing
      dpmCheckerLink: `https://dashboard.stripe.com/test/payments/${paymentIntent.id}`,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
}
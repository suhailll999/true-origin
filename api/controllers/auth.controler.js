import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cart from "../models/cart.model.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = req.query.role;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // Validate role
    const validRoles = ["company", "consumer"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role! Allowed roles: company, consumer",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Hash password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    if (role === 'consumer') {
      await Cart.create({
        user: newUser._id,
        products: [],
        totalPrice: 0,
      });
    }

    return res.status(201).json({
      success: true,
      message: "New user created successfully!",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error during user sign-up:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};


export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Validate password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password!" });
    }

    // Destructure user data and exclude password
    const { password: _, ...userData } = user._doc;
    const { _id: id, role } = userData;

    // Generate JWT token
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET);

    // Set cookie and return response
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: "Sign In Success",
        user: userData,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("access_token"); // Clears the "access_token" cookie set in the signIn function
    return res.status(200).json({ message: "Sign Out Success" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

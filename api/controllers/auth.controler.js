import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All feilds are required!" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist!" });
    }

    const hanshedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      email,
      name,
      password: hanshedPassword,
    });

    await newUser.save();
    return res.json({ success: true, message: "New user created!", newUser });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
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
    const { password: _, isAdmin = false, _id } = user._doc;

    // Generate JWT token
    const token = jwt.sign({ id: _id, isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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
        user: { ...user._doc },
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

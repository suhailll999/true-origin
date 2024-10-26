import User from '../models/user.model.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import Company from '../models/company.model.js';

export const userSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All feilds are required!" });
        }

        const existingCompany = await User.findOne({ email });

        if (existingCompany) {
            return res.status(400).json({ success: false, message: "User already exist!" });
        }

        const hanshedPassword = bcrypt.hashSync(password, 10);

        const newCompany = new User({
            email,
            name,
            password: hanshedPassword
        });

        await newCompany.save();
        return res.json({ success: true, message: "New user created!", newCompany });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}


export const userSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All feilds are required!" });
        }

        const existinguser = await User.findOne({ email });

        if (!existinguser) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const isCorrect = bcrypt.compareSync(password, existinguser.password);

        if (isCorrect) {
            const { password: pass, ...rest } = existinguser._doc;
            const token = jwt.sign({ id: existinguser._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).cookie("access_token", token).json({success: true, message: "Sign In Success", user: rest });
        } else {
            return res.status(400).json({ success: false, message: "Invalid email or password!" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}


export const companySignUp = async (req, res) => {
    try {
        const { companyName, companyEmail, password } = req.body;
        if (!companyName || !companyEmail || !password) {
            return res.status(400).json({ success: false, message: "All feilds are required!" });
        }

        const existingCompany = await Company.findOne({ companyEmail });

        if (existingCompany) {
            return res.status(400).json({ success: false, message: "Company account already exist!" });
        }

        const hanshedPassword = bcrypt.hashSync(password, 10);

        const newCompany = new Company({
            companyName,
            companyEmail,
            password: hanshedPassword
        });

        await newCompany.save();
        return res.json({ success: true, message: "New company account created!", newCompany });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}

export const companySignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All feilds are required!" });
        }

        const existingCompany = await Company.findOne({ companyEmail: email });

        if (!existingCompany) {
            return res.status(404).json({ success: false, message: "Company account not found!" });
        }

        const isCorrect = bcrypt.compareSync(password, existingCompany.password);

        if (isCorrect) {
            const { password: pass, companyName: name, companyEmail: email } = existingCompany._doc;
            const token = jwt.sign({ id: existingCompany._id, role: "company" }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).cookie("access_token", token).json({ success: true, message: "Sign In Success", user: {name, email} });
        } else {
            return res.status(400).json({ success: false, message: "Invalid email or password!" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}


export const signOut = async (req, res) => {
    try {
        res.clearCookie("access_token"); // Clears the "access_token" cookie set in the signIn function
        return res.status(200).json({ message: "Sign Out Success" });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}
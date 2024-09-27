import express from 'express';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

mongoose.connect('mongodb+srv://ansa:1234@trueorigin.1aitw.mongodb.net/?retryWrites=true&w=majority&appName=trueorigin').then(() => {
    console.log('MongoDB Connected!');

})

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
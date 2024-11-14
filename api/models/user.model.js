import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["company", "consumer"],
    required: true,
  },
  accountStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

// Pre-save hook to apply `accountStatus` only if role is `company`
userSchema.pre("save", function (next) {
  if (this.role !== "company") {
    this.accountStatus = undefined; // Remove `accountStatus` if role is not `company`
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;

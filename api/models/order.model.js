import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Referencing the product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User", // Referencing the user model
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    pincode: {
      type: String,
      required: true,
      match: /^[0-9]{6}$/,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["not dispatched", "in transit", "out for delivery", "delivered"],
      default: "not dispatched",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentIntentId: {
      type: String
    }
  },
  { timestamps: true }
);

// Pre-validate hook to automatically calculate the total price
OrderSchema.pre("validate", function (next) {
  this.totalPrice = this.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;

import mongoose from 'mongoose';

// Define the schema for a cart
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the user who owns this cart
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Referencing the product in the cart
        required: true,
      },
      quantity: {
        type: Number,
        default: 1, // Default quantity for each product
        required: true,
      },
      price: {
        type: Number,
        required: true, // The price at the time the product was added to the cart
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  }
}, { timestamps: true });

// Pre-validate hook to automatically calculate the total price
cartSchema.pre('validate', function (next) {
  this.totalPrice = this.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

// Create the model
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

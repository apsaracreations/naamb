import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      }
    ],

    shippingDetails: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pinCode: String,
    },

    subtotal: Number,
    shippingCost: Number,
    totalAmount: Number,

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

// Change ONLY these fields in your schema
status: {
  type: String,
  enum: ["pending", "paid", "failed"], // Only payment related
  default: "pending",
},

shippingStatus: {
  type: String,
  enum: ["Pending", "Packed", "Shipped", "Delivered"],
  default: "Pending",
},

    trackingId: {
      type: String,
      default: null,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

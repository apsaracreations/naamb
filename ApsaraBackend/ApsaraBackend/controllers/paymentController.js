import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const createOrder = async (req, res) => {
  try {
    const { userId, shippingDetails, products, subtotal, shippingCost, totalAmount } = req.body;

    if (!userId || !products || products.length === 0) {
      return res.status(400).json({ error: "Missing required order fields." });
    }

    // Init Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    // Razorpay order options
    const options = {
      amount: totalAmount * 100, // Convert ₹ → paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };

    const rpOrder = await razorpay.orders.create(options);

    // Save order temp in DB (pending)
    const order = await Order.create({
      user: userId,
      products,
      shippingDetails,
      subtotal,
      shippingCost,
      totalAmount,
      razorpayOrderId: rpOrder.id,
      status: "pending",
    });

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      orderId: order._id,
    });
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const sign = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpaySignature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // 🔍 1️⃣ Get the order from DB
    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 🏪 2️⃣ Update stock for each product ordered
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } }, // decrease stock
        { new: true }
      );
    }

    // 🗑️ 3️⃣ Delete the user's cart
    await Cart.findOneAndDelete({ user: order.user });

    // 🔄 4️⃣ Update order as paid
    await Order.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: "paid",
      }
    );

    res.json({ success: true, message: "Payment verified, stock updated, and cart cleared" });

  } catch (err) {
    console.log("Payment verify Error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};



export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "paid" }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch paid orders" });
  }
};



export const updateOrderShipping = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status: newShippingStatus, trackingId } = req.body; // 'status' from frontend maps to shippingStatus

    const updateFields = { 
      shippingStatus: newShippingStatus, 
      trackingId 
    };

    const lowerStatus = newShippingStatus.toLowerCase();
    if (lowerStatus === "shipped") updateFields.shippedAt = new Date();
    if (lowerStatus === "delivered") updateFields.deliveredAt = new Date();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true }
    );

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to update shipping" });
  }
};


export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (err) {
    console.error("Get User Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};


import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const SHIPPING_STATUSES = ["Pending", "Packed", "Shipped", "Delivered"];

export const createOrder = async (req, res) => {
  try {
    const { shippingDetails = {}, products } = req.body;
    const userId = req.user.id; // from token, never trust the body

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Missing required order fields." });
    }

    // Merge duplicate lines, then price everything from the database
    const qtyById = {};
    for (const item of products) {
      const qty = Math.floor(Number(item.quantity));
      if (!item.productId || !(qty > 0)) return res.status(400).json({ error: "Invalid product in order." });
      qtyById[item.productId] = (qtyById[item.productId] || 0) + qty;
    }

    const dbProducts = await Product.find({ _id: { $in: Object.keys(qtyById) } });
    if (dbProducts.length !== Object.keys(qtyById).length) {
      return res.status(400).json({ error: "Some products are no longer available." });
    }

    const orderProducts = [];
    for (const p of dbProducts) {
      const quantity = qtyById[p._id.toString()];
      if (quantity > p.quantity) {
        return res.status(400).json({ error: `Only ${p.quantity} left in stock for "${p.name}".` });
      }
      orderProducts.push({ productId: p._id, name: p.name, price: p.price, quantity, image: p.images?.[0] || "" });
    }

    const subtotal = orderProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const shippingCost = 0;
    const totalAmount = subtotal + shippingCost;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const rpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // ₹ → paise, must be an integer
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    const order = await Order.create({
      user: userId,
      products: orderProducts,
      shippingDetails: {
        fullName: shippingDetails.fullName,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
        address: shippingDetails.addressLine1 || shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        pinCode: shippingDetails.zipCode || shippingDetails.pinCode,
      },
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
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (razorpaySignature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Atomically flip pending → paid so a retried/duplicate call can't reduce stock twice
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId, status: { $ne: "paid" } },
      { razorpayPaymentId, razorpaySignature, status: "paid" },
      { new: true }
    );

    if (!order) {
      const existing = await Order.findOne({ razorpayOrderId });
      if (!existing) return res.status(404).json({ success: false, message: "Order not found" });
      return res.json({ success: true, message: "Payment already verified" });
    }

    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } });
    }
    await Cart.findOneAndDelete({ user: order.user });

    res.json({ success: true, message: "Payment verified, stock updated, and cart cleared" });
  } catch (err) {
    console.log("Payment verify Error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "paid" }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch paid orders" });
  }
};

export const updateOrderShipping = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingId } = req.body; // 'status' from frontend maps to shippingStatus

    const updateFields = {};
    if (trackingId !== undefined) updateFields.trackingId = trackingId || null;
    if (status !== undefined) {
      if (!SHIPPING_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Status must be one of: ${SHIPPING_STATUSES.join(", ")}` });
      }
      updateFields.shippingStatus = status;
      if (status === "Shipped") updateFields.shippedAt = new Date();
      if (status === "Delivered") updateFields.deliveredAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: updateFields }, { new: true });
    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Update Shipping Error:", error);
    res.status(500).json({ error: "Failed to update shipping" });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error("Get User Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

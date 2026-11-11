import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Atomically flips an order pending → paid, then reduces stock and clears the cart.
// Safe to call many times (browser verify + webhook): stock only drops once.
// Returns "paid" | "already_paid" | "not_found".
export const markOrderPaid = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const update = { razorpayPaymentId, status: "paid" };
  if (razorpaySignature) update.razorpaySignature = razorpaySignature;

  const order = await Order.findOneAndUpdate(
    { razorpayOrderId, status: { $ne: "paid" } },
    update,
    { new: true }
  );

  if (!order) {
    const existing = await Order.exists({ razorpayOrderId });
    return existing ? "already_paid" : "not_found";
  }

  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } });
  }
  await Cart.findOneAndDelete({ user: order.user });
  return "paid";
};

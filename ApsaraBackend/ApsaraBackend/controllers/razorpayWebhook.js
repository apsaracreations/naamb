import crypto from "crypto";
import { markOrderPaid } from "../services/orderPayment.js";

// POST /api/payment/webhook  (Razorpay dashboard → Webhooks, events: payment.captured, order.paid)
// Backup for when a customer pays but closes the tab before the browser confirms.
// Only active when RAZORPAY_WEBHOOK_SECRET is set. Needs the raw request body.
export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return res.status(404).json({ error: "Not found" });

  try {
    const signature = req.headers["x-razorpay-signature"];
    const expected = crypto.createHmac("sha256", secret).update(req.body).digest("hex");
    const valid =
      typeof signature === "string" &&
      signature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!valid) return res.status(400).json({ error: "Invalid signature" });

    const event = JSON.parse(req.body.toString("utf8"));
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) await markOrderPaid(payment.order_id, payment.id);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Razorpay webhook error:", err);
    res.status(500).json({ error: "Webhook failed" });
  }
};

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ── Init Razorpay instance ────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Auth middleware (reused from index.js) ────────────────────────────────────
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

/**
 * @route  POST /api/payment/create-order
 * @desc   Creates a Razorpay order and returns the order object to frontend.
 * @access Protected (requires JWT)
 *
 * Body:
 *   amount      {number}  — Amount in INR (not paise). Backend converts to paise.
 *   currency    {string}  — "INR" (default)
 *   description {string}  — Human-readable label e.g. "OMMA Pro Plan"
 */
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { amount, currency = "INR", description } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount." });
    }

    // Razorpay requires amount in smallest unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        description,
        userEmail: req.user.email,
      },
    };

    const order = await razorpay.orders.create(options);

    console.log(`[Razorpay] Order created: ${order.id} | ₹${amount} | ${req.user.email}`);

    return res.status(200).json({
      success: true,
      order,           // { id, amount, currency, receipt, ... }
    });

  } catch (error) {
    console.error("[Razorpay] create-order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order.",
      details: error.message,
    });
  }
});

/**
 * @route  POST /api/payment/verify-payment
 * @desc   Verifies Razorpay payment signature using HMAC-SHA256.
 * @access Protected (requires JWT)
 *
 * Body:
 *   razorpay_order_id   {string}
 *   razorpay_payment_id {string}
 *   razorpay_signature  {string}
 *   description         {string}  — for logging / DB storage
 */
router.post("/verify-payment", verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      description,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification fields." });
    }

    // ── Signature verification ──────────────────────────────────────────────
    // Razorpay signature = HMAC-SHA256 of "order_id|payment_id" using key_secret
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.warn(`[Razorpay] Signature mismatch for order: ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature.",
      });
    }

    // ── Signature valid ─────────────────────────────────────────────────────
    console.log(`[Razorpay] Payment verified: ${razorpay_payment_id} | ${req.user.email} | ${description}`);

    // TODO: Update user's plan/credits in your database here
    // Example:
    // await User.findOneAndUpdate(
    //   { email: req.user.email },
    //   { $set: { plan: "pro" } }   // or increment credits
    // );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      description,
    });

  } catch (error) {
    console.error("[Razorpay] verify-payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification error.",
      details: error.message,
    });
  }
});

module.exports = router;
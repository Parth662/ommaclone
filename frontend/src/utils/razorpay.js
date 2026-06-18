import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

/**
 * Dynamically loads the Razorpay checkout script.
 * Returns true if loaded successfully, false otherwise.
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Main payment handler.
 *
 * @param {Object} options
 * @param {number}   options.amount       - Amount in USD (e.g. 39 for $39)
 * @param {string}   options.currency     - "INR" | "USD" (Razorpay test supports INR best)
 * @param {string}   options.description  - Plan or credit pack label shown in popup
 * @param {string}   options.userEmail    - Pre-fills customer email in checkout
 * @param {Function} options.onSuccess    - Called with payment details on success
 * @param {Function} options.onFailure    - Called with error message on failure
 * @param {Function} options.onLoading    - Called with boolean to control loading state
 */
export const initiatePayment = async ({
  amount,
  currency = "INR",
  description,
  userEmail = "",
  onSuccess,
  onFailure,
  onLoading,
}) => {
  try {
    onLoading?.(true);

    // 1. Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onFailure?.("Failed to load payment gateway. Please check your connection.");
      onLoading?.(false);
      return;
    }

    // 2. Create order on backend
    const token = localStorage.getItem("token");
    const { data } = await axios.post(
      `${BACKEND_URL}/api/payment/create-order`,
      { amount, currency, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!data.success) {
      onFailure?.(data.message || "Could not create payment order.");
      onLoading?.(false);
      return;
    }

    onLoading?.(false);

    // 3. Open Razorpay checkout popup
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: data.order.amount,           // in paise (backend sends this)
      currency: data.order.currency,
      name: "OMMA",
      description,
      order_id: data.order.id,
      prefill: {
        email: userEmail,
      },
      theme: {
        color: "#7b6ef6",
      },
      modal: {
        ondismiss: () => {
          onFailure?.("Payment cancelled.");
        },
      },
      handler: async (response) => {
        // 4. Verify payment on backend
        try {
          onLoading?.(true);
          const verifyRes = await axios.post(
            `${BACKEND_URL}/api/payment/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              description,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            onSuccess?.(verifyRes.data);
          } else {
            onFailure?.("Payment verification failed. Contact support.");
          }
        } catch (err) {
          onFailure?.("Payment verification error. Contact support.");
        } finally {
          onLoading?.(false);
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", (response) => {
      onFailure?.(response.error?.description || "Payment failed.");
    });

    rzp.open();
  } catch (err) {
    onLoading?.(false);
    if (err.response?.status === 401) {
      onFailure?.("Session expired. Please log in again.");
    } else {
      onFailure?.(err.message || "Something went wrong. Please try again.");
    }
  }
};

/**
 * Converts USD display price string (e.g. "$39") to INR paise for Razorpay.
 * Uses a fixed exchange rate — replace with live rate if needed.
 * Razorpay amount is always in smallest currency unit (paise for INR).
 */
export const usdToInrPaise = (usdString) => {
  const usd = parseFloat(usdString.replace("$", ""));
  const inr = Math.round(usd * 84); // 1 USD ≈ 84 INR (update as needed)
  return inr; // backend multiplies by 100 to get paise
};
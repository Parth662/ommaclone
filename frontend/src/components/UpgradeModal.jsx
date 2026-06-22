import React, { useState } from "react";
import { initiatePayment, usdToInrPaise } from "../utils/razorpay";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Get started with the basics",
    badge: "CURRENT",
    badgeStyle: "badge-current",
    features: [
      "50 credits / month",
      "Code generation",
      "Community access",
      "Basic 3D models",
    ],
    btnLabel: "Current Plan",
    btnStyle: "btn-current",
    highlight: false,
    payable: false,
  },
  {
    name: "Pro",
    price: "$39",
    period: "/mo",
    desc: "For professionals and creators",
    badge: "POPULAR",
    badgeStyle: "badge-popular",
    features: [
      "2,000 credits / month",
      "Everything in Free",
      "Image generation",
      "3D model generation",
      "Custom domains",
      "On-demand credit top-ups",
    ],
    btnLabel: "Upgrade to Pro",
    btnStyle: "btn-pro",
    highlight: true,
    payable: true,
  },
  {
    name: "Max",
    price: "$129",
    period: "/seat/mo",
    desc: "For teams building together",
    badge: null,
    badgeStyle: "",
    features: [
      "7,000 credits / seat / month",
      "Everything in Pro",
      "On-demand credit top-ups",
      "Team collaboration",
    ],
    btnLabel: "Upgrade to Max",
    btnStyle: "btn-max",
    highlight: false,
    payable: true,
  },
];

const CREDIT_PACKS = [
  { credits: "500", price: "$5", desc: "Best for occasional use" },
  { credits: "2,000", price: "$15", desc: "Most popular", popular: true },
  { credits: "5,000", price: "$35", desc: "Best value" },
];

export default function UpgradeModal({ onClose, userEmail = "", onUpgradeSuccess }) {
  const [activeTab, setActiveTab] = useState("subscription");
  const [loadingKey, setLoadingKey] = useState(null);  // tracks which button is loading
  const [toast, setToast] = useState(null);            // { type: "success"|"error", msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePlanPayment = (plan) => {
    if (!plan.payable) return;

    initiatePayment({
      amount: usdToInrPaise(plan.price),
      currency: "INR",
      description: `OMMA ${plan.name} Plan`,
      userEmail,
      onLoading: (val) => setLoadingKey(val ? plan.name : null),
      onSuccess: (data) => {
        showToast("success", `🎉 ${plan.name} Plan activated! Payment ID: ${data.paymentId}`);
        onUpgradeSuccess?.({ plan: plan.name, ...data });
        setTimeout(() => onClose(), 2500);
      },
      onFailure: (msg) => {
        if (msg !== "Payment cancelled.") {
          showToast("error", `❌ ${msg}`);
        }
      },
    });
  };

  const handleCreditPayment = (pack) => {
    initiatePayment({
      amount: usdToInrPaise(pack.price),
      currency: "INR",
      description: `OMMA ${pack.credits} Credits`,
      userEmail,
      onLoading: (val) => setLoadingKey(val ? `credits-${pack.credits}` : null),
      onSuccess: (data) => {
        showToast("success", `⚡ ${pack.credits} credits added! Payment ID: ${data.paymentId}`);
        onUpgradeSuccess?.({ credits: pack.credits, ...data });
        setTimeout(() => onClose(), 2500);
      },
      onFailure: (msg) => {
        if (msg !== "Payment cancelled.") {
          showToast("error", `❌ ${msg}`);
        }
      },
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="upgrade-modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Toast notification */}
        {toast && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 999,
              background: toast.type === "success"
                ? "rgba(62, 207, 142, 0.15)"
                : "rgba(240, 106, 106, 0.15)",
              border: `1px solid ${toast.type === "success" ? "rgba(62,207,142,0.4)" : "rgba(240,106,106,0.4)"}`,
              color: toast.type === "success" ? "#3ecf8e" : "#f06a6a",
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "var(--font-body)",
              whiteSpace: "nowrap",
              backdropFilter: "blur(8px)",
            }}
          >
            {toast.msg}
          </div>
        )}

        <div className="upgrade-modal-header">
          <div>
            <div className="upgrade-modal-title">Upgrade Account</div>
            <div className="upgrade-modal-sub">
              Unlock advanced features, higher limits, and infinite creative possibilities.
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="upgrade-tabs">
          <button
            className={`upgrade-tab${activeTab === "subscription" ? " active" : ""}`}
            onClick={() => setActiveTab("subscription")}
          >
            Subscription Plans
          </button>
          <button
            className={`upgrade-tab${activeTab === "credits" ? " active" : ""}`}
            onClick={() => setActiveTab("credits")}
          >
            Buy Credits
          </button>
        </div>
        <div className="upgrade-tab-divider"></div>

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="upgrade-plans">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`upgrade-plan-card${plan.highlight ? " highlighted" : ""}`}
              >
                {plan.badge && (
                  <div className={`plan-badge ${plan.badgeStyle}`}>
                    {plan.badge}
                  </div>
                )}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  <span className="plan-price-num">{plan.price}</span>
                  <span className="plan-price-period">{plan.period}</span>
                </div>
                <div className="plan-desc">{plan.desc}</div>

                <div className="plan-features">
                  {plan.features.map((f) => (
                    <div key={f} className="plan-feature">
                      <span className="plan-check">✓</span>
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  className={`plan-btn ${plan.btnStyle}`}
                  onClick={() => handlePlanPayment(plan)}
                  disabled={!plan.payable || loadingKey === plan.name}
                  style={{
                    opacity: loadingKey === plan.name ? 0.7 : 1,
                    cursor: !plan.payable ? "default" : loadingKey === plan.name ? "wait" : "pointer",
                  }}
                >
                  {loadingKey === plan.name ? "Processing..." : plan.btnLabel}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Buy Credits Tab */}
        {activeTab === "credits" && (
          <div className="upgrade-credits">
            <p className="credits-tab-desc">
              Top up your credits anytime. Credits never expire.
            </p>
            <div className="credit-packs">
              {CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.credits}
                  className={`credit-pack${pack.popular ? " popular" : ""}`}
                >
                  {pack.popular && (
                    <div className="plan-badge badge-popular">POPULAR</div>
                  )}
                  <div className="credit-pack-credits">{pack.credits} credits</div>
                  <div className="credit-pack-price">{pack.price}</div>
                  <div className="credit-pack-desc">{pack.desc}</div>
                  <button
                    className="plan-btn btn-pro"
                    style={{
                      marginTop: 16,
                      opacity: loadingKey === `credits-${pack.credits}` ? 0.7 : 1,
                      cursor: loadingKey === `credits-${pack.credits}` ? "wait" : "pointer",
                      width: "100%",
                    }}
                    onClick={() => handleCreditPayment(pack)}
                    disabled={loadingKey === `credits-${pack.credits}`}
                  >
                    {loadingKey === `credits-${pack.credits}` ? "Processing..." : "Buy Now"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
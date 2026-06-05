import React, { useState } from "react";

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
  },
];

const CREDIT_PACKS = [
  { credits: "500", price: "$5", desc: "Best for occasional use" },
  { credits: "2,000", price: "$15", desc: "Most popular", popular: true },
  { credits: "5,000", price: "$35", desc: "Best value" },
];

export default function UpgradeModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("subscription");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="upgrade-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="upgrade-modal-header">
          <div>
            <div className="upgrade-modal-title">Upgrade your plan</div>
            <div className="upgrade-modal-sub">0 credits remaining</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="upgrade-tabs">
          <button
            className={`upgrade-tab${activeTab === "subscription" ? " active" : ""}`}
            onClick={() => setActiveTab("subscription")}
          >
            ✦ Subscription Plans
          </button>
          <button
            className={`upgrade-tab${activeTab === "credits" ? " active" : ""}`}
            onClick={() => setActiveTab("credits")}
          >
            ⚡ Buy Credits
          </button>
        </div>

        <div className="upgrade-tab-divider" />

        {/* Subscription Plans Tab */}
        {activeTab === "subscription" && (
          <div className="upgrade-plans">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`upgrade-plan-card${plan.highlight ? " highlighted" : ""}`}
              >
                {/* Badge */}
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

                <button className={`plan-btn ${plan.btnStyle}`}>
                  {plan.btnLabel}
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
                  <button className="plan-btn btn-pro" style={{ marginTop: 16 }}>
                    Buy Now
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
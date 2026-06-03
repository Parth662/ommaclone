import React from "react";
import ComponentCard from "../components/ComponentCard.jsx";
import { COMP_DATA } from "../data/data.js";

export default function Components({ onOpenChat }) {
  return (
    <div className="content">
      <h2 className="page-section-title">Components</h2>
      <p className="page-section-sub">
        Reusable building blocks for your projects
      </p>
      <div className="components-grid">
        {COMP_DATA.map((comp) => (
          <ComponentCard
            key={comp.name}
            comp={comp}
            onClick={() => onOpenChat("new", `Build a ${comp.name.toLowerCase()} component`)}
          />
        ))}
      </div>
    </div>
  );
}
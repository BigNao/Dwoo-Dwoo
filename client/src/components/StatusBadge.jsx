import React from "react";
import { STATUS_COLORS, STATUS_LABELS } from "../utils/constants";

export default function StatusBadge({ status }) {
  const colorClasses = STATUS_COLORS[status] || "text-gray-600 bg-gray-100";
  const label = STATUS_LABELS[status] || status;

  return <span className={`sign-badge ${colorClasses}`}>{label}</span>;
}

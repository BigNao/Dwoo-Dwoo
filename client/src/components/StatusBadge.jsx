import React from "react";
import { STATUS_COLORS, STATUS_LABELS } from "../utils/constants";

export default function StatusBadge({ status }) {
  const colorClasses = STATUS_COLORS[status] || "text-muted bg-background";
  const label = STATUS_LABELS[status] || status;

  return <span className={`sign-badge ${colorClasses}`}>{label}</span>;
}

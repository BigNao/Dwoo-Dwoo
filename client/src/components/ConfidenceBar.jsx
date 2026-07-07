import React from "react";
import { confidenceColor } from "../utils/constants";

export default function ConfidenceBar({ score }) {
  const { bar, text } = confidenceColor(score);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono uppercase tracking-wide text-asphalt-light">
          Confidence
        </span>
        <span className={`text-xs font-mono font-semibold ${text}`}>{score}/100</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full ${bar} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

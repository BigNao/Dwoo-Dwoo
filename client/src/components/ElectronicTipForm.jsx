import React from "react";
import { Link } from "react-router-dom";

const INFO_ROWS = [
  <>
    This form is used to report federal crimes and submit tips regarding terrorist activity. If you
    are reporting cyber-enabled crime, please submit a tip to{" "}
    <a
      href="https://www.ic3.gov"
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline transition-colors"
    >
      IC3.gov
    </a>
    .
  </>,
  "Be specific when providing information. Example: If reporting online criminal activity, please provide details such as the website's URL or internet address, the application's name (e.g., Snapchat, Facebook, X, etc.), username of the individual you are reporting or the username of the profile which contains the comment you are reporting, and the date/time of post.",
  "Submit your information only once.",
];

function WarningIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SphereGraphic() {
  return (
    <span
      className="relative shrink-0 h-14 w-14 rounded-full bg-gradient-to-b from-white via-offwhite to-offwhite-recessed shadow-[2px_4px_8px_rgba(0,0,0,0.18),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04]"
      aria-hidden="true"
    />
  );
}

function InfoPill({ children }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-offwhite-recessed/80 border-b-offwhite-recessed bg-offwhite-surface px-3 py-2 shadow-[0_3px_8px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)]">
      <SphereGraphic />
      <p className="text-[14px] leading-relaxed tracking-normal text-ink">
        {children}
      </p>
    </div>
  );
}

export default function ElectronicTipForm() {
  return (
    <section id="how-it-works" className="w-full px-4 sm:px-6 py-10">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-sign border border-offwhite-recessed bg-offwhite shadow-[0_8px_24px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div
          role="alert"
          className="flex items-center justify-center gap-2 bg-danger px-4 py-3 text-center text-sm font-semibold text-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)] sm:px-6 sm:text-base"
        >
          <WarningIcon />
          <p>
            If this is an emergency, contact emergency services. Do not submit this form.
          </p>
        </div>

        <div className="bg-offwhite px-4 py-6 sm:px-8 sm:py-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Electronic Tip Form
          </h2>

          <div className="mt-5 space-y-3 sm:mt-6">
            {INFO_ROWS.map((content, index) => (
              <InfoPill key={index}>{content}</InfoPill>
            ))}
          </div>

          <div className="mt-6 sm:mt-8">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 rounded-sign bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_3px_8px_rgba(30,64,175,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-colors hover:bg-primary-hover sm:text-base"
            >
              Submit a Tip
              <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

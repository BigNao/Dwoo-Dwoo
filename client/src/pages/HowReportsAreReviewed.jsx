import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { STATUS_LABELS } from "../utils/constants.js";

const STEPS = [
  {
    number: "01",
    title: "Report Submission",
    body: "A citizen submits a report through the KwansoDwoo platform — either via the public form or the registered-user dashboard. The submission includes the incident type, a description, GPS coordinates, and an optional photo. The system validates all required fields before accepting the report.",
  },
  {
    number: "02",
    title: "Corroboration Check",
    body: "The system automatically scans all reports submitted within the last 2 hours for matching incident types and locations within 500 metres of the new report. If one or more corroborating reports are found, both the new and existing reports receive a confidence boost of +10 points (capped at 100) and are flagged as corroborated.",
  },
  {
    number: "03",
    title: "Confidence Scoring",
    body: "Each report receives a confidence score from 0 to 100 based on the evidence provided. Points are awarded for incident type selection (+20), a detailed description of at least 50 characters (+20), valid GPS coordinates (+25), an uploaded photo (+25), and corroboration from other reports (+10). A higher score means the report carries more weight for review.",
  },
  {
    number: "04",
    title: "Initial Status Assignment",
    body: "Reports with a confidence score of 40 or higher are automatically marked as Pending, awaiting admin review. Reports scoring below 40 are flagged as Under Review — they have too little corroborating evidence and require immediate attention from an administrator.",
  },
  {
    number: "05",
    title: "Admin Review & Verification",
    body: "An administrator reviews each report in the management panel, where they can view the full details — incident type, description, photo, location on a map, confidence score, and whether the report is corroborated. Administrators have the authority to update the report's status and add internal notes that are visible to the citizen.",
  },
  {
    number: "06",
    title: "Status Lifecycle",
    body: "Reports move through a defined lifecycle of statuses. Administrators can transition a report at any stage as new information emerges.",
  },
];

const STATUS_CYCLE = [
  { status: "pending", description: "Report is awaiting admin review." },
  { status: "under_review", description: "An administrator is actively examining the report." },
  { status: "verified", description: "The incident has been confirmed as legitimate by an administrator." },
  { status: "under_investigation", description: "Verified reports may be escalated for active investigation by the relevant authorities." },
  { status: "resolved", description: "The incident has been addressed and is closed." },
  { status: "rejected", description: "The report was determined to be invalid, spam, or a duplicate." },
];

export default function HowReportsAreReviewed() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight mb-2">
            How Reports Are Reviewed
          </h1>
          <p className="text-muted max-w-2xl text-sm sm:text-base">
            From submission to resolution — every report on KwansoDwoo goes through a structured review pipeline
            designed to ensure accuracy, fairness, and transparency.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <div key={step.number} className="flex gap-5 sm:gap-8">
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-mono text-sm font-bold">
                    {step.number}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-border dark:bg-white/10" />
                  )}
                </div>
                <div className="pb-10 flex-1 min-w-0">
                  <h2 className="text-xl font-semibold mb-2 text-ink dark:text-white">{step.title}</h2>
                  <p className="text-muted dark:text-white/60 leading-relaxed">{step.body}</p>
                  {step.number === "06" && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {STATUS_CYCLE.map((s) => (
                        <div
                          key={s.status}
                          className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-3"
                        >
                          <span className="text-sm font-semibold text-ink dark:text-white capitalize">
                            {STATUS_LABELS[s.status]}
                          </span>
                          <p className="text-xs text-muted dark:text-white/50 mt-1">{s.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border dark:border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl font-semibold mb-4 text-ink dark:text-white">Citizen Notifications</h2>
            <p className="text-muted dark:text-white/60 leading-relaxed max-w-3xl">
              Registered users receive real-time notifications whenever the status of their report changes.
              Each notification includes the report's reference number and the new status, so you are always
              kept in the loop. You can view all updates in your dashboard under Notifications.
            </p>
          </div>
        </section>

        <section className="border-t border-border dark:border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl font-semibold mb-4 text-ink dark:text-white">Track a Report</h2>
            <p className="text-muted dark:text-white/60 leading-relaxed max-w-3xl">
              If you submitted a report as a guest, you can track its status anytime using your unique
              reference number on the{" "}
              <a href="/track" className="text-primary dark:text-accent hover:underline">Track My Report</a>{" "}
              page. No account is required.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

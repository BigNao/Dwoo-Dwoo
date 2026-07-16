import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { confidenceColor } from "../utils/constants.js";

const SCORING_FACTORS = [
  {
    factor: "Incident Type",
    points: 20,
    condition: "Selecting a valid incident category from the predefined list.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    factor: "Detailed Description",
    points: 20,
    condition: "A description of at least 50 characters providing sufficient detail about the incident.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    factor: "GPS Coordinates",
    points: 25,
    condition: "Valid latitude and longitude coordinates pinpointing the exact location of the incident.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    factor: "Photo Evidence",
    points: 25,
    condition: "An uploaded photo of the incident, securely stored via Cloudinary.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    factor: "Corroboration",
    points: 10,
    condition: "One or more other reports within the last 2 hours and 500 metres match the same incident type.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const COLOR_BANDS = [
  { label: "Low", range: "0–39", score: 20, color: "bg-danger", textColor: "text-danger" },
  { label: "Medium", range: "40–69", score: 55, color: "bg-accent", textColor: "text-accent-dark" },
  { label: "High", range: "70–100", score: 85, color: "bg-secondary", textColor: "text-secondary" },
];

export default function ConfidenceScoring() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight mb-2">
            Confidence Scoring
          </h1>
          <p className="text-muted max-w-2xl text-sm sm:text-base">
            Every report on KwansoDwoo is evaluated by an automated scoring system that assesses
            the quality and reliability of the information provided. The confidence score helps
            administrators prioritise reports that need the most urgent attention.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-xl font-semibold mb-6 text-ink dark:text-white">How the Score Is Calculated</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCORING_FACTORS.map((f) => {
              const bar = f.points * 2;
              const barColor = confidenceColor(f.points === 10 ? 30 : f.points === 20 ? 50 : f.points === 25 ? 60 : 0);
              return (
                <div
                  key={f.factor}
                  className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-white/10 text-primary dark:text-accent">
                      {f.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-ink dark:text-white">{f.factor}</p>
                      <p className="text-xs font-mono text-muted dark:text-white/50">+{f.points} points</p>
                    </div>
                  </div>
                  <div className="h-2 bg-muted/30 dark:bg-white/10 rounded-full mb-3">
                    <div
                      className={`h-full rounded-full transition-all ${barColor.bar}`}
                      style={{ width: `${bar}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted dark:text-white/60 leading-relaxed">{f.condition}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border dark:border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl font-semibold mb-6 text-ink dark:text-white">Score Bands</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {COLOR_BANDS.map((band) => {
                const cc = confidenceColor(band.score);
                return (
                  <div
                    key={band.label}
                    className="bg-card dark:bg-asphalt-light rounded-lg border border-border dark:border-white/10 p-5"
                  >
                    <div className="h-4 rounded-full mb-3" style={{ width: `${band.score}%`, backgroundColor: band.color === "bg-danger" ? "#DC2626" : band.color === "bg-accent" ? "#F59E0B" : "#059669" }} />
                    <p className="font-semibold text-ink dark:text-white">{band.label}</p>
                    <p className="text-sm text-muted dark:text-white/50">Score: {band.range}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-muted dark:text-white/60 leading-relaxed max-w-3xl">
              Reports scoring below 40 are automatically flagged as <strong>Under Review</strong> because
              they lack sufficient evidence. Reports with a score of 40 or higher enter the <strong>Pending</strong> queue
              for standard admin review. Regardless of the initial score, administrators may adjust the
              status manually as part of their investigation.
            </p>
          </div>
        </section>

        <section className="border-t border-border dark:border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl font-semibold mb-4 text-ink dark:text-white">Score Updates</h2>
            <p className="text-muted dark:text-white/60 leading-relaxed max-w-3xl">
              Confidence scores are not static. When a new report corroborates an existing one, the
              existing report receives an automatic +10 point boost (capped at 100). This means that
              as more citizens report the same incident, every related report gains credibility over time.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

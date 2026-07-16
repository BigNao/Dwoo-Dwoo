import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "When you submit a report, we collect the incident type, a description, GPS coordinates, and an optional photo. If you register for an account, we also collect your name, email address, and a password (stored securely using Firebase Authentication). Anonymous submissions are accepted and do not require any personally identifiable information.",
  },
  {
    title: "How We Use Your Information",
    body: "Report data is used solely for the purpose of incident tracking, verification, and resolution. Photos are uploaded to Cloudinary for secure storage and are only displayed within the admin review panel and the citizen's personal dashboard. Your email address is used for account management and to send notifications when your report status changes.",
  },
  {
    title: "Data Storage & Security",
    body: "All data is stored in Firebase Firestore, a fully-managed NoSQL database with encryption at rest and in transit. Authentication is handled by Firebase Authentication, which follows industry-standard security practices. Photo uploads are processed and stored securely via Cloudinary. Access to the admin panel is restricted to authorised personnel through Firebase ID token verification and server-side role checks.",
  },
  {
    title: "Data Sharing",
    body: "KwansoDwoo does not sell, rent, or share your personal information with third parties. Report details may be shared with relevant law enforcement or road safety authorities as part of the incident verification and investigation process. Only authorised administrators have access to the full report data.",
  },
  {
    title: "Your Rights",
    body: "Registered users can view all their submitted reports and their current statuses through their personal dashboard. You may request deletion of your account and associated data by contacting the system administrators. Anonymous reports cannot be linked back to an individual and are retained as part of the public safety record.",
  },
  {
    title: "Data Retention",
    body: "Reports are retained indefinitely as part of the public safety record. Account information is retained for as long as the account remains active. You may close your account at any time, which will disable access to the citizen dashboard but will not remove previously submitted reports.",
  },
  {
    title: "Cookies & Local Storage",
    body: "KwansoDwoo uses local storage for theme preferences (light/dark mode). No tracking cookies, analytics, or advertising scripts are used on this platform.",
  },
];

export default function DataPrivacy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight mb-2">
            Data & Privacy
          </h1>
          <p className="text-muted max-w-2xl text-sm sm:text-base">
            KwansoDwoo is committed to protecting your privacy. This page explains how we collect,
            use, and safeguard your information when you use our platform.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="space-y-8">
            {SECTIONS.map((s, i) => (
              <div key={s.title}>
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-accent text-sm font-mono font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold mb-2 text-ink dark:text-white">{s.title}</h2>
                    <p className="text-muted dark:text-white/60 leading-relaxed">{s.body}</p>
                  </div>
                </div>
                {i < SECTIONS.length - 1 && (
                  <div className="ml-4 mt-8 border-b border-border dark:border-white/10" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border dark:border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl font-semibold mb-4 text-ink dark:text-white">Contact</h2>
            <p className="text-muted dark:text-white/60 leading-relaxed max-w-3xl">
              If you have any questions about this policy or wish to exercise your data rights,
              please contact the system administrator through the official KwansoDwoo channels.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CrimeTipsGrid from "../components/CrimeTipsGrid.jsx";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-6">
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight max-w-3xl">
            Report Road Incidents.
            <br />
            <span className="text-secondary">Keep Ghana Safe.</span>
          </h1>
        </section>


        {/* Instructions — rounded pill steps */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="space-y-4">
            <InstructionPill
              number="1"
              text="This form is for non-emergency road incidents — hazards, damaged signage, reckless driving, and similar reports that district officials should review."
            />
            <InstructionPill
              number="2"
              text="Be specific. Include the incident type, a clear description, and the exact location — the more detail you give, the faster it gets verified and reviewed."
            />
            <InstructionPill
              number="3"
              text="Submit your report only once. You'll receive a reference number — save it to check the status any time on the Track My Report page."
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/report"
              className="text-center px-6 py-3.5 rounded-sign bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
            >
              Submit a Report →
            </Link>
            <Link
              to="/track"
              className="text-center px-6 py-3.5 rounded-sign border border-border font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Track My Report
            </Link>
          </div>
        </section>

        <CrimeTipsGrid />
      </main>

      <Footer />
    </div>
  );
}

function InstructionPill({ number, text }) {
  return (
    <div className="flex items-center gap-5 rounded-full border border-border bg-card px-6 py-4 shadow-sm">
      <span className="shrink-0 h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-mono text-sm font-semibold">
        {number}
      </span>
      <p className="text-sm text-muted leading-relaxed">{text}</p>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { INCIDENT_CATEGORIES } from "../utils/constants.js";

const CATEGORY_META = {
  "Road Traffic Accident": { icon: "🚗", blurb: "Collisions, injuries, or vehicles involved in a crash." },
  "Road Hazard": { icon: "🕳️", blurb: "Potholes, fallen trees, flooding, or collapsed bridges." },
  "Missing or Damaged Road Signs / Traffic Signals": {
    icon: "🚦",
    blurb: "Broken traffic lights or signage that's gone missing.",
  },
  "Highway Robbery / Carjacking": { icon: "🚨", blurb: "Robbery, carjacking, or related roadside crime." },
  "Reckless or Dangerous Driving": { icon: "⚠️", blurb: "Dangerous overtaking, speeding, or unsafe driving." },
  "Abandoned Vehicle": { icon: "🚙", blurb: "Vehicles left obstructing or endangering the road." },
  "Poor Road Condition": { icon: "🛣️", blurb: "Degraded surfaces, erosion, or unsafe stretches of road." },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-kente mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-kente inline-block" />
            Ghana Road Safety Network
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight max-w-3xl">
            Report Road Incidents.
            <br />
            <span className="text-forest">Keep Ghana Safe.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-ink/70 leading-relaxed">
            KwansoDwoo lets any citizen flag accidents, hazards, and unsafe driving
            in under a minute — no account required. Reports go straight to the
            district road safety officials who can act on them.
          </p>
        </section>

        {/* Emergency alert */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-sign bg-kente text-canvas px-6 py-4 flex items-center gap-3 font-semibold">
            <span className="text-xl">⚠️</span>
            If this is a life-threatening emergency, call 112 now. Do not submit a form.
          </div>
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
              className="text-center px-6 py-3.5 rounded-sign bg-kente text-canvas font-semibold hover:bg-kente-dark transition-colors"
            >
              Submit a Report →
            </Link>
            <Link
              to="/track"
              className="text-center px-6 py-3.5 rounded-sign border border-ink/20 font-semibold hover:bg-ink hover:text-canvas transition-colors"
            >
              Track My Report
            </Link>
          </div>
        </section>

        {/* Category grid */}
        <section id="categories" className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="font-display text-2xl font-semibold mb-1">Report by Category</h2>
          <p className="text-sm text-ink/60 mb-8">
            Jump straight into the form with your incident type pre-selected.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INCIDENT_CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/report?type=${encodeURIComponent(category)}`}
                className="group rounded-sign border border-ink/15 bg-white p-5 hover:border-kente hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{CATEGORY_META[category]?.icon}</span>
                  <span className="text-ink/30 group-hover:text-kente group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </div>
                <p className="font-display font-semibold leading-snug mb-1">{category}</p>
                <p className="text-xs text-ink/50 leading-relaxed">{CATEGORY_META[category]?.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function InstructionPill({ number, text }) {
  return (
    <div className="flex items-center gap-5 rounded-full border border-ink/10 bg-white px-6 py-4 shadow-sm">
      <span className="shrink-0 h-9 w-9 rounded-full bg-navy text-canvas flex items-center justify-center font-mono text-sm font-semibold">
        {number}
      </span>
      <p className="text-sm text-ink/75 leading-relaxed">{text}</p>
    </div>
  );
}

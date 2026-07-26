import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CrimeTipsGrid from "../components/CrimeTipsGrid.jsx";
import ElectronicTipForm from "../components/ElectronicTipForm.jsx";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight max-w-3xl">
            Report Road Incidents.
            <br />
            <span className="text-secondary">Keep Ghana Safe.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            For immediate response call:
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <a href="tel:191" className="flex flex-col items-center justify-center px-6 py-6 text-xl font-bold rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:ring-2 hover:ring-red-600 hover:ring-offset-2 transition-all">
              <span className="text-sm font-semibold uppercase tracking-wide text-red-600">Police</span>
              <span className="text-2xl font-black text-gray-900">191</span>
            </a>
            <a href="tel:193" className="flex flex-col items-center justify-center px-6 py-6 text-xl font-bold rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:ring-2 hover:ring-red-600 hover:ring-offset-2 transition-all">
              <span className="text-sm font-semibold uppercase tracking-wide text-red-600">Ambulance</span>
              <span className="text-2xl font-black text-gray-900">193</span>
            </a>
            <a href="tel:192" className="flex flex-col items-center justify-center px-6 py-6 text-xl font-bold rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:ring-2 hover:ring-red-600 hover:ring-offset-2 transition-all">
              <span className="text-sm font-semibold uppercase tracking-wide text-red-600">Fire</span>
              <span className="text-2xl font-black text-gray-900">192</span>
            </a>
          </div>
        </section>

        <ElectronicTipForm />

        <CrimeTipsGrid />
      </main>

      <Footer />
    </div>
  );
}

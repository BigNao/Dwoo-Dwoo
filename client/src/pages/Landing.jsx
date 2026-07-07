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
          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight max-w-3xl">
            Report Road Incidents.
            <br />
            <span className="text-secondary">Keep Ghana Safe.</span>
          </h1>
        </section>

        <ElectronicTipForm />

        <CrimeTipsGrid />
      </main>

      <Footer />
    </div>
  );
}

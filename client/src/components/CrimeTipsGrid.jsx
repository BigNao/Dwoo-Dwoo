import React from "react";

const CRIME_TIPS = [
  {
    id: "mttd",
    title: "Alert on Road",
    agency: "Ghana Police MTTD",
    logo: "/assets/Alert.PNG",
    href: "https://www.police.gov.gh",
  },
  {
    id: "gis",
    title: "Immigration & Border",
    agency: "Ghana Immigration Service",
    logo: "/assets/GIS.PNG",
    href: "https://www.gis.gov.gh",
  },
  {
    id: "gps",
    title: "General Policing",
    agency: "Ghana Police Service",
    logo: "/assets/GPS.png",
    href: "https://www.police.gov.gh",
  },
  {
    id: "mor",
    title: "Roads & Highways",
    agency: "Ministry of Roads and Highways",
    logo: "/assets/MoR.png",
    href: "https://mrh.gov.gh",
  },
  {
    id: "nrsa",
    title: "Road Safety",
    agency: "National Road Safety Authority",
    logo: "/assets/NRSA.png",
    href: "https://nrsa.gov.gh",
  },
  {
    id: "nrsa-full",
    title: "Driver and Vehicle Licencing",
    agency: "Driver and Vehicle Licencing Authority",
    logo: "/assets/dvla-ghana.png",
    href: "https://www.dvla.gov.gh",
  },
];

const ROWS = [CRIME_TIPS.slice(0, 3), CRIME_TIPS.slice(3, 6)];

function CrimeTipCard({ tip }) {
  return (
    <article className="group/card flex h-full min-h-[280px] sm:min-h-[360px] flex-col overflow-hidden rounded-sign border border-border bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-8">
        <div className="mx-auto mb-6 flex min-h-0 flex-1 w-full max-w-[280px] items-center justify-center">
          <img
            src={tip.logo}
            alt={`${tip.agency} logo`}
            className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out group-hover/card:scale-105"
            loading="lazy"
          />
        </div>

        <div className="shrink-0 text-center">
          <p className="font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">{tip.title}</p>
          <p className="mt-2 text-xs font-mono uppercase tracking-wider text-muted sm:text-sm">{tip.agency}</p>
        </div>
      </div>

      <a
        href={tip.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group/link flex shrink-0 items-center justify-between border-t border-border bg-background px-6 py-4 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white sm:px-8 sm:py-5 sm:text-base"
      >
        Visit Site
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 group-hover/link:translate-x-2"
        >
          →
        </span>
      </a>
    </article>
  );
}

function CardRow({ tips }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:h-[80vh] lg:min-h-[80vh] lg:grid-cols-3 lg:gap-8">
      {tips.map((tip) => (
        <CrimeTipCard key={tip.id} tip={tip} />
      ))}
    </div>
  );
}

export default function CrimeTipsGrid() {
  return (
    <section id="crime-tips" className="w-full px-4 py-10 sm:px-6 lg:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 lg:mb-10">
          <h2 className="font-display text-2xl font-semibold mb-1">Report Crime &amp; Tips</h2>
          <p className="text-sm text-muted">
            Official Ghanaian agencies and portals for road safety, policing, and related reports.
          </p>
        </header>

        <div className="flex flex-col gap-10 lg:gap-12">
          {ROWS.map((row, index) => (
            <CardRow key={index} tips={row} />
          ))}
        </div>
      </div>
    </section>
  );
}

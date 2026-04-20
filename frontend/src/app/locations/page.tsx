import type { Metadata } from "next";
import Link from "next/link";
import { branches } from "@/lib/content";
import { buildPageMetadata, toAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Spa Locations in Ikate Lekki and Ikeja",
  description:
    "Find Annebeala Spa in Ikate, Lekki and Opebi, Ikeja. Open 24 hours for massage, facials, pedicure, and wellness treatments in Lagos.",
  path: "/locations",
  keywords: [
    "spa in ikate",
    "spa in lekki",
    "spa in ikeja",
    "24 hours spa in lekki",
    "pedicure lekki",
    "spa near me in lekki",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where can I find a spa in Ikate, Lekki?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Annebeala Spa has a branch at 4 Eru-Ifa Street, Ikate, Lekki, Lagos, open daily.",
      },
    },
    {
      "@type": "Question",
      name: "Is Annebeala Spa open 24 hours in Lekki and Ikeja?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Annebeala Spa operates 24 hours round the clock at both the Lekki and Ikeja branches.",
      },
    },
    {
      "@type": "Question",
      name: "Can I book pedicure and manicure in Lekki?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Pedicure and manicure are available at the Lekki branch and can be booked online.",
      },
    },
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@graph": branches.map((branch) => ({
    "@type": "DaySpa",
    "@id": `${toAbsoluteUrl("/locations")}#${branch.slug}`,
    name: `Annebeala Spa ${branch.name}`,
    url: toAbsoluteUrl("/locations"),
    image: toAbsoluteUrl("/marketting.png"),
    telephone: branch.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: "Lagos",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    openingHours: "Mo-Su 00:00-23:59",
    hasMap: branch.mapsUrl,
    areaServed: ["Ikate", "Lekki", "Ikeja", "Lagos"],
  })),
};

export default function LocationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="section-shell pt-10">
        <div className="rounded-3xl border border-brand-olive/30 bg-brand-charcoal p-8 text-brand-ivory md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
            Annebeala Spa Locations
          </p>
          <h1 className="mt-3 text-5xl leading-tight md:text-6xl">
            Looking for a Spa in Ikate, Lekki or Ikeja?
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-brand-ivory/80">
            We serve clients across Lagos from our two branches in Ikate,
            Lekki and Opebi, Ikeja. Both branches are open 24 hours round the
            clock for massage, facials, pedicure, and wellness care.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href="/booking" className="btn-primary">
              Book a Session
            </Link>
            <Link href="/services#pedicure-manicure" className="btn-secondary-dark">
              Pedicure in Lekki
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell mt-10">
        <div className="grid gap-6 md:grid-cols-2">
          {branches.map((branch) => (
            <article key={branch.name} className="glass-card p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-olive">
                {branch.area}
              </p>
              <h2 className="mt-2 text-3xl text-brand-charcoal">{branch.name}</h2>
              <p className="mt-4 text-sm leading-7 text-brand-charcoal/80">
                {branch.address}
              </p>
              <p className="mt-2 text-sm text-brand-charcoal/80">{branch.phone}</p>
              <p className="mt-2 text-sm text-brand-charcoal/70">{branch.hours}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/booking" className="btn-secondary">
                  Book This Branch
                </Link>
                <Link
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  Open Map
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

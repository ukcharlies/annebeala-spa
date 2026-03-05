import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  branches,
  brandPillars,
  packages,
  reviews,
  services,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Luxury spa and wellness experiences in Lagos with massage, facials, body rituals, and premium packages at Annebeala Spa.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Spa",
  name: "Annebeala Spa",
  image: "https://annebealaspa.com/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  url: "https://annebealaspa.com",
  telephone: "+2348000000000",
  sameAs: ["https://www.instagram.com/annebeala_spa?igsh=MW1icHh1dnUxOGVtYQ=="],
  priceRange: "$$",
};

export default function Home() {
  return (
    <>
      <section className="section-shell pt-8 md:pt-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-olive/30 bg-brand-charcoal">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover opacity-30"
            >
              <source src="/meassaghe-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/75 to-brand-charcoal/50" />
          </div>

          <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[1.05fr,0.95fr] lg:gap-12 lg:p-12">
            <div className="pt-3 md:pt-8">
              <p className="text-xs uppercase tracking-[0.26em] text-brand-sage">
                Annebeala Spa • Lagos
              </p>
              <h1 className="mt-4 max-w-3xl text-5xl leading-tight text-brand-ivory md:text-6xl">
                Escape into Elegant Wellness and Visible Results.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-brand-ivory/80 md:text-lg">
                Luxury massages, facials, and body rituals curated to help you
                unwind, glow, and feel your best in both body and mind.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/booking" className="btn-primary">
                  Book a Session
                </Link>
                <Link href="/about" className="btn-secondary-dark">
                  Discover Annebeala
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {/* <article className="rounded-xl border border-brand-ivory/20 bg-brand-ivory/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">Branches</p>
                  <p className="mt-2 text-xl text-brand-ivory">2 in Lagos</p>
                </article> */}
                <article className="rounded-xl border border-brand-ivory/20 bg-brand-ivory/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">
                    Operating Hours
                  </p>
                  <p className="mt-2 text-xl text-brand-ivory">Daily</p>
                </article>
                <article className="rounded-xl border border-brand-ivory/20 bg-brand-ivory/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">
                    Instagram
                  </p>
                  <p className="mt-2 text-xl text-brand-ivory">
                    @annebeala_spa
                  </p>
                </article>
              </div>
            </div>

            <div className="grid min-h-[26rem] grid-cols-12 grid-rows-12 gap-3 sm:min-h-[34rem]">
              <article className="relative col-span-7 row-span-7 overflow-hidden rounded-2xl border border-brand-ivory/20 shadow-2xl">
                <Image
                  src="/marketting.png"
                  alt="Annebeala Spa interior"
                  fill
                  priority
                  sizes="(max-width: 1024px) 65vw, 34vw"
                  className="object-cover"
                />
              </article>

              <article className="relative col-span-5 row-span-8 overflow-hidden rounded-2xl border border-brand-sage/35 shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                >
                  <source src="/white.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/55 to-transparent" />
              </article>

              <article className="relative col-span-8 row-span-5 -mt-3 overflow-hidden rounded-2xl border border-brand-sage/30 shadow-2xl">
                <Image
                  src="/laying%20down.jpg"
                  alt="Spa client relaxing"
                  fill
                  sizes="(max-width: 1024px) 72vw, 40vw"
                  className="object-cover"
                />
              </article>

              <div className="col-span-4 row-span-4 rounded-2xl border border-brand-sage/45 bg-brand-ivory/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.15em] text-brand-sage">
                  Now Serving
                </p>
                <p className="mt-3 text-2xl text-brand-ivory">Ikeja + VI</p>
                <p className="mt-2 text-xs leading-6 text-brand-ivory/75">
                  Premium spa care in two prime Lagos locations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {brandPillars.map((pillar) => (
          <article key={pillar.title} className="glass-card p-5">
            <h2 className="text-2xl text-brand-charcoal">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-6 text-brand-charcoal/75">
              {pillar.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-16 bg-brand-charcoal py-16 text-brand-ivory">
        <div className="section-shell">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
                Signature Treatments
              </p>
              <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">
                Designed for Deep Relaxation and Real Skin Results
              </h2>
            </div>
            <Link href="/services" className="btn-secondary-dark">
              Full Service Menu
            </Link>
          </div>

          <div className="mt-10 space-y-8">
            <article className="grid overflow-hidden rounded-3xl border border-brand-ivory/20 md:grid-cols-2">
              <div className="relative min-h-72">
                <Image
                  src="/client%20happy.jpg"
                  alt="Client receiving massage"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="bg-brand-charcoal p-8">
                <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">
                  Body Therapy
                </p>
                <h3 className="mt-3 text-4xl">Massage Rituals</h3>
                <p className="mt-4 text-sm leading-7 text-brand-ivory/80">
                  From deep tissue to aroma sessions, our massage therapies melt
                  away body stress, improve circulation, and restore physical
                  balance.
                </p>
              </div>
            </article>

            <article className="grid overflow-hidden rounded-3xl border border-brand-ivory/20 md:grid-cols-2">
              <div className="bg-brand-charcoal p-8 md:order-1">
                <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">
                  Skin Health
                </p>
                <h3 className="mt-3 text-4xl">Facials & Advanced Care</h3>
                <p className="mt-4 text-sm leading-7 text-brand-ivory/80">
                  Brightening facials, hydration protocols, and precision skin
                  treatments tailored to your skin goals.
                </p>
              </div>
              <div className="relative min-h-72 md:order-2">
                <Image
                  src="/incense.jpg"
                  alt="Spa facial ritual"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">
              Visit Us
            </p>
            <h2 className="mt-3 text-4xl text-brand-charcoal">
              Two Branches, One Premium Standard
            </h2>
          </div>
          <Link href="/contact" className="btn-secondary">
            Contact Branches
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {branches.map((branch) => (
            <article key={branch.name} className="glass-card p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-olive">
                {branch.area}
              </p>
              <h3 className="mt-2 text-3xl text-brand-charcoal">
                {branch.name}
              </h3>
              <p className="mt-4 text-sm leading-7 text-brand-charcoal/80">
                {branch.address}
              </p>
              <p className="mt-2 text-sm text-brand-charcoal/80">
                {branch.phone}
              </p>
              <p className="mt-2 text-sm text-brand-charcoal/70">
                {branch.hours}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-charcoal p-6 text-brand-ivory md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
                Social Proof
              </p>
              <h2 className="mt-3 text-4xl">Instagram Moments</h2>
            </div>
            <Link
              href="https://www.instagram.com/annebeala_spa?igsh=MW1icHh1dnUxOGVtYQ=="
              target="_blank"
              rel="noreferrer"
              className="btn-secondary-dark"
            >
              Open Instagram
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="overflow-hidden rounded-2xl border border-brand-sage/30">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-72 w-full object-cover"
              >
                <source src="/meassaghe-video.mp4" type="video/mp4" />
              </video>
            </article>
            <article className="relative overflow-hidden rounded-2xl border border-brand-sage/30">
              <Image
                src="/engin-akyurt-ZbzYDboN7fg-unsplash.jpg"
                alt="Spa ambiance"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="h-72" />
            </article>
            <article className="overflow-hidden rounded-2xl border border-brand-sage/30">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-72 w-full object-cover"
              >
                <source src="/white.mp4" type="video/mp4" />
              </video>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">
              Curated Packages
            </p>
            <h2 className="mt-3 text-4xl text-brand-charcoal">
              Wellness Plans That Sell Themselves
            </h2>
          </div>
          <Link
            href="/packages"
            className="text-sm uppercase tracking-wide text-brand-olive underline"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {packages.map((pack) => (
            <article key={pack.name} className="glass-card p-6">
              <h3 className="text-2xl text-brand-charcoal">{pack.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-wider text-brand-olive">
                {pack.duration}
              </p>
              <p className="mt-3 text-sm text-brand-charcoal/75">
                {pack.includes}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-14">
        <div className="glass-card p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">
            Client Love
          </p>
          <h2 className="mt-3 text-4xl text-brand-charcoal">
            Trusted by Returning Guests
          </h2>
          <p className="mt-4 max-w-3xl text-base text-brand-charcoal/80">
            “{reviews[0].quote}”
          </p>
          <p className="mt-2 text-sm uppercase tracking-wide text-brand-olive">
            {reviews[0].name}
          </p>
          <Link
            href="/reviews"
            className="mt-5 inline-block text-sm text-brand-charcoal underline"
          >
            Read more reviews
          </Link>
        </div>
      </section>

      <section className="section-shell mt-12 grid gap-6 pb-2 md:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <article key={service.title} className="glass-card p-6">
            <h2 className="text-2xl text-brand-charcoal">{service.title}</h2>
            <p className="mt-3 text-sm text-brand-charcoal/75">
              {service.description}
            </p>
          </article>
        ))}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

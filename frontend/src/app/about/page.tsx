import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { branches, brandPillars } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover Annebeala Spa, our philosophy, branches in Ikeja and VI, and our commitment to premium wellness care.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section-shell pt-10">
        <div className="grid gap-6 overflow-hidden rounded-3xl border border-brand-olive/30 bg-brand-charcoal text-brand-ivory lg:grid-cols-[1.05fr,0.95fr]">
          <div className="p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">About Annebeala Spa</p>
            <h1 className="mt-4 text-5xl leading-tight md:text-6xl">A Lagos Wellness Brand Built Around Care.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-brand-ivory/80">
              Annebeala Spa was created as a refined sanctuary where modern treatment expertise meets
              warm hospitality. We focus on therapies that leave each guest calmer, healthier, and
              visibly refreshed.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking" className="btn-primary">
                Start Your Wellness Plan
              </Link>
              <Link href="/services" className="btn-secondary-dark">
                Explore Services
              </Link>
            </div>
          </div>

          <div className="relative min-h-[20rem]">
            <Image
              src="/marketting.png"
              alt="Annebeala Spa reception"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/45 to-transparent" />
          </div>
        </div>
      </section>

      <section className="section-shell mt-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="glass-card p-7 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-olive">Our Mission</p>
            <h2 className="mt-3 text-4xl text-brand-charcoal">Premium Results, Personalized Experience</h2>
            <p className="mt-4 text-sm leading-7 text-brand-charcoal/80">
              Every treatment is built around your needs, skin profile, and recovery goals. We blend
              professional spa methods with consistent service quality to deliver comfort and visible
              improvement.
            </p>
          </article>

          <article className="glass-card p-7 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-olive">Our Promise</p>
            <h2 className="mt-3 text-4xl text-brand-charcoal">Consistency Across Both Branches</h2>
            <p className="mt-4 text-sm leading-7 text-brand-charcoal/80">
              Whether you visit Ikeja or VI, you get the same premium standard in hygiene,
              therapist quality, ambience, and customer care.
            </p>
          </article>
        </div>
      </section>

      <section className="mt-16 bg-brand-charcoal py-16 text-brand-ivory">
        <div className="section-shell">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">Why Clients Choose Us</p>
          <h2 className="mt-3 text-5xl">The Annebeala Standard</h2>

          <div className="mt-10 space-y-6">
            {brandPillars.map((pillar, index) => (
              <article key={pillar.title} className="grid gap-4 rounded-2xl border border-brand-ivory/20 p-6 md:grid-cols-[5rem,1fr] md:items-start">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-sage/50 text-2xl text-brand-sage">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-3xl">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-brand-ivory/80">{pillar.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Our Locations</p>
            <h2 className="mt-3 text-4xl text-brand-charcoal">Serving Ikeja and Victoria Island</h2>
          </div>
          <Link href="/contact" className="btn-secondary">
            Contact Branches
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {branches.map((branch) => (
            <article key={branch.name} className="glass-card p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-olive">{branch.area}</p>
              <h3 className="mt-2 text-3xl text-brand-charcoal">{branch.name}</h3>
              <p className="mt-4 text-sm leading-7 text-brand-charcoal/80">{branch.address}</p>
              <p className="mt-2 text-sm text-brand-charcoal/80">{branch.phone}</p>
              <p className="mt-2 text-sm text-brand-charcoal/70">{branch.hours}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-16 pb-2">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-charcoal p-6 text-brand-ivory md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">From Our Socials</p>
              <h2 className="mt-3 text-4xl">Wellness in Motion</h2>
            </div>
            <Link
              href="https://www.instagram.com/annebeala_spa?igsh=MW1icHh1dnUxOGVtYQ=="
              target="_blank"
              rel="noreferrer"
              className="btn-secondary-dark"
            >
              Follow on Instagram
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="overflow-hidden rounded-2xl border border-brand-sage/30">
              <video autoPlay loop muted playsInline preload="metadata" className="h-72 w-full object-cover">
                <source src="/meassaghe-video.mp4" type="video/mp4" />
              </video>
            </article>
            <article className="relative overflow-hidden rounded-2xl border border-brand-sage/30">
              <Image
                src="/engin-akyurt-ZbzYDboN7fg-unsplash.jpg"
                alt="Luxury spa client care"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="h-72" />
            </article>
            <article className="overflow-hidden rounded-2xl border border-brand-sage/30">
              <video autoPlay loop muted playsInline preload="metadata" className="h-72 w-full object-cover">
                <source src="/white.mp4" type="video/mp4" />
              </video>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

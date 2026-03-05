import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { packages, reviews, services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Luxury spa and wellness experiences in Lagos with massage, facials, and restorative rituals.",
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
      <section className="section-shell pt-10 md:pt-14">
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
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/75 to-brand-charcoal/45" />
          </div>

          <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[1.02fr,0.98fr] lg:gap-10 lg:p-12">
            <div className="pt-2 md:pt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-brand-sage">Lagos Luxury Wellness</p>
              <h1 className="mt-4 max-w-3xl text-5xl leading-tight text-brand-ivory md:text-6xl">
                A Premium Spa Experience Designed Around Calm, Care, and Results.
              </h1>
              <div className="gold-divider mt-6" />
              <p className="mt-6 max-w-2xl text-base text-brand-ivory/80">
                Step into curated rituals designed to restore your body, refresh your skin, and
                elevate your confidence.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/booking" className="btn-primary">
                  Book a Session
                </Link>
                <Link href="/services" className="btn-secondary-dark">
                  Explore Services
                </Link>
              </div>
            </div>

            <div className="grid min-h-[28rem] grid-cols-12 grid-rows-12 gap-3 sm:min-h-[34rem]">
              <article className="relative col-span-7 row-span-6 overflow-hidden rounded-2xl border border-brand-ivory/20 shadow-2xl">
                <Image
                  src="/marketting.png"
                  alt="Annebeala Spa interior"
                  fill
                  priority
                  sizes="(max-width: 1024px) 60vw, 32vw"
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
                  <source src="/meassaghe-video.mp4" type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-charcoal/55 to-transparent" />
              </article>

              <article className="relative col-span-8 row-span-6 -mt-2 overflow-hidden rounded-2xl border border-brand-sage/30 shadow-2xl">
                <Image
                  src="/laying%20down.jpg"
                  alt="Spa client relaxing during treatment"
                  fill
                  sizes="(max-width: 1024px) 70vw, 38vw"
                  className="object-cover"
                />
              </article>

              <article className="relative col-span-4 row-span-4 overflow-hidden rounded-2xl border border-brand-ivory/20">
                <Image
                  src="/PHOTO-2026-03-01-11-52-35.jpg"
                  alt="Annebeala Spa logo"
                  fill
                  sizes="(max-width: 1024px) 30vw, 15vw"
                  className="object-cover"
                />
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-14 grid gap-6 md:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <article key={service.title} className="glass-card p-6">
            <h2 className="text-2xl text-brand-charcoal">{service.title}</h2>
            <p className="mt-3 text-sm text-brand-charcoal/75">{service.description}</p>
          </article>
        ))}
      </section>

      <section className="section-shell mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Curated Packages</p>
            <h2 className="mt-3 text-4xl text-brand-charcoal">Wellness Plans That Sell Themselves</h2>
          </div>
          <Link href="/packages" className="text-sm uppercase tracking-wide text-brand-olive underline">
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {packages.map((pack) => (
            <article key={pack.name} className="glass-card p-6">
              <h3 className="text-2xl text-brand-charcoal">{pack.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-wider text-brand-olive">{pack.duration}</p>
              <p className="mt-3 text-sm text-brand-charcoal/75">{pack.includes}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-14">
        <div className="glass-card p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Client Love</p>
          <h2 className="mt-3 text-4xl text-brand-charcoal">Trusted by Returning Guests</h2>
          <p className="mt-4 max-w-3xl text-base text-brand-charcoal/80">“{reviews[0].quote}”</p>
          <p className="mt-2 text-sm uppercase tracking-wide text-brand-olive">{reviews[0].name}</p>
          <Link href="/reviews" className="mt-5 inline-block text-sm text-brand-charcoal underline">
            Read more reviews
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  branches,
  brandPillars,
  packageMenu,
  reviews,
  serviceMenu,
  socialReels,
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

const homeServiceShowcase = serviceMenu.slice(0, 4);
const homePackageShowcase = packageMenu.slice(0, 3);
const homeReviewShowcase = reviews.slice(0, 4);

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
                <article className="rounded-xl border border-brand-ivory/20 bg-brand-ivory/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">
                    Now Serving
                  </p>
                  <p className="mt-2 text-xl text-brand-ivory">Ikeja + VI</p>
                </article>
                <article className="rounded-xl border border-brand-ivory/20 bg-brand-ivory/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">
                    Open Daily
                  </p>
                  <p className="mt-2 text-xl text-brand-ivory">9:30 — 7 pm</p>
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

            <div className="grid grid-cols-2 gap-3 self-center sm:gap-4">
              {/* Top-left — tall video */}
              <article className="relative row-span-2 aspect-[3/4] overflow-hidden rounded-2xl border border-brand-ivory/20 shadow-2xl sm:aspect-auto sm:h-full">
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
              </article>

              {/* Top-right — image */}
              <article className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-sage/35 shadow-2xl">
                <Image
                  src="/marketting.png"
                  alt="Spa treatment session"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 to-transparent" />
              </article>

              {/* Bottom-right — pedicure video */}
              <article className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-sage/30 shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                >
                  <source src="/pedicure.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 to-transparent" />
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 bg-brand-charcoal py-16 text-brand-ivory">
        <div className="section-shell">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-sage">
              Our Services
            </p>
            <h2 className="mt-3 text-5xl">
              Luxury Treatments, Clearly Structured
            </h2>
            <p className="mt-4 text-base leading-7 text-brand-ivory/80">
              We combine therapeutic spa methods with premium hospitality.
              Explore our most requested services with duration and starting
              rates.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            {homeServiceShowcase.map((category, index) => (
              <article
                key={category.id}
                className="grid overflow-hidden rounded-3xl border border-brand-ivory/20 md:grid-cols-2"
              >
                <div
                  className={`relative min-h-72 ${index % 2 ? "md:order-2" : ""}`}
                >
                  {category.video ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                    >
                      <source src={category.video} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-brand-charcoal/20" />
                </div>
                <div className={`p-8 ${index % 2 ? "md:order-1" : ""}`}>
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">
                    {category.id.replace(/-/g, " ")}
                  </p>
                  <h3 className="mt-3 text-4xl">{category.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-brand-ivory/80">
                    {category.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {category.items.slice(0, 5).map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center gap-3 text-sm text-brand-ivory/85"
                      >
                        <span>{item.name}</span>
                        <span className="h-px flex-1 bg-brand-ivory/20" />
                        <span className="text-brand-sage">{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <Link href="/services" className="btn-secondary-dark mt-10">
            Full List of Our Services
          </Link>
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">
              Curated Packages
            </p>
            <h2 className="mt-3 text-4xl text-brand-charcoal md:text-5xl">
              Wellness Plans That Sell Themselves
            </h2>
          </div>
          <Link href="/packages" className="btn-secondary">
            View All Packages
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {homePackageShowcase.map((cat) => (
            <article key={cat.id} className="glass-card overflow-hidden">
              <div className="relative h-52">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-3xl text-brand-charcoal">{cat.title}</h3>
                <p className="mt-2 text-sm text-brand-charcoal/70">
                  {cat.tagline}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-brand-charcoal/80">
                  {cat.packages.slice(0, 3).map((pkg) => (
                    <li key={pkg.name} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-forest" />
                      <span>{pkg.name}</span>
                      <span className="h-px flex-1 bg-brand-olive/20" />
                      <span className="font-semibold">{pkg.price}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/packages#${cat.id}`}
                  className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-brand-forest underline underline-offset-4"
                >
                  See All {cat.title}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-charcoal p-6 text-brand-ivory md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
                Instagram Reels
              </p>
              <h2 className="mt-3 text-5xl">Inside Annebeala Spa</h2>
              <p className="mt-4 text-sm leading-7 text-brand-ivory/80">
                See real treatment sessions, behind-the-scenes clips, and client
                results from our Instagram reels.
              </p>
            </div>
            <Link
              href="https://www.instagram.com/annebeala_spa/reels/"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary-dark"
            >
              Open Instagram Reels
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {socialReels.map((reel) => (
              <article
                key={reel.title}
                className="overflow-hidden rounded-2xl border border-brand-sage/30 bg-brand-charcoal/70"
              >
                <div className="relative aspect-[9/12]">
                  {reel.type === "video" ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={reel.poster}
                      className="h-full w-full object-cover"
                    >
                      <source src={reel.src} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={reel.src}
                      alt={reel.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/85 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full bg-brand-forest/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-ivory">
                    Reel
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-brand-ivory/95">
                    <span>▶ {reel.views}</span>
                    <span>♥ {reel.likes}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg text-brand-ivory">{reel.title}</h3>
                  <Link
                    href={reel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs uppercase tracking-[0.14em] text-brand-sage underline underline-offset-4"
                  >
                    Watch on Instagram
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-ivory p-7 md:p-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">
              What Clients Say
            </p>
            <h2 className="mt-3 text-5xl text-brand-charcoal">
              Trusted by Returning Guests
            </h2>
            <p className="mt-4 text-sm leading-7 text-brand-charcoal/75">
              Consistent results, warm hospitality, and visible improvements
              keep our guests coming back.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {homeReviewShowcase.map((review) => (
              <article
                key={review.name}
                className="rounded-2xl border border-brand-olive/30 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl text-brand-charcoal">
                      {review.name}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.12em] text-brand-olive">
                      {review.role}
                    </p>
                  </div>
                  <p className="text-xs text-brand-olive">{review.date}</p>
                </div>
                <p className="mt-4 text-base text-amber-500">
                  {"★".repeat(review.rating)}
                </p>
                <p className="mt-3 text-sm leading-7 text-brand-charcoal/80">
                  “{review.quote}”
                </p>
              </article>
            ))}
          </div>

          <Link href="/reviews" className="btn-secondary mt-8">
            Read More Reviews
          </Link>
        </div>
      </section>

      <section className="section-shell mt-16 pb-2">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-charcoal p-7 text-brand-ivory md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
            Why Choose Annebeala
          </p>
          <h2 className="mt-3 text-5xl">
            Professional Care, Premium Experience
          </h2>
          <div className="mt-10 space-y-6">
            {brandPillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="grid gap-4 rounded-2xl border border-brand-ivory/20 p-6 md:grid-cols-[5rem,1fr] md:items-start"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-sage/50 text-2xl text-brand-sage">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-3xl">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-brand-ivory/80">
                    {pillar.description}
                  </p>
                </div>
              </article>
            ))}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

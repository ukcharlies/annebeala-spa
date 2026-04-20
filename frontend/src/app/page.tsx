import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InstagramReelCard } from "@/components/InstagramReelCard";
import {
  branches,
  brandPillars,
  packageMenu,
  reviews,
  serviceMenu,
  socialReels,
} from "@/lib/content";
import { attachInstagramThumbnails } from "@/lib/instagram";
import {
  buildPageMetadata,
  instagramUrl,
  siteName,
  toAbsoluteUrl,
} from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Luxury Spa in Lagos, Nigeria",
  description:
    "Annebeala Spa offers massage therapy, facials, waxing, body treatments, and curated spa packages in Ikeja and Lekki, Lagos.",
  path: "/",
  keywords: [
    "day spa in Lagos",
    "spa in Ikate",
    "massage spa in Lekki",
    "spa in Lekki",
    "spa in Ikeja",
    "pedicure Lekki",
    "24 hours spa in Lekki",
    "facial spa in Ikeja",
    "wellness spa in Nigeria",
  ],
});

const parseNairaPrice = (value: string) => {
  const numeric = value.replace(/[^\d]/g, "");
  return numeric ? Number(numeric) : undefined;
};

const serviceOffers = serviceMenu.flatMap((category) =>
  category.items.slice(0, 3).map((item) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: item.name,
      serviceType: category.title,
    },
    priceCurrency: "NGN",
    price: parseNairaPrice(item.price),
    availability: "https://schema.org/InStock",
  })),
);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${toAbsoluteUrl("/")}#organization`,
      name: siteName,
      alternateName: ["Annebeala Beauty and Spa", "Annebealas Beauty and Spa"],
      url: toAbsoluteUrl("/"),
      logo: toAbsoluteUrl("/marketting.png"),
      sameAs: [instagramUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${toAbsoluteUrl("/")}#website`,
      url: toAbsoluteUrl("/"),
      name: siteName,
      inLanguage: "en-NG",
      potentialAction: {
        "@type": "SearchAction",
        target: `${toAbsoluteUrl("/services")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    ...branches.map((branch) => ({
      "@type": "DaySpa",
      "@id": `${toAbsoluteUrl("/")}#${branch.area.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: `Annebeala Spa ${branch.name}`,
      image: toAbsoluteUrl("/marketting.png"),
      url: `${toAbsoluteUrl("/locations")}#${branch.slug}`,
      telephone: branch.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: branch.address,
        addressLocality: "Lagos",
        addressRegion: "Lagos",
        addressCountry: "NG",
      },
      openingHours: "Mo-Su 00:00-23:59",
      priceRange: "$$",
      hasMap: branch.mapsUrl,
      areaServed: ["Ikate", "Lekki", "Ikeja", "Lagos"],
      makesOffer: serviceOffers,
      sameAs: [instagramUrl],
    })),
    {
      "@type": "FAQPage",
      "@id": `${toAbsoluteUrl("/")}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you have a spa in Ikate, Lekki?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Annebeala Spa has a branch at 4 Eru-Ifa Street, Ikate, Lekki, Lagos.",
          },
        },
        {
          "@type": "Question",
          name: "Is Annebeala Spa open 24 hours in Lekki?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Both our Lekki and Ikeja branches operate 24 hours round the clock.",
          },
        },
        {
          "@type": "Question",
          name: "Can I book pedicure in Lekki online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can book pedicure and manicure appointments online from the booking page.",
          },
        },
      ],
    },
  ],
};

const homeServiceShowcase = serviceMenu.slice(0, 4);
const homePackageShowcase = packageMenu.slice(0, 3);
const homeReviewShowcase = reviews.slice(0, 4);

export default async function Home() {
  const reelsWithEmbeds = await attachInstagramThumbnails(socialReels);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              <h1 className="mt-4 max-w-3xl text-4xl leading-[1.15] text-brand-ivory sm:text-5xl sm:leading-tight md:text-6xl">
                Luxury Spa in Lagos for Elegant Wellness and Visible Results.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-brand-ivory/80 sm:mt-6 sm:text-base sm:leading-7 md:text-lg">
                Luxury massages, facials, and body rituals curated to help you
                unwind, glow, and feel your best in both body and mind.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <Link
                  href="/booking"
                  className="btn-primary w-full text-center sm:w-auto"
                >
                  Book a Session
                </Link>
                <Link
                  href="/about"
                  className="btn-secondary-dark w-full text-center sm:w-auto"
                >
                  Discover Annebeala
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3">
                <article className="min-w-0 rounded-xl border border-brand-ivory/20 bg-brand-ivory/10 p-3 text-center backdrop-blur sm:p-4 sm:text-left">
                  <p className="text-[0.6rem] uppercase tracking-[0.18em] text-brand-sage sm:text-xs">
                    Now Serving
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-tight text-brand-ivory sm:mt-2 sm:text-xl">
                    Lekki + Ikeja
                  </p>
                </article>
                <article className="min-w-0 rounded-xl border border-brand-ivory/20 bg-brand-ivory/10 p-3 text-center backdrop-blur sm:p-4 sm:text-left">
                  <p className="text-[0.6rem] uppercase tracking-[0.18em] text-brand-sage sm:text-xs">
                    Open Daily
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-tight text-brand-ivory sm:mt-2 sm:text-xl">
                    24 hrs round the clock
                  </p>
                </article>
                <article className="min-w-0 rounded-xl border border-brand-ivory/20 bg-brand-ivory/10 p-3 text-center backdrop-blur sm:p-4 sm:text-left">
                  <p className="text-[0.6rem] uppercase tracking-[0.18em] text-brand-sage sm:text-xs">
                    Instagram
                  </p>
                  <p className="mt-1 text-[0.75rem] leading-tight text-brand-ivory sm:mt-2 sm:text-xl">
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
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
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

      <section className="section-shell mt-10">
        <div className="rounded-2xl border border-brand-olive/25 bg-brand-ivory p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">
            Popular Local Searches
          </p>
          <h2 className="mt-3 text-3xl text-brand-charcoal md:text-4xl">
            Spa in Ikate, Lekki and Ikeja
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-brand-charcoal/80">
            If you searched for <strong>spa in Ikate</strong>,{" "}
            <strong>spa in Lekki</strong>, <strong>spa near me</strong>,{" "}
            <strong>pedicure Lekki</strong>, or <strong>24 hours spa in Lekki</strong>,
            Annebeala Spa is available at both Ikate Lekki and Opebi Ikeja branches.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/locations" className="btn-secondary">
              View Spa Locations
            </Link>
            <Link href="/services#pedicure-manicure" className="btn-secondary">
              Pedicure & Manicure
            </Link>
            <Link href="/booking" className="btn-secondary">
              Book an Appointment
            </Link>
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

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {reelsWithEmbeds.map((reel, index) => (
              <InstagramReelCard
                key={reel.title}
                reel={reel}
                className={index > 2 ? "hidden sm:block" : ""}
              />
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
    </>
  );
}

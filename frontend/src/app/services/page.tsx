import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { serviceMenu } from "@/lib/content";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Spa Services in Lagos",
  description:
    "Explore massage therapy, body treatments, facials, pedicure and manicure, waxing, and teeth whitening at Annebeala Spa Lagos.",
  path: "/services",
  keywords: [
    "spa in Ikate",
    "spa in Lekki",
    "spa in Ikeja",
    "massage therapy in Lagos",
    "facials in Lekki",
    "waxing in Ikeja",
    "pedicure and manicure in Lagos",
    "pedicure Lekki",
  ],
});

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="section-shell pt-10">
        <div className="rounded-3xl border border-brand-olive/30 bg-brand-charcoal p-8 text-brand-ivory md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
            Our Treatment Menu
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl leading-tight md:text-6xl">
            Every Treatment, Every Price — All in One Place
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-brand-ivory/80">
            From deep tissue massage to hydra facials, body scrubs, waxing, and
            teeth whitening — explore our complete menu with transparent
            pricing.
          </p>
        </div>
      </section>

      {/* ── Quick Nav ── */}
      <section className="section-shell mt-10">
        <div className="flex flex-wrap gap-3">
          {serviceMenu.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-brand-olive/40 bg-brand-ivory px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-charcoal transition hover:border-brand-forest hover:bg-brand-forest hover:text-brand-ivory"
            >
              {cat.title}
            </a>
          ))}
        </div>
      </section>

      <section className="section-shell mt-8">
        <div className="rounded-2xl border border-brand-olive/20 bg-white/70 p-6 md:p-8">
          <h2 className="text-3xl text-brand-charcoal">
            Services Available in Ikate Lekki and Ikeja
          </h2>
          <p className="mt-4 text-sm leading-7 text-brand-charcoal/80">
            All listed treatments are available at Annebeala Spa branches in Ikate
            Lekki and Opebi Ikeja, including pedicure and manicure, massage
            therapy, facials, waxing, and body treatments.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/locations" className="btn-secondary">
              View Branch Addresses
            </Link>
            <Link href="/booking" className="btn-secondary">
              Book Any Service
            </Link>
          </div>
        </div>
      </section>

      {/* ── Service Categories ── */}
      <section className="section-shell mt-12 space-y-16">
        {serviceMenu.map((category, catIdx) => (
          <article
            key={category.id}
            id={category.id}
            className="scroll-mt-24 overflow-hidden rounded-3xl border border-brand-olive/25 bg-brand-ivory shadow-sm"
          >
            {/* Category header with image */}
            <div
              className={`grid lg:grid-cols-[0.9fr,1.1fr] ${
                catIdx % 2 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative min-h-64 lg:min-h-80">
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
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-brand-charcoal/20" />
              </div>

              <div className="p-7 md:p-9">
                <p className="text-xs uppercase tracking-[0.18em] text-brand-olive">
                  {category.id.replace(/-/g, " ")}
                </p>
                <h2 className="mt-3 text-4xl text-brand-charcoal">
                  {category.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-brand-charcoal/75">
                  {category.description}
                </p>

                {/* Price list */}
                <ul className="mt-6 space-y-3">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex items-center gap-3">
                      <span className="text-sm text-brand-charcoal">
                        {item.name}
                      </span>
                      <span className="h-px flex-1 bg-brand-olive/25" />
                      <span className="text-sm font-semibold text-brand-charcoal">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="section-shell mt-14 pb-2">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-charcoal p-8 text-brand-ivory md:p-10">
          <h2 className="text-4xl">Ready to Book a Treatment?</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-brand-ivory/80">
            Choose any service from our menu and schedule your appointment.
            Walk-ins welcome at both our Ikeja and Lekki branches.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href="/booking" className="btn-primary">
              Book a Session
            </Link>
            <Link href="/packages" className="btn-secondary-dark">
              View Packages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore massage therapy, facials, body treatments, and wellness rituals at Annebeala Spa.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="section-shell pt-10">
        <div className="rounded-3xl border border-brand-olive/30 bg-brand-charcoal p-8 text-brand-ivory md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">Spa Services</p>
          <h1 className="mt-3 max-w-4xl text-5xl leading-tight md:text-6xl">Treatment Menu Built for Results</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-brand-ivory/80">
            From full-body massage to advanced facials and detox rituals, our service menu is
            designed for visible wellness outcomes and deep relaxation.
          </p>
        </div>
      </section>

      <section className="section-shell mt-12">
        <div className="space-y-8">
          {services.map((service, index) => (
            <article key={service.title} className="grid overflow-hidden rounded-3xl border border-brand-olive/25 bg-brand-ivory shadow-sm lg:grid-cols-[0.95fr,1.05fr]">
              <div className={`relative min-h-72 ${index % 2 ? "lg:order-2" : ""}`}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className={`p-7 md:p-9 ${index % 2 ? "lg:order-1" : ""}`}>
                <p className="text-xs uppercase tracking-[0.18em] text-brand-olive">{service.category}</p>
                <h2 className="mt-3 text-4xl text-brand-charcoal">{service.title}</h2>
                <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.12em] text-brand-olive">
                  <span>{service.duration}</span>
                  <span>•</span>
                  <span>{service.priceFrom}</span>
                </div>
                <p className="mt-5 text-sm leading-7 text-brand-charcoal/80">{service.details}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-14">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-charcoal p-7 text-brand-ivory md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">Quick Pricing Guide</p>
          <h2 className="mt-3 text-4xl">Top Requested Treatments</h2>
          <ul className="mt-8 space-y-6">
            {services.slice(0, 5).map((service) => (
              <li key={service.title}>
                <div className="flex items-center gap-3 text-xl">
                  <span>{service.title}</span>
                  <span className="h-px flex-1 bg-brand-ivory/25" />
                  <span className="text-brand-sage">{service.priceFrom}</span>
                </div>
                <p className="mt-2 text-sm text-brand-ivory/75">{service.shortDescription}</p>
              </li>
            ))}
          </ul>
          <Link href="/booking" className="btn-secondary-dark mt-8">
            Book a Service
          </Link>
        </div>
      </section>
    </>
  );
}

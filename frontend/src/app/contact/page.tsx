import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
import { branches } from "@/lib/content";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Annebeala Spa Lagos",
  description:
    "Contact Annebeala Spa in Lagos to ask questions, get branch directions, or request a custom treatment plan.",
  path: "/contact",
  keywords: [
    "spa in Ikate contact",
    "spa in Lekki contact",
    "Annebeala Spa contact",
    "spa in Ikeja address",
    "spa in Lekki address",
    "24 hours spa in Lekki",
    "book spa appointment in Lagos",
  ],
});

export default function ContactPage() {
  return (
    <section className="section-shell pt-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Contact Us</p>
          <h1 className="mt-4 text-5xl text-brand-charcoal">Let’s Plan Your Next Spa Session</h1>
          <div className="gold-divider mt-6" />
          <p className="mt-6 text-base leading-7 text-brand-charcoal/80">
            Send us your preferences and we will recommend the right treatment path for your
            wellness goals.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {branches.map((branch) => (
              <article
                key={branch.name}
                className="rounded-2xl border border-brand-olive/20 bg-white/70 p-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-brand-olive">
                  {branch.area}
                </p>
                <h2 className="mt-2 text-lg text-brand-charcoal">
                  {branch.name}
                </h2>
                <p className="mt-2 text-sm text-brand-charcoal/75">
                  {branch.address}
                </p>
                <p className="mt-2 text-sm text-brand-charcoal/70">
                  {branch.phone}
                </p>
              </article>
            ))}
          </div>
        </div>

        <InquiryForm formType="contact" />
      </div>
    </section>
  );
}

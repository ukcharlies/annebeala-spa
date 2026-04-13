import type { Metadata } from "next";
import BookingWizard from "@/components/BookingWizard";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Book a Spa Appointment in Lagos",
  description:
    "Book your spa session at Annebeala Spa Lagos. Select a branch, pick your treatment, and secure your slot with a small commitment deposit.",
  path: "/booking",
  keywords: [
    "book spa appointment in Lagos",
    "massage booking in Lekki",
    "facial appointment in Ikeja",
  ],
});

export default function BookingPage() {
  return (
    <section className="section-shell py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">
            Annebeala Spa
          </p>
          <h1 className="mt-3 text-4xl text-brand-charcoal md:text-5xl">
            Book Your Session
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-brand-charcoal/75">
            Choose your branch and treatment, fill in your details, and pay a
            small commitment fee to lock in your appointment.
          </p>
        </div>

        <BookingWizard />
      </div>
    </section>
  );
}

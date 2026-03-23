import type { Metadata } from "next";
import BookingWizard from "@/components/BookingWizard";

export const metadata: Metadata = {
  title: "Book an Appointment | Annebeala Spa",
  description:
    "Book your spa session at Annebeala Spa Lagos. Select a branch, pick your treatment, and secure your slot with a small commitment deposit.",
  alternates: {
    canonical: "/booking",
  },
};

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

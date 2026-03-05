import type { Metadata } from "next";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Start your booking request for Annebeala Spa. Instant online booking is currently under review.",
};

export default function BookingPage() {
  return (
    <section className="section-shell pt-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Booking</p>
          <h1 className="mt-4 text-5xl text-brand-charcoal">Instant Booking Is Under Review</h1>
          <div className="gold-divider mt-6" />
          <p className="mt-6 text-base leading-7 text-brand-charcoal/80">
            We are finalizing the direct booking flow. For now, send your preferred date and
            treatment and our team will confirm your slot quickly.
          </p>

          <Link
            href="https://www.instagram.com/annebeala_spa?igsh=MW1icHh1dnUxOGVtYQ=="
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-sm text-brand-olive underline"
          >
            You can also book via Instagram DM
          </Link>
        </div>

        <InquiryForm formType="booking" />
      </div>
    </section>
  );
}

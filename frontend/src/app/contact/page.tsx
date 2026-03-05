import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Annebeala Spa to ask questions or request a custom treatment plan.",
};

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

          <div className="mt-8 space-y-2 text-sm text-brand-charcoal/80">
            <p>Lagos, Nigeria</p>
            <p>+234 800 000 0000</p>
            <p>hello@annebealaspa.com</p>
          </div>
        </div>

        <InquiryForm formType="contact" />
      </div>
    </section>
  );
}

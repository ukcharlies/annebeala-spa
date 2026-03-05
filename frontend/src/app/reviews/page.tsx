import type { Metadata } from "next";
import Link from "next/link";
import { reviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read what clients say about their Annebeala Spa experience.",
};

export default function ReviewsPage() {
  return (
    <section className="section-shell pt-16">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Reviews</p>
      <h1 className="mt-4 text-5xl text-brand-charcoal">Proof from Real Clients</h1>
      <div className="gold-divider mt-6" />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.name} className="glass-card p-6">
            <p className="text-sm leading-7 text-brand-charcoal/80">“{review.quote}”</p>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-brand-olive">{review.name}</p>
          </article>
        ))}
      </div>

      <p className="mt-10 text-sm text-brand-charcoal/80">
        More testimonials and before/after highlights are shared on our Instagram page.
      </p>
      <Link
        href="https://www.instagram.com/annebeala_spa?igsh=MW1icHh1dnUxOGVtYQ=="
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-sm text-brand-olive underline"
      >
        View Instagram Reviews
      </Link>
    </section>
  );
}

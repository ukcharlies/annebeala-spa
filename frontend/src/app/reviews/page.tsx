import type { Metadata } from "next";
import Link from "next/link";
import { reviews, socialReels } from "@/lib/content";
import { attachInstagramThumbnails } from "@/lib/instagram";
import { InstagramReelCard } from "@/components/InstagramReelCard";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read what clients say about their Annebeala Spa experience.",
};

const averageRating = (
  reviews.reduce((total, item) => total + item.rating, 0) / reviews.length
).toFixed(1);

export default async function ReviewsPage() {
  const reelsWithEmbeds = await attachInstagramThumbnails(
    socialReels.slice(0, 3),
  );

  return (
    <>
      <section className="section-shell pt-10">
        <div className="rounded-3xl border border-brand-olive/30 bg-brand-charcoal p-8 text-brand-ivory md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
            Client Testimonials
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl leading-tight md:text-6xl">
            What Our Guests Say About Annebeala Spa
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-brand-sage">
            <p className="text-2xl">★★★★★</p>
            <p className="text-sm uppercase tracking-[0.14em] text-brand-ivory/85">
              {averageRating} average rating
            </p>
            <p className="text-sm uppercase tracking-[0.14em] text-brand-ivory/85">
              Based on {reviews.length}+ recent reviews
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell mt-12">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-2xl border border-brand-olive/30 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl text-brand-charcoal">
                    {review.name}
                  </h2>
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-olive">
                    {review.role}
                  </p>
                </div>
                <p className="text-xs text-brand-olive">{review.date}</p>
              </div>

              <p className="mt-4 text-base text-amber-500">
                {"★".repeat(review.rating)}
              </p>
              <p className="mt-4 text-sm leading-7 text-brand-charcoal/80">
                “{review.quote}”
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-14">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-ivory p-7 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">
            Featured Testimonial
          </p>
          <h2 className="mt-3 text-5xl text-brand-charcoal">
            Trusted by Returning Guests
          </h2>
          <p className="mt-7 max-w-4xl text-3xl leading-tight text-brand-charcoal">
            “{reviews[0].quote}”
          </p>
          <p className="mt-5 text-sm uppercase tracking-[0.14em] text-brand-olive">
            {reviews[0].name} • {reviews[0].role}
          </p>
        </div>
      </section>

      <section className="section-shell mt-16 pb-2">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-charcoal p-6 text-brand-ivory md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
                Social Reviews
              </p>
              <h2 className="mt-3 text-4xl">See More on Instagram Reels</h2>
              <p className="mt-4 text-sm leading-7 text-brand-ivory/80">
                For behind-the-scenes treatment clips and live client moments,
                explore our Instagram reels feed.
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
            {reelsWithEmbeds.map((reel) => (
              <InstagramReelCard key={reel.title} reel={reel} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

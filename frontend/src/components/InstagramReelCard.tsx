import Image from "next/image";
import Link from "next/link";
import {
  getInstagramEmbedUrl,
  type InstagramReelWithThumbnail,
} from "@/lib/instagram";

const HANDLE_LABEL = "@annebeala_spa";
const BRAND_LABEL = "Annebeala Spa";

type InstagramReelCardProps = {
  reel: InstagramReelWithThumbnail;
  className?: string;
  aspectClassName?: string;
};

export function InstagramReelCard({
  reel,
  className = "",
  aspectClassName = "aspect-[4/5] sm:aspect-[9/12]",
}: InstagramReelCardProps) {
  const embedUrl = getInstagramEmbedUrl(reel.url);

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-brand-sage/30 bg-brand-charcoal/70 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-brand-ivory/10 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-500" />
          <div className="min-w-0">
            <p className="truncate text-[0.7rem] font-semibold text-brand-ivory sm:text-xs">
              {BRAND_LABEL}
            </p>
            <p className="truncate text-[0.55rem] uppercase tracking-[0.16em] text-brand-sage">
              {HANDLE_LABEL}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-brand-ivory/15 px-2 py-1 text-[0.5rem] uppercase tracking-[0.18em] text-brand-ivory/70">
          Reel
        </span>
      </div>

      {embedUrl ? (
        <div
          className={`relative ${aspectClassName} overflow-hidden`}
          aria-label={`Instagram reel: ${reel.title}`}
        >
          <iframe
            src={embedUrl}
            title={reel.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full"
            allow="encrypted-media; picture-in-picture; clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent" />
        </div>
      ) : (
        <Link
          href={reel.url}
          target="_blank"
          rel="noreferrer"
          className={`group relative block ${aspectClassName} overflow-hidden`}
          aria-label={`Open ${reel.title} on Instagram`}
        >
          {reel.thumbnailUrl.startsWith("http") ? (
            <img
              src={reel.thumbnailUrl}
              alt={reel.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <Image
              src={reel.thumbnailUrl}
              alt={reel.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent" />
        </Link>
      )}

      <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
        <p className="min-w-0 truncate text-[0.7rem] text-brand-ivory sm:text-sm">
          {reel.title}
        </p>
        <Link
          href={reel.url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-[0.55rem] uppercase tracking-[0.16em] text-brand-sage transition hover:text-brand-ivory"
        >
          View<span className="hidden sm:inline"> on Instagram</span>
        </Link>
      </div>
    </article>
  );
}

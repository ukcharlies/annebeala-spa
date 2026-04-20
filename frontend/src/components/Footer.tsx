import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-olive/30 bg-brand-charcoal text-brand-ivory">
      <div className="section-shell grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-sage/60">
              <Image
                src="/PHOTO-2026-03-01-11-52-35.jpg"
                alt="Annebeala Spa logo"
                fill
                sizes="40px"
                className="object-cover object-top"
              />
            </div>
            <h3 className="text-xl">Annebeala Spa</h3>
          </div>
          <p className="mt-3 text-sm text-brand-ivory/80">
            Luxury wellness rituals designed to help you look radiant and feel
            restored.
          </p>
        </div>

        <div>
          <h3 className="text-xl">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-ivory/80">
            <li>Lekki: 4 Eru-Ifa Street, Ikate, Chisco, Lekki</li>
            <li>
              Ikeja: 6 Sheraton Link Road, Opebi — inside Citiheigth Luxury
              Hotel, opposite The Colossus Lagos
            </li>
            <li>+234 708 846 5499</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl">Follow</h3>
          <div className="mt-3">
            <Link
              href="/locations"
              className="text-sm text-brand-ivory/80 underline decoration-brand-forest/80 underline-offset-4 transition hover:text-brand-ivory"
            >
              Spa Locations (Ikate Lekki & Ikeja)
            </Link>
          </div>
          <Link
            href="https://www.instagram.com/annebeala_spa?igsh=MW1icHh1dnUxOGVtYQ=="
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm text-brand-sage underline decoration-brand-forest/90 underline-offset-4"
          >
            @annebeala_spa
          </Link>
        </div>
      </div>

      <div className="border-t border-brand-ivory/10 py-4 text-center text-xs text-brand-ivory/70">
        <p>© {new Date().getFullYear()} Annebeala Spa. All rights reserved.</p>
        <p className="mt-1">
          Developed by{" "}
          <a
            href="https://6ixsuite.me/personal-portfolio/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-sage underline decoration-brand-forest/80 underline-offset-4 transition hover:text-brand-ivory"
          >
            6ixthdev
          </a>
        </p>
      </div>
    </footer>
  );
}

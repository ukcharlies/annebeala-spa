import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-primary-porcelain shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-graphite">
          Annebeala Spa
        </Link>
        <ul className="flex space-x-6 text-primary-graphite">
          <li>
            <Link href="/about" className="hover:text-primary-forest">
              About
            </Link>
          </li>
          <li>
            <Link href="/services" className="hover:text-primary-forest">
              Services
            </Link>
          </li>
          <li>
            <Link href="/packages" className="hover:text-primary-forest">
              Packages
            </Link>
          </li>
          <li>
            <Link href="/reviews" className="hover:text-primary-forest">
              Reviews
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-primary-forest">
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/booking"
              className="bg-primary-forest text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
            >
              Book Now
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

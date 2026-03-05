export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary-graphite mb-4">
          Welcome to Annebeala Spa
        </h1>
        <p className="text-xl text-primary-olive max-w-2xl mx-auto">
          Your sanctuary for relaxation and rejuvenation, open 24 hours a day.
        </p>
        <div className="mt-8">
          <a
            href="/booking"
            className="bg-primary-forest text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-opacity-90 transition"
          >
            Book Your Escape
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        {/* Feature cards */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-tea">
          <h3 className="text-xl font-semibold mb-2">Signature Massages</h3>
          <p className="text-primary-olive">
            Relax with our therapeutic techniques.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-tea">
          <h3 className="text-xl font-semibold mb-2">Luxury Facials</h3>
          <p className="text-primary-olive">Reveal your natural glow.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-tea">
          <h3 className="text-xl font-semibold mb-2">Wellness Packages</h3>
          <p className="text-primary-olive">
            Curated experiences for mind and body.
          </p>
        </div>
      </section>
    </div>
  );
}

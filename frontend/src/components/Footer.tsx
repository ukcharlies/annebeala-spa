export default function Footer() {
  return (
    <footer className="bg-primary-graphite text-primary-porcelain py-8">
      <div className="container mx-auto px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Annebeala Spa. All rights reserved.
        </p>
        <p className="mt-2 text-sm">24/7 Luxury Wellness</p>
      </div>
    </footer>
  );
}

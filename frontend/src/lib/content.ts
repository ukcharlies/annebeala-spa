/* ─── SERVICE MENU (actual Annebeala Spa pricing) ─── */

export interface ServiceItem {
  name: string;
  price: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  items: ServiceItem[];
}

export const serviceMenu: ServiceCategory[] = [
  {
    id: "body-massage",
    title: "Body Massage Therapy",
    description:
      "Therapeutic massage sessions tailored to relieve tension, ease pain, and restore balance to your body.",
    image: "/client%20happy.jpg",
    video: "/meassaghe-video.mp4",
    items: [
      { name: "Swedish Massage", price: "₦40,000" },
      { name: "Deep Tissue Massage", price: "₦50,000" },
      { name: "Aromatherapy Massage", price: "₦60,000" },
      { name: "Wood Therapy", price: "₦50,000" },
      { name: "Gun Massage", price: "₦50,000" },
      { name: "Focus Massage", price: "₦30,000" },
      { name: "Reflexology", price: "₦30,000" },
      { name: "Couple Massage", price: "₦100,000" },
      { name: "Four Hands Massage", price: "₦100,000" },
      { name: "Sculpting Massage", price: "₦60,000" },
      { name: "Lymphatic Massage", price: "₦60,000" },
    ],
  },
  {
    id: "body-treatment",
    title: "Body Treatment",
    description:
      "Cleansing, exfoliation, and glow treatments that leave your skin smooth, radiant, and deeply nourished.",
    image: "/laying%20down.jpg",
    items: [
      { name: "Glow Body Polish", price: "₦50,000" },
      { name: "Steam Bath", price: "₦30,000" },
      { name: "Moroccan Bath", price: "₦50,000" },
      { name: "Whitening Body Scrub", price: "₦55,000" },
      { name: "Herman Bath", price: "₦60,000" },
      { name: "Sugar / Honey Scrub", price: "₦40,000" },
      { name: "Coffee Scrub", price: "₦40,000" },
      { name: "Caramel Glow Scrub", price: "₦40,000" },
      { name: "Body Wash", price: "₦50,000" },
    ],
  },
  {
    id: "facials",
    title: "Facials",
    description:
      "Advanced facial treatments to target acne, aging, dullness, and uneven skin tone for a visible glow.",
    image: "/incense.jpg",
    video: "/face-massage.mp4",
    items: [
      { name: "Collagen Facials", price: "₦50,000" },
      { name: "Deep Cleansing Facial", price: "₦40,000" },
      { name: "Anti-Ageing Facial", price: "₦50,000" },
      { name: "Acne Facial", price: "₦50,000" },
      { name: "Face Brightening Facial", price: "₦50,000" },
      { name: "Basic Facials", price: "₦30,000" },
      { name: "LED Facials", price: "₦60,000" },
      { name: "Dermabrasion", price: "₦40,000" },
      { name: "Fruit Facials", price: "₦35,000" },
      { name: "Hydra Facial", price: "₦70,000" },
    ],
  },
  {
    id: "pedicure-manicure",
    title: "Pedicure & Manicure",
    description:
      "Pamper your hands and feet with our range of pedicure and manicure options for a polished finish.",
    image: "/marketting.png",
    video: "/pedicure.mp4",
    items: [
      { name: "Classic Pedicure", price: "₦20,000" },
      { name: "Jelly Pedicure", price: "₦30,000" },
      { name: "Fruit Pedicure", price: "₦30,000" },
      { name: "Manicure", price: "₦10,000" },
    ],
  },
  {
    id: "waxing",
    title: "Waxing",
    description:
      "Professional waxing services for smooth, hair-free skin across all body areas.",
    image: "/engin-akyurt-ZbzYDboN7fg-unsplash.jpg",
    video: "/waxing.mp4",
    items: [
      { name: "Under Arm", price: "₦15,000" },
      { name: "Full Leg", price: "₦30,000" },
      { name: "Brazilian Waxing", price: "₦25,000" },
      { name: "Bikini Waxing", price: "₦30,000" },
      { name: "Full Chest", price: "₦30,000" },
      { name: "Face Waxing", price: "₦20,000" },
      { name: "Nose Waxing", price: "₦10,000" },
      { name: "Eye Brow Waxing", price: "₦10,000" },
      { name: "Upper Lip Waxing", price: "₦10,000" },
      { name: "Full Arm", price: "₦25,000" },
      { name: "Chin Waxing", price: "₦15,000" },
      { name: "Half Chest", price: "₦20,000" },
      { name: "Full Back Waxing", price: "₦25,000" },
    ],
  },
  {
    id: "dental",
    title: "Teeth Whitening & Dental Care",
    description:
      "Brighten your smile with our professional teeth whitening and polishing treatments.",
    image: "/PHOTO-2026-03-01-11-52-35.jpg",
    items: [
      { name: "Teeth Whitening", price: "₦60,000" },
      { name: "Scaling and Polishing", price: "₦40,000" },
    ],
  },
];

/* ─── PACKAGES (actual Annebeala Spa packages) ─── */

export interface PackageItem {
  name: string;
  includes: string[];
  price: string;
}

export interface PackageCategory {
  id: string;
  title: string;
  tagline: string;
  image: string;
  packages: PackageItem[];
}

export const packageMenu: PackageCategory[] = [
  {
    id: "birthday",
    title: "Birthday Packages",
    tagline:
      "Celebrate your special day with a curated spa experience and treats",
    image: "/client%20happy.jpg",
    packages: [
      {
        name: "Birthday Glow",
        includes: [
          "Massage",
          "Facials",
          "Pedicure & Manicure",
          "6 inches Cake & Wine",
        ],
        price: "₦200,000",
      },
      {
        name: "Birthday Luxe",
        includes: [
          "Massage",
          "Facials",
          "Teeth Whitening",
          "Body Scrub",
          "Pedicure & Manicure",
          "Cake + Wine + Chocolate",
        ],
        price: "₦300,000",
      },
      {
        name: "Birthday Royal",
        includes: [
          "Massage",
          "Facials",
          "Teeth Whitening",
          "Body Scrub",
          "Pedicure & Manicure",
          "Cake + Wine + Chocolate + Bouquet",
        ],
        price: "₦350,000",
      },
    ],
  },
  {
    id: "couples",
    title: "Couples Spa Packages",
    tagline:
      "Side-by-side treatments for partners, friends, and special celebrations",
    image: "/engin-akyurt-ZbzYDboN7fg-unsplash.jpg",
    packages: [
      {
        name: "Couples Essentials",
        includes: ["Massage", "Pedicure & Manicure"],
        price: "₦160,000",
      },
      {
        name: "Couples Refresh",
        includes: ["Massage", "Facials", "Pedicure & Manicure"],
        price: "₦240,000",
      },
      {
        name: "Couples Glow",
        includes: ["Massage", "Facials", "Teeth Whitening", "Body Scrub"],
        price: "₦380,000",
      },
      {
        name: "Couples Ultimate",
        includes: [
          "Facials",
          "Teeth Whitening",
          "Pedicure & Manicure",
          "Body Scrub",
          "Massage",
        ],
        price: "₦440,000",
      },
    ],
  },
  {
    id: "spa",
    title: "Spa Packages",
    tagline: "Individual wellness combos for a complete head-to-toe reset",
    image: "/laying%20down.jpg",
    packages: [
      {
        name: "Quick Glow",
        includes: ["Full Body Scrub", "Facials"],
        price: "₦80,000",
      },
      {
        name: "Relax & Glow",
        includes: ["Full Body Massage", "Facials"],
        price: "₦80,000",
      },
      {
        name: "Classic Spa",
        includes: [
          "Full Body Scrub",
          "Full Body Massage",
          "Pedicure & Manicure",
        ],
        price: "₦110,000",
      },
      {
        name: "Premium Spa",
        includes: [
          "Full Body Scrub",
          "Facials",
          "Full Body Massage",
          "Pedicure & Manicure",
        ],
        price: "₦150,000",
      },
    ],
  },
  {
    id: "friendship",
    title: "Friendship Spa Packages",
    tagline: "Bond with your besties over relaxation and glow-up sessions",
    image: "/incense.jpg",
    packages: [
      {
        name: "Friends Chill",
        includes: ["Massage", "Facials", "Body Scrub"],
        price: "₦260,000",
      },
      {
        name: "Friends Glow",
        includes: ["Massage", "Facials", "Pedicure & Manicure", "Body Scrub"],
        price: "₦320,000",
      },
      {
        name: "Friends Ultimate",
        includes: [
          "Massage",
          "Facials",
          "Teeth Whitening",
          "Body Scrub",
          "Pedicure & Manicure",
        ],
        price: "₦440,000",
      },
    ],
  },
];

export const reviews = [
  {
    name: "Chiamaka O.",
    role: "Returning Guest",
    rating: 5,
    date: "2 months ago",
    quote:
      "Clean ambience, professional therapists, and the most consistent spa experience I have found in Lagos.",
  },
  {
    name: "Amaka E.",
    role: "Skincare Client",
    rating: 5,
    date: "1 month ago",
    quote:
      "I booked a package after seeing them on Instagram and the result exceeded my expectations.",
  },
  {
    name: "Kene A.",
    role: "Monthly Member",
    rating: 5,
    date: "3 weeks ago",
    quote:
      "The attention to detail is excellent. This is now my monthly self-care ritual.",
  },
  {
    name: "Tobi A.",
    role: "Corporate Client",
    rating: 5,
    date: "5 weeks ago",
    quote:
      "The team is polite and highly skilled. I got exactly the kind of premium service I wanted.",
  },
  {
    name: "Ifeoma N.",
    role: "Bride-to-be",
    rating: 5,
    date: "2 weeks ago",
    quote:
      "I came for pre-wedding skin prep and left with a glow I have never had before.",
  },
  {
    name: "Daniel O.",
    role: "Massage Client",
    rating: 5,
    date: "1 week ago",
    quote:
      "Strong therapists, calm environment, and proper customer care from check-in to finish.",
  },
];

export const branches = [
  {
    name: "Ikeja Branch",
    area: "Ikeja GRA, Lagos",
    address: "29C Remi Fani-Kayode Avenue, Ikeja GRA, Lagos",
    phone: "+234 708 846 5499",
    hours: "Mon - Sat: 9:30am - 7:00pm | Sun: 12:00pm - 7:00pm",
  },
  {
    name: "VI Branch",
    area: "Victoria Island, Lagos",
    address: "Annebeala Spa, Victoria Island, Lagos",
    phone: "+234 708 846 5499",
    hours: "Mon - Sat: 9:30am - 7:00pm | Sun: 12:00pm - 7:00pm",
  },
];

export const brandPillars = [
  {
    title: "Prime Locations",
    description: "Easily accessible branches in Ikeja and Victoria Island.",
  },
  {
    title: "Affordable Luxury",
    description:
      "Premium wellness service with transparent pricing and clear value.",
  },
  {
    title: "Expert Therapists",
    description: "Professionally trained staff delivering personalized care.",
  },
  {
    title: "Wide Service Menu",
    description: "From quick glow sessions to full-day spa rituals.",
  },
  {
    title: "Serene Ambience",
    description: "Quiet, refined spaces built for deep relaxation.",
  },
  {
    title: "Celebration Packages",
    description:
      "Birthday, couples, and friendship packages for every occasion.",
  },
];

export const socialReels = [
  {
    title: "Microneedling Skin Renewal",
    type: "video",
    src: "/meassaghe-video.mp4",
    poster: "/incense.jpg",
    views: "12.8k",
    likes: "1.4k",
    url: "https://www.instagram.com/annebeala_spa/reels/",
  },
  {
    title: "Luxury Recovery Session",
    type: "video",
    src: "/white.mp4",
    poster: "/client%20happy.jpg",
    views: "9.3k",
    likes: "1.1k",
    url: "https://www.instagram.com/annebeala_spa/reels/",
  },
  {
    title: "Treatment Room Tour",
    type: "image",
    src: "/marketting.png",
    views: "6.7k",
    likes: "680",
    url: "https://www.instagram.com/annebeala_spa/reels/",
  },
  {
    title: "Deep Tissue Technique",
    type: "image",
    src: "/laying%20down.jpg",
    views: "8.2k",
    likes: "940",
    url: "https://www.instagram.com/annebeala_spa/reels/",
  },
  {
    title: "Facial Ritual in Progress",
    type: "image",
    src: "/engin-akyurt-ZbzYDboN7fg-unsplash.jpg",
    views: "11.1k",
    likes: "1.2k",
    url: "https://www.instagram.com/annebeala_spa/reels/",
  },
  {
    title: "Client Glow Result",
    type: "image",
    src: "/client%20happy.jpg",
    views: "7.9k",
    likes: "830",
    url: "https://www.instagram.com/annebeala_spa/reels/",
  },
];

/* ─── BOOKING CONFIG ─── */

export const bookingConfig = {
  /** Commitment deposit required to hold a slot */
  commitmentFee: "₦20,000",
  commitmentFeeRaw: 20_000,
  currency: "NGN",
  /** Bank details for manual transfer */
  bankDetails: {
    bankName: "Opay",
    accountName: "Annebeala Spa",
    accountNumber: "6104411498",
  },
  /** WhatsApp number (international format, no +) for receipt forwarding */
  whatsappNumber: "2347088465499",
  /** Instagram handle as fallback */
  instagram: "@annebeala_spa",
};

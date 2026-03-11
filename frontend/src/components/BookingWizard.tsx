"use client";

import { useState, useMemo } from "react";
import {
  branches,
  serviceMenu,
  packageMenu,
  bookingConfig,
} from "@/lib/content";

/* ─── TYPES ─── */
type Step = 1 | 2 | 3 | 4;

interface BookingState {
  branch: string;
  treatmentType: "service" | "package" | "";
  treatmentCategory: string;
  treatmentName: string;
  treatmentPrice: string;
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string;
  notes: string;
}

const initialState: BookingState = {
  branch: "",
  treatmentType: "",
  treatmentCategory: "",
  treatmentName: "",
  treatmentPrice: "",
  fullName: "",
  phone: "",
  email: "",
  preferredDate: "",
  notes: "",
};

/* ─── COMPONENT ─── */
export default function BookingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<BookingState>(initialState);

  const update = <K extends keyof BookingState>(key: K, value: BookingState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 4) as Step);
  const back = () => setStep((s) => Math.max(s - 1, 1) as Step);

  /* Build flat list of all bookable items */
  const allServices = useMemo(() => {
    return serviceMenu.flatMap((cat) =>
      cat.items.map((item) => ({
        type: "service" as const,
        category: cat.title,
        categoryId: cat.id,
        name: item.name,
        price: item.price,
      }))
    );
  }, []);

  const allPackages = useMemo(() => {
    return packageMenu.flatMap((cat) =>
      cat.packages.map((pkg) => ({
        type: "package" as const,
        category: cat.title,
        categoryId: cat.id,
        name: pkg.name,
        price: pkg.price,
        includes: pkg.includes,
      }))
    );
  }, []);

  /* WhatsApp message builder */
  const buildWhatsAppMessage = () => {
    const lines = [
      `NEW BOOKING REQUEST`,
      `--------------------`,
      ``,
      `Branch: ${form.branch}`,
      `Treatment: ${form.treatmentName}`,
      `Category: ${form.treatmentCategory}`,
      `Price: ${form.treatmentPrice}`,
      ``,
      `Customer: ${form.fullName}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email || "Not provided"}`,
      `Preferred Date: ${form.preferredDate || "Flexible"}`,
      form.notes ? `Notes: ${form.notes}` : "",
      ``,
      `--------------------`,
      `Commitment fee of ${bookingConfig.commitmentFee} has been paid.`,
      `Please find my payment receipt attached.`,
    ];
    return encodeURIComponent(lines.filter(Boolean).join("\n"));
  };

  const whatsappLink = `https://wa.me/${bookingConfig.whatsappNumber}?text=${buildWhatsAppMessage()}`;

  /* ─── STEP 1: BRANCH ─── */
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-brand-olive">Step 1 of 4</p>
        <h2 className="mt-2 text-3xl text-brand-charcoal">Select a Branch</h2>
        <p className="mt-2 text-sm text-brand-charcoal/70">
          Choose the location most convenient for you.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {branches.map((b) => (
          <button
            key={b.name}
            type="button"
            onClick={() => update("branch", b.name)}
            className={`rounded-2xl border p-5 text-left transition ${
              form.branch === b.name
                ? "border-brand-forest bg-brand-sage/30"
                : "border-brand-olive/30 bg-white hover:border-brand-forest"
            }`}
          >
            <p className="text-lg font-semibold text-brand-charcoal">{b.name}</p>
            <p className="mt-1 text-sm text-brand-charcoal/70">{b.address}</p>
            <p className="mt-2 text-xs text-brand-olive">{b.phone}</p>
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!form.branch}
        onClick={next}
        className="btn-primary mt-4 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );

  /* ─── STEP 2: TREATMENT ─── */
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-brand-olive">Step 2 of 4</p>
        <h2 className="mt-2 text-3xl text-brand-charcoal">Choose Your Treatment</h2>
        <p className="mt-2 text-sm text-brand-charcoal/70">
          Pick a single service or a curated package.
        </p>
      </div>

      {/* Type toggle */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            update("treatmentType", "service");
            update("treatmentCategory", "");
            update("treatmentName", "");
            update("treatmentPrice", "");
          }}
          className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
            form.treatmentType === "service"
              ? "border-brand-forest bg-brand-forest text-brand-ivory"
              : "border-brand-olive/40 bg-white text-brand-charcoal hover:border-brand-forest"
          }`}
        >
          Services
        </button>
        <button
          type="button"
          onClick={() => {
            update("treatmentType", "package");
            update("treatmentCategory", "");
            update("treatmentName", "");
            update("treatmentPrice", "");
          }}
          className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
            form.treatmentType === "package"
              ? "border-brand-forest bg-brand-forest text-brand-ivory"
              : "border-brand-olive/40 bg-white text-brand-charcoal hover:border-brand-forest"
          }`}
        >
          Packages
        </button>
      </div>

      {/* Service list */}
      {form.treatmentType === "service" && (
        <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-brand-olive/20 bg-white p-3">
          {allServices.map((s) => (
            <button
              key={`${s.categoryId}-${s.name}`}
              type="button"
              onClick={() => {
                update("treatmentCategory", s.category);
                update("treatmentName", s.name);
                update("treatmentPrice", s.price);
              }}
              className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${
                form.treatmentName === s.name && form.treatmentCategory === s.category
                  ? "border-brand-forest bg-brand-sage/25"
                  : "border-transparent hover:bg-brand-ivory"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-brand-charcoal">{s.name}</p>
                <p className="text-xs text-brand-olive">{s.category}</p>
              </div>
              <span className="text-sm font-semibold text-brand-charcoal">{s.price}</span>
            </button>
          ))}
        </div>
      )}

      {/* Package list */}
      {form.treatmentType === "package" && (
        <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-brand-olive/20 bg-white p-3">
          {allPackages.map((p) => (
            <button
              key={`${p.categoryId}-${p.name}`}
              type="button"
              onClick={() => {
                update("treatmentCategory", p.category);
                update("treatmentName", p.name);
                update("treatmentPrice", p.price);
              }}
              className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${
                form.treatmentName === p.name && form.treatmentCategory === p.category
                  ? "border-brand-forest bg-brand-sage/25"
                  : "border-transparent hover:bg-brand-ivory"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-brand-charcoal">{p.name}</p>
                <p className="text-xs text-brand-olive">{p.category}</p>
              </div>
              <span className="text-sm font-semibold text-brand-charcoal">{p.price}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={back} className="btn-secondary">
          Back
        </button>
        <button
          type="button"
          disabled={!form.treatmentName}
          onClick={next}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );

  /* ─── STEP 3: DETAILS ─── */
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-brand-olive">Step 3 of 4</p>
        <h2 className="mt-2 text-3xl text-brand-charcoal">Your Details</h2>
        <p className="mt-2 text-sm text-brand-charcoal/70">
          Tell us how to reach you and when you'd like to visit.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          Full Name *
          <input
            required
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-olive/30 bg-white px-4 py-2.5"
            placeholder="Your full name"
          />
        </label>
        <label className="block text-sm">
          Phone Number *
          <input
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-olive/30 bg-white px-4 py-2.5"
            placeholder="+234..."
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          Email (optional)
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-olive/30 bg-white px-4 py-2.5"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm">
          Preferred Date
          <input
            type="date"
            value={form.preferredDate}
            onChange={(e) => update("preferredDate", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-olive/30 bg-white px-4 py-2.5"
          />
        </label>
      </div>

      <label className="block text-sm">
        Additional Notes
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="mt-1 min-h-20 w-full rounded-lg border border-brand-olive/30 bg-white px-4 py-2.5"
          placeholder="Any special requests or questions?"
        />
      </label>

      <div className="flex gap-3">
        <button type="button" onClick={back} className="btn-secondary">
          Back
        </button>
        <button
          type="button"
          disabled={!form.fullName || !form.phone}
          onClick={next}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  /* ─── STEP 4: PAYMENT ─── */
  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-brand-olive">Step 4 of 4</p>
        <h2 className="mt-2 text-3xl text-brand-charcoal">Commitment Payment</h2>
        <p className="mt-2 text-sm text-brand-charcoal/70">
          Pay a small deposit to secure your slot. The balance is paid at the spa.
        </p>
      </div>

      {/* Booking summary */}
      <div className="rounded-2xl border border-brand-olive/25 bg-white p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-brand-olive">Booking Summary</p>
        <ul className="mt-3 space-y-2 text-sm text-brand-charcoal">
          <li className="flex justify-between">
            <span className="text-brand-charcoal/70">Branch</span>
            <span className="font-medium">{form.branch}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-brand-charcoal/70">Treatment</span>
            <span className="font-medium">{form.treatmentName}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-brand-charcoal/70">Category</span>
            <span className="font-medium">{form.treatmentCategory}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-brand-charcoal/70">Treatment Price</span>
            <span className="font-medium">{form.treatmentPrice}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-brand-charcoal/70">Preferred Date</span>
            <span className="font-medium">{form.preferredDate || "Flexible"}</span>
          </li>
        </ul>
        <div className="mt-4 border-t border-brand-olive/20 pt-4">
          <p className="flex justify-between text-base">
            <span className="font-semibold text-brand-charcoal">Commitment Deposit</span>
            <span className="font-bold text-brand-forest">{bookingConfig.commitmentFee}</span>
          </p>
          <p className="mt-1 text-xs text-brand-charcoal/60">
            This deposit is deducted from your total on the day of your visit.
          </p>
        </div>
      </div>

      {/* Bank transfer info */}
      <div className="rounded-2xl border border-brand-sage/50 bg-brand-sage/20 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-forest">
          Bank Transfer Details
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-brand-charcoal">
          <li>
            <span className="text-brand-charcoal/70">Bank:</span>{" "}
            <span className="font-medium">{bookingConfig.bankDetails.bankName}</span>
          </li>
          <li>
            <span className="text-brand-charcoal/70">Account Name:</span>{" "}
            <span className="font-medium">{bookingConfig.bankDetails.accountName}</span>
          </li>
          <li>
            <span className="text-brand-charcoal/70">Account Number:</span>{" "}
            <span className="font-semibold">{bookingConfig.bankDetails.accountNumber}</span>
          </li>
          <li>
            <span className="text-brand-charcoal/70">Amount:</span>{" "}
            <span className="font-semibold">{bookingConfig.commitmentFee}</span>
          </li>
        </ul>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-brand-olive/20 bg-white p-4 text-sm text-brand-charcoal/80">
        <p className="font-medium text-brand-charcoal">How to complete your booking:</p>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>Transfer <strong>{bookingConfig.commitmentFee}</strong> to the account above.</li>
          <li>Take a screenshot of your payment receipt.</li>
          <li>Click the button below to send the receipt via WhatsApp.</li>
          <li>Our team will confirm your slot within 1 hour.</li>
        </ol>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={back} className="btn-secondary">
          Back
        </button>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Send Receipt via WhatsApp
        </a>
      </div>

      <p className="text-xs text-brand-charcoal/60">
        Having trouble? You can also DM us on Instagram{" "}
        <a
          href="https://www.instagram.com/annebeala_spa"
          target="_blank"
          rel="noreferrer"
          className="text-brand-forest underline"
        >
          {bookingConfig.instagram}
        </a>
      </p>
    </div>
  );

  /* ─── RENDER ─── */
  return (
    <div className="glass-card p-6 md:p-8">
      {/* Progress bar */}
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition ${
              s <= step ? "bg-brand-forest" : "bg-brand-olive/25"
            }`}
          />
        ))}
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
}

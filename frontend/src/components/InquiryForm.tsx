"use client";

import { useState } from "react";

type InquiryFormProps = {
  formType: "contact" | "booking";
};

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  interest: string;
  preferredDate: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  phone: "",
  email: "",
  interest: "",
  preferredDate: "",
  message: "",
};

export default function InquiryForm({ formType }: InquiryFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

  const onChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch(`${apiBaseUrl}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          source: formType,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setForm(initialState);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-card space-y-4 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Full Name
          <input
            required
            value={form.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="mt-1 w-full rounded-md border border-brand-champagne bg-white px-3 py-2"
            placeholder="Your full name"
          />
        </label>
        <label className="text-sm">
          Phone Number
          <input
            required
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="mt-1 w-full rounded-md border border-brand-champagne bg-white px-3 py-2"
            placeholder="+234..."
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Email Address
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="mt-1 w-full rounded-md border border-brand-champagne bg-white px-3 py-2"
            placeholder="you@example.com"
          />
        </label>
        <label className="text-sm">
          Service Interest
          <input
            required
            value={form.interest}
            onChange={(e) => onChange("interest", e.target.value)}
            className="mt-1 w-full rounded-md border border-brand-champagne bg-white px-3 py-2"
            placeholder="Facials, massage, package..."
          />
        </label>
      </div>

      <label className="text-sm block">
        Preferred Date (Optional)
        <input
          type="date"
          value={form.preferredDate}
          onChange={(e) => onChange("preferredDate", e.target.value)}
          className="mt-1 w-full rounded-md border border-brand-champagne bg-white px-3 py-2"
        />
      </label>

      <label className="text-sm block">
        Message
        <textarea
          required
          value={form.message}
          onChange={(e) => onChange("message", e.target.value)}
          className="mt-1 min-h-28 w-full rounded-md border border-brand-champagne bg-white px-3 py-2"
          placeholder="Tell us what you need"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>

      {status === "success" ? (
        <p className="text-sm text-brand-olive">Your inquiry was sent. We will contact you shortly.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-700">
          We could not submit right now. Please also send us a DM on Instagram: @annebeala_spa.
        </p>
      ) : null}
    </form>
  );
}

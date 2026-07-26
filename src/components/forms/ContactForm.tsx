import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";

import { Button } from "~/components/buttons/Button";
import { Input } from "~/components/forms/Input";
import { Select } from "~/components/forms/Select";
import { COMPANY } from "~/constants/company";

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  propertyType: string;
  monthlyBill: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  monthlyBill?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROPERTY_TYPE_OPTIONS = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.fullName.trim().length < 2) errors.fullName = "Please enter your full name.";
  if (!/^\d{10}$/.test(form.phone.trim())) errors.phone = "Please enter a valid 10-digit phone number.";
  if (!EMAIL_REGEX.test(form.email.trim())) errors.email = "Please enter a valid email address.";
  if (form.monthlyBill.trim().length > 0) {
    const bill = Number.parseFloat(form.monthlyBill);
    if (!Number.isFinite(bill) || bill <= 0) errors.monthlyBill = "Please enter a positive number.";
  }
  return errors;
}

/**
 * There is no backend to submit to, so this hands off to the user's own
 * email client via `mailto:` with the form data pre-filled — genuinely
 * functional without inventing a fake "submitted" state that doesn't
 * actually send anything. Swap for a real endpoint (serverless function,
 * form service, etc.) once one exists; see docs/DECISIONS.md.
 */
export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    propertyType: "residential",
    monthlyBill: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof FormState) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function handleBlur(field: keyof FormState) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors(validate(form));
    };
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ fullName: true, phone: true, email: true, monthlyBill: true });
    if (Object.keys(validationErrors).length > 0) return;

    const subject = encodeURIComponent(`Consultation request from ${form.fullName}`);
    const body = encodeURIComponent(
      `Name: ${form.fullName}\nPhone: ${form.phone}\nEmail: ${form.email}\nLocation: ${form.location}\nProperty type: ${form.propertyType}\nMonthly bill: ${form.monthlyBill}\n\n${form.message}`,
    );
    window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface-elevated p-8 text-center">
        <p className="text-subheading">Thanks, {form.fullName.split(" ")[0]}!</p>
        <p className="mt-2 text-body text-ink-muted">
          Your email app should have opened with a message ready to send. If it didn't, email us directly at{" "}
          <a href={`mailto:${COMPANY.email}`} className="underline decoration-current underline-offset-4">
            {COMPANY.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        label="Full Name"
        autoComplete="name"
        value={form.fullName}
        onChange={handleChange("fullName")}
        onBlur={handleBlur("fullName")}
        error={touched.fullName ? errors.fullName : undefined}
      />
      <Input
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={form.phone}
        onChange={handleChange("phone")}
        onBlur={handleBlur("phone")}
        error={touched.phone ? errors.phone : undefined}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
        error={touched.email ? errors.email : undefined}
      />
      <Input label="Location" autoComplete="address-level2" value={form.location} onChange={handleChange("location")} />
      <Select
        label="Property Type"
        options={PROPERTY_TYPE_OPTIONS}
        value={form.propertyType}
        onChange={handleChange("propertyType")}
      />
      <Input
        label="Monthly Electricity Bill (₹)"
        type="number"
        inputMode="decimal"
        min={0}
        value={form.monthlyBill}
        onChange={handleChange("monthlyBill")}
        onBlur={handleBlur("monthlyBill")}
        error={touched.monthlyBill ? errors.monthlyBill : undefined}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-caption font-medium text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={form.message}
          onChange={handleChange("message")}
          className="w-full rounded-[var(--radius-input)] border border-line bg-surface-elevated px-4 py-3 text-body text-ink transition-colors duration-fast focus:border-mercury"
        />
      </div>
      <Button type="submit">Get Free Consultation</Button>
    </form>
  );
}

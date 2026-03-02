import { useState } from "react";
import { API_BASE } from "../services/api";
import { brandConfig } from "../data/siteContent";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  event_date: "",
  event_location: "",
  estimated_guest_count: "",
  event_type: "Wedding",
  referral_source: "Instagram",
  vision: "",
};

export default function EnquiryPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Unable to submit your enquiry right now.");
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-royal-velvet px-3 pb-20 pt-28 sm:px-6" data-testid="enquiry-page">
      <div
        className={`enquiry-opening-panel mx-auto w-full max-w-3xl rounded-[24px] border border-[#C6A75E]/45 bg-[#F5EFE6] px-4 py-8 transition-opacity duration-500 sm:px-8 sm:py-10 ${
          submitted ? "opacity-85" : "opacity-100"
        }`}
        data-testid="enquiry-panel"
      >
        <img src={brandConfig.logo} alt="New Beginnings Events" className="mx-auto h-16 w-16 object-contain" loading="lazy" data-testid="enquiry-logo" />
        <h1 className="serif-display mt-4 text-center text-4xl text-[#350A13] sm:text-5xl" data-testid="enquiry-heading">
          Begin Your Celebration.
        </h1>
        <div className="mx-auto mt-4 h-[1px] w-28 bg-[#C6A75E]" data-testid="enquiry-divider" />
        <p className="mx-auto mt-6 max-w-2xl text-center text-base text-[#4C3330]" data-testid="enquiry-subline">
          Share your details, and let us craft something unforgettable.
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit} data-testid="enquiry-form">
          <Input name="full_name" value={form.full_name} onChange={updateField} required placeholder="Full Name" className="enquiry-input" data-testid="enquiry-full-name-input" />
          <Input name="email" type="email" value={form.email} onChange={updateField} required placeholder="Email" className="enquiry-input" data-testid="enquiry-email-input" />
          <Input name="phone" value={form.phone} onChange={updateField} required placeholder="Phone" className="enquiry-input" data-testid="enquiry-phone-input" />
          <Input name="event_date" type="text" value={form.event_date} onChange={updateField} required placeholder="Event Date (DD/MM/YYYY)" className="enquiry-input" data-testid="enquiry-event-date-input" />
          <Input name="event_location" value={form.event_location} onChange={updateField} required placeholder="Event Location" className="enquiry-input" data-testid="enquiry-event-location-input" />
          <Input
            name="estimated_guest_count"
            value={form.estimated_guest_count}
            onChange={updateField}
            required
            placeholder="Estimated Guest Count"
            className="enquiry-input"
            data-testid="enquiry-guest-count-input"
          />

          <select name="event_type" value={form.event_type} onChange={updateField} className="enquiry-input h-11 w-full" data-testid="enquiry-event-type-select">
            <option>Wedding</option>
            <option>Corporate Event</option>
            <option>Catering</option>
            <option>SFX & Entries</option>
            <option>Other</option>
          </select>

          <select name="referral_source" value={form.referral_source} onChange={updateField} className="enquiry-input h-11 w-full" data-testid="enquiry-referral-select">
            <option>Instagram</option>
            <option>YouTube</option>
            <option>Facebook</option>
            <option>WhatsApp</option>
            <option>Google Search</option>
            <option>Reference</option>
          </select>

          <Textarea
            name="vision"
            value={form.vision}
            onChange={updateField}
            required
            placeholder="Tell us your vision"
            className="enquiry-input min-h-[120px]"
            data-testid="enquiry-vision-textarea"
          />

          {error && (
            <p className="text-sm text-red-700" data-testid="enquiry-error-message">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="h-12 rounded-full border border-[#C6A75E] bg-transparent px-7 text-xs uppercase tracking-[0.2em] text-[#4B0F1B] transition-colors hover:bg-[#4B0F1B] hover:text-[#F5EFE6]"
            data-testid="enquiry-submit-button"
          >
            {submitting ? "Submitting..." : "Request Private Consultation"}
          </Button>
        </form>

        {submitted && (
          <div className="mt-10 rounded-2xl border border-[#C6A75E]/35 bg-[#4B0F1B]/10 p-6 text-center" data-testid="enquiry-success-message-panel">
            <p className="serif-display text-3xl text-[#3E0B14]" data-testid="enquiry-success-title">
              Your Story Begins Here.
            </p>
            <p className="mt-3 text-sm text-[#50332F]" data-testid="enquiry-success-text">
              Our team will connect with you within 24–48 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
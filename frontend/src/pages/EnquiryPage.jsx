import { useEffect, useState } from "react";
import { brandConfig } from "../data/siteContent";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScfTdPIwsmXpDap4KSER1GL_0KZPjYCeLAXBBW9ZUYe4WkDEg/formResponse";

const ENTRY_IDS = {
  full_name: "entry.827195904",
  email: "entry.1873800378",
  phone: "entry.1724362707",
  event_date: "entry.634533857",
  event_location: "entry.848190616",
  estimated_guest_count: "entry.1517076950",
  event_type: "entry.934301364",
  referral_source: "entry.1294170504",
  vision: "entry.1964823167",
};

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  event_date: "",
  event_location: "",
  estimated_guest_count: "",
  event_type: "",
  referral_source: "",
  vision: "",
};

const inputBase =
  "w-full border-0 border-b border-[#C6A75E]/50 bg-transparent px-0 py-2 text-sm text-[#F5EFE8] placeholder-[#C6A75E]/60 outline-none transition-colors focus:border-[#C6A75E] focus:ring-0";

const selectBase =
  "w-full appearance-none border-0 border-b border-[#C6A75E]/50 bg-transparent px-0 py-2 text-sm text-inherit outline-none transition-colors focus:border-[#C6A75E] focus:ring-0";

export default function EnquiryPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      Object.entries(ENTRY_IDS).forEach(([key, entryId]) => {
        formData.append(entryId, form[key]);
      });

      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      setSubmitted(true);
      setForm(initialForm);
    } catch (_submitError) {
      setError("Unable to submit your enquiry right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
   <div className="bg-[#F5EFE8] min-h-screen flex flex-col justify-between pb-16 pt-16 sm:pb-20 sm:pt-20">
    <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-10">
      <div className="relative mx-auto w-full max-w-[1100px]">
        {/* ✨ SHIMMER / GLOW */}
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(198,167,94,0.18),transparent_70%)] blur-2xl"></div>
        {/* 🟥 CARD (DO NOT CLOSE HERE) */}
        <div className="relative rounded-2xl border border-[#C6A75E]/40 bg-[#3C0518] p-16 shadow-2xl card-entry">
          <div className="absolute left-6 top-6 h-8 w-8 border-l border-t border-[#C6A75E]/50"></div>
          <div className="absolute right-6 top-6 h-8 w-8 border-r border-t border-[#C6A75E]/50"></div>
          <div className="absolute left-6 bottom-6 h-8 w-8 border-l border-b border-[#C6A75E]/50"></div>
          <div className="absolute right-6 bottom-6 h-8 w-8 border-r border-b border-[#C6A75E]/50"></div>
          <div className="flex w-full flex-col items-center justify-center"></div>
            {!submitted ? (
              <>
              <div className="w-full flex justify-center mb-3 fade-up delay-1">
                <img
                  src={brandConfig.logo}
                  alt="New Beginnings Events"
                  className="logo-animate h-10 w-10 object-contain sm:h-14 sm:w-14"
                  loading="eager"
                  data-testid="enquiry-logo"
                />
                </div>
                <h1
                  className="fade-up delay-2 serif-display mt-4 text-center text-xl tracking-[0.35em] text-[#C6A75E] md:text-2xl lg:text-3xl"
                  data-testid="enquiry-heading"
                >
                  GET IN TOUCH WITH US
                </h1>

                <form
                  className="mt-6 w-full max-w-[1000px] space-y-6 fade-up"
                  onSubmit={handleSubmit}
                  data-testid="enquiry-form"
                >
                  {/* Row 1: Name, Email, Phone */}
                  <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 delay-3">
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={updateField}
                      required
                      placeholder="Full Name"
                      className={inputBase}
                      data-testid="enquiry-full-name-input"
                    />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={updateField}
                      required
                      placeholder="Email"
                      className={inputBase}
                      data-testid="enquiry-email-input"
                    />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={updateField}
                      required
                      placeholder="Phone"
                      className={`${inputBase} sm:col-span-2 md:col-span-1`}
                      data-testid="enquiry-phone-input"
                    />
                  </div>

                  {/* Row 2: Event Date, Location, Guest Count */}
                  <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 delay-4">
                    <input
                      name="event_date"
                      value={form.event_date}
                      onChange={updateField}
                      required
                      placeholder="Event Date"
                      className={inputBase}
                      data-testid="enquiry-event-date-input"
                    />
                    <input
                      name="event_location"
                      value={form.event_location}
                      onChange={updateField}
                      required
                      placeholder="Event Location"
                      className={inputBase}
                      data-testid="enquiry-event-location-input"
                    />
                    <input
                      name="estimated_guest_count"
                      value={form.estimated_guest_count}
                      onChange={updateField}
                      required
                      placeholder="Estimated Guest Count"
                      className={`${inputBase} sm:col-span-2 md:col-span-1`}
                      data-testid="enquiry-guest-count-input"
                    />
                  </div>

                  {/* Row 3: Event Type, Referral Source */}
                  <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 md:gap-x-8 delay-5">
                    <div className="relative">
                      <select
                        name="event_type"
                        value={form.event_type}
                        onChange={updateField}
                        required
                        className={`${selectBase} ${
  form.event_type === ""
    ? "!text-[#C6A75E]/60"
    : "!text-[#F5EFE8]"
}`}
                        data-testid="enquiry-event-type-select"
                      >
                        <option value="">Event Type</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Catering">Catering</option>
                        <option value="SFX & Entries">SFX &amp; Entries</option>
                        <option value="Others">Others</option>
                      </select>
                      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#C6A75E]/60">&#9662;</span>
                    </div>
                    <div className="relative">
                      <select
                        name="referral_source"
                        value={form.referral_source}
                        onChange={updateField}
                        required
                        className={`${selectBase} ${
  form.referral_source === ""
    ? "!text-[#C6A75E]/60"
    : "!text-[#F5EFE8]"
}`}
                        data-testid="enquiry-referral-select"
                      >
                        <option value="">How did you hear about us?</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Youtube">Youtube</option>
                        <option value="Google">Google</option>
                        <option value="Friend & Family">Friend &amp; Family</option>
                        <option value="Others">Others</option>
                      </select>
                      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#C6A75E]/60">&#9662;</span>
                    </div>
                  </div>

                  {/* Row 4: Vision */}
                  <div className="fade-up delay-6">
                    <textarea
                      name="vision"
                      value={form.vision}
                      onChange={updateField}
                      required
                      placeholder="Tell us about your vision"
                      rows={2}
                      className={`${inputBase} resize-none`}
                      data-testid="enquiry-vision-textarea"
                    />
                  </div>

                  {error && (
                    <p className="text-center text-xs text-red-700" data-testid="enquiry-error-message">
                      {error}
                    </p>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-center pt-1 sm:pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-8 border border-[#C6A75E] bg-transparent px-10 py-3 text-sm uppercase tracking-[0.35em] text-[#C6A75E] transition-all duration-300 hover:bg-[#C6A75E] hover:text-[#3C0518] disabled:opacity-50"
                      data-testid="enquiry-submit-button"
                    >
                      {submitting ? "Submitting..." : "Begin Your Celebration"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center" data-testid="enquiry-success-message-panel">
                <img
                  src={brandConfig.logo}
                  alt="New Beginnings Events"
                  className="mx-auto h-12 w-12 object-contain sm:h-16 sm:w-16"
                  loading="eager"
                />
                <p className="serif-display mt-4 text-2xl text-[#F5EFE8] opacity-80 sm:text-3xl" data-testid="enquiry-success-title">
                  Thank you.
                </p>
                <p className="serif-display mt-4 text-2xl text-sm text-[#F5EFE8] opacity-80 sm:text-2xl">
                  Our team will reach out shortly to curate your day.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

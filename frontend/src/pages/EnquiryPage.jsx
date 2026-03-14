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
  "w-full border-0 border-b border-[#C6A75E]/50 bg-transparent px-0 py-2 text-sm text-[#3C0518] placeholder-[#C6A75E]/60 outline-none transition-colors focus:border-[#C6A75E] focus:ring-0";

const selectBase =
  "w-full appearance-none border-0 border-b border-[#C6A75E]/50 bg-transparent px-0 py-2 text-sm text-[#3C0518] outline-none transition-colors focus:border-[#C6A75E] focus:ring-0";

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
    <div className="bg-[#f5efe8] pb-8 pt-16 sm:pb-12 sm:pt-20" data-testid="enquiry-page">
      <div className="mx-auto w-full max-w-[1200px] px-2 sm:px-4" data-testid="enquiry-hero-wrapper">
        {/* Card container with background image */}
        <div
          className="enquiry-card-bg relative flex items-center justify-center bg-no-repeat"
          style={{
            backgroundImage: isMobile
              ? "url(/assets/enquiry-card-mobile.png)"
              : "url(/assets/enquiry-card.png)",
          }}
          data-testid="enquiry-card-container"
        >
          <div className="flex w-full flex-col items-center justify-center">
            {!submitted ? (
              <>
                <img
                  src={brandConfig.logo}
                  alt="New Beginnings Events"
                  className="h-10 w-10 object-contain sm:h-14 sm:w-14"
                  loading="eager"
                  data-testid="enquiry-logo"
                />
                <h1
                  className="serif-display mt-2 text-center text-lg text-[#C6A75E] sm:mt-3 sm:text-xl md:text-2xl lg:text-3xl"
                  data-testid="enquiry-heading"
                >
                  GET IN TOUCH WITH US
                </h1>

                <form
                  className="mt-4 w-full max-w-full space-y-4 pl-1 sm:mt-5 sm:space-y-5 sm:pl-0 md:space-y-6"
                  onSubmit={handleSubmit}
                  data-testid="enquiry-form"
                >
                  {/* Row 1: Name, Email, Phone */}
                  <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8">
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
                  <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8">
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
                  <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 md:gap-x-8">
                    <div className="relative">
                      <select
                        name="event_type"
                        value={form.event_type}
                        onChange={updateField}
                        required
                        className={`${selectBase} ${!form.event_type ? "text-[#C6A75E]/60" : ""}`}
                        data-testid="enquiry-event-type-select"
                      >
                        <option value="" disabled>Event Type</option>
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
                        className={`${selectBase} ${!form.referral_source ? "text-[#C6A75E]/60" : ""}`}
                        data-testid="enquiry-referral-select"
                      >
                        <option value="" disabled>How did you hear about us?</option>
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
                  <div>
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
                      className="border border-[#C6A75E] bg-transparent px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-[#C6A75E] transition-colors duration-300 hover:bg-[#C6A75E] hover:text-[#3C0518] disabled:opacity-50 sm:px-8 sm:py-2.5 sm:text-xs"
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
                <p className="serif-display mt-4 text-2xl text-[#3C0518] sm:text-3xl" data-testid="enquiry-success-title">
                  Thank you.
                </p>
                <p className="mt-3 text-sm text-[#50332F]" data-testid="enquiry-success-text">
                  Our team will reach out shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

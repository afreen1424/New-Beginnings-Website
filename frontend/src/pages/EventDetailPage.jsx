import { Link, useParams } from "react-router-dom";
import { portfolioEvents } from "../data/siteContent";

export default function EventDetailPage() {
  const { category, eventId } = useParams();
  const categoryEvents = portfolioEvents[category] || [];
  const event = categoryEvents.find((item) => item.id === eventId);

  if (!event) {
    return (
      <div className="bg-[#F5EFE6] px-5 pb-20 pt-28 text-center sm:px-8" data-testid="event-not-found-page">
        <h1 className="serif-display text-4xl text-[#350A13]" data-testid="event-not-found-heading">
          Event Not Found
        </h1>
        <Link to="/portfolio" className="gold-outline-button mt-8 inline-flex" data-testid="event-not-found-back-button">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE6] px-5 pb-20 pt-28 sm:px-8 lg:px-12" data-testid="event-detail-page">
      <div className="mx-auto w-full max-w-6xl">
        <img
          src={event.cover}
          alt={event.title}
          loading="eager"
          className="aspect-[16/8] w-full rounded-3xl object-cover object-center"
          data-testid="event-detail-hero-image"
        />

        <h1 className="serif-display mt-10 text-4xl text-[#350A13] sm:text-5xl" data-testid="event-detail-title">
          {event.title}
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[#4B0F1B]" data-testid="event-detail-subtitle">
          {event.subtitle}
        </p>

        <p className="mt-8 max-w-4xl text-base leading-relaxed text-[#50332F] sm:text-lg" data-testid="event-detail-story">
          {event.story}
        </p>

        {event.testimonial && (
          <blockquote
            className="mt-8 rounded-2xl border border-[#C6A75E]/40 bg-white p-6 text-base italic text-[#4B0F1B]"
            data-testid="event-detail-testimonial"
          >
            “{event.testimonial}”
          </blockquote>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="event-detail-gallery">
          {event.gallery.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${event.title} gallery ${index + 1}`}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover object-center"
              data-testid={`event-detail-gallery-image-${index}`}
            />
          ))}
        </div>

        <Link to="/enquiry" className="gold-outline-button mt-12 inline-flex" data-testid="event-detail-cta-button">
          Begin Your Celebration
        </Link>
      </div>
    </div>
  );
}
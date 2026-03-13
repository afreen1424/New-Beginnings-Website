import { Link, useParams } from "react-router-dom";
import { portfolioEvents } from "../data/siteContent";

export default function EventDetailPage() {
  const { category, eventId } = useParams();
  const categoryEvents = portfolioEvents[category] || [];
  const event = categoryEvents.find((item) => item.id === eventId);
  const galleryImages = [...(event?.gallery || [])];

  while (galleryImages.length < 4 && galleryImages.length > 0) {
    galleryImages.push(galleryImages[galleryImages.length - 1]);
  }

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
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="serif-display text-center text-4xl text-[#350A13] sm:text-5xl" data-testid="event-detail-title">
          {event.title}
        </h1>
        <div className="mx-auto mt-3 h-[1px] w-36 bg-[#C6A75E]" data-testid="event-detail-title-underline" />

        <img
          src={event.cover}
          alt={event.title}
          loading="eager"
          className="mt-8 aspect-[16/8] w-full rounded-3xl object-cover object-center"
          data-testid="event-detail-hero-image"
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2" data-testid="event-detail-gallery">
          {galleryImages.slice(0, 4).map((image, index) => (
            <div key={`${image}-${index}`} className="section-fade-up" style={{ animationDelay: `${index * 120}ms` }} data-testid={`event-detail-gallery-wrap-${index}`}>
              <img
                src={image}
                alt={`${event.title} gallery ${index + 1}`}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl object-cover object-center"
                data-testid={`event-detail-gallery-image-${index}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center" data-testid="event-detail-cta-wrap">
          <Link to="/enquiry" className="gold-outline-button inline-flex" data-testid="event-detail-cta-button">
            Begin Your Celebration
          </Link>
        </div>
      </div>
    </div>
  );
}
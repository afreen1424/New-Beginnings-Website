import { Link } from "react-router-dom";
import FadeCarousel from "../../components/common/FadeCarousel";
import { corporateService } from "../../data/siteContent";

export default function CorporateEventsPage() {
  const slides = corporateService.slides.map((image) => ({ image, couple: "", theme: "" }));

  return (
    <div className="bg-[#E8D8C3] pb-20 pt-20" data-testid="corporate-service-page">
      <section data-testid="corporate-carousel-section">
        <FadeCarousel slides={slides} testId="corporate-service-carousel" />
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pt-14 text-center sm:px-8" data-testid="corporate-heading-section">
        <h1 className="serif-display text-4xl text-[#3E0B14] sm:text-5xl" data-testid="corporate-heading">
          Strategic Events. Seamless Execution.
        </h1>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-5 sm:px-8" data-testid="corporate-showcase-section">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" data-testid="corporate-showcase-grid">
          {corporateService.showcase.map((item, index) => (
            <article
              key={item.title}
              className={`group overflow-hidden rounded-2xl bg-white transition-transform duration-500 ${index % 2 === 0 ? "hover:-translate-y-1" : "hover:translate-y-1"}`}
              data-testid={`corporate-showcase-card-${index}`}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover object-center"
                data-testid={`corporate-showcase-image-${index}`}
              />
              <h2 className="serif-display p-5 text-2xl text-[#3E0B14]" data-testid={`corporate-showcase-title-${index}`}>
                {item.title}
              </h2>
            </article>
          ))}
        </div>

        <Link to="/enquiry" className="gold-outline-button mt-12 inline-flex" data-testid="corporate-service-cta-button">
          Plan a Corporate Experience
        </Link>
      </section>
    </div>
  );
}
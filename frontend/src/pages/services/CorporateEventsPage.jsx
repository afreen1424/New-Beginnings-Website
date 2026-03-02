import { Link } from "react-router-dom";
import FadeCarousel from "../../components/common/FadeCarousel";
import RevealBlock from "../../components/common/RevealBlock";
import { corporateService } from "../../data/siteContent";

export default function CorporateEventsPage() {
  const slides = corporateService.slides.map((image) => ({ image, couple: "", theme: "" }));

  return (
    <div className="bg-ivory pb-20 pt-20" data-testid="corporate-service-page">
      <section className="relative" data-testid="corporate-carousel-section">
        <FadeCarousel slides={slides} testId="corporate-service-carousel" fadeDuration={900} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(75,15,27,0.2)] to-[rgba(75,15,27,0.78)]" data-testid="corporate-carousel-overlay" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center" data-testid="corporate-heading-section">
          <h1 className="serif-display text-4xl text-[#F5EFE6] sm:text-5xl" data-testid="corporate-heading">
            Strategic Events. Seamless Execution.
          </h1>
        </div>
      </section>

      <section className="section-fade-up mx-auto w-full max-w-6xl px-5 pt-14 text-center sm:px-8" data-testid="corporate-about-section">
        <p className="about-poetic-heading text-4xl sm:text-5xl" data-testid="corporate-about-hook">
          Crafted for Scale, Led with Precision.
        </p>
        <div className="about-hook-divider mx-auto mt-4" data-testid="corporate-about-divider" />
        <p className="mx-auto mt-6 max-w-4xl text-base leading-relaxed text-[#4C3330] sm:text-lg" data-testid="corporate-about-paragraph">
          We curate corporate experiences that reflect precision, scale, and brand identity — from fashion showcases to large-scale productions executed seamlessly.
        </p>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-5 sm:px-8" data-testid="corporate-showcase-section">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" data-testid="corporate-showcase-grid">
          {corporateService.showcase.map((item, index) => (
            <RevealBlock key={item.title} direction={index % 2 === 0 ? "left" : "right"} delay={index * 100} testId={`corporate-showcase-reveal-${index}`}>
              <article
                className="group relative overflow-hidden rounded-2xl"
                data-testid={`corporate-showcase-card-${index}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover object-center"
                  data-testid={`corporate-showcase-image-${index}`}
                />
                <div className="service-card-overlay absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-100" data-testid={`corporate-showcase-overlay-${index}`} />
                <h2 className="serif-display absolute inset-0 flex items-center justify-center px-4 text-center text-2xl text-[#F5EFE6]" data-testid={`corporate-showcase-title-${index}`}>
                  {item.title}
                </h2>
              </article>
            </RevealBlock>
          ))}
        </div>

        <div className="mt-12 text-center" data-testid="corporate-cta-wrapper">
          <Link to="/enquiry" className="gold-outline-button inline-flex" data-testid="corporate-service-cta-button">
            Plan a Corporate Experience
          </Link>
        </div>
      </section>
    </div>
  );
}
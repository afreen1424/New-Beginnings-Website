import { Link } from "react-router-dom";
import FadeCarousel from "../../components/common/FadeCarousel";
import RevealBlock from "../../components/common/RevealBlock";
import { brandConfig } from "../../data/siteContent";

const corporateMedia = [
  { title: "Fashion Shows", image: "/assets/corporate/corp_custom_1.webp", direction: "left" },
  { title: "Awards Functions", image: "/assets/corporate/corp_custom_2.webp", direction: "right" },
  { title: "Large Scale MNC Events", image: "/assets/corporate/corp_custom_3.webp", direction: "left" },
  { title: "School/College Events", image: "/assets/corporate/corp_custom_4.webp", direction: "right" },
];

export default function CorporateEventsPage() {
  const slides = corporateMedia.map((item) => ({ image: item.image, couple: "" }));

  return (
    <div className="bg-ivory pb-20" data-testid="corporate-service-page">
      <section className="relative" data-testid="corporate-carousel-section">
        <FadeCarousel
          slides={slides}
          testId="corporate-service-carousel"
          fadeDuration={850}
          interval={4700}
          transitionType="slide"
          fullHeight
        />
        <div className="mobile-hero-brand-overlay lg:hidden" data-testid="corporate-mobile-hero-brand-overlay">
          <img src={brandConfig.logo} alt="New Beginnings Events" className="mobile-hero-brand-logo" loading="eager" data-testid="corporate-mobile-hero-brand-logo" />
          <p className="mobile-hero-brand-name signature-script" data-testid="corporate-mobile-hero-brand-name">
            New Beginnings Events
          </p>
        </div>
      </section>

      <section className="section-fade-up mx-auto w-full max-w-6xl px-5 pt-14 text-center sm:px-8" data-testid="corporate-about-section">
        <p className="serif-display text-3xl text-[#3C0518] sm:text-4xl" data-testid="corporate-about-hook">
          Crafted for Scale, Led with Precision.
        </p>
        <div className="about-hook-divider mx-auto mt-4" data-testid="corporate-about-divider" />
        <p className="mx-auto mt-6 max-w-4xl text-base leading-relaxed text-[#4C3330] sm:text-lg" data-testid="corporate-about-paragraph">
          At New Beginnings Events, we design and execute experiences ranging from concert productions and fashion showcases to school and college events, large-scale MNC gatherings, and prestigious award ceremonies. With a structured end-to-end approach, our team oversees every stage — from concept development and production planning to flawless on-ground execution — ensuring each event reflects professionalism, impact, and meticulous attention to detail.
        </p>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-5 sm:px-8" data-testid="corporate-showcase-section">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2" data-testid="corporate-showcase-grid">
          {corporateMedia.map((item, index) => (
            <RevealBlock key={item.title} direction={item.direction} delay={index * 100} testId={`corporate-showcase-reveal-${index}`}>
              <article className="group relative cursor-pointer overflow-hidden rounded-2xl" data-testid={`corporate-showcase-card-${index}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  data-testid={`corporate-showcase-image-${index}`}
                />
                <div className="service-card-overlay absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-100" data-testid={`corporate-showcase-overlay-${index}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-testid={`corporate-showcase-title-wrap-${index}`}>
                  <h2 className="serif-display px-4 text-center text-2xl text-[#F5EFE6]" data-testid={`corporate-showcase-title-${index}`}>
                    {item.title}
                  </h2>
                  <div className="mt-2 h-[1px] w-12 bg-[#C6A75E] transition-all duration-300 group-hover:w-24" data-testid={`corporate-showcase-underline-${index}`} />
                </div>
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
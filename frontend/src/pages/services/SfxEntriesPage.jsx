import FadeCarousel from "../../components/common/FadeCarousel";
import RevealBlock from "../../components/common/RevealBlock";
import { brandConfig, sfxService } from "../../data/siteContent";

export default function SfxEntriesPage() {
  const slides = sfxService.slides.map((image) => ({ image, couple: "", theme: "" }));

  return (
    <div className="bg-ivory pb-20 pt-20" data-testid="sfx-service-page">
      <section className="relative" data-testid="sfx-carousel-section">
        <FadeCarousel slides={slides} testId="sfx-service-carousel" fadeDuration={900} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(75,15,27,0.2)] to-[rgba(75,15,27,0.8)]" data-testid="sfx-carousel-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center" data-testid="sfx-heading-section">
          <h1 className="serif-display text-4xl text-[#F5EFE6] sm:text-5xl" data-testid="sfx-heading">
            Make an Entrance They&apos;ll Never Forget.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[rgba(245,239,230,0.92)] sm:text-base" data-testid="sfx-hero-paragraph">
            From cinematic walk-ins to precision-timed special effects, each entrance is engineered to create a lasting first moment with elegance and impact.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-5 sm:px-8" data-testid="sfx-grid-section">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="sfx-grid">
          {sfxService.showcases.map((item, index) => (
            <RevealBlock key={item.title} direction={index % 2 === 0 ? "left" : "right"} delay={index * 80} testId={`sfx-card-reveal-${index}`}>
              <article className="group relative overflow-hidden rounded-2xl" data-testid={`sfx-card-${index}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[5/4] w-full object-cover object-center"
                  data-testid={`sfx-card-image-${index}`}
                />
                <div className="service-card-overlay absolute inset-0 opacity-25 transition-opacity duration-500 group-hover:opacity-100" data-testid={`sfx-card-overlay-${index}`} />
                <h2 className="serif-display absolute inset-0 flex items-center justify-center px-4 text-center text-xl text-[#F5EFE6]" data-testid={`sfx-card-title-${index}`}>
                  {item.title}
                </h2>
              </article>
            </RevealBlock>
          ))}
        </div>

        <div className="mt-12 text-center" data-testid="sfx-cta-wrapper">
          <a href={brandConfig.whatsappLink} target="_blank" rel="noreferrer" className="gold-outline-button inline-flex" data-testid="sfx-whatsapp-cta-button">
            Plan Your Signature Entry
          </a>
        </div>
      </section>
    </div>
  );
}
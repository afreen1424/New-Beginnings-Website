import { brandConfig, cateringService } from "../../data/siteContent";
import FadeCarousel from "../../components/common/FadeCarousel";
import RevealBlock from "../../components/common/RevealBlock";

export default function CateringPage() {
  const slides = cateringService.slides.map((image) => ({ image, couple: "", theme: "" }));

  return (
    <div className="bg-ivory pb-20 pt-20" data-testid="catering-service-page">
      <section className="relative" data-testid="catering-carousel-section">
        <FadeCarousel slides={slides} testId="catering-service-carousel" fadeDuration={900} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(75,15,27,0.2)] to-[rgba(75,15,27,0.78)]" data-testid="catering-carousel-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center" data-testid="catering-heading-section">
          <h1 className="serif-display text-4xl text-[#F5EFE6] sm:text-5xl" data-testid="catering-heading">
            Curated Culinary Experiences.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#F5EFE6]/92 sm:text-base" data-testid="catering-hero-paragraph">
            Refined menu design, seamless service, and elevated presentation come together to create dining that feels as memorable as the celebration itself.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-12 grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center" data-testid="catering-veg-section">
        <RevealBlock direction="left" testId="catering-veg-image-reveal">
          <img
            src={cateringService.veg.image}
            alt={cateringService.veg.title}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover object-center"
            data-testid="catering-veg-image"
          />
        </RevealBlock>
        <RevealBlock direction="right" testId="catering-veg-text-reveal">
          <h2 className="serif-display text-3xl text-[#350A13]" data-testid="catering-veg-title">
            {cateringService.veg.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#50332F]" data-testid="catering-veg-text">
            {cateringService.veg.text}
          </p>
        </RevealBlock>
      </section>

      <section className="mx-auto mt-16 grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center" data-testid="catering-nonveg-section">
        <RevealBlock direction="left" testId="catering-nonveg-text-reveal">
          <h2 className="serif-display text-3xl text-[#350A13]" data-testid="catering-nonveg-title">
            {cateringService.nonVeg.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#50332F]" data-testid="catering-nonveg-text">
            {cateringService.nonVeg.text}
          </p>
        </RevealBlock>
        <RevealBlock direction="right" testId="catering-nonveg-image-reveal">
          <img
            src={cateringService.nonVeg.image}
            alt={cateringService.nonVeg.title}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover object-center"
            data-testid="catering-nonveg-image"
          />
        </RevealBlock>
      </section>

      <div className="mx-auto mt-14 h-[1px] w-full max-w-5xl bg-[#C6A75E]/55" data-testid="catering-section-divider" />

      <section className="mx-auto mt-16 w-full max-w-6xl px-5 text-center sm:px-8" data-testid="catering-cta-section">
        <a href={brandConfig.whatsappLink} target="_blank" rel="noreferrer" className="gold-outline-button inline-flex" data-testid="catering-whatsapp-cta-button">
          Ready to Curate Your Menu?
        </a>
      </section>
    </div>
  );
}
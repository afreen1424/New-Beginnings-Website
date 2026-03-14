import { brandConfig, cateringService } from "../../data/siteContent";
import RevealBlock from "../../components/common/RevealBlock";

export default function CateringPage() {
  return (
    <div className="bg-ivory pb-20" data-testid="catering-service-page">
      <section className="relative" data-testid="catering-hero-section">
        <div className="relative h-[70vh] min-h-[400px] w-full overflow-hidden">
          <img
            src={cateringService.slides[0]}
            alt="Curated Culinary Experiences"
            className="h-full w-full object-cover object-center"
            loading="eager"
            data-testid="catering-hero-image"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pt-14 text-center sm:px-8" data-testid="catering-heading-section">
        <h1 className="serif-display text-4xl text-[#3C0518] sm:text-5xl" data-testid="catering-heading">
          Curated Culinary Experiences
        </h1>
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
            Vegetarian Menu
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#50332F]" data-testid="catering-veg-text">
            We curate an extensive range of vegetarian cuisine that celebrates the richness of both South Indian and North Indian traditions. From comforting classics to refined regional specialties, every dish is crafted to deliver exceptional flavor and presentation. Our team works closely with you to design a menu that perfectly reflects your taste and the spirit of your celebration.
          </p>
        </RevealBlock>
      </section>

      <section className="mx-auto mt-16 grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center" data-testid="catering-nonveg-section">
        <RevealBlock direction="left" testId="catering-nonveg-text-reveal">
          <h2 className="serif-display text-3xl text-[#350A13]" data-testid="catering-nonveg-title">
            Non-Veg Menu
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#50332F]" data-testid="catering-nonveg-text">
            Our non-vegetarian menus are designed to bring together bold flavors, premium ingredients, and refined culinary techniques. From traditional favorites to contemporary preparations, every dish is thoughtfully curated to create a memorable dining experience. Each menu is tailored to complement your event while ensuring exceptional taste and presentation.
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

      <section className="mx-auto mt-16 w-full max-w-6xl px-5 text-center sm:px-8" data-testid="catering-cta-section">
        <a href={brandConfig.whatsappLink} target="_blank" rel="noreferrer" className="gold-outline-button inline-flex" data-testid="catering-whatsapp-cta-button">
          Ready to Curate Your Menu?
        </a>
      </section>
    </div>
  );
}
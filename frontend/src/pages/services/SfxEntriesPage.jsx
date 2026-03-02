import FadeCarousel from "../../components/common/FadeCarousel";
import { brandConfig, sfxService } from "../../data/siteContent";

export default function SfxEntriesPage() {
  const slides = sfxService.slides.map((image) => ({ image, couple: "", theme: "" }));

  return (
    <div className="bg-[#E8D8C3] pb-20 pt-20" data-testid="sfx-service-page">
      <section data-testid="sfx-carousel-section">
        <FadeCarousel slides={slides} testId="sfx-service-carousel" />
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pt-14 text-center sm:px-8" data-testid="sfx-heading-section">
        <h1 className="serif-display text-4xl text-[#3E0B14] sm:text-5xl" data-testid="sfx-heading">
          Make an Entrance They&apos;ll Never Forget.
        </h1>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-5 sm:px-8" data-testid="sfx-grid-section">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="sfx-grid">
          {sfxService.showcases.map((item, index) => (
            <article key={item.title} className="overflow-hidden rounded-2xl bg-white" data-testid={`sfx-card-${index}`}>
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="aspect-[5/4] w-full object-cover object-center"
                data-testid={`sfx-card-image-${index}`}
              />
              <h2 className="serif-display p-4 text-xl text-[#3E0B14]" data-testid={`sfx-card-title-${index}`}>
                {item.title}
              </h2>
            </article>
          ))}
        </div>

        <a href={brandConfig.whatsappLink} target="_blank" rel="noreferrer" className="gold-outline-button mt-12 inline-flex" data-testid="sfx-whatsapp-cta-button">
          Plan Your Signature Entry
        </a>
      </section>
    </div>
  );
}
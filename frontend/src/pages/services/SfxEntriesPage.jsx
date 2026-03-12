import { useEffect, useRef, useState } from "react";
import FadeCarousel from "../../components/common/FadeCarousel";
import RevealBlock from "../../components/common/RevealBlock";
import { brandConfig } from "../../data/siteContent";

const heroSlides = [
  { image: "/assets/sfx_custom/sfx_hero_1.webp", couple: "" },
  { image: "/assets/sfx_custom/sfx_hero_2.webp", couple: "" },
  { image: "/assets/sfx_custom/sfx_hero_3.webp", couple: "" },
  { image: "/assets/sfx_custom/sfx_hero_4.webp", couple: "" },
  { image: "/assets/sfx_custom/sfx_hero_5.webp", couple: "" },
];

const sfxGridItems = [
  { title: "Cold Pyros", image: "/assets/sfx_custom/sfx_hero_5.webp" },
  { title: "Fog Effects", image: "/assets/sfx_custom/sfx_hero_4.webp" },
  { title: "Cracker Show", image: "/assets/sfx_custom/sfx_hero_3.webp" },
  { title: "Jet Effect", image: "/assets/sfx_custom/sfx_hero_2.webp" },
  { title: "Fan Wheel", image: "/assets/sfx_custom/sfx_hero_1.webp" },
  { title: "Colour Bomb", image: "/assets/sfx_custom/sfx_colour_bomb.webp" },
];

export default function SfxEntriesPage() {
  const [introVisible, setIntroVisible] = useState(false);
  const introSectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntroVisible(entry.isIntersecting);
      },
      { threshold: 0.28 },
    );

    if (introSectionRef.current) {
      observer.observe(introSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-ivory pb-20" data-testid="sfx-service-page">
      <section data-testid="sfx-carousel-section">
        <FadeCarousel
          slides={heroSlides}
          testId="sfx-service-carousel"
          fadeDuration={850}
          interval={4700}
          transitionType="slide"
          fullHeight
          caption={false}
        />
      </section>

      <section ref={introSectionRef} className="mx-auto mt-12 w-full max-w-6xl px-5 text-center sm:px-8" data-testid="sfx-intro-section">
        <h1 className={`serif-display section-heading-slide text-3xl text-[#3C0518] sm:text-4xl ${introVisible ? "is-visible" : ""}`} data-testid="sfx-heading">
          For Moments That Begin with Magic
        </h1>
        <p className="mx-auto mt-6 max-w-4xl text-base leading-relaxed text-[#4C3330] sm:text-lg" data-testid="sfx-description">
          Every celebration deserves a moment that captures attention and sets the stage for what follows. From cold pyros and fog effects to cracker shows, CO₂ jets, fan wheels, and colour bombs, we design breathtaking special effects that transform entrances into unforgettable highlights. Each effect is carefully timed to create a magical atmosphere that leaves a lasting impression.
        </p>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-5 sm:px-8" data-testid="sfx-grid-section">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="sfx-grid">
          {sfxGridItems.map((item, index) => (
            <RevealBlock key={item.title} direction="up" delay={index * 110} testId={`sfx-card-reveal-${index}`}>
              <article className="group relative cursor-pointer overflow-hidden rounded-2xl" data-testid={`sfx-card-${index}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[5/4] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  data-testid={`sfx-card-image-${index}`}
                />
                <div className="service-card-overlay absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-100" data-testid={`sfx-card-overlay-${index}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-testid={`sfx-card-title-wrap-${index}`}>
                  <h2 className="serif-display px-4 text-center text-xl text-[#F5EFE6]" data-testid={`sfx-card-title-${index}`}>
                    {item.title}
                  </h2>
                  <div className="mt-2 h-[1px] w-12 bg-[#C6A75E] transition-all duration-300 group-hover:w-24" data-testid={`sfx-card-underline-${index}`} />
                </div>
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
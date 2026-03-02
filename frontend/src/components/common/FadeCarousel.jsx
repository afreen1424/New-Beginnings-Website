import { useEffect, useState } from "react";

export default function FadeCarousel({ slides, interval = 4500, caption = false, testId = "fade-carousel", fadeDuration = 900 }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides?.length) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides, interval]);

  if (!slides?.length) return null;

  return (
    <div className="relative w-full overflow-hidden" data-testid={testId}>
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        {slides.map((slide, index) => (
          <img
            key={`${slide.image}-${index}`}
            src={slide.image}
            alt={slide.couple || slide.title || "Celebration visual"}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity ease-in-out ${
              activeIndex === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: `${fadeDuration}ms` }}
            data-testid={`${testId}-image-${index}`}
          />
        ))}
      </div>

      {caption && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgba(62,11,20,0.92)] to-transparent" />
          <div className="absolute bottom-5 left-5 z-10 sm:bottom-8 sm:left-10" data-testid={`${testId}-caption`}>
            <p className="serif-display text-xl text-[#E8D8C3] sm:text-2xl" data-testid={`${testId}-caption-name`}>
              {slides[activeIndex].couple}
            </p>
            <p className="mt-1 uppercase tracking-[0.28em] text-[#C6A75E] text-xs sm:text-sm" data-testid={`${testId}-caption-theme`}>
              {slides[activeIndex].theme}
            </p>
            <div className="mt-2 h-[1px] w-20 bg-[#C6A75E]" data-testid={`${testId}-caption-underline`} />
          </div>
        </>
      )}
    </div>
  );
}
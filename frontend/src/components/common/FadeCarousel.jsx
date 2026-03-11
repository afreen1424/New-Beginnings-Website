import { useEffect, useState } from "react";

export default function FadeCarousel({
  slides,
  interval = 4500,
  caption = false,
  testId = "fade-carousel",
  fadeDuration = 900,
  fullHeight = false,
  transitionType = "fade",
}) {
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
    <div className={`relative w-full overflow-hidden ${fullHeight ? "h-full" : ""}`} data-testid={testId}>
      <div className={`relative w-full ${fullHeight ? "h-full" : "aspect-[16/9] sm:aspect-[21/9]"}`}>
        {transitionType === "slide" ? (
          <div
            className="flex h-full w-full"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              transition: `transform ${fadeDuration}ms ease-in-out`,
            }}
            data-testid={`${testId}-slide-track`}
          >
            {slides.map((slide, index) => (
              <img
                key={`${slide.image}-${index}`}
                src={slide.image}
                alt={slide.couple || slide.title || "Celebration visual"}
                loading="lazy"
                className="h-full w-full shrink-0 object-cover object-center"
                data-testid={`${testId}-image-${index}`}
              />
            ))}
          </div>
        ) : (
          slides.map((slide, index) => (
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
          ))
        )}
      </div>

      {caption && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgba(62,11,20,0.92)] to-transparent" />
          <div className="absolute bottom-16 right-4 z-10 text-right sm:bottom-8 sm:right-10" data-testid={`${testId}-caption`}>
            <p
              key={`${slides[activeIndex].couple}-${activeIndex}`}
              className="carousel-couple-name serif-display max-w-[74vw] text-base leading-tight text-[#C6A75E] sm:max-w-none sm:text-2xl"
              data-testid={`${testId}-caption-name`}
            >
              {slides[activeIndex].couple}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";

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
  const [slideIndex, setSlideIndex] = useState(1);
  const [disableSlideTransition, setDisableSlideTransition] = useState(false);

  const slideTrackItems = useMemo(() => {
    if (!slides?.length || transitionType !== "slide") return slides || [];
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides, transitionType]);

  useEffect(() => {
    if (transitionType === "slide") {
      setSlideIndex(1);
      setDisableSlideTransition(false);
    } else {
      setActiveIndex(0);
    }
  }, [slides, transitionType]);

  useEffect(() => {
    if (!slides?.length) return undefined;
    const timer = setInterval(() => {
      if (transitionType === "slide") {
        setDisableSlideTransition(false);
        setSlideIndex((prev) => prev + 1);
      } else {
        setActiveIndex((prev) => (prev + 1) % slides.length);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [slides, interval, transitionType]);

  useEffect(() => {
    if (transitionType !== "slide" || !slides?.length) return;

    if (slideIndex === slides.length + 1) {
      const timer = setTimeout(() => {
        setDisableSlideTransition(true);
        setSlideIndex(1);
      }, fadeDuration);
      return () => clearTimeout(timer);
    }

    if (slideIndex === 0) {
      const timer = setTimeout(() => {
        setDisableSlideTransition(true);
        setSlideIndex(slides.length);
      }, fadeDuration);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [slideIndex, slides, transitionType, fadeDuration]);

  if (!slides?.length) return null;

  return (
    <div className={`relative w-full overflow-hidden ${fullHeight ? "h-screen" : ""}`} data-testid={testId}>
      <div className={`relative w-full ${fullHeight ? "h-screen" : "aspect-[16/9] sm:aspect-[21/9]"}`}>
        {transitionType === "slide" ? (
          <div
            className="flex h-full w-full"
            style={{
              transform: `translateX(-${slideIndex * 100}%)`,
              transition: disableSlideTransition ? "none" : `transform ${fadeDuration}ms ease-in-out`,
            }}
            data-testid={`${testId}-slide-track`}
          >
            {slideTrackItems.map((slide, index) => (
              <img
                key={`${slide.image}-${index}`}
                src={slide.image}
                alt={slide.couple || slide.title || "Celebration visual"}
                loading="lazy"
                className="h-full w-full shrink-0 object-cover object-center"
                style={fullHeight ? { height: "100vh", width: "100%", objectFit: "cover", objectPosition: "center" } : undefined}
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
              style={fullHeight ? { transitionDuration: `${fadeDuration}ms`, height: "100vh", width: "100%", objectFit: "cover", objectPosition: "center" } : { transitionDuration: `${fadeDuration}ms` }}
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
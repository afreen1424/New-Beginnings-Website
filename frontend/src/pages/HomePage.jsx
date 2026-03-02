import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FadeCarousel from "../components/common/FadeCarousel";
import RevealBlock from "../components/common/RevealBlock";
import {
  coupleReviews,
  homeCarouselSlides,
  portfolioEvents,
  socialLinks,
} from "../data/siteContent";

const HERO_TITLE = "NEW BEGINNINGS EVENTS";

function HeroLogoLineDraw() {
  return (
    <div className="hero-logo-draw mx-auto" data-testid="home-hero-logo">
      <svg viewBox="0 0 120 120" role="img" aria-label="New Beginnings Events Monogram">
        <circle className="hero-logo-stroke hero-logo-path-1" cx="60" cy="60" r="44" fill="none" />
        <path className="hero-logo-stroke hero-logo-path-2" d="M42 84V36L74 76V36" fill="none" />
        <path
          className="hero-logo-stroke hero-logo-path-3"
          d="M76 84V36H87C94 36 98.5 40.4 98.5 46.4C98.5 52 95.4 55.2 90.4 56.5C96.5 57.8 100 61.8 100 67.9C100 75.5 94.7 84 84.5 84H76Z"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default function HomePage({ onIntroComplete }) {
  const [showTitle, setShowTitle] = useState(false);
  const [heroContentFading, setHeroContentFading] = useState(false);
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [decorScale, setDecorScale] = useState(1);
  const decorRef = useRef(null);
  const introDoneRef = useRef(false);
  const onIntroCompleteRef = useRef(onIntroComplete);

  const portfolioPreview = useMemo(() => portfolioEvents.weddings.slice(0, 4), []);

  useEffect(() => {
    onIntroCompleteRef.current = onIntroComplete;
  }, [onIntroComplete]);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setHeroContentFading(false);
    setCarouselVisible(false);

    const showTimer = setTimeout(() => setShowTitle(true), 600);
    const fadeOutStart = mobile ? 4200 : 4500;
    const textFadeTimer = setTimeout(() => setHeroContentFading(true), fadeOutStart);
    const revealTimer = setTimeout(() => setCarouselVisible(true), fadeOutStart);

    const doneTimer = setTimeout(() => {
      if (introDoneRef.current) return;
      introDoneRef.current = true;
      onIntroCompleteRef.current?.();
    }, fadeOutStart + 720);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(textFadeTimer);
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, [mobile]);

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % coupleReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!decorRef.current) return;
      const rect = decorRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
      setDecorScale(1 + progress * 0.06);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="overflow-hidden" data-testid="home-page">
      <section className="bg-royal-velvet relative flex min-h-screen items-center justify-center px-5 text-center" data-testid="home-hero-section">
        <div
          className={`hero-carousel-layer absolute inset-0 ${carouselVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
          data-testid="home-main-carousel-section"
        >
          <FadeCarousel slides={homeCarouselSlides} caption testId="home-main-carousel" fadeDuration={900} />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(75,15,27,0.38)] to-[rgba(75,15,27,0.72)]" />
        </div>

        <div
          className={`hero-content-shell relative z-10 mx-auto max-w-5xl ${heroContentFading ? "hero-content-fade-out" : ""}`}
          data-testid="home-hero-content"
        >
          <HeroLogoLineDraw />

          {showTitle && (
            <h1
              className="serif-display hero-title-gold mt-8 text-3xl font-normal sm:whitespace-nowrap sm:text-5xl lg:text-6xl"
              style={{ letterSpacing: mobile ? "0.18em" : "0.3em" }}
              data-testid="home-hero-heading"
            >
              {HERO_TITLE.split("").map((char, idx) => (
                <span
                  key={`${char}-${idx}`}
                  className="hero-letter"
                  style={{ animationDelay: `${idx * (mobile ? 0.05 : 0.07)}s` }}
                  data-testid={`hero-letter-${idx}`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
          )}
        </div>
      </section>

      <section className="bg-ivory section-fade-up px-5 py-24 sm:px-8 lg:px-12" data-testid="home-about-section">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-2">
          <RevealBlock direction="left" testId="about-text-reveal">
            <h2 className="about-poetic-heading mt-4 text-4xl sm:text-5xl" data-testid="about-heading">
              Shall we set the date to forever?
            </h2>
            <div className="about-hook-divider mt-5" data-testid="about-hook-divider" />
            <p className="mt-8 max-w-xl text-base leading-relaxed text-[#4C3330] sm:text-lg" data-testid="about-paragraph">
              At New Beginnings Events, we design celebrations that transcend trends and time. From intimate ceremonies to grand wedding experiences,
              every detail is curated with intention and artistry. We do not simply plan events — we orchestrate moments that live beautifully in memory.
            </p>
            <Link to="/enquiry" className="gold-outline-button mt-8 inline-flex" data-testid="about-cta-button">
              Let&apos;s Begin
            </Link>
          </RevealBlock>

          <RevealBlock direction="right" testId="about-image-reveal">
            <div className="relative mx-auto w-full max-w-[250px] lg:ml-auto" data-testid="about-image-wrapper">
              <div className="absolute left-1/2 top-[-9px] z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-[#C6A75E] shadow-[0_0_8px_rgba(198,167,94,0.42)]" data-testid="about-image-pin" />
              <div className="overflow-hidden rounded-2xl shadow-[0_14px_30px_rgba(62,11,20,0.14)]" data-testid="about-image-inner">
                <img
                  src="/assets/wedding-3.webp"
                  alt="Luxury wedding portrait"
                  loading="lazy"
                  className="aspect-square w-full object-cover object-center"
                  data-testid="about-image"
                />
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      <section ref={decorRef} className="bg-royal-velvet section-fade-up px-5 py-20 sm:px-8 lg:px-12" data-testid="home-decor-highlight-section">
        <div className="mx-auto w-full max-w-6xl">
          <p className="serif-display text-center text-3xl text-[#F5EFE6] sm:text-4xl" data-testid="decor-kicker">
            Every Detail Tells a Story.
          </p>
          <RevealBlock direction="up" testId="decor-arch-reveal">
            <div className="mx-auto mt-10 w-full max-w-6xl" data-testid="decor-arch-container">
              <div className="arch-editorial-frame" data-testid="decor-video-wrapper">
                <div className="arch-editorial-inner" data-testid="decor-arch-inner">
                  <video
                    src="/assets/decor-video.webm"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-500"
                    style={{ transform: `scale(${decorScale})` }}
                    data-testid="decor-highlight-video"
                  />
                </div>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      <section className="bg-ivory section-fade-up px-5 py-20 sm:px-8 lg:px-12" data-testid="home-portfolio-preview-section">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="serif-display text-center text-3xl text-[#350A13] sm:text-4xl" data-testid="portfolio-preview-heading">
            Stories We&apos;ve Brought to Life.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4" data-testid="portfolio-preview-grid">
            {portfolioPreview.map((event) => (
              <Link
                key={event.id}
                to={`/portfolio/weddings/${event.id}`}
                className="group relative overflow-hidden rounded-2xl"
                data-testid={`portfolio-preview-card-${event.id}`}
              >
                <img
                  src={event.cover}
                  alt={event.title}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  data-testid={`portfolio-preview-image-${event.id}`}
                />
                <div className="service-card-overlay absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-testid={`portfolio-preview-overlay-${event.id}`}>
                  <p className="serif-display text-2xl text-[#F5EFE6]" data-testid={`portfolio-preview-title-${event.id}`}>
                    {event.title}
                  </p>
                  <div className="mt-2 h-[1px] w-12 bg-[#C6A75E] transition-all duration-300 group-hover:w-24" data-testid={`portfolio-preview-underline-${event.id}`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory section-fade-up px-5 py-20 sm:px-8 lg:px-12" data-testid="home-reviews-section">
        <div className="mx-auto w-full max-w-4xl text-center">
          <h2 className="serif-display text-3xl text-[#350A13] sm:text-4xl" data-testid="reviews-heading">
            Words from Our Couples.
          </h2>

          <div className="relative mt-8 min-h-[210px]" data-testid="reviews-slider">
            {coupleReviews.map((review, index) => (
              <article
                key={review.name}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
                  reviewIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                data-testid={`review-slide-${index}`}
              >
                <div className="rounded-2xl border border-[#C6A75E]/45 bg-white px-7 py-8 shadow-[0_18px_30px_rgba(75,15,27,0.08)]">
                  <div className="mb-3 flex justify-center gap-1 text-[#C6A75E]" data-testid={`review-stars-${index}`}>
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <span key={starIdx}>★</span>
                    ))}
                  </div>
                  <p className="serif-display text-2xl text-[#350A13]" data-testid={`review-name-${index}`}>
                    {review.name}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#50332F] sm:text-base" data-testid={`review-text-${index}`}>
                    {review.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory section-fade-up px-5 py-20 sm:px-8 lg:px-12" data-testid="home-social-section">
        <div className="mx-auto w-full max-w-6xl text-center">
          <h2 className="serif-display text-3xl text-[#350A13] sm:text-4xl" data-testid="social-heading">
            Follow the Celebration.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4" data-testid="social-buttons-group">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="social-gold-glow rounded-full border border-[#C6A75E] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#4B0F1B] transition-transform duration-300 hover:-translate-y-1 hover:bg-[#4B0F1B] hover:text-[#F5EFE6]"
                data-testid={`social-button-${social.label.toLowerCase()}`}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
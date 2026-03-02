import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FadeCarousel from "../components/common/FadeCarousel";
import RevealBlock from "../components/common/RevealBlock";
import {
  brandConfig,
  coupleReviews,
  homeCarouselSlides,
  portfolioEvents,
  socialLinks,
} from "../data/siteContent";

const HERO_TITLE = "NEW BEGINNINGS EVENTS";

export default function HomePage({ onIntroComplete }) {
  const [showTitle, setShowTitle] = useState(false);
  const [heroContentFading, setHeroContentFading] = useState(false);
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [decorScale, setDecorScale] = useState(1);
  const decorRef = useRef(null);
  const introDoneRef = useRef(false);

  const portfolioPreview = useMemo(() => portfolioEvents.weddings.slice(0, 4), []);

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
    const stagger = mobile ? 50 : 70;
    const fadeOutStart = 600 + HERO_TITLE.length * stagger + 260;
    const textFadeTimer = setTimeout(() => setHeroContentFading(true), fadeOutStart);
    const revealTimer = setTimeout(() => setCarouselVisible(true), fadeOutStart + 520);

    const doneTimer = setTimeout(() => {
      if (introDoneRef.current) return;
      introDoneRef.current = true;
      onIntroComplete?.();
    }, fadeOutStart + 520);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(textFadeTimer);
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, [mobile, onIntroComplete]);

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
        <div className="relative z-10 mx-auto max-w-5xl" data-testid="home-hero-content">
          <img
            src={brandConfig.logo}
            alt="New Beginnings Events"
            className="intro-logo mx-auto h-24 w-24 object-contain sm:h-28 sm:w-28"
            data-testid="home-hero-logo"
          />

          {showTitle && (
            <h1
              className={`serif-display hero-title-gold hero-heading-shell mt-8 text-3xl font-normal sm:text-5xl lg:text-6xl ${
                heroContentFading ? "hero-heading-fade-out" : ""
              }`}
              style={{ letterSpacing: mobile ? "0.22em" : "0.3em" }}
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

      <section
        className={`transition-opacity duration-[900ms] ease-in-out ${carouselVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
        data-testid="home-main-carousel-section"
      >
        <FadeCarousel slides={homeCarouselSlides} caption testId="home-main-carousel" fadeDuration={900} />
      </section>

      <section className="bg-[#E8D8C3] px-5 py-20 sm:px-8 lg:px-12" data-testid="home-about-section">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          <RevealBlock direction="left" testId="about-text-reveal">
            <h2 className="about-poetic-heading mt-4 text-4xl sm:text-5xl" data-testid="about-heading">
              Shall we set the date to forever?
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#50332F] sm:text-lg" data-testid="about-paragraph">
              At New Beginnings Events, we design celebrations that transcend trends and time. From refined intimate affairs to grand wedding experiences,
              every detail is curated with intention and artistry. We don&apos;t just plan events — we orchestrate moments that live on as legacy.
            </p>
            <Link to="/enquiry" className="gold-outline-button mt-8 inline-flex" data-testid="about-cta-button">
              Let&apos;s Begin
            </Link>
          </RevealBlock>

          <RevealBlock direction="right" testId="about-image-reveal">
            <div className="relative mx-auto w-full max-w-[250px] overflow-hidden rounded-2xl shadow-[0_14px_30px_rgba(62,11,20,0.14)] lg:ml-auto" data-testid="about-image-wrapper">
              <div className="absolute left-1/2 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[#C6A75E] shadow-[0_0_6px_rgba(198,167,94,0.38)]" data-testid="about-image-pin" />
              <img
                src="/assets/wedding-3.webp"
                alt="Luxury wedding portrait"
                loading="lazy"
                className="aspect-square w-full object-cover object-center"
                data-testid="about-image"
              />
            </div>
          </RevealBlock>
        </div>
      </section>

      <section ref={decorRef} className="bg-royal-velvet px-5 py-20 sm:px-8 lg:px-12" data-testid="home-decor-highlight-section">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-center text-xs uppercase tracking-[0.24em] text-[#C6A75E]" data-testid="decor-kicker">
            Every Detail Tells a Story.
          </p>
          <div className="mx-auto mt-10 w-full max-w-2xl" data-testid="decor-arch-container">
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
        </div>
      </section>

      <section className="bg-[#E8D8C3] px-5 py-20 sm:px-8 lg:px-12" data-testid="home-portfolio-preview-section">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="serif-display text-center text-3xl text-[#3E0B14] sm:text-4xl" data-testid="portfolio-preview-heading">
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
                <div className="absolute inset-0 bg-[rgba(62,11,20,0.05)] transition-colors duration-400 group-hover:bg-[rgba(62,11,20,0.7)]" />
                <div className="absolute inset-x-5 bottom-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-testid={`portfolio-preview-overlay-${event.id}`}>
                  <p className="serif-display text-2xl text-[#E8D8C3]" data-testid={`portfolio-preview-title-${event.id}`}>
                    {event.title}
                  </p>
                  <div className="mt-2 h-[1px] w-16 bg-[#C6A75E] transition-all duration-300 group-hover:w-24" data-testid={`portfolio-preview-underline-${event.id}`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-royal-velvet px-5 py-20 sm:px-8 lg:px-12" data-testid="home-reviews-section">
        <div className="mx-auto w-full max-w-4xl text-center">
          <h2 className="serif-display text-3xl text-[#E8D8C3] sm:text-4xl" data-testid="reviews-heading">
            Words from Our Couples.
          </h2>

          <div className="relative mt-8 min-h-[170px]" data-testid="reviews-slider">
            {coupleReviews.map((review, index) => (
              <article
                key={review.name}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
                  reviewIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                data-testid={`review-slide-${index}`}
              >
                <div className="mb-3 flex gap-1 text-[#C6A75E]" data-testid={`review-stars-${index}`}>
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <span key={starIdx}>★</span>
                  ))}
                </div>
                <p className="serif-display text-2xl text-[#E8D8C3]" data-testid={`review-name-${index}`}>
                  {review.name}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#E8D8C3]/90 sm:text-base" data-testid={`review-text-${index}`}>
                  {review.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E8D8C3] px-5 py-20 sm:px-8 lg:px-12" data-testid="home-social-section">
        <div className="mx-auto w-full max-w-6xl text-center">
          <h2 className="serif-display text-3xl text-[#3E0B14] sm:text-4xl" data-testid="social-heading">
            Follow the Celebration.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4" data-testid="social-buttons-group">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#5A0F1C] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A0F1C] transition-transform duration-300 hover:-translate-y-1 hover:bg-[#5A0F1C] hover:text-[#E8D8C3]"
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
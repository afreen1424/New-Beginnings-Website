import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle, Youtube } from "lucide-react";
import FadeCarousel from "../components/common/FadeCarousel";
import { brandConfig, coupleReviews, externalLinks, homeCarouselSlides, homeMedia, portfolioEvents, socialLinks } from "../data/siteContent";

const HERO_TITLE = "New Beginnings Events";
const SOCIAL_ICON_MAP = {
  Instagram,
  YouTube: Youtube,
  Facebook,
  WhatsApp: MessageCircle,
};

function HeroLogoCinematic() {
  return (
    <div className="hero-logo-cinematic-wrap mx-auto" data-testid="home-hero-logo">
      <img src={brandConfig.logo} alt="New Beginnings Events" className="hero-logo-cinematic-image" loading="eager" data-testid="home-hero-logo-image" />
    </div>
  );
}

function AnimatedHeading({ text, active, testId, className = "" }) {
  return (
    <h2 className={`serif-display section-heading-slide ${active ? "is-visible" : ""} ${className}`} data-testid={testId}>
      {text}
    </h2>
  );
}

export default function HomePage({ onIntroComplete }) {
  const [showTitle, setShowTitle] = useState(false);
  const [heroLift, setHeroLift] = useState(false);
  const [heroContentFading, setHeroContentFading] = useState(false);
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [socialVisible, setSocialVisible] = useState(false);

  const aboutRef = useRef(null);
  const videoRef = useRef(null);
  const portfolioRef = useRef(null);
  const reviewsRef = useRef(null);
  const socialRef = useRef(null);
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
    setHeroLift(false);
    setHeroContentFading(false);
    setCarouselVisible(false);
    introDoneRef.current = false;

    const showTimer = setTimeout(() => setShowTitle(true), 1300);
    const liftStart = mobile ? 4000 : 4300;
    const fadeOutStart = mobile ? 4500 : 4800;
    const liftTimer = setTimeout(() => setHeroLift(true), liftStart);
    const fadeTimer = setTimeout(() => setHeroContentFading(true), fadeOutStart);
    const carouselTimer = setTimeout(() => setCarouselVisible(true), fadeOutStart);
    const doneTimer = setTimeout(() => {
      if (introDoneRef.current) return;
      introDoneRef.current = true;
      onIntroCompleteRef.current?.();
    }, fadeOutStart + 650);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(liftTimer);
      clearTimeout(fadeTimer);
      clearTimeout(carouselTimer);
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
    const sections = [
      { ref: aboutRef, setter: setAboutVisible, threshold: 0.26 },
      { ref: videoRef, setter: setVideoVisible, threshold: 0.3 },
      { ref: portfolioRef, setter: setPortfolioVisible, threshold: 0.2 },
      { ref: reviewsRef, setter: setReviewsVisible, threshold: 0.25 },
      { ref: socialRef, setter: setSocialVisible, threshold: 0.25 },
    ];

    const observers = sections.map(({ ref, setter, threshold }) => {
      const observer = new IntersectionObserver(([entry]) => {
        setter(entry.isIntersecting);
      }, { threshold });

      if (ref.current) {
        observer.observe(ref.current);
      }
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <div className="overflow-hidden" data-testid="home-page">
      <section className="bg-royal-velvet relative flex min-h-screen items-center justify-center overflow-hidden px-0 text-center sm:px-5" data-testid="home-hero-section">
        <div className={`hero-carousel-layer absolute inset-0 ${carouselVisible ? "opacity-100" : "pointer-events-none opacity-0"}`} data-testid="home-main-carousel-section">
          <FadeCarousel slides={homeCarouselSlides} caption={false} testId="home-main-carousel" fadeDuration={850} interval={4700} transitionType="slide" fullHeight />
        </div>

        <div className={`hero-content-shell relative z-10 mx-auto max-w-5xl ${heroLift ? "hero-content-lift" : ""} ${heroContentFading ? "hero-content-fade-out" : ""}`} data-testid="home-hero-content">
          <HeroLogoCinematic />

          {showTitle && (
            <h1 className="hero-signature-name mt-8" style={{ letterSpacing: mobile ? "0.06em" : "0.09em" }} data-testid="home-hero-heading">
              {HERO_TITLE.split("").map((char, idx) => (
                <span
                  key={`hero-signature-${idx}`}
                  className="hero-signature-letter"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                  data-testid={`home-hero-signature-letter-${idx}`}
                >
                  {char}
                </span>
              ))}
            </h1>
          )}
        </div>
      </section>

      <section ref={aboutRef} className="bg-ivory px-5 py-24 sm:px-8 lg:px-12" data-testid="home-about-section">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,620px)_minmax(0,1fr)] lg:gap-[76px]">
          <div className="order-1 space-y-6 lg:max-w-[620px]" data-testid="about-text-reveal">
            <h2 className={`about-poetic-heading about-seq-item text-[3.3rem] leading-none sm:text-[5.1rem] ${aboutVisible ? "is-visible" : ""}`} data-testid="about-heading">
              Shall we set the date to forever?
            </h2>
            <div className="about-hook-divider mt-5" data-testid="about-hook-divider" />
            <p className={`about-seq-item text-[16px] leading-relaxed text-[#3C0518] sm:text-[17px] ${aboutVisible ? "is-visible" : ""}`} style={{ transitionDelay: "130ms" }} data-testid="about-paragraph-1">
              At New Beginnings Events, we believe weddings are the beginning of something timeless — the moment where love becomes a promise for forever. Every couple carries a dream of how their day should feel, and it is our joy to turn that dream into something real, beautiful, and deeply meaningful. With an eye for detail and a heart for celebration, we craft weddings that feel personal, effortless, and filled with moments that linger long after the day is over.
            </p>
            <p className={`about-seq-item text-[16px] leading-relaxed text-[#3C0518] sm:text-[17px] ${aboutVisible ? "is-visible" : ""}`} style={{ transitionDelay: "260ms" }} data-testid="about-paragraph-2">
              What we create goes beyond décor and planning — it is the atmosphere, the emotion, and the quiet magic woven into every detail. Each celebration is thoughtfully designed so that couples can be fully present in the moments that matter most. Alongside weddings, we also curate memorable events, always with the same care and artistry that define the stories we bring to life. Because some moments deserve to be remembered not just beautifully, but forever.
            </p>

            <div className="flex justify-center px-1 pt-1 lg:hidden" data-testid="about-cta-wrap">
              <Link to="/enquiry" className="about-cta-button" data-testid="about-cta-button">
                Let&apos;s Begin Your Forever
              </Link>
            </div>
          </div>

          <div className={`order-3 lg:order-2 about-frame-animate ${aboutVisible ? "is-visible" : ""}`} data-testid="about-image-reveal">
            <div className="about-final-image-shell relative mx-auto w-full max-w-[520px]" data-testid="about-image-wrapper">
              <img src={homeMedia.aboutFinal} alt="About celebration visual" loading="lazy" className="h-full w-full object-cover object-center" data-testid="about-image" />
            </div>
          </div>

          <div className="hidden px-1 lg:order-3 lg:col-span-2 lg:-mt-6 lg:flex lg:justify-center lg:pt-0" data-testid="about-cta-wrap-desktop">
            <Link to="/enquiry" className="about-cta-button" data-testid="about-cta-button-desktop">
              Let&apos;s Begin Your Forever
            </Link>
          </div>
        </div>

      </section>

      <section ref={videoRef} className="bg-ivory pb-16 pt-5 sm:pt-6" data-testid="home-decor-highlight-section">
        <div className="w-full">
          <AnimatedHeading text="Every Detail Tells A Story" active={videoVisible} testId="decor-kicker" className="text-center text-3xl text-[#3C0518] sm:text-4xl" />

          <div className={`video-mask-stage mt-14 w-full ${videoVisible ? "is-visible" : ""}`} data-testid="decor-arch-container">
            <div className="video-mask-inner" data-testid="decor-video-wrapper">
              <video autoPlay muted loop playsInline preload="metadata" className="video-mask-video" data-testid="decor-highlight-video">
                <source src={homeMedia.videoInside} type="video/mp4" />
                <source src="/assets/decor-video.webm" type="video/webm" />
              </video>
            </div>
          </div>
        </div>
      </section>

      <section ref={portfolioRef} className="bg-ivory px-5 py-20 sm:px-8 lg:px-12" data-testid="home-portfolio-preview-section">
        <div className="mx-auto w-full max-w-7xl">
          <AnimatedHeading text="Stories We've Brought to Life." active={portfolioVisible} testId="portfolio-preview-heading" className="text-center text-3xl text-[#3C0518] sm:text-4xl" />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="portfolio-preview-grid">
            {portfolioPreview.map((event, index) => (
              <div key={event.id} className={`portfolio-card-seq ${portfolioVisible ? "is-visible" : ""}`} style={{ transitionDelay: `${index * 150}ms` }} data-testid={`portfolio-card-animation-wrap-${event.id}`}>
                <Link to={`/portfolio/weddings/${event.id}`} className="group relative overflow-hidden rounded-2xl" data-testid={`portfolio-preview-card-${event.id}`}>
                  <img src={event.cover} alt={event.title} loading="lazy" className="aspect-[4/5] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" data-testid={`portfolio-preview-image-${event.id}`} />
                  <div className="service-card-overlay absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-testid={`portfolio-preview-overlay-${event.id}`}>
                    <p className="serif-display text-2xl text-[#F5EFE6]" data-testid={`portfolio-preview-title-${event.id}`}>
                      {event.title}
                    </p>
                    <div className="mt-2 h-[1px] w-12 bg-[#C6A75E] transition-all duration-300 group-hover:w-24" data-testid={`portfolio-preview-underline-${event.id}`} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={reviewsRef} className="bg-[#3C0518] px-5 py-20 sm:px-8 lg:px-12" data-testid="home-reviews-section">
        <div className="mx-auto w-full max-w-4xl text-center">
          <AnimatedHeading text="Words from Our Couples." active={reviewsVisible} testId="reviews-heading" className="text-3xl text-[#F5EFE6] sm:text-4xl" />

          <div className="relative mt-8 min-h-[210px]" data-testid="reviews-slider">
            {coupleReviews.map((review, index) => (
              <article key={review.name} className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${reviewIndex === index ? "opacity-100" : "pointer-events-none opacity-0"}`} data-testid={`review-slide-${index}`}>
                <div className="mx-auto max-w-2xl rounded-2xl px-4 py-3">
                  <div className="mb-3 flex justify-center gap-1 text-[#C6A75E]" data-testid={`review-stars-${index}`}>
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <span key={starIdx}>★</span>
                    ))}
                  </div>
                  <p className="serif-display text-2xl text-[#F5EFE6]" data-testid={`review-name-${index}`}>
                    {review.name}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[rgba(245,239,230,0.88)] sm:text-base" data-testid={`review-text-${index}`}>
                    {review.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <a
            href={externalLinks.googleReviews}
            target="_blank"
            rel="noreferrer"
            className="serif-display mt-8 inline-flex text-base text-[#C6A75E] underline-offset-4 transition-colors hover:text-[#F5EFE6] hover:underline"
            data-testid="home-google-reviews-link"
          >
            Read our reviews on Google →
          </a>
        </div>
      </section>

      <section ref={socialRef} className="bg-ivory px-5 py-20 sm:px-8 lg:px-12" data-testid="home-social-section">
        <div className="mx-auto w-full max-w-6xl text-center">
          <AnimatedHeading text="Follow the Celebration." active={socialVisible} testId="social-heading" className="text-3xl text-[#3C0518] sm:text-4xl" />

          <div className="mx-auto mt-10 flex max-w-full items-center justify-center gap-3 sm:gap-5" data-testid="social-buttons-group">
            {socialLinks.map((social, index) => {
              const Icon = SOCIAL_ICON_MAP[social.label] || MessageCircle;
              return (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className={`social-icon-button ${socialVisible ? "is-visible" : ""}`} style={{ transitionDelay: `${index * 120}ms` }} data-testid={`social-button-${social.label.toLowerCase()}`} aria-label={social.label}>
                  <Icon size={26} />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
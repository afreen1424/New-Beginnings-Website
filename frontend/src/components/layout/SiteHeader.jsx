import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { brandConfig } from "../../data/siteContent";

const mainLinks = [
  { label: "Home", path: "/" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Blog", path: "/blog" },
  { label: "Enquiry", path: "/enquiry" },
];

const serviceLinks = [
  { label: "Corporate Events", path: "/services/corporate-events" },
  { label: "Catering", path: "/services/catering" },
  { label: "SFX & Entries", path: "/services/sfx-entries" },
];

export default function SiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const servicesRef = useRef(null);

  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 border-b border-transparent bg-[rgba(53,10,19,0.96)] shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
        data-testid="site-header"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-3 lg:px-8" data-testid="site-header-inner">
          <Link to="/" className="flex min-w-0 flex-nowrap items-center gap-2 sm:gap-3" data-testid="header-brand-link">
            <img
              src={brandConfig.logo}
              alt="New Beginnings Events Logo"
              className="h-9 w-9 object-contain sm:h-11 sm:w-11"
              loading="eager"
              data-testid="header-brand-logo"
            />
            <span
              className="serif-display max-w-[170px] truncate whitespace-nowrap text-[9px] tracking-[0.12em] text-[#C6A75E] sm:max-w-none sm:text-xs sm:tracking-[0.14em] lg:text-sm lg:tracking-[0.18em]"
              data-testid="header-brand-name"
            >
              NEW BEGINNINGS EVENTS
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {mainLinks.slice(0, 1).map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className="nav-link"
                data-testid={`nav-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="relative" ref={servicesRef}>
              <button
                type="button"
                onClick={() => setServicesOpen((prev) => !prev)}
                className="nav-link inline-flex items-center gap-1"
                data-testid="nav-link-other-services"
              >
                Other Services <ChevronDown size={15} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>

              {servicesOpen && (
                <div
                  className="absolute right-0 top-11 w-56 rounded-xl border border-[#C6A75E]/40 bg-[#350A13] p-2"
                  data-testid="desktop-services-dropdown"
                >
                  {serviceLinks.map((service) => (
                    <NavLink
                      key={service.label}
                      to={service.path}
                      className="block rounded-lg px-3 py-2 text-sm text-[#F5EFE6] transition-colors hover:bg-[#4B0F1B]"
                      data-testid={`desktop-service-link-${service.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    >
                      {service.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {mainLinks.slice(1).map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className="nav-link"
                data-testid={`nav-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </NavLink>
            ))}

            <a
              href={brandConfig.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="gold-outline-button"
              data-testid="header-lets-chat-button"
            >
              LET&apos;S CHAT
            </a>
          </div>

          <div className="flex items-center gap-1.5 lg:hidden" data-testid="mobile-header-actions">
            <a
              href={brandConfig.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#C6A75E] px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.14em] whitespace-nowrap text-[#C6A75E]"
              data-testid="mobile-header-lets-chat-button"
            >
              LET&apos;S CHAT
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-full border border-[#C6A75E] p-1.5 text-[#C6A75E]"
              aria-label="Open Menu"
              data-testid="mobile-menu-open-button"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute inset-0 bg-black/50"
          data-testid="mobile-menu-overlay"
          aria-label="Close mobile menu overlay"
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-[#350A13] px-6 py-5 transition-transform duration-[350ms] ease-in-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          data-testid="mobile-slide-panel"
        >
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" data-testid="mobile-panel-logo-link">
              <img src={brandConfig.logo} alt="NB Logo" className="h-10 w-10 object-contain" loading="lazy" data-testid="mobile-panel-logo" />
              <span className="serif-display text-xs tracking-[0.16em] text-[#C6A75E]" data-testid="mobile-panel-brand-name">
                NEW BEGINNINGS EVENTS
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-full border border-[#C6A75E] p-2 text-[#C6A75E]"
              aria-label="Close Menu"
              data-testid="mobile-menu-close-button"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-4" data-testid="mobile-nav-links">
            {mainLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className="text-base text-[#F5EFE6]"
                data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-2 border-t border-[#C6A75E]/30 pt-4" data-testid="mobile-services-section">
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#C6A75E]" data-testid="mobile-services-heading">
                Other Services
              </p>
              <div className="flex flex-col gap-3">
                {serviceLinks.map((service) => (
                  <NavLink
                    key={service.label}
                    to={service.path}
                    className="text-base text-[#F5EFE6]"
                    data-testid={`mobile-service-link-${service.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    {service.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>

          <a
            href={brandConfig.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 rounded-full bg-[#C6A75E] px-5 py-3 text-center text-xs font-semibold tracking-[0.2em] text-[#350A13]"
            data-testid="mobile-panel-lets-chat-button"
          >
            LET&apos;S CHAT
          </a>
        </aside>
      </div>
    </>
  );
}
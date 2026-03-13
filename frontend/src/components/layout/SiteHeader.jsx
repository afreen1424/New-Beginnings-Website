import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { brandConfig } from "../../data/siteContent";

const leftDesktopLinks = [
  { label: "Home", path: "/" },
  { label: "Portfolio", path: "/portfolio" },
];

const rightDesktopLinks = [
  { label: "Blog", path: "/blog" },
  { label: "Enquiry", path: "/enquiry" },
];

const mobileMainLinks = [
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

export default function SiteHeader({ introComplete = true, isHome = false, nonSticky = false }) {
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

  const homeHeaderVisible = !isHome || introComplete;
  const standardHeaderClass = nonSticky
    ? "relative z-50 h-[var(--site-header-height)] border-b border-transparent bg-[rgba(60,5,24,0.96)] shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
    : "fixed left-0 right-0 top-0 z-50 h-[var(--site-header-height)] border-b border-transparent bg-[rgba(60,5,24,0.96)] shadow-[0_12px_30px_rgba(0,0,0,0.4)]";

  const headerClassName = isHome
    ? `absolute left-0 right-0 top-0 z-40 border-b border-[rgba(198,167,94,0.18)] bg-[rgba(60,5,24,0.98)] transition-all duration-700 ${homeHeaderVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0"}`
    : standardHeaderClass;

  const desktopNavClass = isHome ? "nav-link-home" : "nav-link";

  return (
    <>
      <header className={headerClassName} data-testid="site-header">
        <div
          className={`mx-auto flex w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 ${isHome ? "h-[72px]" : "h-[var(--site-header-height)]"}`}
          data-testid="site-header-inner"
        >
          <div className={`hidden min-w-0 flex-1 items-center gap-6 transition-all duration-700 lg:flex ${homeHeaderVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`} data-testid="header-left-cluster">
            {leftDesktopLinks.slice(0, 1).map((item) => (
              <NavLink key={item.label} to={item.path} className={desktopNavClass} data-testid={`nav-link-${item.label.toLowerCase()}`}>
                {item.label}
              </NavLink>
            ))}

            <div className="relative" ref={servicesRef}>
              <button
                type="button"
                onClick={() => setServicesOpen((prev) => !prev)}
                className={`${desktopNavClass} inline-flex items-center gap-1`}
                data-testid="nav-link-other-services"
              >
                Other Services <ChevronDown size={15} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>

              {servicesOpen && (
                <div className="header-dropdown-panel absolute left-0 top-11 w-56 overflow-hidden rounded-none" data-testid="desktop-services-dropdown">
                  {serviceLinks.map((service) => (
                    <NavLink
                      key={service.label}
                      to={service.path}
                      className="block px-3 py-2 text-sm text-[#F5EFE6] transition-colors hover:text-[#C6A75E]"
                      data-testid={`desktop-service-link-${service.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    >
                      {service.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {leftDesktopLinks.slice(1).map((item) => (
              <NavLink key={item.label} to={item.path} className={desktopNavClass} data-testid={`nav-link-${item.label.toLowerCase()}`}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <Link to="/" className="header-brand-center hidden min-w-0 flex-nowrap items-center justify-center gap-[11px] lg:flex" data-testid="header-brand-link">
            <img src={brandConfig.logo} alt="New Beginnings Events Logo" className="h-9 w-9 object-contain" loading="eager" data-testid="header-brand-logo" />
            <span className="header-brand-script signature-script whitespace-nowrap" data-testid="header-brand-name">
              New Beginnings Events
            </span>
          </Link>

          <div className={`hidden min-w-0 flex-1 items-center justify-end gap-6 transition-all duration-700 lg:flex ${homeHeaderVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`} data-testid="header-right-cluster">
            {rightDesktopLinks.map((item) => (
              <NavLink key={item.label} to={item.path} className={desktopNavClass} data-testid={`nav-link-${item.label.toLowerCase()}`}>
                {item.label}
              </NavLink>
            ))}

            <a href={brandConfig.whatsappLink} target="_blank" rel="noreferrer" className="gold-outline-button" data-testid="header-lets-chat-button">
              LET&apos;S CHAT
            </a>
          </div>

          <div className="flex w-full items-center justify-between lg:hidden" data-testid="mobile-header-actions">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-full border border-[#C6A75E] p-1.5 text-[#C6A75E]"
              aria-label="Open Menu"
              data-testid="mobile-menu-open-button"
            >
              <Menu size={18} />
            </button>

            <Link to="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[10px]" data-testid="mobile-header-center-brand">
              <img src={brandConfig.logo} alt="NB Logo" className="h-8 w-8 object-contain" loading="eager" data-testid="mobile-header-brand-logo" />
              <span className="header-brand-script-mobile signature-script max-w-[146px] truncate whitespace-nowrap" data-testid="mobile-header-brand-name">
                New Beginnings Events
              </span>
            </Link>

            <a href={brandConfig.whatsappLink} target="_blank" rel="noreferrer" className="rounded-full border border-[#C6A75E] px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.14em] whitespace-nowrap text-[#C6A75E]" data-testid="mobile-header-lets-chat-button">
              CHAT
            </a>
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
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-[#3C0518] px-6 py-5 transition-transform duration-[350ms] ease-in-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          data-testid="mobile-slide-panel"
        >
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5" data-testid="mobile-panel-logo-link">
              <img src={brandConfig.logo} alt="NB Logo" className="h-10 w-10 object-contain" loading="lazy" data-testid="mobile-panel-logo" />
              <span className="signature-script whitespace-nowrap text-[2.2rem] leading-none text-[var(--logo-gold)]" data-testid="mobile-panel-brand-name">
                New Beginnings Events
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
            {mobileMainLinks.map((item) => (
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
            className="mt-5 rounded-full bg-[#C6A75E] px-5 py-3 text-center text-xs font-semibold tracking-[0.2em] text-[#3C0518]"
            data-testid="mobile-panel-lets-chat-button"
          >
            LET&apos;S CHAT
          </a>
        </aside>
      </div>
    </>
  );
}
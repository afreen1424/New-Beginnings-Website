import { Link } from "react-router-dom";
import { brandConfig } from "../../data/siteContent";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Blog", path: "/blog" },
  { label: "Enquiry", path: "/enquiry" },
];

export default function SiteFooter({ isHome = false }) {
  if (isHome) {
    return (
      <footer className="bg-[#350A13] px-4 py-7 text-[#F5EFE6]" data-testid="site-footer">
        <div className="mx-auto h-[1px] w-full max-w-6xl bg-[#C6A75E]/50" data-testid="footer-divider" />
        <p className="serif-display mx-auto mt-5 max-w-6xl text-center text-sm leading-relaxed text-[#F5EFE6]" data-testid="footer-compact-line">
          © 2026 New Beginnings Events — All Rights Reserved | Chennai, Tamil Nadu | +91 81229 13183
        </p>
      </footer>
    );
  }

  return (
    <footer className="bg-[#350A13] px-4 pb-6 pt-12 text-[#F5EFE6] sm:px-6 lg:px-8" data-testid="site-footer">
      <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-3">
        <div data-testid="footer-brand-column">
          <img src={brandConfig.logo} alt="New Beginnings Events logo" className="mb-3 h-16 w-16 object-contain" loading="lazy" data-testid="footer-logo" />
          <h3 className="serif-display text-xl tracking-[0.14em] text-[#C6A75E]" data-testid="footer-brand-name">
            NEW BEGINNINGS EVENTS
          </h3>
        </div>

        <div data-testid="footer-quick-links-column">
          <h4 className="text-xs uppercase tracking-[0.26em] text-[#C6A75E]" data-testid="footer-quick-links-heading">
            Quick Links
          </h4>
          <div className="mt-4 flex flex-col gap-2">
            {quickLinks.map((link) => (
              <Link key={link.label} to={link.path} className="w-fit text-sm text-[#F5EFE6] transition-colors hover:text-[#C6A75E]" data-testid={`footer-link-${link.label.toLowerCase()}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div data-testid="footer-contact-column">
          <h4 className="text-xs uppercase tracking-[0.26em] text-[#C6A75E]" data-testid="footer-contact-heading">
            Contact
          </h4>
          <p className="mt-4 text-sm leading-relaxed" data-testid="footer-address">
            {brandConfig.address}
          </p>
          <a href={`tel:+${brandConfig.phoneRaw}`} className="mt-2 block w-fit text-sm text-[#F5EFE6] transition-colors hover:text-[#C6A75E]" data-testid="footer-phone-link">
            {brandConfig.phone}
          </a>
          <a href={`mailto:${brandConfig.email}`} className="mt-2 block w-fit text-sm text-[#F5EFE6] transition-colors hover:text-[#C6A75E]" data-testid="footer-email-link">
            {brandConfig.email}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 h-[1px] w-full max-w-7xl bg-[#C6A75E]/55" data-testid="footer-divider" />
    </footer>
  );
}
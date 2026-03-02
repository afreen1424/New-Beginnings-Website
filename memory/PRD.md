# PRD - New Beginnings Events Luxury Website

## Original Problem Statement
Build a fully functional, production-ready luxury event management website for **New Beginnings Events** with regal maroon-gold-beige branding, structured premium UX, responsive mobile-first layout, optimized media, immersive home experience, portfolio/blog/services pages, and a regal enquiry flow.

## User Inputs Confirmed
- Logo uploaded and integrated
- WhatsApp: https://wa.me/918122913183
- Phone: 8122913183
- YouTube and Instagram links provided
- Use stock images for now

## Architecture Decisions
- **Frontend**: React + React Router, Tailwind utility classes + custom CSS animations
- **Backend**: FastAPI + MongoDB (Motor)
- **Data Flow**: Enquiry form posts to `/api/enquiries`, persisted in MongoDB, validated with Pydantic models
- **Media Strategy**: Local WebP assets in `/frontend/public/assets` (<300KB), lightweight WebM decor video (<3MB), lazy loading for imagery
- **UI Strategy**: Modular page/component split with reusable carousel and reveal components; sticky header with desktop dropdown + mobile slide panel

## Implemented
- Full multi-page website:
  - Home (animated hero, wedding carousel, about, decor video, portfolio preview, reviews, social, footer)
  - Portfolio (tabs + smooth in-page content transition)
  - Event detail pages
  - Blog listing + detailed story pages
  - Other services pages: Corporate Events, Catering, SFX & Entries
  - Enquiry page with vertical regal panel and success state
- Navigation system:
  - Sticky transparent-to-maroon header on scroll
  - Desktop “Other Services” dropdown
  - Mobile hamburger with right-side slide-in menu and close-on-overlay
  - Persistent LET'S CHAT buttons wired to WhatsApp
- Backend APIs:
  - Existing `/api/` kept
  - Added `POST /api/enquiries`
  - Added `GET /api/enquiries`
- Brand styling:
  - Palette and typography hierarchy aligned to brief
  - Velvet texture usage on maroon backgrounds
  - Controlled lightweight transitions and reveal animations
- QA/testing completed:
  - Curl API validation for enquiry create/list
  - Playwright visual flow checks (desktop + mobile)
  - Testing agent run with report review and fixes applied

## Prioritized Backlog
### P0
- Replace stock portfolio/blog media with final client-approved assets and real couple/event metadata
- Add real business contact/address/email content if different from placeholders

### P1
- Add CMS/admin interface to manage portfolio, blog posts, and testimonials dynamically
- Add anti-spam protection + server-side rate limiting for enquiry form

### P2
- Add analytics dashboard (lead source, conversion by service category)
- Add multilingual content (EN + regional language)

## Next Tasks
1. Integrate final branded content pack (photos, videos, copy)
2. Add admin-authenticated content management endpoints and UI
3. Expand enquiry workflow with lead status tracking and internal notes

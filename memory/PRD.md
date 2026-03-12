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

## Refinement Pass (Latest)
- Applied full color-system uplift across app to Deep Royal Maroon `#4B0F1B`, Warm Ivory `#F5EFE6`, and Antique Gold `#C6A75E`
- Updated Home hero timing/behavior: letter reveal → text fade (0.6s) → carousel visual takeover with 0.8s fade-in and 900ms crossfades
- Refined Home About (poetic hook + divider + revised copy + pinned square image), Decor section (full-width ivory arched frame), Reviews (ivory styling), and Social hover glow
- Upgraded Corporate/Catering/SFX hero overlays, supporting copy blocks, hover-gradient showcase cards, and centered CTAs
- Enhanced Blog card motion/overlay styling and Enquiry panel opening animation while preserving existing routes and architecture

## Micro Refinement Pass (Hero/Header/Carousel Text)
- Hero logo now uses a stroke-style line-drawing animation and fades out with the full hero content timeline before carousel takeover.
- Header is now always fixed and visible from initial load with no opacity/transition fade behavior tied to hero animation.
- Home carousel captions moved to bottom-right, now showing only couple names in antique gold serif with subtle fade-in on slide change.

## Micro Refinement Pass (Hero Logo Animation Only)
- Removed logo stroke/line-draw effect.
- Implemented cinematic logo reveal: smooth opacity fade-in + subtle scale-in + one-time antique-gold shimmer sweep + soft gold glow.
- Kept hero/carousel shared timeline intact so entire hero content (including logo) fades out together before carousel takeover in the same viewport.

## Micro Refinement Pass (Mobile + Carousel Editability)
- Mobile header optimized for single-line brand display (no wrapping), reduced small-screen padding, and maintained hamburger navigation below 1024px.
- Enforced global no-horizontal-scroll behavior (`html`, `body`, `#root` overflow-x hidden).
- Carousel caption remains data-driven from slide array (`homeCarouselSlides` with `couple` field), so names are editable via data only.
- Mobile carousel caption spacing and typography adjusted for readable bottom-right placement while preserving desktop structure.

## Final Homepage Refinement (Luxury Iteration)
- Updated homepage-only visual system to exact core palette with primary burgundy `#3C0518`, ivory `#F5EFE6`, and gold `#C6A75E` accents.
- Reworked homepage hero/header choreography (logo + Tangerine script intro, upward lift, delayed header/nav reveal, slide-based hero carousel without captions).
- Wired newly provided assets: 5 carousel images, final about image, and updated social/contact details.
- Added transparent burgundy desktop dropdown styling, refined section typography/animations, Google reviews CTA link, and compact single-line home footer with provided contact metadata.

## Final Instruction Pass (Precision Tweaks)
- Hero brand name animation now uses elegant letter-by-letter reveal (`0.35s`, `0.06s` stagger, `translateY(8px→0)`, opacity fade) while preserving intro timeline.
- Set homepage/header brand-name color to logo-extracted gold (`#DB9A17`) and aligned center header logo/text visual heights.
- Updated desktop dropdown background to `rgba(60,5,24,0.65)` while preserving square-corner layout and existing interactions.
- Corrected hero carousel image rendering for clean viewport fill (`height: 100vh`, object-fit cover, centered) with seamless infinite slide logic retained.
- Refined About spacing (left text width + wider text/image separation), replaced About image source only, and simplified Video section to clean full-width cinematic playback (70vh desktop / 50vh mobile) without decorative overlays.

## Micro Pass (Header Text + Carousel Scaling)
- Updated header center brand text color to `#DEA937` and adjusted desktop script size to requested refined value while preserving alignment/layout.
- Replaced hero carousel image set with newly uploaded 5 images (1920×1080) and preserved transitions/height/spacing.
- Ensured carousel slide images maintain proportion with `object-fit: cover`, centered framing, and no distortion/stretching.

## About Section Micro Pass
- Replaced About image source with latest uploaded asset while keeping section layout/alignment intact.
- Reduced About paragraph body size to ~16–17px for lighter editorial balance.
- Moved About CTA placement to align neatly under left text content within the About container (no overflow).
- Removed rounded corners from About right image container for a clean rectangular presentation.

## Video Section + Lower Heading Animation Micro Pass
- Updated only the “Every Detail Tells A Story” section: reduced top spacing, replaced video source with newly uploaded file, and rendered video as full-width section media (no frame/mask), responsive with `object-fit: cover`.
- Retained heading style/colors/background while updating heading entrance behavior from this section onward to subtle slide-up + fade-in on viewport entry.

## Video Edge-to-Edge Layout Fix
- Removed width-limiting paddings around the “Every Detail Tells A Story” media block so video spans full section width edge-to-edge.
- Kept heading centered and unchanged in font/color while positioning video directly below heading.
- Updated video rendering to block-level responsive media (`width:100%`, `height:auto`, `object-fit:cover`) without card/frame wrappers.

## Corporate Events Page Refinement Pass
- Disabled sticky header behavior only on `/services/corporate-events` so header scrolls naturally while preserving header design/layout.
- Replaced corporate hero with Home-style full-width, full-height slide carousel (auto + infinite + same smooth transition), using newly uploaded 4 images with no overlays/captions/buttons.
- Updated “Crafted for Scale, Led with Precision.” section typography to match Home heading style and replaced description text with provided copy (same width/alignment/spacing).
- Kept existing 2x2 grid layout intact, mapped uploaded images to requested category order, retained layout dimensions, added left/right entrance reveals, and matched Home “Stories” hover interaction pattern.
- Applied Home footer variant specifically on corporate page to match requested footer consistency.

## Catering Page Refinement Pass
- Disabled sticky header only on `/services/catering` while preserving header visual design.
- Replaced catering hero with Home-style full-width slide carousel behavior using exactly one image (no overlays/captions/controls), matching Home transition settings.
- Kept post-carousel heading section structure and styling; set heading text to `Curated Culinary Experiences`.
- Updated only first/second content section headings + descriptions to requested Vegetarian/Non-Veg menu copy, without layout or spacing alterations.
- Removed thin gold divider above CTA while preserving CTA styling/alignment/hover behavior and applied Home footer variant on catering page.

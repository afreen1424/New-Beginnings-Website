# New Beginnings Events - Product Requirements Document

## Original Problem Statement
Build a fully functional, production-ready luxury event management website for "New Beginnings Events". The brand identity is Royal, Regal, Authority-driven with a specific color palette (maroon, gold, ivory), custom typography, and comprehensive multi-page structure.

## Core Pages
- **Homepage** - Hero animation, carousel, about section, video showcase, portfolio preview, testimonials, social links
- **Portfolio** - Grid page + individual project detail pages
- **Blog** - Dynamic listing + individual post pages (CMS-driven)
- **Enquiry** - Functional enquiry form
- **Other Services** - Corporate Events, Catering, SFX & Entries

## Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **UI Components:** Shadcn/UI

## What's Been Implemented

### Phase 1: Website Structure (Complete)
- Full multi-page luxury event website
- Homepage with hero animation, carousel, about section, video showcase
- Portfolio page with grid and detail views
- Other Services pages (Corporate, Catering, SFX & Entries)
- Enquiry page with form submission
- Responsive design for mobile/desktop
- Custom fonts, color scheme, and animations

### Phase 2: Blog CMS (Complete - Feb 2026)
- **Admin Panel** at `/admin` with passcode protection (`nb-manage-2026`)
- **Category Management** - Full CRUD (add, edit, delete categories)
- **Blog Post Management** - Full CRUD with:
  - Title with auto-generated slug preview
  - Category, Author, Date fields
  - Hero image (URL paste or file upload)
  - Excerpt and article content
  - SEO Title and Meta Description
  - Flexible content blocks: Paragraph, Full-width Image, Two Image Grid, Three Image Grid, Quote
  - Drag-and-drop block reordering
  - Gallery images section
  - **Publish/Draft toggle** - New posts default to Draft, only Published posts visible on public blog
  - Draft/Published status badge on each post in admin sidebar
- **Server-side Image Upload** - `/api/upload` endpoint stores to `/assets/uploads/`
- **Dynamic Public Pages** - `/blog` and `/blog/:slug` fetch from backend APIs (only published posts)
- **Auto CTA** - "Planning something unforgettable?" section at end of each blog post
- Header/footer hidden on admin page for clean admin experience

### Backend API Endpoints
- `GET /api/blog/categories` - List all categories
- `POST /api/blog/categories` - Create category (auth required)
- `PUT /api/blog/categories/:id` - Update category (auth required)
- `DELETE /api/blog/categories/:id` - Delete category (auth required)
- `GET /api/blog/posts` - List all posts (optional `?category=` filter)
- `GET /api/blog/posts/:slug` - Get single post by slug
- `POST /api/blog/posts` - Create post (auth required)
- `PUT /api/blog/posts/:id` - Update post (auth required)
- `DELETE /api/blog/posts/:id` - Delete post (auth required)
- `POST /api/upload` - Upload image file (auth required)
- `GET /api/blog/admin/health` - Verify admin passcode
- `POST /api/enquiries` - Submit enquiry form

### Database Schema
- **blog_posts:** id, slug, title, category, author_name, date, hero_image, excerpt, article_content, seo_title, meta_description, content_blocks[], gallery_images[], created_at, updated_at
- **blog_categories:** id, name, created_at
- **enquiries:** id, full_name, email, phone, event_date, event_location, estimated_guest_count, event_type, referral_source, vision, submitted_at

## Backlog / Remaining Tasks

### P2 - Refinements
- Hero animation smoothness on homepage (recurring refinement item)
- Native browser date picker on admin form could be improved with a custom date picker

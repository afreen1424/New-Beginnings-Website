import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogPostBySlug } from "../services/blogApi";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const result = await getBlogPostBySlug(slug);
        setPost(result);
        setNotFound(false);
      } catch (_error) {
        setNotFound(true);
      }
    };

    loadPost();
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    document.title = post.seo_title || post.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute("content", post.meta_description || post.excerpt || "");
    }
  }, [post]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] px-5 pb-20 pt-28 text-center" data-testid="blog-not-found-page">
        <h1 className="serif-display text-4xl text-[#350A13]" data-testid="blog-not-found-heading">
          Story Not Found
        </h1>
        <Link to="/blog" className="gold-outline-button mt-8 inline-flex" data-testid="blog-not-found-back-button">
          Back to Blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] px-5 pb-20 pt-28 text-center" data-testid="blog-loading-page">
        <p className="text-base text-[#4C3330]" data-testid="blog-loading-text">
          Loading story...
        </p>
      </div>
    );
  }

  const blocks = post.content_blocks || [];
  const galleryImages = post.gallery_images || [];

  // Separate blocks by type for restructured layout
  const paragraphBlocks = blocks.filter((b) => b.type === "paragraph");
  const imageBlocks = blocks.filter((b) => b.type === "full_image" || b.type === "two_image_grid" || b.type === "three_image_grid");
  const quoteBlocks = blocks.filter((b) => b.type === "quote");

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-20 pt-20" data-testid="blog-detail-page">
      <article className="mx-auto w-full max-w-5xl px-5 sm:px-8" data-testid="blog-detail-article">
        {/* HERO IMAGE — inside container */}
        <div data-testid="blog-detail-hero-section">
          <img
            src={post.hero_image}
            alt={post.title}
            loading="eager"
            className="aspect-[21/9] w-full object-cover object-center"
            data-testid="blog-detail-hero-image"
          />
        </div>

        {/* TITLE + META */}
        <div className="mt-8" data-testid="blog-detail-header">
          <h1 className="serif-display text-4xl text-[#350A13] sm:text-5xl" data-testid="blog-detail-title">
            {post.title}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#7b5a53]" data-testid="blog-detail-meta">
            {post.category} &middot; {post.author_name} &middot; {post.date}
          </p>
        </div>

        {/* PARAGRAPH 1 */}
        {paragraphBlocks[0] && (
          <section className="mt-8" data-testid="blog-detail-intro-paragraph">
            <p className="text-base leading-[1.85] text-[#50332F]">{paragraphBlocks[0].text}</p>
          </section>
        )}

        {/* LARGE IMAGE 1 */}
        {imageBlocks[0] && (
          <section className="mt-8" data-testid="blog-detail-large-image-1">
            <img
              src={imageBlocks[0].images?.[0]}
              alt={post.title}
              loading="lazy"
              className="aspect-[16/8] w-full object-cover object-center"
            />
          </section>
        )}

        {/* 4 IMAGE GALLERY GRID 1 */}
        {galleryImages.length > 0 && (
          <section className="mt-8" data-testid="blog-detail-gallery-grid-1">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {galleryImages.slice(0, 4).map((image, index) => (
                <img
                  key={`gallery1-${index}`}
                  src={image}
                  alt={`${post.title} gallery ${index + 1}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover object-center"
                  data-testid={`blog-detail-gallery-image-${index}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* PARAGRAPH 2 (2-3 lines) */}
        {paragraphBlocks[1] && (
          <section className="mt-8" data-testid="blog-detail-second-paragraph">
            <p className="text-base leading-[1.85] text-[#50332F]">{paragraphBlocks[1].text}</p>
          </section>
        )}

        {/* 4 IMAGE GALLERY GRID 2 (reuse images or use remaining) */}
        {(imageBlocks.length > 1 || galleryImages.length > 0) && (
          <section className="mt-8" data-testid="blog-detail-gallery-grid-2">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(imageBlocks.length > 1
                ? [...(imageBlocks[1]?.images || []), ...(imageBlocks[2]?.images || [])].flat().slice(0, 4)
                : galleryImages.slice(0, 4)
              ).map((image, index) => (
                <img
                  key={`gallery2-${index}`}
                  src={image}
                  alt={`${post.title} ${index + 1}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover object-center"
                  data-testid={`blog-detail-gallery2-image-${index}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* QUOTE if exists */}
        {quoteBlocks[0] && (
          <section className="mt-8" data-testid="blog-detail-quote-block">
            <blockquote className="border-l-2 border-[#C6A75E] py-2 pl-6 text-xl italic leading-relaxed text-[#4B0F1B]">
              &ldquo;{quoteBlocks[0].text}&rdquo;
            </blockquote>
          </section>
        )}

        {/* CTA — Button only, no question text */}
        <div className="mt-14 flex justify-center" data-testid="blog-detail-end-cta">
          <Link to="/enquiry" className="gold-outline-button inline-flex" data-testid="blog-detail-end-cta-button">
            Begin Your Celebration
          </Link>
        </div>
      </article>
    </div>
  );
}

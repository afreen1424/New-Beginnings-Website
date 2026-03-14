import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { brandConfig } from "../data/siteContent";
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
      <div className="bg-[#F5EFE6] px-5 pb-20 pt-28 text-center" data-testid="blog-not-found-page">
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
      <div className="bg-[#F5EFE6] px-5 pb-20 pt-28 text-center" data-testid="blog-loading-page">
        <p className="text-base text-[#4C3330]" data-testid="blog-loading-text">
          Loading story...
        </p>
      </div>
    );
  }

  const blocks = post.content_blocks || [];
  const galleryImages = post.gallery_images || [];

  return (
    <div className="bg-[#F5EFE6] pb-20 pt-20" data-testid="blog-detail-page">
      <article data-testid="blog-detail-article">
        {/* SECTION 1 — HERO */}
        <div className="w-full" data-testid="blog-detail-hero-section">
          <img
            src={post.hero_image}
            alt={post.title}
            loading="eager"
            className="aspect-[21/9] w-full object-cover object-center"
            data-testid="blog-detail-hero-image"
          />
        </div>

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <div className="mt-8" data-testid="blog-detail-header">
            <h1 className="serif-display text-4xl text-[#350A13] sm:text-5xl" data-testid="blog-detail-title">
              {post.title}
            </h1>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#7b5a53]" data-testid="blog-detail-meta">
              {post.category} &middot; {post.author_name} &middot; {post.date}
            </p>
          </div>

          {/* SECTION 2+ — CONTENT BLOCKS */}
          <div className="mt-10 space-y-10" data-testid="blog-detail-sections">
            {post.article_content && (
              <section data-testid="blog-detail-article-content">
                <p className="text-base leading-[1.85] text-[#50332F]">{post.article_content}</p>
              </section>
            )}

            {blocks.map((block, index) => {
              if (block.type === "paragraph") {
                return (
                  <section key={block.id || index} data-testid={`blog-detail-block-paragraph-${index}`}>
                    <p className="text-base leading-[1.85] text-[#50332F]">{block.text}</p>
                  </section>
                );
              }

              if (block.type === "quote") {
                return (
                  <section key={block.id || index} data-testid={`blog-detail-block-quote-${index}`}>
                    <blockquote className="border-l-2 border-[#C6A75E] py-2 pl-6 text-xl italic leading-relaxed text-[#4B0F1B]">
                      &ldquo;{block.text}&rdquo;
                    </blockquote>
                  </section>
                );
              }

              if (block.type === "full_image") {
                return (
                  <section key={block.id || index} className="-mx-5 sm:-mx-8" data-testid={`blog-detail-block-full-image-${index}`}>
                    <img
                      src={block.images?.[0]}
                      alt={`${post.title}`}
                      loading="lazy"
                      className="aspect-[16/8] w-full object-cover object-center"
                    />
                  </section>
                );
              }

              if (block.type === "two_image_grid") {
                return (
                  <section key={block.id || index} className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-testid={`blog-detail-block-two-grid-${index}`}>
                    {(block.images || []).slice(0, 2).map((image, imageIndex) => (
                      <img
                        key={`${image}-${imageIndex}`}
                        src={image}
                        alt={`${post.title}`}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover object-center"
                      />
                    ))}
                  </section>
                );
              }

              if (block.type === "three_image_grid") {
                return (
                  <section key={block.id || index} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid={`blog-detail-block-three-grid-${index}`}>
                    {(block.images || []).slice(0, 3).map((image, imageIndex) => (
                      <img
                        key={`${image}-${imageIndex}`}
                        src={image}
                        alt={`${post.title}`}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover object-center"
                      />
                    ))}
                  </section>
                );
              }

              return null;
            })}
          </div>

          {/* GALLERY SECTION */}
          {galleryImages.length > 0 && (
            <section className="mt-10" data-testid="blog-detail-gallery">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {galleryImages.slice(0, 4).map((image, index) => (
                  <img
                    key={`gallery-${index}`}
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
        </div>

        {/* CTA SECTION */}
        <section className="mx-auto mt-14 w-full max-w-4xl border-t border-b border-[#C6A75E]/35 bg-white px-5 py-12 text-center sm:px-8" data-testid="blog-detail-end-cta">
          <h2 className="serif-display text-3xl text-[#3C0518]" data-testid="blog-detail-end-cta-heading">
            Planning something unforgettable?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#4C3330]" data-testid="blog-detail-end-cta-text">
            Let us design a celebration that reflects your story with elegance and precision.
          </p>
          <Link to="/enquiry" className="gold-outline-button mt-7 inline-flex" data-testid="blog-detail-end-cta-button">
            Begin Your Celebration
          </Link>
        </section>
      </article>
    </div>
  );
}

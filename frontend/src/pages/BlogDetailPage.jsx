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

  return (
    <div className="bg-[#F5EFE6] px-5 pb-20 pt-28 sm:px-8 lg:px-12" data-testid="blog-detail-page">
      <article className="mx-auto w-full max-w-5xl" data-testid="blog-detail-article">
        <img
          src={post.hero_image}
          alt={post.title}
          loading="eager"
          className="aspect-[16/8] w-full rounded-3xl object-cover object-center"
          data-testid="blog-detail-hero-image"
        />

        <h1 className="serif-display mt-10 text-4xl text-[#350A13] sm:text-5xl" data-testid="blog-detail-title">
          {post.title}
        </h1>

        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#7b5a53]" data-testid="blog-detail-meta">
          {post.category} · {post.author_name} · {post.date}
        </p>

        <div className="mt-10 space-y-8" data-testid="blog-detail-sections">
          {post.article_content && (
            <section data-testid="blog-detail-article-content">
              <p className="text-base leading-relaxed text-[#50332F]">{post.article_content}</p>
            </section>
          )}

          {(post.content_blocks || []).map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <section key={block.id || index} data-testid={`blog-detail-block-paragraph-${index}`}>
                  <p className="text-base leading-relaxed text-[#50332F]">{block.text}</p>
                </section>
              );
            }

            if (block.type === "quote") {
              return (
                <section key={block.id || index} data-testid={`blog-detail-block-quote-${index}`}>
                  <blockquote className="rounded-2xl border border-[#C6A75E]/40 bg-white p-6 text-xl italic text-[#4B0F1B]">“{block.text}”</blockquote>
                </section>
              );
            }

            if (block.type === "full_image") {
              return (
                <section key={block.id || index} data-testid={`blog-detail-block-full-image-${index}`}>
                  <img src={block.images?.[0]} alt={`${post.title} block image`} loading="lazy" className="aspect-[16/8] w-full rounded-2xl object-cover object-center" />
                </section>
              );
            }

            if (block.type === "two_image_grid") {
              return (
                <section key={block.id || index} className="grid grid-cols-1 gap-4 sm:grid-cols-2" data-testid={`blog-detail-block-two-grid-${index}`}>
                  {(block.images || []).slice(0, 2).map((image, imageIndex) => (
                    <img key={`${image}-${imageIndex}`} src={image} alt={`${post.title} two-grid ${imageIndex + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover object-center" />
                  ))}
                </section>
              );
            }

            if (block.type === "three_image_grid") {
              return (
                <section key={block.id || index} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid={`blog-detail-block-three-grid-${index}`}>
                  {(block.images || []).slice(0, 3).map((image, imageIndex) => (
                    <img key={`${image}-${imageIndex}`} src={image} alt={`${post.title} three-grid ${imageIndex + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover object-center" />
                  ))}
                </section>
              );
            }

            return null;
          })}
        </div>

        {post.gallery_images?.length > 0 && (
          <section className="mt-12" data-testid="blog-detail-gallery">
            <h3 className="serif-display text-2xl text-[#350A13]" data-testid="blog-detail-gallery-heading">
              Gallery
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {post.gallery_images.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${post.title} gallery ${index + 1}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-2xl object-cover object-center"
                  data-testid={`blog-detail-gallery-image-${index}`}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 rounded-3xl border border-[#C6A75E]/35 bg-white p-8 text-center" data-testid="blog-detail-end-cta">
          <h2 className="serif-display text-3xl text-[#3C0518]" data-testid="blog-detail-end-cta-heading">
            Planning something unforgettable?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#4C3330]" data-testid="blog-detail-end-cta-text">
            Let us design a celebration that reflects your story with elegance and precision.
          </p>
          <a href={brandConfig.whatsappLink} target="_blank" rel="noreferrer" className="gold-outline-button mt-7 inline-flex" data-testid="blog-detail-end-cta-button">
            Start Your Celebration →
          </a>
        </section>

        <div className="mt-12">
          <Link to="/enquiry" className="gold-outline-button inline-flex" data-testid="blog-detail-cta-button">
            Begin Your Celebration
          </Link>
        </div>
      </article>
    </div>
  );
}
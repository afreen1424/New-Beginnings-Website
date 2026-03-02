import { Link, useParams } from "react-router-dom";
import { blogPosts } from "../data/siteContent";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
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

  return (
    <div className="bg-[#F5EFE6] px-5 pb-20 pt-28 sm:px-8 lg:px-12" data-testid="blog-detail-page">
      <article className="mx-auto w-full max-w-5xl" data-testid="blog-detail-article">
        <img
          src={post.cover}
          alt={post.title}
          loading="eager"
          className="aspect-[16/8] w-full rounded-3xl object-cover object-center"
          data-testid="blog-detail-hero-image"
        />

        <h1 className="serif-display mt-10 text-4xl text-[#350A13] sm:text-5xl" data-testid="blog-detail-title">
          {post.title}
        </h1>

        <div className="mt-10 space-y-8" data-testid="blog-detail-sections">
          <section data-testid="blog-detail-vision">
            <h2 className="text-xs uppercase tracking-[0.24em] text-[#4B0F1B]">Vision</h2>
            <p className="mt-3 text-base leading-relaxed text-[#50332F]">{post.vision}</p>
          </section>
          <section data-testid="blog-detail-concept">
            <h2 className="text-xs uppercase tracking-[0.24em] text-[#4B0F1B]">Concept</h2>
            <p className="mt-3 text-base leading-relaxed text-[#50332F]">{post.concept}</p>
          </section>
          <section data-testid="blog-detail-execution">
            <h2 className="text-xs uppercase tracking-[0.24em] text-[#4B0F1B]">Execution</h2>
            <p className="mt-3 text-base leading-relaxed text-[#50332F]">{post.execution}</p>
          </section>
          <section data-testid="blog-detail-experience">
            <h2 className="text-xs uppercase tracking-[0.24em] text-[#4B0F1B]">Experience</h2>
            <p className="mt-3 text-base leading-relaxed text-[#50332F]">{post.experience}</p>
          </section>
        </div>

        <section className="mt-12" data-testid="blog-detail-gallery">
          <h3 className="serif-display text-2xl text-[#350A13]" data-testid="blog-detail-gallery-heading">
            Gallery
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {post.gallery.map((image, index) => (
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

        <Link to="/enquiry" className="gold-outline-button mt-12 inline-flex" data-testid="blog-detail-cta-button">
          Begin Your Celebration
        </Link>
      </article>
    </div>
  );
}
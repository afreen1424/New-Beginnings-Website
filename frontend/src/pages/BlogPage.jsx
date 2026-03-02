import { Link } from "react-router-dom";
import { blogPosts } from "../data/siteContent";

export default function BlogPage() {
  return (
    <div className="bg-[#E8D8C3] px-5 pb-20 pt-28 sm:px-8 lg:px-12" data-testid="blog-page">
      <section className="mx-auto w-full max-w-5xl text-center" data-testid="blog-hero-section">
        <h1 className="serif-display text-4xl text-[#C6A75E] sm:text-5xl lg:text-6xl" data-testid="blog-hero-heading">
          The Forever Stories We&apos;ve Crafted.
        </h1>
        <div className="mx-auto mt-4 h-[1px] w-28 bg-[#C6A75E]" data-testid="blog-hero-divider" />
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-[#50332F]" data-testid="blog-hero-subline">
          An inside look at the ideas, details, and dedication behind the celebrations we bring to life.
        </p>
      </section>

      <section className="mx-auto mt-14 w-full max-w-6xl" data-testid="blog-grid-section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2" data-testid="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.slug} className="group overflow-hidden rounded-2xl bg-white" data-testid={`blog-card-${post.slug}`}>
              <img
                src={post.cover}
                alt={post.title}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                data-testid={`blog-card-image-${post.slug}`}
              />
              <div className="p-6">
                <h2 className="serif-display text-3xl text-[#3E0B14]" data-testid={`blog-card-title-${post.slug}`}>
                  {post.title}
                </h2>
                <p className="mt-4 text-base text-[#50332F]" data-testid={`blog-card-teaser-${post.slug}`}>
                  {post.teaser}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#5A0F1C]"
                  data-testid={`blog-card-link-${post.slug}`}
                >
                  Read the Story →
                  <span className="ml-3 h-[1px] w-10 bg-[#C6A75E] transition-all duration-300 group-hover:w-14" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
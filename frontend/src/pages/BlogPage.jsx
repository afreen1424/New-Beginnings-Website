import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RevealBlock from "../components/common/RevealBlock";
import { getBlogCategories, getBlogPosts } from "../services/blogApi";

export default function BlogPage() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const loadData = async () => {
      const [categoryData, postData] = await Promise.all([getBlogCategories(), getBlogPosts("all")]);
      setCategories(categoryData);
      setPosts(postData);
    };

    loadData().catch(() => {
      setCategories([]);
      setPosts([]);
    });
  }, []);

  const visiblePosts = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <div className="bg-ivory px-5 pb-20 pt-28 sm:px-8 lg:px-12" data-testid="blog-page">
      <section className="section-fade-up mx-auto w-full max-w-5xl text-center" data-testid="blog-hero-section">
        <h1 className="serif-display text-4xl text-[#350A13] sm:text-5xl lg:text-6xl" data-testid="blog-hero-heading">
          The Forever Stories We&apos;ve Crafted.
        </h1>
        <div className="mx-auto mt-4 h-[1px] w-28 bg-[#C6A75E]" data-testid="blog-hero-divider" />
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-[#4C3330]" data-testid="blog-hero-subline">
          An inside look at the ideas, details, and dedication behind the celebrations we bring to life.
        </p>
      </section>

      <section className="mx-auto mt-8 w-full max-w-6xl" data-testid="blog-categories-filter-section">
        <div className="flex flex-wrap items-center justify-center gap-2" data-testid="blog-categories-filter-list">
          {["All", ...categories.map((category) => category.name)].map((categoryName) => (
            <button
              key={categoryName}
              type="button"
              onClick={() => setActiveCategory(categoryName)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                activeCategory === categoryName
                  ? "border-[#3C0518] bg-[#3C0518] text-[#F5EFE6]"
                  : "border-[#C6A75E] text-[#3C0518]"
              }`}
              data-testid={`blog-category-filter-${categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              {categoryName}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-6xl" data-testid="blog-grid-section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2" data-testid="blog-grid">
          {visiblePosts.map((post, index) => (
            <RevealBlock key={post.slug} direction={index % 2 === 0 ? "left" : "right"} delay={index * 110} testId={`blog-card-reveal-${post.slug}`}>
              <article className="group overflow-hidden rounded-2xl bg-white shadow-[0_16px_24px_rgba(75,15,27,0.08)]" data-testid={`blog-card-${post.slug}`}>
                <div className="relative">
                  <img
                    src={post.hero_image}
                    alt={post.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    data-testid={`blog-card-image-${post.slug}`}
                  />
                  <div className="soft-overlay-card absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" data-testid={`blog-card-overlay-${post.slug}`} />
                </div>
                <div className="p-6">
                  <h2 className="serif-display text-3xl text-[#350A13]" data-testid={`blog-card-title-${post.slug}`}>
                    {post.title}
                  </h2>
                  <p className="mt-4 text-base text-[#4C3330]" data-testid={`blog-card-teaser-${post.slug}`}>
                    {post.excerpt}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#7b5a53]" data-testid={`blog-card-meta-${post.slug}`}>
                    {post.category} · {post.author_name} · {post.date}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#4B0F1B]"
                    data-testid={`blog-card-link-${post.slug}`}
                  >
                    Read the Story →
                    <span className="ml-3 h-[1px] w-10 bg-[#C6A75E] transition-all duration-300 group-hover:w-14" />
                  </Link>
                </div>
              </article>
            </RevealBlock>
          ))}
        </div>
      </section>
    </div>
  );
}
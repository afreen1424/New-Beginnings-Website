import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RevealBlock from "../components/common/RevealBlock";
import { getBlogCategories, getBlogPosts } from "../services/blogApi";

function HeroPost({ post }) {
  return (
    <RevealBlock direction="up" delay={0} testId={`blog-hero-reveal-${post.slug}`}>
      <Link to={`/blog/${post.slug}`} className="group block" data-testid={`blog-hero-post-${post.slug}`}>
        <div className="overflow-hidden">
          <img
            src={post.hero_image}
            alt={post.title}
            loading="eager"
            className="aspect-[21/9] w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            data-testid={`blog-hero-post-image-${post.slug}`}
          />
        </div>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C6A75E]" data-testid={`blog-hero-post-category-${post.slug}`}>
            {post.category}
          </p>
          <h2 className="serif-display mt-2 text-3xl text-[#350A13] sm:text-4xl lg:text-5xl" data-testid={`blog-hero-post-title-${post.slug}`}>
            {post.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#4C3330]" data-testid={`blog-hero-post-excerpt-${post.slug}`}>
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.18em] text-[#7b5a53]" data-testid={`blog-hero-post-date-${post.slug}`}>
              {post.date}
            </span>
            <span className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#4B0F1B]">
              Read More
              <span className="ml-3 inline-block h-[1px] w-10 bg-[#C6A75E] transition-all duration-300 group-hover:w-16" />
            </span>
          </div>
        </div>
      </Link>
    </RevealBlock>
  );
}

function EditorialRow({ post, imageLeft }) {
  const direction = imageLeft ? "left" : "right";

  const imageBlock = (
    <div className="overflow-hidden">
      <img
        src={post.hero_image}
        alt={post.title}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        data-testid={`blog-editorial-image-${post.slug}`}
      />
    </div>
  );

  const textBlock = (
    <div className="flex flex-col justify-center" data-testid={`blog-editorial-text-${post.slug}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-[#C6A75E]">
        {post.category}
      </p>
      <h2 className="serif-display mt-2 text-2xl text-[#350A13] sm:text-3xl">
        {post.title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-[#4C3330]">
        {post.excerpt}
      </p>
      <div className="mt-4 flex items-center gap-4">
        <span className="text-xs uppercase tracking-[0.18em] text-[#7b5a53]">
          {post.date}
        </span>
        <span className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#4B0F1B]">
          Read More
          <span className="ml-3 inline-block h-[1px] w-10 bg-[#C6A75E] transition-all duration-300 group-hover:w-16" />
        </span>
      </div>
    </div>
  );

  return (
    <RevealBlock direction={direction} delay={0} testId={`blog-editorial-reveal-${post.slug}`}>
      <Link
        to={`/blog/${post.slug}`}
        className="group grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center md:gap-10"
        data-testid={`blog-editorial-row-${post.slug}`}
      >
        {imageLeft ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            <div className="order-2 md:order-1">{textBlock}</div>
            <div className="order-1 md:order-2">{imageBlock}</div>
          </>
        )}
      </Link>
    </RevealBlock>
  );
}

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

  const heroPost = visiblePosts[0];
  const remainingPosts = visiblePosts.slice(1);

  return (
    <div className="min-h-screen bg-[#F5EFE6] px-5 pb-20 pt-28 sm:px-8 lg:px-12" data-testid="blog-page">
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

      <section className="mx-auto mt-14 w-full max-w-6xl" data-testid="blog-listing-section">
        {heroPost && <HeroPost post={heroPost} />}

        {remainingPosts.length > 0 && (
          <div className="mt-16 space-y-16" data-testid="blog-editorial-list">
            {remainingPosts.map((post, index) => (
              <EditorialRow
                key={post.slug}
                post={post}
                imageLeft={index % 2 === 0}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

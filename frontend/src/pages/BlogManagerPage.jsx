import { useEffect, useMemo, useState, useCallback } from "react";
import {
  createBlogCategory,
  createBlogPost,
  deleteBlogCategory,
  deleteBlogPost,
  getAdminBlogPosts,
  getBlogCategories,
  updateBlogCategory,
  updateBlogPost,
  uploadImage,
  verifyAdminPasscode,
} from "../services/blogApi";

const createEmptyBlock = (type = "paragraph") => ({
  id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  text: "",
  images: [],
});

const createInitialForm = () => ({
  title: "",
  category: "Weddings",
  author_name: "",
  date: "",
  hero_image: "",
  excerpt: "",
  article_content: "",
  seo_title: "",
  meta_description: "",
  content_blocks: [createEmptyBlock("paragraph")],
  gallery_images: ["", "", "", "", "", ""],
  status: "draft",
});

const blockTypeOptions = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Full Width Image", value: "full_image" },
  { label: "Two Image Grid", value: "two_image_grid" },
  { label: "Three Image Grid", value: "three_image_grid" },
  { label: "Quote", value: "quote" },
];

const requiredImageCount = (type) => {
  if (type === "full_image") return 1;
  if (type === "two_image_grid") return 2;
  if (type === "three_image_grid") return 3;
  return 0;
};

export default function BlogManagerPage() {
  const [passcode, setPasscode] = useState("");
  const [authedPasscode, setAuthedPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState(createInitialForm());
  const [activePostId, setActivePostId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isAuthed = Boolean(authedPasscode);

  const normalizedCategories = useMemo(() => {
    const list = categories.map((cat) => cat.name);
    if (!list.includes("Uncategorized")) {
      list.push("Uncategorized");
    }
    return list;
  }, [categories]);

  const refreshData = async () => {
    const [categoryData, postData] = await Promise.all([
      getBlogCategories(),
      authedPasscode ? getAdminBlogPosts(authedPasscode, "all") : [],
    ]);
    setCategories(categoryData);
    if (postData.length !== undefined) setPosts(postData);
  };

  useEffect(() => {
    refreshData().catch(() => {
      setStatusMessage("Unable to load blog data right now.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authedPasscode]);

  const handleVerifyPasscode = async (event) => {
    event.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      await verifyAdminPasscode(passcode);
      setAuthedPasscode(passcode);
      setStatusMessage("Manager unlocked.");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPost = (post) => {
    setActivePostId(post.id);
    setPostForm({
      title: post.title || "",
      category: post.category || "Weddings",
      author_name: post.author_name || "",
      date: post.date || "",
      hero_image: post.hero_image || "",
      excerpt: post.excerpt || "",
      article_content: post.article_content || "",
      seo_title: post.seo_title || "",
      meta_description: post.meta_description || "",
      content_blocks: (post.content_blocks || []).map((block) => ({
        id: block.id || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: block.type,
        text: block.text || "",
        images: block.images || [],
      })),
      gallery_images: [...(post.gallery_images || [])],
      status: post.status || "draft",
    });
  };

  const handleResetForm = () => {
    setActivePostId(null);
    setPostForm(createInitialForm());
  };

  const updatePostField = (field, value) => {
    setPostForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateGalleryItem = (index, value) => {
    setPostForm((prev) => {
      const next = [...prev.gallery_images];
      next[index] = value;
      return { ...prev, gallery_images: next };
    });
  };

  const appendGalleryImage = () => {
    setPostForm((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, ""] }));
  };

  const removeGalleryImage = (index) => {
    setPostForm((prev) => ({ ...prev, gallery_images: prev.gallery_images.filter((_, idx) => idx !== index) }));
  };

  const doUpload = useCallback(async (file) => {
    if (!authedPasscode) return null;
    setUploading(true);
    try {
      const result = await uploadImage(authedPasscode, file);
      return result.url;
    } catch (error) {
      setStatusMessage(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  }, [authedPasscode]);

  const handleHeroImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await doUpload(file);
    if (url) updatePostField("hero_image", url);
  };

  const handleGalleryUpload = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await doUpload(file);
    if (url) updateGalleryItem(index, url);
  };

  const addContentBlock = (type) => {
    setPostForm((prev) => ({ ...prev, content_blocks: [...prev.content_blocks, createEmptyBlock(type)] }));
  };

  const removeContentBlock = (id) => {
    setPostForm((prev) => ({ ...prev, content_blocks: prev.content_blocks.filter((block) => block.id !== id) }));
  };

  const updateBlock = (id, updates) => {
    setPostForm((prev) => ({
      ...prev,
      content_blocks: prev.content_blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)),
    }));
  };

  const updateBlockImage = (blockId, imageIndex, value) => {
    setPostForm((prev) => ({
      ...prev,
      content_blocks: prev.content_blocks.map((block) => {
        if (block.id !== blockId) return block;
        const nextImages = [...block.images];
        nextImages[imageIndex] = value;
        return { ...block, images: nextImages };
      }),
    }));
  };

  const handleBlockImageUpload = async (blockId, imageIndex, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await doUpload(file);
    if (url) updateBlockImage(blockId, imageIndex, url);
  };

  const onDragStart = (index) => setDragIndex(index);

  const onDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      return;
    }

    setPostForm((prev) => {
      const nextBlocks = [...prev.content_blocks];
      const [moved] = nextBlocks.splice(dragIndex, 1);
      nextBlocks.splice(dropIndex, 0, moved);
      return { ...prev, content_blocks: nextBlocks };
    });
    setDragIndex(null);
  };

  const sanitizePayload = () => {
    const blocks = postForm.content_blocks.map((block) => {
      const minImages = requiredImageCount(block.type);
      const nextImages = [...(block.images || [])];
      while (nextImages.length < minImages) nextImages.push("");

      return {
        id: block.id,
        type: block.type,
        text: block.text,
        images: nextImages.filter((img) => Boolean(img)),
      };
    });

    return {
      ...postForm,
      gallery_images: postForm.gallery_images.filter((img) => Boolean(img)),
      content_blocks: blocks,
    };
  };

  const handleSavePost = async (event) => {
    event.preventDefault();
    if (!isAuthed) return;

    setLoading(true);
    try {
      const payload = sanitizePayload();
      if (activePostId) {
        await updateBlogPost(authedPasscode, activePostId, payload);
        setStatusMessage("Blog post updated.");
      } else {
        await createBlogPost(authedPasscode, payload);
        setStatusMessage("Blog post created.");
      }
      await refreshData();
      handleResetForm();
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!isAuthed) return;
    setLoading(true);
    try {
      await deleteBlogPost(authedPasscode, postId);
      setStatusMessage("Blog post deleted.");
      if (activePostId === postId) handleResetForm();
      await refreshData();
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !isAuthed) return;
    setLoading(true);
    try {
      await createBlogCategory(authedPasscode, { name: newCategoryName.trim() });
      setNewCategoryName("");
      setStatusMessage("Category added.");
      await refreshData();
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (categoryId) => {
    if (!editingCategoryName.trim() || !isAuthed) return;
    setLoading(true);
    try {
      await updateBlogCategory(authedPasscode, categoryId, { name: editingCategoryName.trim() });
      setEditingCategoryId(null);
      setEditingCategoryName("");
      setStatusMessage("Category updated.");
      await refreshData();
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!isAuthed) return;
    setLoading(true);
    try {
      await deleteBlogCategory(authedPasscode, categoryId);
      setStatusMessage("Category deleted.");
      await refreshData();
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5EFE6] px-5 pb-20 pt-28 sm:px-8 lg:px-12" data-testid="blog-manager-page">
      <div className="mx-auto w-full max-w-7xl" data-testid="blog-manager-wrapper">
        <h1 className="serif-display text-4xl text-[#3C0518] sm:text-5xl" data-testid="blog-manager-title">
          Blog Management
        </h1>
        <p className="mt-3 text-base text-[#4C3330]" data-testid="blog-manager-subtitle">
          Create, edit, and organize blog stories with flexible content blocks.
        </p>

        {!isAuthed && (
          <form className="mt-8 max-w-lg rounded-2xl bg-white p-6" onSubmit={handleVerifyPasscode} data-testid="blog-manager-passcode-form">
            <label className="block text-sm text-[#3C0518]" htmlFor="manager-passcode-input">
              Enter manager passcode
            </label>
            <input
              id="manager-passcode-input"
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              className="mt-3 w-full rounded-md border border-[#C6A75E]/40 px-3 py-2"
              data-testid="manager-passcode-input"
            />
            {authError && (
              <p className="mt-2 text-sm text-red-600" data-testid="manager-passcode-error">
                {authError}
              </p>
            )}
            <button type="submit" className="gold-outline-button mt-5" disabled={loading} data-testid="manager-passcode-submit">
              Unlock
            </button>
          </form>
        )}

        {isAuthed && (
          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[340px_1fr]" data-testid="blog-manager-main-grid">
            <aside className="space-y-6" data-testid="blog-manager-sidebar">
              <section className="rounded-2xl bg-white p-5" data-testid="blog-categories-panel">
                <h2 className="serif-display text-2xl text-[#3C0518]">Categories</h2>
                <div className="mt-4 space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="rounded-lg border border-[#C6A75E]/25 p-3" data-testid={`manager-category-row-${category.id}`}>
                      {editingCategoryId === category.id ? (
                        <div className="space-y-2">
                          <input
                            value={editingCategoryName}
                            onChange={(event) => setEditingCategoryName(event.target.value)}
                            className="w-full rounded border border-[#C6A75E]/40 px-2 py-1"
                            data-testid={`manager-category-edit-input-${category.id}`}
                          />
                          <button onClick={() => handleSaveCategory(category.id)} type="button" className="text-sm text-[#3C0518]" data-testid={`manager-category-save-${category.id}`}>
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-[#3C0518]" data-testid={`manager-category-name-${category.id}`}>
                            {category.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-xs text-[#3C0518]"
                              onClick={() => {
                                setEditingCategoryId(category.id);
                                setEditingCategoryName(category.name);
                              }}
                              data-testid={`manager-category-edit-${category.id}`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-xs text-red-700"
                              onClick={() => handleDeleteCategory(category.id)}
                              data-testid={`manager-category-delete-${category.id}`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <input
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="New category"
                    className="w-full rounded border border-[#C6A75E]/40 px-2 py-1"
                    data-testid="manager-new-category-input"
                  />
                  <button type="button" onClick={handleAddCategory} className="text-sm text-[#3C0518]" data-testid="manager-add-category-button">
                    Add
                  </button>
                </div>
              </section>

              <section className="rounded-2xl bg-white p-5" data-testid="blog-posts-panel">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="serif-display text-2xl text-[#3C0518]">Posts</h2>
                  <button type="button" className="text-sm text-[#3C0518]" onClick={handleResetForm} data-testid="manager-new-post-button">
                    New
                  </button>
                </div>
                <div className="space-y-2">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className={`cursor-pointer rounded-lg border p-3 ${activePostId === post.id ? "border-[#3C0518]" : "border-[#C6A75E]/25"}`}
                      onClick={() => handleSelectPost(post)}
                      data-testid={`manager-post-row-${post.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-[#3C0518]">{post.title}</p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            post.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                          data-testid={`manager-post-status-badge-${post.id}`}
                        >
                          {post.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-[#5a3c37]">
                        <span>{post.category}</span>
                        <button
                          type="button"
                          className="text-red-700"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeletePost(post.id);
                          }}
                          data-testid={`manager-post-delete-${post.id}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>

            <section className="rounded-2xl bg-white p-6" data-testid="blog-post-form-panel">
              <h2 className="serif-display text-3xl text-[#3C0518]" data-testid="manager-form-heading">
                {activePostId ? "Edit Blog Post" : "Create Blog Post"}
              </h2>

              <form className="mt-6 space-y-6" onSubmit={handleSavePost} data-testid="manager-post-form">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <input value={postForm.title} onChange={(e) => updatePostField("title", e.target.value)} placeholder="Blog Title" className="w-full rounded border border-[#C6A75E]/40 px-3 py-2" data-testid="manager-title-input" required />
                    {postForm.title && (
                      <p className="text-xs text-[#7b5a53]" data-testid="manager-slug-preview">
                        Slug: /blog/{postForm.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "..."}
                      </p>
                    )}
                  </div>
                  <select value={postForm.category} onChange={(e) => updatePostField("category", e.target.value)} className="rounded border border-[#C6A75E]/40 px-3 py-2" data-testid="manager-category-select">
                    {normalizedCategories.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                  <input value={postForm.author_name} onChange={(e) => updatePostField("author_name", e.target.value)} placeholder="Author Name" className="rounded border border-[#C6A75E]/40 px-3 py-2" data-testid="manager-author-input" required />
                  <input value={postForm.date} onChange={(e) => updatePostField("date", e.target.value)} type="date" className="rounded border border-[#C6A75E]/40 px-3 py-2" data-testid="manager-date-input" required />
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-[#3C0518]">Hero Image (URL or Upload)</label>
                  <input value={postForm.hero_image} onChange={(e) => updatePostField("hero_image", e.target.value)} className="w-full rounded border border-[#C6A75E]/40 px-3 py-2" placeholder="https://..." data-testid="manager-hero-image-url-input" />
                  <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="text-sm text-[#4C3330]" data-testid="manager-hero-image-upload" />
                  {postForm.hero_image && (
                    <img src={postForm.hero_image} alt="Hero preview" className="mt-2 h-32 w-auto rounded-lg object-cover" data-testid="manager-hero-image-preview" />
                  )}
                </div>

                <textarea value={postForm.excerpt} onChange={(e) => updatePostField("excerpt", e.target.value)} placeholder="Short Excerpt" className="min-h-[90px] w-full rounded border border-[#C6A75E]/40 px-3 py-2" data-testid="manager-excerpt-input" required />
                <textarea value={postForm.article_content} onChange={(e) => updatePostField("article_content", e.target.value)} placeholder="Article Content" className="min-h-[120px] w-full rounded border border-[#C6A75E]/40 px-3 py-2" data-testid="manager-article-content-input" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input value={postForm.seo_title} onChange={(e) => updatePostField("seo_title", e.target.value)} placeholder="SEO Title" className="rounded border border-[#C6A75E]/40 px-3 py-2" data-testid="manager-seo-title-input" required />
                  <input value={postForm.meta_description} onChange={(e) => updatePostField("meta_description", e.target.value)} placeholder="Meta Description" className="rounded border border-[#C6A75E]/40 px-3 py-2" data-testid="manager-meta-description-input" required />
                </div>

                <div className="space-y-3" data-testid="manager-gallery-section">
                  <h3 className="serif-display text-2xl text-[#3C0518]">Gallery Images</h3>
                  {postForm.gallery_images.map((image, index) => (
                    <div key={`gallery-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_auto]">
                      <input
                        value={image}
                        onChange={(event) => updateGalleryItem(index, event.target.value)}
                        className="rounded border border-[#C6A75E]/40 px-3 py-2"
                        placeholder={`Gallery image ${index + 1} URL`}
                        data-testid={`manager-gallery-url-${index}`}
                      />
                      <input type="file" accept="image/*" onChange={(event) => handleGalleryUpload(index, event)} data-testid={`manager-gallery-upload-${index}`} />
                      <button type="button" onClick={() => removeGalleryImage(index)} className="text-sm text-red-700" data-testid={`manager-gallery-remove-${index}`}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="text-sm text-[#3C0518]" onClick={appendGalleryImage} data-testid="manager-gallery-add-button">
                    Add Gallery Image
                  </button>
                </div>

                <div className="space-y-4" data-testid="manager-content-blocks-section">
                  <div className="flex items-center justify-between">
                    <h3 className="serif-display text-2xl text-[#3C0518]">Content Blocks</h3>
                    <div className="flex flex-wrap gap-2">
                      {blockTypeOptions.map((option) => (
                        <button key={option.value} type="button" className="text-xs text-[#3C0518]" onClick={() => addContentBlock(option.value)} data-testid={`manager-add-block-${option.value}`}>
                          + {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {postForm.content_blocks.map((block, index) => {
                    const minImages = requiredImageCount(block.type);
                    const blockImages = [...(block.images || [])];
                    while (blockImages.length < minImages) blockImages.push("");

                    return (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => onDragStart(index)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => onDrop(index)}
                        className="rounded-lg border border-[#C6A75E]/30 p-4"
                        data-testid={`manager-block-${block.id}`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <select
                            value={block.type}
                            onChange={(event) => updateBlock(block.id, { type: event.target.value, images: [], text: "" })}
                            className="rounded border border-[#C6A75E]/40 px-2 py-1"
                            data-testid={`manager-block-type-${block.id}`}
                          >
                            {blockTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button type="button" className="text-sm text-red-700" onClick={() => removeContentBlock(block.id)} data-testid={`manager-block-remove-${block.id}`}>
                            Remove
                          </button>
                        </div>

                        {(block.type === "paragraph" || block.type === "quote") && (
                          <textarea
                            value={block.text}
                            onChange={(event) => updateBlock(block.id, { text: event.target.value })}
                            className="min-h-[90px] w-full rounded border border-[#C6A75E]/40 px-3 py-2"
                            placeholder={block.type === "quote" ? "Quote text" : "Paragraph text"}
                            data-testid={`manager-block-text-${block.id}`}
                          />
                        )}

                        {minImages > 0 && (
                          <div className="mt-3 space-y-2">
                            {blockImages.map((image, imageIndex) => (
                              <div key={`${block.id}-${imageIndex}`} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
                                <input
                                  value={image}
                                  onChange={(event) => updateBlockImage(block.id, imageIndex, event.target.value)}
                                  className="rounded border border-[#C6A75E]/40 px-3 py-2"
                                  placeholder={`Image ${imageIndex + 1} URL`}
                                  data-testid={`manager-block-image-url-${block.id}-${imageIndex}`}
                                />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => handleBlockImageUpload(block.id, imageIndex, event)}
                                  data-testid={`manager-block-image-upload-${block.id}-${imageIndex}`}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[#C6A75E]/30 p-4" data-testid="manager-status-toggle-section">
                  <div>
                    <p className="text-sm font-medium text-[#3C0518]">Post Status</p>
                    <p className="mt-0.5 text-xs text-[#7b5a53]">
                      {postForm.status === "published" ? "This post is visible on the public blog." : "This post is hidden from the public blog."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updatePostField("status", postForm.status === "published" ? "draft" : "published")}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      postForm.status === "published"
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-amber-500 text-white hover:bg-amber-600"
                    }`}
                    data-testid="manager-status-toggle-button"
                  >
                    {postForm.status === "published" ? "Published" : "Draft"}
                  </button>
                </div>

                <button type="submit" className="gold-outline-button" disabled={loading || uploading} data-testid="manager-save-post-button">
                  {uploading ? "Uploading..." : activePostId ? "Update Blog Post" : "Create Blog Post"}
                </button>
              </form>

              {statusMessage && (
                <p className="mt-4 text-sm text-[#3C0518]" data-testid="manager-status-message">
                  {statusMessage}
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

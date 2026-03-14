"""
Blog CMS API Tests - Tests for blog categories, posts, admin auth, and image upload endpoints
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
ADMIN_PASSCODE = "nb-manage-2026"


@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture
def admin_headers():
    """Headers with admin passcode"""
    return {
        "Content-Type": "application/json",
        "x-admin-passcode": ADMIN_PASSCODE
    }


class TestAdminPasscodeAuth:
    """Test passcode authentication for admin endpoints"""
    
    def test_admin_health_with_valid_passcode(self, api_client):
        """Verify admin health endpoint works with correct passcode"""
        response = api_client.get(
            f"{BASE_URL}/api/blog/admin/health",
            headers={"x-admin-passcode": ADMIN_PASSCODE}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("ok") is True
        print("✓ Admin health check passed with valid passcode")
    
    def test_admin_health_with_invalid_passcode(self, api_client):
        """Verify admin health endpoint rejects wrong passcode"""
        response = api_client.get(
            f"{BASE_URL}/api/blog/admin/health",
            headers={"x-admin-passcode": "wrong-passcode"}
        )
        assert response.status_code == 401
        print("✓ Admin health check rejected invalid passcode")
    
    def test_admin_health_without_passcode(self, api_client):
        """Verify admin health endpoint rejects missing passcode"""
        response = api_client.get(f"{BASE_URL}/api/blog/admin/health")
        assert response.status_code == 401
        print("✓ Admin health check rejected missing passcode")


class TestBlogCategoriesAPI:
    """Test blog categories CRUD operations"""
    
    def test_get_categories(self, api_client):
        """GET /api/blog/categories - list all categories"""
        response = api_client.get(f"{BASE_URL}/api/blog/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Check seed categories exist
        category_names = [cat["name"] for cat in data]
        assert "Weddings" in category_names
        assert "Corporate Events" in category_names
        assert "SFX & Entries" in category_names
        print(f"✓ GET categories returned {len(data)} categories")
    
    def test_create_category_success(self, api_client, admin_headers):
        """POST /api/blog/categories - create new category"""
        unique_name = f"TEST_Category_{uuid.uuid4().hex[:8]}"
        response = api_client.post(
            f"{BASE_URL}/api/blog/categories",
            headers=admin_headers,
            json={"name": unique_name}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == unique_name
        assert "id" in data
        assert "created_at" in data
        
        # Verify persistence with GET
        get_response = api_client.get(f"{BASE_URL}/api/blog/categories")
        category_names = [cat["name"] for cat in get_response.json()]
        assert unique_name in category_names
        print(f"✓ Created category '{unique_name}' and verified persistence")
        
        # Cleanup
        api_client.delete(
            f"{BASE_URL}/api/blog/categories/{data['id']}",
            headers=admin_headers
        )
    
    def test_create_category_without_auth(self, api_client):
        """POST /api/blog/categories - should fail without passcode"""
        response = api_client.post(
            f"{BASE_URL}/api/blog/categories",
            json={"name": "Unauthorized Category"}
        )
        assert response.status_code == 401
        print("✓ Create category rejected without auth")
    
    def test_create_duplicate_category(self, api_client, admin_headers):
        """POST /api/blog/categories - should reject duplicate names"""
        response = api_client.post(
            f"{BASE_URL}/api/blog/categories",
            headers=admin_headers,
            json={"name": "Weddings"}  # Existing category
        )
        assert response.status_code == 400
        print("✓ Create duplicate category rejected")
    
    def test_update_category_success(self, api_client, admin_headers):
        """PUT /api/blog/categories/:id - update category name"""
        # Create test category first
        unique_name = f"TEST_UpdateCat_{uuid.uuid4().hex[:8]}"
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/categories",
            headers=admin_headers,
            json={"name": unique_name}
        )
        assert create_resp.status_code == 200
        cat_id = create_resp.json()["id"]
        
        # Update
        new_name = f"TEST_Updated_{uuid.uuid4().hex[:8]}"
        update_resp = api_client.put(
            f"{BASE_URL}/api/blog/categories/{cat_id}",
            headers=admin_headers,
            json={"name": new_name}
        )
        assert update_resp.status_code == 200
        assert update_resp.json()["name"] == new_name
        
        # Verify persistence
        get_resp = api_client.get(f"{BASE_URL}/api/blog/categories")
        category_names = [cat["name"] for cat in get_resp.json()]
        assert new_name in category_names
        assert unique_name not in category_names
        print(f"✓ Updated category from '{unique_name}' to '{new_name}'")
        
        # Cleanup
        api_client.delete(
            f"{BASE_URL}/api/blog/categories/{cat_id}",
            headers=admin_headers
        )
    
    def test_update_nonexistent_category(self, api_client, admin_headers):
        """PUT /api/blog/categories/:id - should 404 for non-existent"""
        response = api_client.put(
            f"{BASE_URL}/api/blog/categories/nonexistent-id",
            headers=admin_headers,
            json={"name": "New Name"}
        )
        assert response.status_code == 404
        print("✓ Update non-existent category returned 404")
    
    def test_delete_category_success(self, api_client, admin_headers):
        """DELETE /api/blog/categories/:id - delete category"""
        # Create test category
        unique_name = f"TEST_DeleteCat_{uuid.uuid4().hex[:8]}"
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/categories",
            headers=admin_headers,
            json={"name": unique_name}
        )
        cat_id = create_resp.json()["id"]
        
        # Delete
        delete_resp = api_client.delete(
            f"{BASE_URL}/api/blog/categories/{cat_id}",
            headers=admin_headers
        )
        assert delete_resp.status_code == 200
        
        # Verify removal
        get_resp = api_client.get(f"{BASE_URL}/api/blog/categories")
        category_names = [cat["name"] for cat in get_resp.json()]
        assert unique_name not in category_names
        print(f"✓ Deleted category '{unique_name}' and verified removal")


class TestBlogPostsAPI:
    """Test blog posts CRUD operations"""
    
    def test_get_posts(self, api_client):
        """GET /api/blog/posts - list all posts"""
        response = api_client.get(f"{BASE_URL}/api/blog/posts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Check seed post exists
        if len(data) > 0:
            post = data[0]
            assert "title" in post
            assert "slug" in post
            assert "hero_image" in post
            assert "content_blocks" in post
        print(f"✓ GET posts returned {len(data)} posts")
    
    def test_get_posts_by_category(self, api_client):
        """GET /api/blog/posts?category=Weddings - filter by category"""
        response = api_client.get(f"{BASE_URL}/api/blog/posts?category=Weddings")
        assert response.status_code == 200
        data = response.json()
        for post in data:
            assert post["category"] == "Weddings"
        print(f"✓ GET posts by category 'Weddings' returned {len(data)} posts")
    
    def test_get_post_by_slug(self, api_client):
        """GET /api/blog/posts/:slug - get specific post"""
        response = api_client.get(f"{BASE_URL}/api/blog/posts/designing-a-regal-wedding-experience")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Designing a Regal Wedding Experience"
        assert data["slug"] == "designing-a-regal-wedding-experience"
        assert data["category"] == "Weddings"
        assert "content_blocks" in data
        assert "gallery_images" in data
        print("✓ GET post by slug returned correct post")
    
    def test_get_nonexistent_post(self, api_client):
        """GET /api/blog/posts/:slug - should 404 for non-existent"""
        response = api_client.get(f"{BASE_URL}/api/blog/posts/nonexistent-slug-12345")
        assert response.status_code == 404
        print("✓ GET non-existent post returned 404")
    
    def test_create_post_success(self, api_client, admin_headers):
        """POST /api/blog/posts - create new post"""
        unique_title = f"TEST Post {uuid.uuid4().hex[:8]}"
        payload = {
            "title": unique_title,
            "category": "Weddings",
            "author_name": "Test Author",
            "date": "2026-03-15",
            "hero_image": "/assets/test-hero.jpg",
            "excerpt": "Test excerpt for the blog post",
            "article_content": "Test article content",
            "seo_title": f"{unique_title} | SEO",
            "meta_description": "Test meta description",
            "content_blocks": [
                {"id": str(uuid.uuid4()), "type": "paragraph", "text": "Test paragraph", "images": []},
                {"id": str(uuid.uuid4()), "type": "quote", "text": "Test quote", "images": []}
            ],
            "gallery_images": ["/assets/gallery-1.jpg", "/assets/gallery-2.jpg"]
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == unique_title
        assert "id" in data
        assert "slug" in data
        assert data["category"] == "Weddings"
        assert len(data["content_blocks"]) == 2
        
        # Verify persistence with GET
        get_resp = api_client.get(f"{BASE_URL}/api/blog/posts/{data['slug']}")
        assert get_resp.status_code == 200
        assert get_resp.json()["title"] == unique_title
        print(f"✓ Created post '{unique_title}' with slug '{data['slug']}'")
        
        # Cleanup
        api_client.delete(
            f"{BASE_URL}/api/blog/posts/{data['id']}",
            headers=admin_headers
        )
    
    def test_create_post_without_auth(self, api_client):
        """POST /api/blog/posts - should fail without passcode"""
        response = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            json={
                "title": "Unauthorized Post",
                "category": "Weddings",
                "author_name": "Test",
                "date": "2026-03-15",
                "hero_image": "/test.jpg",
                "excerpt": "Test",
                "seo_title": "Test",
                "meta_description": "Test"
            }
        )
        assert response.status_code == 401
        print("✓ Create post rejected without auth")
    
    def test_update_post_success(self, api_client, admin_headers):
        """PUT /api/blog/posts/:id - update post"""
        # Create test post
        unique_title = f"TEST Update Post {uuid.uuid4().hex[:8]}"
        create_payload = {
            "title": unique_title,
            "category": "Weddings",
            "author_name": "Original Author",
            "date": "2026-03-15",
            "hero_image": "/assets/original.jpg",
            "excerpt": "Original excerpt",
            "article_content": "",
            "seo_title": unique_title,
            "meta_description": "Original meta",
            "content_blocks": [],
            "gallery_images": []
        }
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=create_payload
        )
        post_id = create_resp.json()["id"]
        
        # Update
        updated_title = f"TEST Updated Post {uuid.uuid4().hex[:8]}"
        update_payload = {
            **create_payload,
            "title": updated_title,
            "author_name": "Updated Author",
            "content_blocks": [
                {"id": str(uuid.uuid4()), "type": "paragraph", "text": "New content", "images": []}
            ]
        }
        update_resp = api_client.put(
            f"{BASE_URL}/api/blog/posts/{post_id}",
            headers=admin_headers,
            json=update_payload
        )
        assert update_resp.status_code == 200
        data = update_resp.json()
        assert data["title"] == updated_title
        assert data["author_name"] == "Updated Author"
        assert len(data["content_blocks"]) == 1
        
        # Verify persistence
        get_resp = api_client.get(f"{BASE_URL}/api/blog/posts/{data['slug']}")
        assert get_resp.json()["title"] == updated_title
        print(f"✓ Updated post to '{updated_title}'")
        
        # Cleanup
        api_client.delete(
            f"{BASE_URL}/api/blog/posts/{post_id}",
            headers=admin_headers
        )
    
    def test_delete_post_success(self, api_client, admin_headers):
        """DELETE /api/blog/posts/:id - delete post"""
        # Create test post
        unique_title = f"TEST Delete Post {uuid.uuid4().hex[:8]}"
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json={
                "title": unique_title,
                "category": "Weddings",
                "author_name": "Test",
                "date": "2026-03-15",
                "hero_image": "/test.jpg",
                "excerpt": "Test",
                "article_content": "",
                "seo_title": "Test",
                "meta_description": "Test",
                "content_blocks": [],
                "gallery_images": []
            }
        )
        post_id = create_resp.json()["id"]
        post_slug = create_resp.json()["slug"]
        
        # Delete
        delete_resp = api_client.delete(
            f"{BASE_URL}/api/blog/posts/{post_id}",
            headers=admin_headers
        )
        assert delete_resp.status_code == 200
        
        # Verify removal
        get_resp = api_client.get(f"{BASE_URL}/api/blog/posts/{post_slug}")
        assert get_resp.status_code == 404
        print(f"✓ Deleted post and verified removal")
    
    def test_auto_slug_generation(self, api_client, admin_headers):
        """Test that slug is auto-generated from title"""
        title = "TEST Auto Slug Post!"
        response = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json={
                "title": title,
                "category": "Weddings",
                "author_name": "Test",
                "date": "2026-03-15",
                "hero_image": "/test.jpg",
                "excerpt": "Test",
                "article_content": "",
                "seo_title": "Test",
                "meta_description": "Test",
                "content_blocks": [],
                "gallery_images": []
            }
        )
        assert response.status_code == 200
        slug = response.json()["slug"]
        # Slug should be lowercase, no special chars
        assert "test-auto-slug-post" in slug.lower()
        print(f"✓ Auto-generated slug: '{slug}'")
        
        # Cleanup
        api_client.delete(
            f"{BASE_URL}/api/blog/posts/{response.json()['id']}",
            headers=admin_headers
        )


class TestImageUploadAPI:
    """Test image upload endpoint"""
    
    def test_upload_without_auth(self, api_client):
        """POST /api/upload - should fail without passcode"""
        # Create a simple test file
        files = {"file": ("test.jpg", b"fake image data", "image/jpeg")}
        response = requests.post(
            f"{BASE_URL}/api/upload",
            files=files
        )
        assert response.status_code == 401
        print("✓ Upload rejected without auth")
    
    def test_upload_invalid_extension(self):
        """POST /api/upload - should reject non-image files"""
        files = {"file": ("test.txt", b"text content", "text/plain")}
        response = requests.post(
            f"{BASE_URL}/api/upload",
            files=files,
            headers={"x-admin-passcode": ADMIN_PASSCODE}
        )
        assert response.status_code == 400
        print("✓ Upload rejected invalid file extension")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

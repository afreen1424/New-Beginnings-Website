"""
Publish/Draft Feature Tests - Tests for blog post status (draft/published) functionality

Tests cover:
1. New post defaults to 'draft' status
2. Draft posts hidden from public endpoints
3. Draft posts visible in admin view with include_drafts=true
4. Published posts visible on both public and admin views
5. Status toggle preserves correctly during updates
6. Public /blog/:slug returns 404 for draft posts
7. Backfill migration for legacy posts without status field
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


def create_test_post_payload(title=None, status="draft"):
    """Generate a test post payload with given status"""
    unique_title = title or f"TEST Draft Post {uuid.uuid4().hex[:8]}"
    return {
        "title": unique_title,
        "category": "Weddings",
        "author_name": "Test Author",
        "date": "2026-03-15",
        "hero_image": "/assets/test-hero.jpg",
        "excerpt": "Test excerpt for draft/publish testing",
        "article_content": "Test article content",
        "seo_title": f"{unique_title} | SEO",
        "meta_description": "Test meta description",
        "content_blocks": [
            {"id": str(uuid.uuid4()), "type": "paragraph", "text": "Test paragraph", "images": []}
        ],
        "gallery_images": [],
        "status": status
    }


class TestNewPostDefaultsToDraft:
    """Test 1: New post defaults to 'draft' status"""
    
    def test_create_post_without_status_defaults_to_draft(self, api_client, admin_headers):
        """Create a post without explicitly setting status - should default to draft"""
        unique_title = f"TEST Default Draft {uuid.uuid4().hex[:8]}"
        payload = {
            "title": unique_title,
            "category": "Weddings",
            "author_name": "Test Author",
            "date": "2026-03-15",
            "hero_image": "/assets/test-hero.jpg",
            "excerpt": "Test excerpt",
            "article_content": "",
            "seo_title": unique_title,
            "meta_description": "Test meta"
            # NOTE: status NOT provided - should default to 'draft'
        }
        
        response = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "draft", f"Expected 'draft' but got '{data.get('status')}'"
        assert data["title"] == unique_title
        print(f"✓ Post created without status defaults to 'draft': {unique_title}")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{data['id']}", headers=admin_headers)
    
    def test_create_post_with_explicit_draft_status(self, api_client, admin_headers):
        """Create a post with explicit status='draft'"""
        payload = create_test_post_payload(status="draft")
        
        response = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "draft"
        print(f"✓ Post created with explicit 'draft' status: {data['title']}")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{data['id']}", headers=admin_headers)


class TestDraftPostsHiddenFromPublic:
    """Test 2 & 9: Draft posts do NOT appear on public /blog page or /blog/:slug"""
    
    def test_draft_post_not_in_public_posts_list(self, api_client, admin_headers):
        """GET /api/blog/posts - draft posts should be hidden"""
        # Create a draft post
        payload = create_test_post_payload(status="draft")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        post_slug = post_data["slug"]
        
        # Fetch public posts list (no auth, no include_drafts)
        public_resp = api_client.get(f"{BASE_URL}/api/blog/posts")
        assert public_resp.status_code == 200
        public_posts = public_resp.json()
        
        # Draft post should NOT be in public list
        post_ids = [p["id"] for p in public_posts]
        assert post_id not in post_ids, f"Draft post {post_id} should not appear in public posts list"
        print(f"✓ Draft post '{payload['title']}' not visible in public GET /api/blog/posts")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)
    
    def test_draft_post_returns_404_on_public_slug_endpoint(self, api_client, admin_headers):
        """GET /api/blog/posts/:slug - should return 404 for draft posts"""
        # Create a draft post
        payload = create_test_post_payload(status="draft")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        post_slug = post_data["slug"]
        
        # Try to fetch draft post by slug (public endpoint)
        slug_resp = api_client.get(f"{BASE_URL}/api/blog/posts/{post_slug}")
        assert slug_resp.status_code == 404, f"Expected 404 for draft post slug, got {slug_resp.status_code}"
        print(f"✓ Draft post at /api/blog/posts/{post_slug} returns 404")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)


class TestDraftPostsVisibleInAdmin:
    """Test 3 & 11: Draft posts visible in admin view with include_drafts=true and passcode"""
    
    def test_admin_can_see_drafts_with_include_drafts_flag(self, api_client, admin_headers):
        """GET /api/blog/posts?include_drafts=true with passcode returns all posts including drafts"""
        # Create a draft post
        payload = create_test_post_payload(status="draft")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        
        # Fetch with include_drafts=true and admin passcode
        admin_resp = api_client.get(
            f"{BASE_URL}/api/blog/posts?include_drafts=true",
            headers={"x-admin-passcode": ADMIN_PASSCODE}
        )
        assert admin_resp.status_code == 200
        admin_posts = admin_resp.json()
        
        # Draft post SHOULD be in admin list
        post_ids = [p["id"] for p in admin_posts]
        assert post_id in post_ids, f"Draft post {post_id} should appear in admin posts list"
        print(f"✓ Draft post visible in admin GET /api/blog/posts?include_drafts=true")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)
    
    def test_include_drafts_without_passcode_still_hides_drafts(self, api_client, admin_headers):
        """GET /api/blog/posts?include_drafts=true WITHOUT passcode should still hide drafts"""
        # Create a draft post
        payload = create_test_post_payload(status="draft")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        
        # Fetch with include_drafts=true but NO passcode
        public_resp = api_client.get(f"{BASE_URL}/api/blog/posts?include_drafts=true")
        assert public_resp.status_code == 200
        public_posts = public_resp.json()
        
        # Draft post should NOT be visible (passcode required)
        post_ids = [p["id"] for p in public_posts]
        assert post_id not in post_ids, "Draft should not be visible without valid passcode"
        print(f"✓ include_drafts=true without passcode still hides draft posts")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)


class TestPublishedPostsVisibleEverywhere:
    """Test 4 & 10: Published posts appear on both public and admin views"""
    
    def test_published_post_visible_in_public_list(self, api_client, admin_headers):
        """GET /api/blog/posts - published posts should be visible"""
        # Create a published post
        payload = create_test_post_payload(status="published")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        post_slug = post_data["slug"]
        
        # Fetch public posts list
        public_resp = api_client.get(f"{BASE_URL}/api/blog/posts")
        assert public_resp.status_code == 200
        public_posts = public_resp.json()
        
        # Published post SHOULD be in public list
        post_ids = [p["id"] for p in public_posts]
        assert post_id in post_ids, "Published post should appear in public posts list"
        print(f"✓ Published post visible in public GET /api/blog/posts")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)
    
    def test_published_post_accessible_by_slug(self, api_client, admin_headers):
        """GET /api/blog/posts/:slug - published posts should be accessible"""
        # Create a published post
        payload = create_test_post_payload(status="published")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        post_slug = post_data["slug"]
        
        # Fetch by slug
        slug_resp = api_client.get(f"{BASE_URL}/api/blog/posts/{post_slug}")
        assert slug_resp.status_code == 200
        assert slug_resp.json()["id"] == post_id
        print(f"✓ Published post accessible at /api/blog/posts/{post_slug}")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)
    
    def test_published_post_visible_in_admin_view(self, api_client, admin_headers):
        """GET /api/blog/posts?include_drafts=true - published posts should also be visible"""
        # Create a published post
        payload = create_test_post_payload(status="published")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        
        # Fetch admin view
        admin_resp = api_client.get(
            f"{BASE_URL}/api/blog/posts?include_drafts=true",
            headers={"x-admin-passcode": ADMIN_PASSCODE}
        )
        assert admin_resp.status_code == 200
        admin_posts = admin_resp.json()
        
        post_ids = [p["id"] for p in admin_posts]
        assert post_id in post_ids, "Published post should appear in admin view"
        print(f"✓ Published post visible in admin GET /api/blog/posts?include_drafts=true")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)


class TestStatusUpdateAndToggle:
    """Test 7 & 8: Editing a post preserves status, changing status works correctly"""
    
    def test_update_preserves_draft_status(self, api_client, admin_headers):
        """PUT /api/blog/posts/:id - updating other fields preserves draft status"""
        # Create a draft post
        payload = create_test_post_payload(status="draft")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        
        # Update title but keep status as draft
        payload["title"] = f"TEST Updated Title {uuid.uuid4().hex[:8]}"
        payload["status"] = "draft"  # Keep as draft
        
        update_resp = api_client.put(
            f"{BASE_URL}/api/blog/posts/{post_id}",
            headers=admin_headers,
            json=payload
        )
        assert update_resp.status_code == 200
        updated_data = update_resp.json()
        assert updated_data["status"] == "draft", "Status should remain 'draft'"
        print(f"✓ Updated post preserves 'draft' status")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)
    
    def test_change_status_from_draft_to_published(self, api_client, admin_headers):
        """PUT /api/blog/posts/:id - changing from draft to published makes post public"""
        # Create a draft post
        payload = create_test_post_payload(status="draft")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        post_slug = post_data["slug"]
        
        # Verify it's NOT visible publicly
        public_resp = api_client.get(f"{BASE_URL}/api/blog/posts")
        post_ids = [p["id"] for p in public_resp.json()]
        assert post_id not in post_ids, "Draft post should not be visible publicly"
        
        # Change status to published
        payload["status"] = "published"
        update_resp = api_client.put(
            f"{BASE_URL}/api/blog/posts/{post_id}",
            headers=admin_headers,
            json=payload
        )
        assert update_resp.status_code == 200
        assert update_resp.json()["status"] == "published"
        
        # Verify it IS now visible publicly
        public_resp2 = api_client.get(f"{BASE_URL}/api/blog/posts")
        post_ids2 = [p["id"] for p in public_resp2.json()]
        assert post_id in post_ids2, "Published post should now be visible publicly"
        
        # Verify accessible by slug
        slug_resp = api_client.get(f"{BASE_URL}/api/blog/posts/{post_slug}")
        assert slug_resp.status_code == 200
        print(f"✓ Changed status from draft to published - post now visible publicly")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)
    
    def test_change_status_from_published_to_draft(self, api_client, admin_headers):
        """PUT /api/blog/posts/:id - changing from published to draft hides post"""
        # Create a published post
        payload = create_test_post_payload(status="published")
        create_resp = api_client.post(
            f"{BASE_URL}/api/blog/posts",
            headers=admin_headers,
            json=payload
        )
        assert create_resp.status_code == 200
        post_data = create_resp.json()
        post_id = post_data["id"]
        post_slug = post_data["slug"]
        
        # Verify it IS visible publicly
        public_resp = api_client.get(f"{BASE_URL}/api/blog/posts")
        post_ids = [p["id"] for p in public_resp.json()]
        assert post_id in post_ids, "Published post should be visible publicly"
        
        # Change status to draft
        payload["status"] = "draft"
        update_resp = api_client.put(
            f"{BASE_URL}/api/blog/posts/{post_id}",
            headers=admin_headers,
            json=payload
        )
        assert update_resp.status_code == 200
        assert update_resp.json()["status"] == "draft"
        
        # Verify it is NOW hidden publicly
        public_resp2 = api_client.get(f"{BASE_URL}/api/blog/posts")
        post_ids2 = [p["id"] for p in public_resp2.json()]
        assert post_id not in post_ids2, "Draft post should now be hidden publicly"
        
        # Verify slug returns 404
        slug_resp = api_client.get(f"{BASE_URL}/api/blog/posts/{post_slug}")
        assert slug_resp.status_code == 404
        print(f"✓ Changed status from published to draft - post now hidden")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/posts/{post_id}", headers=admin_headers)


class TestSeedDataBackfill:
    """Test 12: Verify existing seed post was backfilled to 'published'"""
    
    def test_seed_post_has_published_status(self, api_client):
        """Verify the seed post 'Designing a Regal Wedding Experience' is published"""
        response = api_client.get(f"{BASE_URL}/api/blog/posts/designing-a-regal-wedding-experience")
        assert response.status_code == 200, "Seed post should be accessible (published)"
        data = response.json()
        assert data["status"] == "published", f"Seed post should be 'published', got '{data.get('status')}'"
        assert data["title"] == "Designing a Regal Wedding Experience"
        print(f"✓ Seed post 'Designing a Regal Wedding Experience' is published")
    
    def test_seed_post_visible_in_public_list(self, api_client):
        """Verify the seed post appears in public posts list"""
        response = api_client.get(f"{BASE_URL}/api/blog/posts")
        assert response.status_code == 200
        posts = response.json()
        
        seed_post = next((p for p in posts if p["slug"] == "designing-a-regal-wedding-experience"), None)
        assert seed_post is not None, "Seed post should appear in public posts list"
        assert seed_post["status"] == "published"
        print(f"✓ Seed post visible in public posts list with status 'published'")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

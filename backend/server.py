from fastapi import FastAPI, APIRouter, HTTPException, Header, Query, UploadFile, File
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone
import re
import shutil


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

BLOG_ADMIN_PASSCODE = os.environ.get("BLOG_ADMIN_PASSCODE", "nb-manage-2026")


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def now_iso() -> str:
    return now_utc().isoformat()


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "blog-post"


def ensure_admin_passcode(x_admin_passcode: str) -> None:
    if x_admin_passcode != BLOG_ADMIN_PASSCODE:
        raise HTTPException(status_code=401, detail="Invalid admin passcode")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class EnquiryCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    event_date: Optional[str] = None
    event_location: str
    estimated_guest_count: str
    event_type: str
    referral_source: str
    vision: str


class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    event_date: Optional[str] = None
    event_location: str
    estimated_guest_count: str
    event_type: str
    referral_source: str
    vision: str
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BlogCategoryCreate(BaseModel):
    name: str


class BlogCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    created_at: datetime = Field(default_factory=now_utc)


class BlogContentBlock(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: Literal["paragraph", "full_image", "two_image_grid", "three_image_grid", "quote"]
    text: Optional[str] = None
    images: List[str] = Field(default_factory=list)


class BlogPostCreate(BaseModel):
    title: str
    category: str
    author_name: str
    date: str
    hero_image: str
    excerpt: str
    article_content: str = ""
    seo_title: str
    meta_description: str
    content_blocks: List[BlogContentBlock] = Field(default_factory=list)
    gallery_images: List[str] = Field(default_factory=list)
    status: Literal["draft", "published"] = "draft"


class BlogPost(BlogPostCreate):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


def parse_blog_category(category_doc: dict) -> dict:
    if isinstance(category_doc.get("created_at"), str):
        category_doc["created_at"] = datetime.fromisoformat(category_doc["created_at"])
    return category_doc


def parse_blog_post(post_doc: dict) -> dict:
    if isinstance(post_doc.get("created_at"), str):
        post_doc["created_at"] = datetime.fromisoformat(post_doc["created_at"])
    if isinstance(post_doc.get("updated_at"), str):
        post_doc["updated_at"] = datetime.fromisoformat(post_doc["updated_at"])
    return post_doc


async def generate_unique_slug(title: str, current_post_id: Optional[str] = None) -> str:
    base_slug = slugify(title)
    slug = base_slug
    idx = 2

    while True:
        existing = await db.blog_posts.find_one({"slug": slug}, {"_id": 0, "id": 1})
        if not existing or (current_post_id and existing.get("id") == current_post_id):
            return slug
        slug = f"{base_slug}-{idx}"
        idx += 1


async def ensure_blog_seed_data() -> None:
    # Backfill: set status=published on any posts missing the field
    await db.blog_posts.update_many({"status": {"$exists": False}}, {"$set": {"status": "published"}})

    category_count = await db.blog_categories.count_documents({})
    if category_count == 0:
        seed_categories = [
            {"id": str(uuid.uuid4()), "name": "Weddings", "created_at": now_iso()},
            {"id": str(uuid.uuid4()), "name": "Corporate Events", "created_at": now_iso()},
            {"id": str(uuid.uuid4()), "name": "SFX & Entries", "created_at": now_iso()},
        ]
        await db.blog_categories.insert_many(seed_categories)

    post_count = await db.blog_posts.count_documents({})
    if post_count == 0:
        post_id = str(uuid.uuid4())
        created_at = now_iso()
        seed_post = {
            "id": post_id,
            "slug": "designing-a-regal-wedding-experience",
            "title": "Designing a Regal Wedding Experience",
            "category": "Weddings",
            "author_name": "New Beginnings Team",
            "date": "2026-03-01",
            "hero_image": "/assets/blog-1.webp",
            "excerpt": "How structure, lighting, and emotional pacing shape unforgettable wedding journeys.",
            "article_content": "",
            "seo_title": "Designing a Regal Wedding Experience | New Beginnings Events",
            "meta_description": "A behind-the-scenes look at crafting a luxury wedding atmosphere with precision and elegance.",
            "content_blocks": [
                {
                    "id": str(uuid.uuid4()),
                    "type": "paragraph",
                    "text": "To design a wedding atmosphere that feels grand yet intimate, where every scene reflects the couple's personality.",
                    "images": [],
                },
                {
                    "id": str(uuid.uuid4()),
                    "type": "full_image",
                    "text": "",
                    "images": ["/assets/wedding-3.webp"],
                },
                {
                    "id": str(uuid.uuid4()),
                    "type": "quote",
                    "text": "Luxury is not excess. It is precision, atmosphere, and memory designed beautifully.",
                    "images": [],
                },
            ],
            "gallery_images": ["/assets/blog-1.webp", "/assets/wedding-3.webp", "/assets/wedding-5.webp"],
            "status": "published",
            "created_at": created_at,
            "updated_at": created_at,
        }
        await db.blog_posts.insert_one(seed_post)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(input: EnquiryCreate):
    enquiry = Enquiry(**input.model_dump())
    enquiry_doc = enquiry.model_dump()
    enquiry_doc["submitted_at"] = enquiry_doc["submitted_at"].isoformat()

    result = await db.enquiries.insert_one(enquiry_doc)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to submit enquiry")

    return enquiry


@api_router.get("/enquiries", response_model=List[Enquiry])
async def get_enquiries():
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(1000)
    for enquiry in enquiries:
        if isinstance(enquiry["submitted_at"], str):
            enquiry["submitted_at"] = datetime.fromisoformat(enquiry["submitted_at"])

    return enquiries


@api_router.get("/blog/admin/health")
async def blog_admin_health(x_admin_passcode: str = Header(default="")):
    ensure_admin_passcode(x_admin_passcode)
    return {"ok": True}


@api_router.get("/blog/categories", response_model=List[BlogCategory])
async def get_blog_categories():
    await ensure_blog_seed_data()
    categories = await db.blog_categories.find({}, {"_id": 0}).sort("name", 1).to_list(200)
    return [parse_blog_category(category) for category in categories]


@api_router.post("/blog/categories", response_model=BlogCategory)
async def create_blog_category(input: BlogCategoryCreate, x_admin_passcode: str = Header(default="")):
    ensure_admin_passcode(x_admin_passcode)
    name = input.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Category name is required")

    existing = await db.blog_categories.find_one({"name": {"$regex": f"^{re.escape(name)}$", "$options": "i"}}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")

    category = BlogCategory(name=name)
    doc = category.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.blog_categories.insert_one(doc)
    return category


@api_router.put("/blog/categories/{category_id}", response_model=BlogCategory)
async def update_blog_category(category_id: str, input: BlogCategoryCreate, x_admin_passcode: str = Header(default="")):
    ensure_admin_passcode(x_admin_passcode)
    name = input.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Category name is required")

    category = await db.blog_categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    await db.blog_categories.update_one({"id": category_id}, {"$set": {"name": name}})
    await db.blog_posts.update_many({"category": category["name"]}, {"$set": {"category": name}})
    updated = await db.blog_categories.find_one({"id": category_id}, {"_id": 0})
    return parse_blog_category(updated)


@api_router.delete("/blog/categories/{category_id}")
async def delete_blog_category(category_id: str, x_admin_passcode: str = Header(default="")):
    ensure_admin_passcode(x_admin_passcode)
    category = await db.blog_categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    await db.blog_categories.delete_one({"id": category_id})
    await db.blog_posts.update_many({"category": category["name"]}, {"$set": {"category": "Uncategorized"}})
    return {"success": True}


@api_router.get("/blog/posts", response_model=List[BlogPost])
async def get_blog_posts(category: Optional[str] = Query(default=None), include_drafts: bool = Query(default=False), x_admin_passcode: str = Header(default="")):
    await ensure_blog_seed_data()

    # Only allow drafts when admin passcode is provided
    show_drafts = include_drafts and x_admin_passcode == BLOG_ADMIN_PASSCODE

    query = {}
    if not show_drafts:
        query["status"] = "published"
    if category and category.lower() != "all":
        query["category"] = category

    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [parse_blog_post(post) for post in posts]


@api_router.get("/blog/posts/{slug}", response_model=BlogPost)
async def get_blog_post_by_slug(slug: str):
    await ensure_blog_seed_data()
    post = await db.blog_posts.find_one({"slug": slug, "status": "published"}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return parse_blog_post(post)


@api_router.post("/blog/posts", response_model=BlogPost)
async def create_blog_post(input: BlogPostCreate, x_admin_passcode: str = Header(default="")):
    ensure_admin_passcode(x_admin_passcode)
    await ensure_blog_seed_data()
    slug = await generate_unique_slug(input.title)

    post = BlogPost(
        **input.model_dump(),
        slug=slug,
    )
    post_doc = post.model_dump()
    post_doc["created_at"] = post_doc["created_at"].isoformat()
    post_doc["updated_at"] = post_doc["updated_at"].isoformat()
    await db.blog_posts.insert_one(post_doc)
    return post


@api_router.put("/blog/posts/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, input: BlogPostCreate, x_admin_passcode: str = Header(default="")):
    ensure_admin_passcode(x_admin_passcode)
    existing = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog post not found")

    slug = await generate_unique_slug(input.title, current_post_id=post_id)
    updated_post = {
        **input.model_dump(),
        "slug": slug,
        "updated_at": now_iso(),
    }
    await db.blog_posts.update_one({"id": post_id}, {"$set": updated_post})
    saved = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    return parse_blog_post(saved)


@api_router.delete("/blog/posts/{post_id}")
async def delete_blog_post(post_id: str, x_admin_passcode: str = Header(default="")):
    ensure_admin_passcode(x_admin_passcode)
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"success": True}


UPLOAD_DIR = Path("/app/frontend/public/assets/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), x_admin_passcode: str = Header(default="")):
    ensure_admin_passcode(x_admin_passcode)

    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")

    unique_name = f"{uuid.uuid4().hex[:12]}{ext}"
    dest = UPLOAD_DIR / unique_name

    with open(dest, "wb") as f:
        f.write(contents)

    return {"url": f"/assets/uploads/{unique_name}"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
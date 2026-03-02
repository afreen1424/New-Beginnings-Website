import os
import uuid
import pytest
import requests
from dotenv import load_dotenv

# Load frontend public URL for API verification against ingress/public endpoint
load_dotenv("/app/frontend/.env")
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")


@pytest.fixture(scope="session")
def api_base_url():
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL not configured")
    return BASE_URL.rstrip("/") + "/api"


@pytest.fixture(scope="session")
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


# Module: Core API health route

def test_api_root(api_client, api_base_url):
    response = api_client.get(f"{api_base_url}/")
    assert response.status_code == 200
    data = response.json()
    assert data.get("message") == "Hello World"


# Module: Enquiry creation and readback persistence flow

def test_create_enquiry_and_verify_persistence(api_client, api_base_url):
    marker = str(uuid.uuid4())[:8]
    payload = {
        "full_name": f"TEST_User_{marker}",
        "email": f"test_{marker}@example.com",
        "phone": "8122913183",
        "event_date": "2026-12-24",
        "event_location": "Chennai",
        "estimated_guest_count": "350",
        "event_type": "Wedding",
        "referral_source": "Instagram",
        "vision": "TEST_Classic regal maroon and gold celebration",
    }

    create_response = api_client.post(f"{api_base_url}/enquiries", json=payload)
    assert create_response.status_code == 200

    created = create_response.json()
    assert created["full_name"] == payload["full_name"]
    assert created["email"] == payload["email"]
    assert created["event_location"] == payload["event_location"]
    assert isinstance(created.get("id"), str)
    assert isinstance(created.get("submitted_at"), str)

    list_response = api_client.get(f"{api_base_url}/enquiries")
    assert list_response.status_code == 200

    enquiries = list_response.json()
    assert isinstance(enquiries, list)

    matched = next((e for e in enquiries if e.get("email") == payload["email"]), None)
    assert matched is not None
    assert matched["full_name"] == payload["full_name"]
    assert matched["vision"] == payload["vision"]


# Module: Enquiry validation

def test_create_enquiry_invalid_email_returns_validation_error(api_client, api_base_url):
    payload = {
        "full_name": "TEST_Invalid_Email_User",
        "email": "not-an-email",
        "phone": "8122913183",
        "event_date": "2026-12-24",
        "event_location": "Chennai",
        "estimated_guest_count": "120",
        "event_type": "Corporate Event",
        "referral_source": "Google Search",
        "vision": "TEST_Validation check",
    }

    response = api_client.post(f"{api_base_url}/enquiries", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
    assert isinstance(data["detail"], list)

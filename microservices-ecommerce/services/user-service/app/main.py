from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = FastAPI(
    title="User Service",
    version="1.0.0"
)


STORAGE_SERVICE_URL = os.getenv(
    "STORAGE_SERVICE_URL",
    "http://localhost:8004"
)


class CreateUserRequest(BaseModel):
    name: str
    email: str


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "user-service"
    }


@app.get("/api/users")
def get_users():
    try:
        response = requests.get(
            f"{STORAGE_SERVICE_URL}/api/storage/users",
            timeout=5
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException as error:
        raise HTTPException(
            status_code=503,
            detail=f"Storage service unavailable: {error}"
        )


@app.get("/api/users/{user_id}")
def get_user(user_id: int):
    try:
        response = requests.get(
            f"{STORAGE_SERVICE_URL}/api/storage/users/{user_id}",
            timeout=5
        )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        response.raise_for_status()

        return response.json()

    except requests.RequestException as error:
        raise HTTPException(
            status_code=503,
            detail=f"Storage service unavailable: {error}"
        )


@app.post("/api/users", status_code=201)
def create_user(request: CreateUserRequest):
    try:
        response = requests.post(
            f"{STORAGE_SERVICE_URL}/api/storage/users",
            json=request.model_dump(),
            timeout=5
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException as error:
        raise HTTPException(
            status_code=503,
            detail=f"Storage service unavailable: {error}"
        )
from pydantic_settings import BaseSettings
from typing import List, Optional
import os
import secrets
import logging

logger = logging.getLogger(__name__)

def _generate_secret_key() -> str:
    """Generate a secure secret key if not provided via environment."""
    env_key = os.getenv("SECRET_KEY")
    if not env_key or env_key == "your-secret-key-change-in-production":
        # Auto-generate a secure key for this session
        # NOTE: This means JWT tokens will be invalidated on restart.
        # Set the SECRET_KEY environment variable in HuggingFace Spaces settings
        # to persist tokens across restarts.
        generated = secrets.token_hex(32)
        logger.warning(
            "⚠️  SECRET_KEY not set in environment. A temporary key has been generated. "
            "JWT tokens will be invalidated on app restart. "
            "Please set SECRET_KEY in your Hugging Face Space secrets."
        )
        return generated
    return env_key


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "ML Forecast SaaS"
    DEBUG: bool = False
    VERSION: str = "3.0.0"
    ENVIRONMENT: str = "production"  # Default to production for Docker/HF
    
    # Database (SQLite, stored in /data/ for persistence on HF)
    DATABASE_URL: str = "sqlite:////data/forecast.db"
    
    # Supabase Configuration
    SUPABASE_URL: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None  # Server-side key (not anon)
    
    # Security - MUST be set via environment variable in production
    # Falls back to auto-generated key (tokens reset on restart)
    SECRET_KEY: str = "placeholder"  # Will be overridden in __init__
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # Extended to 1hr for better UX
    
    # OAuth Settings
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    MICROSOFT_CLIENT_ID: Optional[str] = None
    MICROSOFT_CLIENT_SECRET: Optional[str] = None
    
    # Frontend URL for Redirects
    FRONTEND_URL: str = "https://ibadatali-walmart-sales-forecasting-saas.hf.space"
    
    # CORS - Allow Vercel frontend and local development
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://*.vercel.app",
        "https://ibadatali-walmart-sales-forecasting-saas.hf.space",
        "https://*.hf.space",
    ]
    
    # ML Models
    MODEL_DIR: str = "./app/ml/models"
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./models")
    
    # Render-specific settings
    PORT: int = int(os.getenv("PORT", "7860"))
    
    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra env vars

settings = Settings()

# Override SECRET_KEY with secure value AFTER settings are loaded
settings.SECRET_KEY = _generate_secret_key()

# Parse ALLOWED_ORIGINS from environment if set as comma-separated string
if os.getenv("ALLOWED_ORIGINS"):
    settings.ALLOWED_ORIGINS = [
        origin.strip() 
        for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
        if origin.strip()
    ]

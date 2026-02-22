from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.services.oauth_service import oauth, get_oauth_user_info
from app.services.auth_service import create_access_token, get_or_create_oauth_user
from app.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

SUPPORTED_PROVIDERS = ['google', 'microsoft']


def _build_redirect_uri(request: Request, provider: str) -> str:
    """
    Build the OAuth callback URL, always using HTTPS on Hugging Face Spaces.
    Hugging Face terminates TLS at the proxy level, so the internal request
    arrives with http:// scheme. We force https:// here to match what is
    registered in Google / Azure consoles.
    """
    uri = str(request.url_for('auth_callback', provider=provider))
    # Force https for non-localhost environments
    if not uri.startswith('http://localhost') and not uri.startswith('https://'):
        uri = uri.replace('http://', 'https://', 1)
    return uri


@router.get("/login/{provider}")
async def login_oauth(provider: str, request: Request):
    """Redirect user to the OAuth provider's consent screen."""
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=404, detail=f"Provider '{provider}' not supported. Use: {SUPPORTED_PROVIDERS}")

    if provider == 'google' and not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google OAuth is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to Hugging Face Secrets.")

    if provider == 'microsoft' and not settings.MICROSOFT_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Microsoft OAuth is not configured. Add MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET to Hugging Face Secrets.")

    redirect_uri = _build_redirect_uri(request, provider)
    logger.info(f"Initiating {provider} OAuth redirect to: {redirect_uri}")

    client = getattr(oauth, provider)
    return await client.authorize_redirect(request, redirect_uri)


@router.get("/callback/{provider}", name="auth_callback")
async def auth_callback(provider: str, request: Request, db: Session = Depends(get_db)):
    """Handle the OAuth provider callback, issue a JWT, redirect to frontend."""
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=404, detail="Provider not supported")

    client = getattr(oauth, provider)

    try:
        token = await client.authorize_access_token(request)
        user_info = await get_oauth_user_info(provider, request, token)
        logger.info(f"OAuth success for {provider}: {user_info.get('email')}")

        # Create / update user in DB
        user = get_or_create_oauth_user(db, user_info)

        # Issue JWT
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        # Redirect to frontend callback handler with token in query string
        frontend_url = settings.FRONTEND_URL or "http://localhost:5173"
        redirect_to = f"{frontend_url}/auth/callback?token={access_token}&provider={provider}"
        return RedirectResponse(url=redirect_to)

    except Exception as e:
        logger.error(f"OAuth callback failed for {provider}: {e}", exc_info=True)
        frontend_url = settings.FRONTEND_URL or "http://localhost:5173"
        return RedirectResponse(url=f"{frontend_url}/login?error=oauth_failed&provider={provider}")

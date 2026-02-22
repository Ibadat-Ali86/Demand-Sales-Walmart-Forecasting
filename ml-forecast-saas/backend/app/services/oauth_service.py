from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from fastapi import HTTPException
from app.config import settings

# Initialize OAuth
config_data = {
    'GOOGLE_CLIENT_ID': settings.GOOGLE_CLIENT_ID or '',
    'GOOGLE_CLIENT_SECRET': settings.GOOGLE_CLIENT_SECRET or '',
    'GITHUB_CLIENT_ID': settings.GITHUB_CLIENT_ID or '',
    'GITHUB_CLIENT_SECRET': settings.GITHUB_CLIENT_SECRET or '',
    'MICROSOFT_CLIENT_ID': settings.MICROSOFT_CLIENT_ID or '',
    'MICROSOFT_CLIENT_SECRET': settings.MICROSOFT_CLIENT_SECRET or '',
}

starlette_config = Config(environ=config_data)
oauth = OAuth(starlette_config)

# ── Google ────────────────────────────────────────────────────────────────────
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

# ── GitHub ────────────────────────────────────────────────────────────────────
oauth.register(
    name='github',
    api_base_url='https://api.github.com/',
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    client_kwargs={'scope': 'user:email'},
    userinfo_endpoint='https://api.github.com/user',
)

# ── Microsoft (Azure AD v2 — personal + work/school accounts) ─────────────────
# Uses the /common/ tenant so both personal (Live/Outlook) and corporate accounts work.
oauth.register(
    name='microsoft',
    server_metadata_url='https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile User.Read',
        'token_endpoint_auth_method': 'client_secret_post',
    },
)


async def get_oauth_user_info(provider: str, request: Request, token: dict) -> dict:
    """Extract a standardised user-info dict from different OAuth providers."""

    if provider == 'google':
        user_data = token.get('userinfo')
        if not user_data:
            resp = await oauth.google.get(
                'https://www.googleapis.com/oauth2/v3/userinfo', token=token
            )
            user_data = resp.json()
        return {
            'email': user_data.get('email'),
            'name': user_data.get('name'),
            'picture': user_data.get('picture'),
            'provider': 'google',
            'provider_id': user_data.get('sub'),
        }

    elif provider == 'github':
        resp = await oauth.github.get('user', token=token)
        profile = resp.json()
        email = profile.get('email')
        if not email:
            resp_emails = await oauth.github.get('user/emails', token=token)
            for e in resp_emails.json():
                if e.get('primary') and e.get('verified'):
                    email = e.get('email')
                    break
        return {
            'email': email,
            'name': profile.get('name') or profile.get('login'),
            'picture': profile.get('avatar_url'),
            'provider': 'github',
            'provider_id': str(profile.get('id')),
        }

    elif provider == 'microsoft':
        # id_token contains claims for openid scope
        user_data = token.get('userinfo')
        if not user_data:
            # Fallback: call Microsoft Graph
            resp = await oauth.microsoft.get(
                'https://graph.microsoft.com/v1.0/me', token=token
            )
            user_data = resp.json()
        email = (
            user_data.get('email')
            or user_data.get('preferred_username')
            or user_data.get('mail')
            or user_data.get('userPrincipalName')
        )
        return {
            'email': email,
            'name': user_data.get('name') or user_data.get('displayName'),
            'picture': None,  # Graph photo requires extra call; skip for simplicity
            'provider': 'microsoft',
            'provider_id': user_data.get('sub') or user_data.get('id'),
        }

    raise ValueError(f"Unsupported provider: {provider}")

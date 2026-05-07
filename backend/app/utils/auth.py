from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from google.oauth2 import id_token
from google.auth.transport import requests

security = HTTPBearer()

# Your Google OAuth Client ID
CLIENT_ID = "959535440286-21n1dkp9703h8um2hppper6m5f6s4vu9.apps.googleusercontent.com"

async def get_current_user(cred: HTTPAuthorizationCredentials = Security(security)) -> str:
    """Verifies the Google OAuth JWT token and returns the user's unique Google ID (sub)."""
    token = cred.credentials
    try:
        # Verify the Google JWT token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        
        # 'sub' is the unique identifier for the Google user
        uid = idinfo.get('sub')
        if not uid:
            raise ValueError("No user ID found in token")
        
        return uid
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google Authentication: {str(e)}")

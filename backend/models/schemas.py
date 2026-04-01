from pydantic import BaseModel
from typing import Optional, Dict

class IdentifyRequest(BaseModel):
    url: str

class IdentifyResponse(BaseModel):
    status: str  # "success", "not_found", "error"
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    cover_url: Optional[str] = None
    links: Optional[Dict[str, str]] = None
    error_message: Optional[str] = None

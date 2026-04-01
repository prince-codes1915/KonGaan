from fastapi import APIRouter, HTTPException
from ..models.schemas import IdentifyRequest, IdentifyResponse
from ..viewmodels.music_recognition import MusicRecognitionViewModel

router = APIRouter()
viewmodel = MusicRecognitionViewModel()

@router.post("/identify", response_model=IdentifyResponse)
def identify(request: IdentifyRequest):
    result = viewmodel.identify_music(request.url)
    
    # We always return 200 with the status in the payload for easier frontend handling
    # unless it's a critical server error. The ViewModel handles everything
    return IdentifyResponse(
        status=result.get("status", "error"),
        title=result.get("title"),
        artist=result.get("artist"),
        album=result.get("album"),
        cover_url=result.get("cover_url"),
        links=result.get("links"),
        error_message=result.get("error_message")
    )

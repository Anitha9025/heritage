from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List, Optional
from translate_module import translate_text, is_supported_language
from search_module import get_sites_by_place

app = FastAPI()

class ListRequest(BaseModel):
    language: str
    district: str

class ListResponse(BaseModel):
    place: str
    sites: List[str]
    error: Optional[str] = None

@app.post("/getList", response_model=ListResponse)
def get_list(data: ListRequest):
    language = data.language
    place = data.district

    if not is_supported_language(language):
        return ListResponse(place=place, sites=[], error="Language not supported.")

    sites = get_sites_by_place(place)
    if not sites:
        return ListResponse(
            place=place,
            sites=[],
            error=translate_text('No tourist sites found for this location.', target_language_name=language)
        )

    translated_sites = [translate_text(site, target_language_name=language) for site in sites]
    return ListResponse(place=place, sites=translated_sites)
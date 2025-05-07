# llm_module.py

from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from search_module import popular_site  # District-wise site data
from location_module import get_coordinates  # Removed get_location_details
from map_module import show_location_on_map
import re

# Load Llama 3 model
llm = Ollama(model="llama3:8b")

# --------------------- PROMPTS ---------------------
site_description_prompt = PromptTemplate(
    input_variables=["site"],
    template="""
You are an expert Indian travel and heritage guide, trained to give accurate, verified, and concise facts.

User asked about: "{site}"

🚫 Important:
Do NOT confuse the input with a person's name or a general topic.
ALWAYS assume it is a *place, **temple, or **tourist site* unless the question explicitly mentions a person or historical figure.

If the site is unknown or ambiguous, say:
> "I could not find verified information about this place. It may not be a well-known heritage or tourist site."

First determine if this is:
- A *heritage site or temple*
- A *tourist destination, hill station, or beach*

Use only historically accurate facts. If unsure, say "Information not verified" or "No historical record found."

### If it is a *heritage site or temple*:
- *Historical Background*: When and by whom was it built? What’s its legacy?
- *Cultural Importance*: Describe its religious or cultural value.
- *Architectural Style*: Mention dynasties, design styles, and unique features.
- *Festivals/Traditions*: Key rituals or celebrations linked to the site.
- *Best Time to Visit*: Seasonal tips for tourists.

### If it is a *tourist destination*:
- *Overview*: Short intro with top things it's known for.
- *Best Time to Visit*: Seasons and climate.
- *Attractions*: What to see/do there.
- *Local Flavor*: Festivals, food, crafts, etc.
- *Travel Tips*: Essentials for visitors.

Keep the response structured and bullet-pointed. Avoid guessing. Keep it engaging, but fact-based.
"""

)

chat_prompt = PromptTemplate(
    input_variables=["question", "site_name"],
    template="""
You are a reliable, accurate, and engaging heritage site guide.

- The site is: "{site_name}"
- User asked: "{question}"

Guidelines:
- If the question is related to "{site_name}", use historical facts only.
- If unrelated (e.g., general history, kings, events), answer normally and accurately.
- Do NOT make up events or features. If uncertain, say "I don't have accurate data on that."
- Give short, clear answers (2–5 lines), not long essays.
"""
)

general_chat_prompt = PromptTemplate(
    input_variables=["question"],
    template="""
You are a trained Indian history and culture expert.

User asked: "{question}"

Rules:
- Keep answers factual and concise (max 5 lines).
- Say "Not sure" if the answer is not verified.
- Do not create imaginary facts or legends.
"""
)

# --------------------- CHAINS ---------------------
site_chain = LLMChain(llm=llm, prompt=site_description_prompt)
chat_chain = LLMChain(llm=llm, prompt=chat_prompt)
general_chat_chain = LLMChain(llm=llm, prompt=general_chat_prompt)

# --------------------- HELPERS ---------------------

def find_site_details(site_name: str):
    """
    Checks all districts to find the full address and pincode of a given site.
    """
    for district, sites in popular_site.items():
        for full_site in sites:
            if site_name.lower() in full_site.lower():
                # Extract pincode using regex
                match = re.search(r"\b\d{6}\b", full_site)
                pincode = match.group(0) if match else None
                return {
                    "district": district,
                    "full_address": full_site,
                    "pincode": pincode
                }
    return None

def preprocess_site_name(site_name: str) -> str:
    return site_name.strip().lower().replace("temple", "").replace("beach", "").strip()

def get_location_details(full_address: str):
    """
    Fallback version of get_location_details.
    Uses get_coordinates and returns basic info.
    """
    coords = get_coordinates(full_address)
    if not coords:
        return {
            "address": full_address,
            "latitude": "Not found",
            "longitude": "Not found"
        }
    return {
        "address": full_address,
        "latitude": coords[0],
        "longitude": coords[1]
    }

# --------------------- MAIN FUNCTIONS ---------------------

def get_heritage_info(site_name):
    """
    Checks for site in search_module. If found, fetches heritage info using LLM.
    Also fetches location data for mapping.
    """
    site_data = find_site_details(site_name)

    if not site_data:
        return "❌ Site not found in our records. Please check the name or try a nearby landmark."

    # Describe using LLM
    cleaned_name = preprocess_site_name(site_name)
    heritage_text = site_chain.invoke({"site": cleaned_name})["text"]

    # Location Mapping
    full_address = site_data["full_address"]
    location = get_location_details(full_address)
    coords = get_coordinates(full_address)

    if coords:
        show_location_on_map(coords[0], coords[1], site_name)

    return f"""
✅ **Site Found**: {full_address}

📌 **Heritage Overview**:
{heritage_text}

📍 **Location Details**:
- Address: {location.get('address')}
- Latitude: {location.get('latitude')}
- Longitude: {location.get('longitude')}
"""

def get_chat_response(question, site_name=None):
    if site_name:
        return chat_chain.invoke({"question": question, "site_name": site_name})["text"]
    else:
        return general_chat_chain.invoke({"question": question})["text"]

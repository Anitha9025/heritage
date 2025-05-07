# main.py

from translate_module import translate_text, is_supported_language
from llm_module import get_heritage_info
from speech_module import speak_text
from chatbot_module import chat_loop
from location_module import get_coordinates
from map_module import show_location_on_map
from search_module import get_sites_by_place  # Lists tourist sites for a place
import json

def handle_site_interaction(language_name):
    result = {
        "place": None,
        "sites": [],
        "site_name": None,
        "heritage_info": None,
        "map_file": None,
        "error": None
    }

    # Ask for place name (city or district)
    place_prompt = translate_text("Enter the name of the place:", target_language_name=language_name)
    place = input(f"\n📍 {place_prompt} ").strip()
    result["place"] = place

    # Search for tourist sites in the place
    sites = get_sites_by_place(place)
    if not sites:
        result["error"] = translate_text('No tourist sites found for this location.', target_language_name=language_name)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    # Display list of sites
    for site in sites:
        translated_site = translate_text(site, target_language_name=language_name)
        result["sites"].append(translated_site)

    # Ask for specific site to explore
    site_prompt = translate_text("Enter the name of the site you want to explore:", target_language_name=language_name)
    site_name = input(f"\n🏭️ {site_prompt} ").strip()
    result["site_name"] = site_name

    # Get LLM response
    english_info = get_heritage_info(site_name)
    translated_info = translate_text(english_info, target_language_name=language_name)
    result["heritage_info"] = translated_info

    # Show map
    lat, lng = get_coordinates(site_name)
    if lat and lng:
        map_file = show_location_on_map(lat, lng, site_name)
        result["map_file"] = map_file
    else:
        result["error"] = translate_text('Could not find location on the map.', target_language_name=language_name)

    print(json.dumps(result, ensure_ascii=False, indent=2))

def main():
    print("\n🌐 Welcome to the Multilingual Heritage Guide!")

    language = input("🌍 Enter your preferred language: ").strip()
    if not is_supported_language(language):
        print("❌ Language not supported.")
        return

    while True:
        handle_site_interaction(language)

        again = input(f"\n🔁 {translate_text('Do you want to search for another site? (yes/no)', target_language_name=language)} ").strip().lower()
        if again not in ["yes", "y", translate_text("yes", target_language_name=language).lower()]:
            print(translate_text("Thank you for using the Heritage Guide!", target_language_name=language))
            break

if __name__ == "__main__":
    main()

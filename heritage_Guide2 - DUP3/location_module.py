# location_module.py

from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

def get_coordinates(place_name):
    """
    Returns latitude and longitude for the given heritage site name using Nominatim.
    Attempts multiple region suffixes to ensure more flexible geolocation.
    """
    try:
        geolocator = Nominatim(user_agent="heritage_guide_app")
        suffixes = ["Tamil Nadu, India", "India", ""]

        for suffix in suffixes:
            query = f"{place_name}, {suffix}" if suffix else place_name
            location = geolocator.geocode(query, timeout=10)
            if location:
                return location.latitude, location.longitude

        return None, None

    except GeocoderTimedOut:
        print("[Location Error] Geocoding timed out. Try again later.")
        return None, None
    except Exception as e:
        print(f"[Location Error] {e}")
        return None, None

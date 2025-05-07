#intent_module.py

def detect_intent(user_input):
    user_input = user_input.lower()

    # Normalize common phrases
    user_input = user_input.replace("entry fee", "ticket").replace("price", "ticket")

    # Priority-based detection
    if any(word in user_input for word in ["history", "origin", "built", "built by", "construction", "established"]):
        return "ask_history"
    
    elif any(word in user_input for word in ["timing", "open", "close", "opening hours", "time to visit", "best time", "when open"]):
        return "ask_timing"
    
    elif any(word in user_input for word in ["ticket", "entry", "entry ticket", "entry cost", "entry price", "cost to visit"]):
        return "ask_ticket"
    
    elif any(word in user_input for word in ["location", "where is", "where located", "which place"]):
        return "ask_location"
    
    elif any(word in user_input for word in ["hotel", "stay", "lodging", "accommodation", "rooms nearby", "places to stay"]):
        return "ask_hotels"
    
    elif any(word in user_input for word in ["nearby", "around", "near", "places around", "attractions near", "what to see near"]):
        return "ask_nearby"

    # If none matched properly, treat it as unknown (let LLM handle)
    else:
        return "unknown"

#response_module.py

from llm_module import get_chat_response as generate_response  # just rename it at import

def respond_to_query(intent, site_name):
    prompts = {
        "ask_history": f"Tell me the detailed history and origin of {site_name}.",
        "ask_timing": f"What are the visiting hours or timings for {site_name}?",
        "ask_ticket": f"Is there any ticket or entry fee for visiting {site_name}?",
        "ask_location": f"Where exactly is {site_name} located?",
        "ask_hotels": f"Suggest good hotels or accommodations near {site_name}.",
        "ask_nearby": f"What are some nearby attractions around {site_name}?"
    }

    if intent in prompts:
        prompt = prompts[intent]
        response = generate_response(prompt)
        return response
    else:
        return None

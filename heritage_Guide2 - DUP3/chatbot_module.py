#chatbot_module.py

from translate_module import translate_text
from speech_module import speak_text, stop_speech, is_playing
from llm_module import get_heritage_info, get_chat_response
from intent_module import detect_intent
from response_module import respond_to_query
import threading
import time

def chat_loop(language_name, site_name):
    # System messages
    welcome_message_template = translate_text("\n💬 You can now ask questions about {site_name}! Type 'exit' to end.", target_language_name=language_name)
    welcome_message = welcome_message_template.replace("{site_name}", site_name)

    speech_instruction = translate_text("🛑 You can press Enter anytime while the AI is speaking to stop it and continue chatting.\n", target_language_name=language_name)
    user_prompt = translate_text("👤 You: ", target_language_name=language_name)
    thank_you_message = translate_text("👋 Thank you for exploring with us!", target_language_name=language_name)
    stop_speech_message = translate_text("🔈 Press Enter to stop the speech and continue chatting...\n", target_language_name=language_name)
    ai_prefix = translate_text("🤖 AI: ", target_language_name=language_name)

    print(welcome_message)
    print(speech_instruction)

    while True:
        user_input = input(user_prompt).strip()

        if user_input.lower() in ["exit", "quit", "bye"]:
            stop_speech()
            print(thank_you_message)
            break

        english_input = translate_text(user_input, target_language_name="english")
        intent = detect_intent(english_input)
        static_response = respond_to_query(intent, site_name)

        if static_response and intent not in ["unknown", ""] and len(english_input.split()) < 7:
            response = static_response
        else:
            response = get_chat_response(english_input, site_name)

        translated_response = translate_text(response, target_language_name=language_name)
        print(f"{ai_prefix}{translated_response}\n")

        speech_thread = threading.Thread(target=speak_text, args=(translated_response, language_name))
        speech_thread.start()

        input(stop_speech_message)
        stop_speech()

        while is_playing:
            time.sleep(0.1)

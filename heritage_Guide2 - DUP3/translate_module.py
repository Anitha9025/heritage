# translate_module.py

from googletrans import Translator, LANGUAGES

# Converts language name like 'Tamil' to 'ta'
def get_language_code(language_name):
    language_name = language_name.lower()
    for code, name in LANGUAGES.items():
        if name.lower() == language_name:
            return code
    return None

# Translates text into target language (by name)
def translate_text(text, target_language_name):
    translator = Translator()
    target_lang_code = get_language_code(target_language_name)
    
    if not target_lang_code:
        print(f"[Translation Error] Unsupported language: {target_language_name}")
        return text  # fallback to original
    
    try:
        translated = translator.translate(text, dest=target_lang_code)
        if translated is None or translated.text is None:
            raise ValueError("Translation failed: empty response")
        return translated.text
    except Exception as e:
        print(f"[Translation Error] {e}")
        return text  # fallback to original on failure


# Checks if a language name like 'Tamil' is supported
def is_supported_language(language_name):
    return get_language_code(language_name) is not None

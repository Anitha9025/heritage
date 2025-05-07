# speech_module.py

from gtts import gTTS
import pygame
from gtts.lang import tts_langs
import re
import threading
import os
import time
import uuid

is_playing = False
stop_requested = False

def clean_text(text):
    return re.sub(r'[*_#`~]+', '', text)

def get_language_code(language_name):
    name_to_code = {name.lower(): code for code, name in tts_langs().items()}
    return name_to_code.get(language_name.lower())

def _play_audio(file_path):
    global is_playing, stop_requested
    try:
        if not pygame.mixer.get_init():
            pygame.mixer.init(frequency=22050, size=-16, channels=2, buffer=4096)

        pygame.mixer.music.load(file_path)
        pygame.mixer.music.play()
        is_playing = True

        while pygame.mixer.music.get_busy():
            if stop_requested:
                pygame.mixer.music.stop()
                break
            time.sleep(0.1)

    except pygame.error as e:
        print(f"[Pygame Error] {e}")
    finally:
        is_playing = False
        stop_requested = False

        try:
            pygame.mixer.quit()
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"[File Cleanup Error] {e}")

def speak_text(text, lang):
    global is_playing, stop_requested
    stop_requested = False  # Reset stop before speaking
    language_code = get_language_code(lang)

    if not language_code:
        print("❌ Sorry, that language is not supported by gTTS.")
        return

    cleaned_text = clean_text(text)
    file_path = f"output_{uuid.uuid4()}.mp3"

    try:
        tts = gTTS(text=cleaned_text, lang=language_code, slow=False)
        tts.save(file_path)

        thread = threading.Thread(target=_play_audio, args=(file_path,))
        thread.start()
    except Exception as e:
        print(f"[Speech Error] {e}")

def stop_speech():
    global stop_requested
    stop_requested = True

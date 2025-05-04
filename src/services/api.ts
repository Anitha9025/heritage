
// This file simulates API calls to your Python backend modules

import { toast } from "sonner";

// Simulated API for heritage site information (llm_module.py)
export async function getHeritageSiteInfo(siteName: string, language: string = "English") {
  console.log(`Getting info for ${siteName} in ${language}`);
  
  // In a real implementation, this would call your Python backend's llm_module.get_heritage_info
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = {
        description: `This is detailed information about ${siteName}. The site was built during the ancient period and features remarkable architecture. It holds significant cultural importance in the region and attracts visitors from around the world.`,
        audioAvailable: true
      };
      resolve(response);
    }, 1000);
  });
}

// Simulated API for text-to-speech (speech_module.py)
export async function speakText(text: string, language: string = "English") {
  console.log(`Speaking text in ${language} using speech_module.py`);
  
  // In a real implementation, this would call your Python backend's speech_module.speak_text()
  toast.info(`Playing audio narration in ${language}`, {
    description: "Text-to-speech service activated"
  });
  
  return { success: true, isPlaying: true };
}

// Simulated API for stopping speech (speech_module.py)
export async function stopSpeech() {
  console.log("Stopping speech using speech_module.py");
  
  // In a real implementation, this would call your Python backend's speech_module.stop_speech()
  toast.info("Audio narration stopped");
  
  return { success: true, isPlaying: false };
}

// Simulated API for translation (translate_module.py)
export async function translateText(text: string, targetLanguage: string) {
  console.log(`Translating text to ${targetLanguage} using translate_module.py`);
  
  // In a real implementation, this would call your Python backend's translate_module.translate_text
  return new Promise((resolve) => {
    setTimeout(() => {
      // Just return the same text for simulation
      resolve(text);
    }, 500);
  });
}

// Simulated API for checking if language is supported (translate_module.py)
export async function isSupportedLanguage(language: string) {
  console.log(`Checking if ${language} is supported using translate_module.py`);
  
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would call translate_module.is_supported_language()
      const supportedLanguages = ["English", "Tamil", "Hindi", "Telugu", "Malayalam", "Kannada", "Bengali"];
      resolve(supportedLanguages.includes(language));
    }, 300);
  });
}

// Simulated API for getting map coordinates (location_module.py)
export async function getCoordinates(siteName: string) {
  console.log(`Getting coordinates for ${siteName} using location_module.py`);
  
  // In a real implementation, this would call your Python backend's location_module.get_coordinates
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample coordinates based on site name
      const coordinates = {
        "Fort St. George": { latitude: 13.0801, longitude: 80.2838 },
        "Kapaleeshwarar Temple": { latitude: 13.0337, longitude: 80.2693 },
        "Mahabalipuram": { latitude: 12.6269, longitude: 80.1927 },
        "Government Museum": { latitude: 13.0628, longitude: 80.2826 },
        "Santhome Cathedral": { latitude: 13.0334, longitude: 80.2787 }
      };
      
      // Default to Chennai coordinates if site not found
      resolve(coordinates[siteName] || { latitude: 13.0827, longitude: 80.2707 });
    }, 800);
  });
}

// Simulated API for chat responses (chatbot_module.py and intent_module.py)
export async function getChatResponse(question: string, siteName: string, language: string = "English") {
  console.log(`Getting chat response for "${question}" about ${siteName} in ${language} using chatbot_module.py`);
  
  // In a real implementation, this would:
  // 1. Detect intent using intent_module.detect_intent()
  // 2. Generate response using chatbot_module.respond_to_query() or llm_module.get_chat_response()
  return new Promise((resolve) => {
    setTimeout(() => {
      let response = "";
      
      // Simple intent detection simulation
      if (question.toLowerCase().includes("history")) {
        response = `${siteName} has a rich history dating back many centuries. It was built by ancient rulers and has been preserved as an important cultural heritage site.`;
      } else if (question.toLowerCase().includes("timing") || question.toLowerCase().includes("hours")) {
        response = `${siteName} is open from 9:00 AM to 6:00 PM on weekdays, and 10:00 AM to 4:00 PM on weekends and holidays.`;
      } else if (question.toLowerCase().includes("ticket") || question.toLowerCase().includes("fee")) {
        response = `The entry fee for ${siteName} is ₹50 for Indian nationals and ₹200 for foreign tourists. Children under 12 can enter for free.`;
      } else {
        response = `${siteName} is a famous heritage site known for its architectural beauty and cultural significance. Is there anything specific you'd like to know about it?`;
      }
      
      resolve(response);
    }, 1000);
  });
}

// Simulated API for getting supported languages
export async function getSupportedLanguages() {
  console.log("Getting supported languages");
  
  // In a real implementation, this would retrieve available languages from your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "en", name: "English" },
        { id: "ta", name: "Tamil" },
        { id: "hi", name: "Hindi" },
        { id: "te", name: "Telugu" },
        { id: "ml", name: "Malayalam" },
        { id: "kn", name: "Kannada" },
        { id: "bn", name: "Bengali" },
      ]);
    }, 300);
  });
}

// Function to save selected language to localStorage
export function saveSelectedLanguage(language: string) {
  localStorage.setItem('selectedLanguage', language);
  return { success: true };
}

// Function to get selected language from localStorage
export function getSelectedLanguage(): string {
  return localStorage.getItem('selectedLanguage') || 'English';
}

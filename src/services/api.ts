// This file simulates API calls to your Python backend modules

import { toast } from "sonner";
import { generateHeritageResponse, generateTranslation } from "./ollamaService";

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
  console.log(`Translating text to ${targetLanguage} using Ollama`);
  
  if (targetLanguage === "English") {
    return text;
  }
  
  try {
    // Get translation from Ollama
    const translatedText = await generateTranslation(text, targetLanguage);
    return translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    // Fallback to simple translation for Tamil
    if (targetLanguage === "Tamil") {
      const translations: Record<string, string> = {
        "Choose your Language": "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
        "Search language...": "மொழியைத் தேடுங்கள்...",
        "No languages found matching": "பொருந்தும் மொழிகள் எதுவும் கிடைக்கவில்லை",
        "Language set to Tamil": "மொழி தமிழாக அமைக்கப்பட்டுள்ளது",
        "The app will now display content in your selected language": "செயலி இப்போது உங்கள் தேர்ந்தெடுக்கப்பட்ட மொழியில் உள்ளடக்கத்தைக் காண்பிக்கும்",
        "Search heritage sites...": "பாரம்பரிய தளங்களைத் தேடுங்கள்...",
        "Discover Heritage": "பாரம்பரியத்தைக் கண்டறியுங்கள்",
        "Exploring in": "ஆராய்கிறது",
        "Search for heritage sites to explore": "ஆராய வேண்டிய பாரம்பரிய தளங்களைத் தேடுங்கள்",
        "or select from popular sites below": "அல்லது கீழே உள்ள பிரபலமான தளங்களிலிருந்து தேர்ந்தெடுக்கவும்",
        "Popular Heritage Sites": "பிரபலமான பாரம்பரிய தளங்கள்",
        "Featured Sites": "சிறப்பு தளங்கள்",
        "All Heritage Sites": "அனைத்து பாரம்பரிய தளங்கள்",
        "No heritage sites found matching": "பொருந்தும் பாரம்பரிய தளங்கள் எதுவும் கிடைக்கவில்லை",
        "Reset search": "தேடலை மீட்டமைக்கவும்",
        "Showing heritage sites in": "பாரம்பரிய தளங்களைக் காட்டுகிறது",
        "Showing results for": "இதற்கான முடிவுகளைக் காட்டுகிறது",
        "Found": "கண்டுபிடிக்கப்பட்டது",
        "heritage sites": "பாரம்பரிய தளங்கள்",
        "No sites found for": "இதற்கான தளங்கள் எதுவும் கிடைக்கவில்லை",
        "Try another place name": "மற்றொரு இட பெயரை முயற்சிக்கவும்",
        "Failed to search for heritage sites": "பாரம்பரிய தளங்களைத் தேட முடியவில்லை",
        "Popular": "பிரபலமானது",
        "Learn more about": "இதைப் பற்றி மேலும் அறிக",
        "Changing language": "மொழியை மாற்றுகிறது",
        "Redirecting to language selection screen": "மொழி தேர்வு திரைக்கு திருப்பி விடப்படுகிறது"
      };
      
      // Check if exact match exists
      if (translations[text]) {
        return translations[text];
      }
      
      // Check for partial matches
      for (const [key, value] of Object.entries(translations)) {
        if (text.includes(key)) {
          return text.replace(key, value);
        }
      }
      
      // Fallback for no matches
      return `${text} (தமிழில்)`;
    }
    
    // For other languages, just add a suffix indicating translation
    return `${text} (Translated to ${targetLanguage})`;
  }
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
  console.log(`Getting chat response for "${question}" about ${siteName} in ${language} using Ollama`);
  
  try {
    // Get response from Ollama
    const response = await generateHeritageResponse(question, siteName);
    
    // If language is not English, translate the response
    if (language !== "English") {
      const translatedResponse = await translateText(response, language);
      return translatedResponse;
    }
    
    return response;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return `${siteName} is a famous heritage site known for its architectural beauty and cultural significance. Is there anything specific you'd like to know about it?`;
  }
}

// Simulated API for getting supported languages
export async function getSupportedLanguages() {
  console.log("Getting supported languages from LANGUAGES dictionary in translate_module.py");
  
  // In a real implementation, this would retrieve available languages from your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulating a more comprehensive list of languages from googletrans.LANGUAGES
      resolve([
        { id: "en", name: "English" },
        { id: "ta", name: "Tamil" },
        { id: "hi", name: "Hindi" },
        { id: "te", name: "Telugu" },
        { id: "ml", name: "Malayalam" },
        { id: "kn", name: "Kannada" },
        { id: "bn", name: "Bengali" },
        { id: "fr", name: "French" },
        { id: "es", name: "Spanish" },
        { id: "de", name: "German" },
        { id: "it", name: "Italian" },
        { id: "pt", name: "Portuguese" },
        { id: "ru", name: "Russian" },
        { id: "ja", name: "Japanese" },
        { id: "ko", name: "Korean" },
        { id: "zh-cn", name: "Chinese (Simplified)" },
        { id: "ar", name: "Arabic" },
        { id: "af", name: "Afrikaans" },
        { id: "sq", name: "Albanian" },
        { id: "am", name: "Amharic" },
        { id: "hy", name: "Armenian" },
        { id: "az", name: "Azerbaijani" },
        { id: "eu", name: "Basque" },
        { id: "be", name: "Belarusian" },
        { id: "bg", name: "Bulgarian" },
        { id: "ca", name: "Catalan" },
        { id: "hr", name: "Croatian" },
        { id: "cs", name: "Czech" },
        { id: "da", name: "Danish" },
        { id: "nl", name: "Dutch" },
        { id: "et", name: "Estonian" },
        { id: "fi", name: "Finnish" },
        { id: "gl", name: "Galician" },
        { id: "ka", name: "Georgian" },
        { id: "el", name: "Greek" },
        { id: "gu", name: "Gujarati" },
        { id: "he", name: "Hebrew" },
        { id: "hu", name: "Hungarian" },
        { id: "is", name: "Icelandic" },
        { id: "id", name: "Indonesian" },
        { id: "ga", name: "Irish" },
        { id: "lv", name: "Latvian" },
        { id: "lt", name: "Lithuanian" },
        { id: "mk", name: "Macedonian" },
        { id: "ms", name: "Malay" },
        { id: "mt", name: "Maltese" },
        { id: "mr", name: "Marathi" },
        { id: "no", name: "Norwegian" },
        { id: "fa", name: "Persian" },
        { id: "pl", name: "Polish" },
        { id: "ro", name: "Romanian" },
        { id: "sr", name: "Serbian" },
        { id: "sk", name: "Slovak" },
        { id: "sl", name: "Slovenian" },
        { id: "sw", name: "Swahili" },
        { id: "sv", name: "Swedish" },
        { id: "tl", name: "Tagalog" },
        { id: "th", name: "Thai" },
        { id: "tr", name: "Turkish" },
        { id: "uk", name: "Ukrainian" },
        { id: "ur", name: "Urdu" },
        { id: "vi", name: "Vietnamese" },
        { id: "cy", name: "Welsh" },
        { id: "yi", name: "Yiddish" },
      ]);
    }, 300);
  });
}

// API for getting heritage sites by place name
export async function getHeritageSitesByPlace(placeName: string, language: string = "English"): Promise<string[]> {
  console.log(`Searching for heritage sites in ${placeName} using backend API`);
  
  try {
    // First check if the backend is accessible
    const response = await fetch('http://localhost:8000/getList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        language,
        district: placeName.toLowerCase().trim()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // Check if the response has the expected format
    if (!data || !data.place || !Array.isArray(data.sites)) {
      console.warn('Invalid response format:', data);
      return [];
    }
    
    // If backend is not accessible or returns no data, return mock data
    console.log("Backend not accessible, returning mock data");
    return [
      "Fort St. George, Rajaji Road, Chennai",
      "Mahabalipuram, East Coast Road",
      "Kapaleeshwarar Temple, Mylapore, Chennai"
    ];
  } catch (error) {
    console.error("Error fetching heritage sites:", error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      toast.error("Cannot connect to the server. Please ensure the backend is running at http://localhost:8000");
    } else {
      toast.error("Failed to fetch heritage sites. Please try again later.");
    }
    return [];
  }
}

// Function to save selected language to localStorage
export function saveSelectedLanguage(language: string) {
  localStorage.setItem('selectedLanguage', language);
  console.log(`Language saved to localStorage: ${language}`);
  return { success: true };
}

// Function to get selected language from localStorage
export function getSelectedLanguage(): string {
  const lang = localStorage.getItem('selectedLanguage') || 'English';
  console.log(`Retrieved language from localStorage: ${lang}`);
  return lang;
}

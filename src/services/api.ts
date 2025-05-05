
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
  
  if (targetLanguage === "English") {
    return text;
  }
  
  // In a real implementation, this would call your Python backend's translate_module.translate_text
  return new Promise((resolve) => {
    setTimeout(() => {
      // For Tamil, simulate actual translation
      if (targetLanguage === "Tamil") {
        // Map of common English phrases to Tamil translations
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
          resolve(translations[text]);
          return;
        }
        
        // Check for partial matches
        for (const [key, value] of Object.entries(translations)) {
          if (text.includes(key)) {
            const translated = text.replace(key, value);
            resolve(translated);
            return;
          }
        }
        
        // Fallback for no matches
        resolve(`${text} (தமிழில்)`);
      } else {
        // For other languages, just add a suffix indicating translation
        resolve(`${text} (Translated to ${targetLanguage})`);
      }
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

// Simulated API for getting heritage sites by place name
export async function getHeritageSitesByPlace(placeName: string): Promise<string[]> {
  console.log(`Searching for heritage sites in ${placeName} using search_module.py`);
  
  // Simulate the Python backend's search_module.get_sites_by_place function
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample data from the provided search_module.py
      const sitesData: Record<string, string[]> = {
        "chennai": [
          "Fort St. George, Rajaji Road, Chennai – 600009",
          "Government Museum, Pantheon Road, Egmore, Chennai – 600008",
          "Vivekananda House, Kamarajar Salai, Triplicane, Chennai – 600005",
          "Kalakshetra Foundation, Kalakshetra Road, Thiruvanmiyur, Chennai – 600041",
          "Madras High Court, Parry's Corner, Chennai – 600104",
          "Kapaleeshwarar Temple, Mylapore, Chennai – 600004",
          "Parthasarathy Temple, Triplicane, Chennai – 600005"
        ],
        "madurai": [
          "Meenakshi Amman Temple, Madurai Main, Madurai – 625001",
          "Thirumalai Nayakkar Mahal, Panthadi 1st Street, Madurai – 625001",
          "Gandhi Memorial Museum, Tamukkam, Madurai – 625020",
          "Alagar Kovil, Alagarkoil Road, Madurai – 625301",
          "Vandiyur Mariamman Teppakulam, Vandiyur, Madurai – 625020"
        ],
        "coimbatore": [
          "Adiyogi Shiva Statue, Isha Yoga Center, Velliangiri Foothills, Coimbatore – 641114",
          "Dhyanalinga Temple, Isha Yoga Center, Velliangiri Foothills, Coimbatore – 641114",
          "Marudhamalai Murugan Temple, Marudhamalai, Coimbatore – 641046",
          "Perur Pateeswarar Temple, Perur, Coimbatore – 641010",
          "Eachanari Vinayagar Temple, Eachanari, Coimbatore – 641021"
        ],
        "salem": [
          "Yercaud Hill Station, Yercaud, Salem – 636601",
          "Mettur Dam, Mettur, Salem – 636401",
          "1008 Lingam Temple, Ariyanoor, Salem – 636308",
          "Kalangi Siddhar Temple, Kanja Malai, Salem – 636305",
          "Kottai Mariamman Temple, Fort, Salem – 636001"
        ],
        "trichy": [
          "Sri Ranganathaswamy Temple, Srirangam, Tiruchirapalli – 620006",
          "Rockfort Temple, Rockfort Road, Tiruchirapalli – 620002",
          "Kallanai Dam, Kallanai, Tiruchirapalli – 620105",
          "St. Lourdes Church, Tiruchirapalli – 620001",
          "Jambukeswarar Temple, Thiruvanaikaval, Tiruchirapalli – 620005"
        ],
        "ariyalur": [
          "Gangaikonda Cholapuram, Jayankondam, Ariyalur – 621802",
          "Karaivetti Bird Sanctuary, Karaivetti, Ariyalur – 621851",
          "Thirumazhapadi Vaidyanathaswami Temple, Thirumazhapadi, Ariyalur – 621851",
          "Kaliyuga Varadaraja Perumal Temple, Kallankurichi, Ariyalur – 621705",
          "Meenatchi Sundareswarar Temple, Melapaluvur, Ariyalur – 621707"
        ],
        "chengalpattu": [
          "Vedanthangal Bird Sanctuary, Vedanthangal, Chengalpattu – 603314",
          "Arignar Anna Zoological Park, Vandalur, Chennai – 600048",
          "Kandhaswamy Temple, Thiruporur, Chengalpattu – 603110",
          "Vedagiriswarar Temple, Thirukalukundram, Chengalpattu – 603109",
          "Nityakalyana Perumal Temple, Thiruvidanthai, Chengalpattu – 603112"
        ],
        "dindigul": [
          "Dindigul Fort, Fort Road, Dindigul – 624001",
          "Arulmigu Dhandayuthapani Swamy Temple, Palani Hills, Palani – 624601",
          "Soundararaja Perumal Temple, Thadikombu, Dindigul – 624005",
          "Abirami Amman Temple, Rock Fort, Dindigul – 624001",
          "Sirumalai Hills, Sirumalai, Dindigul – 624003"
        ],
        "erode": [
          "Thindal Murugan Temple, Thindal, Erode – 638012",
          "Sangameswarar Temple, Bhavani, Erode – 638301",
          "Chennimalai Murugan Temple, Chennimalai, Erode – 638051",
          "Bannari Amman Temple, Bannari, Sathyamangalam, Erode – 638401",
          "Magudeswarar Temple, Kodumudi, Erode – 638151"
        ],
        "kancheepuram": [
          "Kailasanathar Temple, Pillaiyarpalayam, Kanchipuram – 631501",
          "Ekambareswarar Temple, Ekambaranathar Sannathi Street, Periya Kanchipuram, Kanchipuram – 631502",
          "Kamakshi Amman Temple, Kamakshi Amman Sannathi Street, Periya Kanchipuram, Kanchipuram – 631502",
          "Varadharaja Perumal Temple, Vishnu Kanchi, Kanchipuram – 631501",
          "Ulagalantha Perumal Temple, Big Kanchipuram, Kanchipuram – 631502"
        ],
        "thanjavur": [
          "Brihadeeswarar Temple, South Bank Road, Thanjavur – 613007",
          "Thanjavur Maratha Palace, Thanjavur – 613001",
          "Saraswathi Mahal Library, Thanjavur – 613001",
          "Sivaganga Park, Thanjavur – 613007",
          "Rajaraja Chola Art Gallery, Thanjavur – 613007"
        ]
      };
      
      // Search for exact match first
      const lowerCasePlaceName = placeName.toLowerCase().trim();
      if (sitesData[lowerCasePlaceName]) {
        resolve(sitesData[lowerCasePlaceName]);
        return;
      }
      
      // Then look for partial matches
      for (const [key, sites] of Object.entries(sitesData)) {
        if (key.includes(lowerCasePlaceName) || lowerCasePlaceName.includes(key)) {
          resolve(sites);
          return;
        }
      }
      
      // Return empty array if no matches found
      resolve([]);
    }, 800);
  });
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

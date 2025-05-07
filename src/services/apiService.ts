// Flexible API service for connecting with backend
import { toast } from "sonner";
import { getSelectedLanguage } from "./api";

// Types for API responses
export interface HeritageSite {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  isPopular: boolean;
  audioAvailable: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const API_URL = import.meta.env.VITE_APP_API_URL || "https://your-backend-api.com"; // Replace with Vite's environment variable

// Helper function to handle API errors
const handleApiError = async (error: any, language: string): Promise<string> => {
  console.error("API Error:", error);
  let errorMessage = error.message || "An unexpected error occurred";
  
  if (language !== "English") {
    try {
      const { translateText } = await import("./api");
      errorMessage = await translateText(errorMessage, language) as string;
    } catch (e) {
      console.error("Translation error:", e);
    }
  }
  
  return errorMessage;
};

// Fetch heritage sites by place name
export const fetchHeritageSitesByPlace = async (placeName: string): Promise<ApiResponse<HeritageSite[]>> => {
  const language = getSelectedLanguage();
  
  try {
    console.log(`Fetching heritage sites for ${placeName} in ${language}`);
    
    // First try to get data from the real backend
    try {
      const response = await fetch(`${API_URL}/heritage-sites?place=${placeName}&language=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': language
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
    } catch (backendError) {
      console.log("Real backend not available, falling back to mock data:", backendError);
      // Continue to fallback
    }
    
    // Fallback to the simulated API from api.ts
    const { getHeritageSitesByPlace } = await import("./api");
    const sites = await getHeritageSitesByPlace(placeName);
    
    // Format the results into proper HeritageSite objects
    if (sites && sites.length > 0) {
      const formattedSites = sites.map((site: string, index: number) => {
        // Extract site name and location (assuming format: "Site Name, Location")
        const parts = site.split(',');
        const title = parts[0].trim();
        const location = parts.slice(1).join(',').trim();
        
        return {
          id: `site-${index}-${Date.now()}`,
          title,
          location,
          description: `Learn more about ${title}`,
          image: `https://images.unsplash.com/photo-${1470071459604 + index * 10}-3b5ec3a7fe05`,
          isPopular: index < 2, // First two are marked as popular
          audioAvailable: true
        };
      });
      
      return { success: true, data: formattedSites };
    }
    
    return { success: false, error: `No heritage sites found for "${placeName}"` };
    
  } catch (error: any) {
    const errorMsg = await handleApiError(error, language);
    return { success: false, error: errorMsg };
  }
};

// Get heritage site details
export const fetchHeritageSiteDetails = async (siteId: string): Promise<ApiResponse<HeritageSite>> => {
  const language = getSelectedLanguage();
  
  try {
    console.log(`Fetching heritage site details for ID: ${siteId} in ${language}`);
    
    // Try real backend first
    try {
      const response = await fetch(`${API_URL}/heritage-sites/${siteId}?language=${language}`, {
        headers: {
          'Accept-Language': language
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
    } catch (backendError) {
      console.log("Real backend not available, falling back to mock data:", backendError);
      // Continue to fallback
    }
    
    // Fallback to the simulated API from api.ts
    const { getHeritageSiteInfo } = await import("./api");
    
    const defaultSites: Record<string, HeritageSite> = {
      "1": {
        id: "1",
        title: "Fort St. George",
        location: "Rajaji Road, Chennai",
        description: "Built in 1644, Fort St. George was the first English fortress in India, founded by the British East India Company.",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
        isPopular: true,
        audioAvailable: true
      },
      "2": {
        title: "Mahabalipuram",
        id: "2",
        location: "East Coast Road",
        description: "Mahabalipuram, also known as Mamallapuram, is a UNESCO World Heritage site famous for its 7th and 8th-century rock-cut temples.",
        image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb",
        isPopular: true,
        audioAvailable: true
      },
      "3": {
        id: "3",
        title: "Kapaleeshwarar Temple",
        location: "Mylapore, Chennai",
        description: "Kapaleeshwarar Temple is a Hindu temple dedicated to Lord Shiva located in Mylapore, Chennai.",
        image: "https://images.unsplash.com/photo-1466442929976-97f336a657be",
        isPopular: false,
        audioAvailable: true
      }
    };
    
    const site = defaultSites[siteId];
    if (site) {
      const siteInfo = await getHeritageSiteInfo(site.title, language);
      if (siteInfo && (siteInfo as any).description) {
        site.description = (siteInfo as any).description;
      }
      
      return { success: true, data: site };
    }
    
    return { success: false, error: "Heritage site not found" };
  } catch (error: any) {
    const errorMsg = await handleApiError(error, language);
    return { success: false, error: errorMsg };
  }
};

// Create a chat message
export const createChatMessage = async (
  question: string,
  siteName: string
): Promise<ApiResponse<string>> => {
  const language = getSelectedLanguage();
  
  try {
    console.log(`Creating chat message about ${siteName} in ${language}: "${question}"`);
    
    // Try real backend first
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': language
        },
        body: JSON.stringify({
          question,
          siteName,
          language
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data.response };
      }
    } catch (backendError) {
      console.log("Real backend not available, falling back to mock data:", backendError);
      // Continue to fallback
    }
    
    // Fallback to the simulated API from api.ts
    const { getChatResponse } = await import("./api");
    const response = await getChatResponse(question, siteName, language);
    return { success: true, data: response as string };
  } catch (error: any) {
    const errorMsg = await handleApiError(error, language);
    return { success: false, error: errorMsg };
  }
};

// Get map coordinates
export const fetchMapCoordinates = async (siteName: string): Promise<ApiResponse<{latitude: number, longitude: number}>> => {
  const language = getSelectedLanguage();
  
  try {
    console.log(`Fetching map coordinates for ${siteName} in ${language}`);
    
    // Try real backend first
    try {
      const response = await fetch(`${API_URL}/coordinates?site=${encodeURIComponent(siteName)}`, {
        headers: {
          'Accept-Language': language
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data: { latitude: data.latitude, longitude: data.longitude } };
      }
    } catch (backendError) {
      console.log("Real backend not available, falling back to mock data:", backendError);
      // Continue to fallback
    }
    
    // Fallback to the simulated API from api.ts
    const { getCoordinates } = await import("./api");
    const coordinates = await getCoordinates(siteName);
    return { success: true, data: coordinates as {latitude: number, longitude: number} };
  } catch (error: any) {
    const errorMsg = await handleApiError(error, language);
    return { success: false, error: errorMsg };
  }
};

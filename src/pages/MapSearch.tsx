
import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import BackButton from "@/components/BackButton";
import { getCoordinates, getSelectedLanguage, translateText } from "@/services/api";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

const MapSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [translatedLabels, setTranslatedLabels] = useState({
    searchPlaceholder: "Search heritage sites",
    findHeritageSite: "Find a Heritage Site",
    inputPlaceholder: "Enter site name or location",
    searching: "Searching...",
    search: "Search",
    nearbySites: "Nearby Sites",
    interactiveMapView: "Interactive Map View",
    searchingLocation: "Searching for location...",
    showing: "Showing"
  });
  const location = useLocation();
  
  useEffect(() => {
    // Get the user's selected language
    const language = getSelectedLanguage();
    setSelectedLanguage(language);
    
    if (language !== "English") {
      translateUIElements(language);
    }
    
    // Parse the query parameter to get the site name from the URL
    const params = new URLSearchParams(location.search);
    const site = params.get('site');
    
    if (site) {
      setSearchValue(site);
      handleSearch(null, site);
    }
  }, [location]);
  
  const translateUIElements = async (language: string) => {
    try {
      const translations = {} as any;
      for (const [key, value] of Object.entries(translatedLabels)) {
        const translated = await translateText(value, language);
        translations[key] = translated;
      }
      setTranslatedLabels(translations as typeof translatedLabels);
    } catch (error) {
      console.error("Error translating UI elements:", error);
    }
  };
  
  const handleSearch = async (e: React.FormEvent | null, siteName?: string) => {
    if (e) e.preventDefault();
    
    const searchSite = siteName || searchValue;
    if (!searchSite.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Call our simulated API using location_module.py
      const coords = await getCoordinates(searchSite);
      setCoordinates(coords as {latitude: number, longitude: number});
      
      // Create and translate success message
      let successMessage = `Found location for ${searchSite}`;
      let descriptionMessage = `Coordinates: ${(coords as any).latitude.toFixed(4)}, ${(coords as any).longitude.toFixed(4)}`;
      
      if (selectedLanguage !== "English") {
        successMessage = await translateText(successMessage, selectedLanguage) as string;
        descriptionMessage = await translateText(descriptionMessage, selectedLanguage) as string;
      }
      
      toast.success(successMessage, {
        description: descriptionMessage
      });
    } catch (error) {
      console.error("Error getting coordinates:", error);
      
      // Create and translate error message
      let errorMessage = `Could not find location for ${searchSite}`;
      
      if (selectedLanguage !== "English") {
        errorMessage = await translateText(errorMessage, selectedLanguage) as string;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-[70vh] bg-gray-200">
        {/* This would be a real map in a production app using your map_module.py */}
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <div className="text-heritage-dark text-lg font-medium">
            {isSearching ? translatedLabels.searchingLocation : 
             coordinates ? `${translatedLabels.showing}: ${searchValue}` : translatedLabels.interactiveMapView}
          </div>
          
          {coordinates && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg text-sm">
              <div className="font-medium mb-1">{searchValue}</div>
              <div>Latitude: {coordinates.latitude.toFixed(4)}</div>
              <div>Longitude: {coordinates.longitude.toFixed(4)}</div>
            </div>
          )}
        </div>
        
        {/* Map Marker */}
        {coordinates && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-bounce">
              <MapPin size={36} className="text-red-500" />
            </div>
          </div>
        )}
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <BackButton />
        </div>
        
        {/* Search Bar */}
        <div className="absolute top-4 left-0 right-0 px-16">
          <form onSubmit={(e) => handleSearch(e)}>
            <div className="bg-white rounded-full shadow-lg flex items-center py-2 px-4">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={translatedLabels.searchPlaceholder}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </form>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-t-2xl -mt-6 relative z-10 p-4">
        <form onSubmit={(e) => handleSearch(e)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              {translatedLabels.findHeritageSite}
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={translatedLabels.inputPlaceholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-heritage-primary"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSearching || !searchValue.trim()}
            className={`w-full ${isSearching || !searchValue.trim() ? 'bg-gray-400' : 'bg-heritage-primary hover:bg-blue-600'} text-white font-medium py-3 rounded-lg transition-colors`}
          >
            {isSearching ? translatedLabels.searching : translatedLabels.search}
          </button>
        </form>
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-3">{translatedLabels.nearbySites}</h3>
          <div className="space-y-2">
            {["Fort St. George", "Kapaleeshwarar Temple", "Mahabalipuram"].map((site, index) => (
              <div 
                key={index} 
                className="p-3 border border-gray-200 rounded-lg flex items-center cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSearchValue(site);
                  handleSearch(null, site);
                }}
              >
                <MapPin size={18} className="text-heritage-primary mr-3" />
                <span>{site}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSearch;

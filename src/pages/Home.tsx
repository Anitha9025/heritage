import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, MessageCircle, Languages, Mic } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import FloatingButton from "@/components/FloatingButton";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import TranslationWrapper from "@/components/TranslationWrapper";
import { fetchHeritageSitesByPlace, HeritageSite } from "@/services/apiService";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Default popular heritage sites for initial display
const defaultHeritageSites = [
  {
    id: "1",
    title: "Fort St. George",
    location: "Rajaji Road, Chennai",
    description: "Built in 1644, Fort St. George was the first English fortress in India, founded by the British East India Company.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    isPopular: true,
    audioAvailable: true
  },
  {
    id: "2",
    title: "Mahabalipuram",
    location: "East Coast Road",
    description: "Mahabalipuram, also known as Mamallapuram, is a UNESCO World Heritage site famous for its 7th and 8th-century rock-cut temples.",
    image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb",
    isPopular: true,
    audioAvailable: true
  },
  {
    id: "3",
    title: "Kapaleeshwarar Temple",
    location: "Mylapore, Chennai",
    description: "Kapaleeshwarar Temple is a Hindu temple dedicated to Lord Shiva located in Mylapore, Chennai.",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be",
    isPopular: false,
    audioAvailable: true
  }
];

// List of districts in Tamil Nadu for the dropdown
const districts = [
  "All Districts",
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Thoothukudi",
  "Tiruppur",
  "Erode",
  "Vellore"
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [displayedSites, setDisplayedSites] = useState<HeritageSite[]>(defaultHeritageSites);
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [isListening, setIsListening] = useState(false);
  const { language, translate } = useLanguage();
  const navigate = useNavigate();

  const labels = {
    searchPlaceholder: "Search heritage sites...",
    discoverHeading: "Discover Heritage",
    exploringIn: "Exploring in",
    searchInstructions: "Search for heritage sites to explore",
    orSelectBelow: "or select from popular sites below",
    popularSites: "Popular Heritage Sites",
    featuredSites: "Featured Sites",
    allSites: "All Heritage Sites", 
    noSitesFound: "No heritage sites found matching",
    resetSearch: "Reset search",
    searchingFor: "Showing heritage sites in",
    selectDistrict: "Select District",
    aboutUsTitle: "About Heritage Guide",
    aboutUsContent: "We are dedicated to showcasing the rich cultural heritage of India, focusing on historical and archaeological sites. Our mission is to preserve these treasures through digital documentation and make them accessible to everyone in their preferred language.",
    exploreMore: "Explore More",
    startVoiceSearch: "Start voice search",
    stopVoiceSearch: "Stop listening"
  };

  const handleLanguageButtonClick = () => {
    translate("Changing language").then(msg => {
      toast.info(msg, {
        description: "Redirecting to language selection screen"
      });
    });
    navigate("/");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setHasSearched(true);
    
    try {
      console.log(`Searching for heritage sites in: ${searchTerm}, district: ${selectedDistrict}`);
      
      // Get sites based on search term (place name) and selected district using our flexible API service
      const response = await fetchHeritageSitesByPlace(searchTerm, selectedDistrict !== "All Districts" ? selectedDistrict : undefined);
      
      if (response.success && response.data && response.data.length > 0) {
        console.log(`Found ${response.data.length} sites for ${searchTerm}`);
        setDisplayedSites(response.data);
        
        // Translate success message based on selected language
        const successMessage = await translate(`Showing results for "${searchTerm}"`);
        const descriptionMessage = await translate(`Found ${response.data.length} heritage sites`);
        
        toast.success(successMessage, {
          description: descriptionMessage
        });
      } else {
        console.log(`No sites found for ${searchTerm}`);
        setDisplayedSites([]);
        
        // Translate error message based on selected language
        const errorMessage = await translate(`No sites found for "${searchTerm}"`);
        const descriptionMessage = await translate("Try another place name");
        
        toast.error(errorMessage, {
          description: descriptionMessage
        });
      }
    } catch (error) {
      console.error("Error searching for heritage sites:", error);
      
      const errorMessage = await translate("Failed to search for heritage sites");
      
      toast.error(errorMessage);
      
      // Fallback to default sites
      setDisplayedSites([]);
    }
  };

  const handleDistrictChange = async (value: string) => {
    setSelectedDistrict(value);
    
    if (searchTerm) {
      // If there's already a search term, re-run the search with the new district
      try {
        const response = await fetchHeritageSitesByPlace(searchTerm, value !== "All Districts" ? value : undefined);
        
        if (response.success && response.data && response.data.length > 0) {
          setDisplayedSites(response.data);
          
          const successMessage = await translate(`Showing results for "${searchTerm}" in ${value}`);
          toast.success(successMessage);
        } else {
          setDisplayedSites([]);
          
          const errorMessage = await translate(`No sites found for "${searchTerm}" in ${value}`);
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error filtering by district:", error);
      }
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    setIsListening(true);
    
    // Initialize speech recognition with proper TypeScript typing
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.lang = language === 'English' ? 'en-US' : getLanguageCode(language);
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      
      // Automatically submit the form after getting speech input
      setTimeout(() => {
        const form = document.getElementById("search-form");
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }, 500);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast.error(`Voice recognition error: ${event.error}`);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
    toast.info("Listening... Speak now");
  };

  function getLanguageCode(language: string): string {
    const languageCodeMap: Record<string, string> = {
      'English': 'en-US',
      'Tamil': 'ta-IN',
      'Hindi': 'hi-IN',
      'Bengali': 'bn-IN',
      'Telugu': 'te-IN',
      'Malayalam': 'ml-IN',
      'Kannada': 'kn-IN'
    };
  
    return languageCodeMap[language] || 'en-US';
  }

  return (
    <TranslationWrapper
      textContent={labels}
      render={(translatedLabels) => (
        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 bg-heritage-primary shadow-md p-4">
            <form id="search-form" onSubmit={handleSearch} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <SearchBar 
                  placeholder={translatedLabels.searchPlaceholder} 
                  className="flex-1" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="button"
                  className={`p-2 ${isListening ? 'bg-red-500' : 'bg-white'} rounded-full shadow-sm hover:bg-gray-100 transition-colors`}
                  onClick={startVoiceRecognition}
                  aria-label={isListening ? translatedLabels.stopVoiceSearch : translatedLabels.startVoiceSearch}
                >
                  <Mic size={20} className={`${isListening ? 'text-white' : 'text-heritage-primary'} animate-pulse`} />
                </button>
                <button 
                  type="submit"
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                  aria-label="Search"
                >
                  <MapPin size={20} className="text-heritage-primary" />
                </button>
                <button 
                  type="button"
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                  onClick={handleLanguageButtonClick}
                  aria-label="Change language"
                >
                  <Languages size={20} className="text-heritage-primary" />
                </button>
              </div>
              
              {/* District Dropdown */}
              <div className="w-full">
                <Select onValueChange={handleDistrictChange} value={selectedDistrict}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder={translatedLabels.selectDistrict} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>

          <div className="px-4 pt-6">
            <h1 className="text-2xl font-bold text-heritage-dark mb-2">
              {translatedLabels.discoverHeading}
            </h1>
            <p className="text-gray-600 mb-6">
              {translatedLabels.exploringIn} {language}
            </p>
            
            {!hasSearched && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <MapPin size={48} className="mx-auto text-heritage-primary mb-4" />
                  <p className="text-gray-600">
                    {translatedLabels.searchInstructions}<br />
                    {translatedLabels.orSelectBelow}
                  </p>
                </div>
                
                <h2 className="font-semibold text-lg text-heritage-dark mt-8 mb-4">
                  {translatedLabels.popularSites}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {defaultHeritageSites.filter(site => site.isPopular).map((site) => (
                    <Link
                      key={`popular-${site.id}`}
                      to={`/site/${site.id}`}
                      className="site-card flex bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <div className="w-24 h-24">
                        <img 
                          src={site.image} 
                          alt={site.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 flex-1">
                        <h3 className="font-bold">{site.title}</h3>
                        <div className="flex items-center text-gray-500 mt-1">
                          <MapPin size={14} className="mr-1" />
                          <span className="text-xs">{site.location}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* About Us Section */}
                <Card className="mt-12 mb-4">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">{translatedLabels.aboutUsTitle}</h2>
                    <p className="text-gray-600 mb-4">{translatedLabels.aboutUsContent}</p>
                    <Button 
                      onClick={() => window.open("https://goverment-tourism.org", "_blank")}
                      className="bg-heritage-primary hover:bg-heritage-primary/90"
                    >
                      {translatedLabels.exploreMore}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {hasSearched && (
              <div className="space-y-6">
                {displayedSites.length > 0 ? (
                  <>
                    <h2 className="font-semibold text-lg text-heritage-dark">
                      {selectedDistrict !== "All Districts" 
                        ? `${translatedLabels.searchingFor} "${searchTerm}" - ${selectedDistrict}` 
                        : `${translatedLabels.searchingFor} "${searchTerm}"`}
                    </h2>
                    
                    <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 snap-x">
                      {displayedSites.map((site) => (
                        <Link
                          key={site.id}
                          to={`/site/${site.id}`}
                          className="site-card min-w-[280px] rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0 snap-start"
                        >
                          <div className="relative h-44">
                            <img 
                              src={site.image} 
                              alt={site.title} 
                              className="w-full h-full object-cover"
                            />
                            {site.isPopular && (
                              <span className="absolute top-3 left-3 bg-heritage-accent text-white text-xs py-1 px-3 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{site.title}</h3>
                            <div className="flex items-center text-gray-500">
                              <MapPin size={16} className="mr-1" />
                              <span className="text-sm">{site.location}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <h2 className="font-semibold text-lg text-heritage-dark mt-8">
                      {translatedLabels.allSites}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayedSites.map((site) => (
                        <Link
                          key={`all-${site.id}`}
                          to={`/site/${site.id}`}
                          className="site-card flex bg-white rounded-lg overflow-hidden shadow-sm"
                        >
                          <div className="w-24 h-24">
                            <img 
                              src={site.image} 
                              alt={site.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3 flex-1">
                            <h3 className="font-bold">{site.title}</h3>
                            <div className="flex items-center text-gray-500 mt-1">
                              <MapPin size={14} className="mr-1" />
                              <span className="text-xs">{site.location}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* About Us Section for search results page */}
                    <Card className="mt-12 mb-4">
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">{translatedLabels.aboutUsTitle}</h2>
                        <p className="text-gray-600 mb-4">{translatedLabels.aboutUsContent}</p>
                        <Button 
                          onClick={() => window.open("https://goverment-tourism.org", "_blank")}
                          className="bg-heritage-primary hover:bg-heritage-primary/90"
                        >
                          {translatedLabels.exploreMore}
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      {translatedLabels.noSitesFound} "{searchTerm}"
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setHasSearched(false);
                      }}
                      className="mt-4 text-heritage-primary underline"
                    >
                      {translatedLabels.resetSearch}
                    </button>
                    
                    {/* About Us Section for no results page */}
                    <Card className="mt-12 mb-4">
                      <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">{translatedLabels.aboutUsTitle}</h2>
                        <p className="text-gray-600 mb-4">{translatedLabels.aboutUsContent}</p>
                        <Button 
                          onClick={() => window.open("https://goverment-tourism.org", "_blank")}
                          className="bg-heritage-primary hover:bg-heritage-primary/90"
                        >
                          {translatedLabels.exploreMore}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Floating buttons */}
          <div className="fixed bottom-6 right-6">
            <FloatingButton 
              icon={<MessageCircle size={24} />} 
              to="/chat/1"
              ariaLabel="Open chatbot"
            />
          </div>
          
          <div className="fixed bottom-6 left-6">
            <FloatingButton 
              icon={<MapPin size={24} />} 
              to="/map"
              className="bg-heritage-dark"
              ariaLabel="Open map"
            />
          </div>
        </div>
      )}
    />
  );
};

export default Home;

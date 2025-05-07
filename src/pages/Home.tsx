
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, MessageCircle, Languages } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import FloatingButton from "@/components/FloatingButton";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import TranslationWrapper from "@/components/TranslationWrapper";
import { fetchHeritageSitesByPlace, HeritageSite } from "@/services/apiService";

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

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [displayedSites, setDisplayedSites] = useState<HeritageSite[]>(defaultHeritageSites);
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
    searchingFor: "Showing heritage sites in"
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
      console.log(`Searching for heritage sites in: ${searchTerm}`);
      
      // Get sites based on search term (place name) using our flexible API service
      const response = await fetchHeritageSitesByPlace(searchTerm);
      
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

  return (
    <TranslationWrapper
      textContent={labels}
      render={(translatedLabels) => (
        <div className="min-h-screen bg-gray-50 pb-20">
          <div className="sticky top-0 z-10 bg-heritage-primary shadow-md p-4">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <SearchBar 
                placeholder={translatedLabels.searchPlaceholder} 
                className="flex-1" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
              </div>
            )}
            
            {hasSearched && (
              <div className="space-y-6">
                {displayedSites.length > 0 ? (
                  <>
                    <h2 className="font-semibold text-lg text-heritage-dark">
                      {translatedLabels.searchingFor} "{searchTerm}"
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

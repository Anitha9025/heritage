
import { useParams, Link } from "react-router-dom";
import { Speaker, MessageCircle, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getHeritageSiteInfo, speakText, stopSpeech, getSelectedLanguage } from "@/services/api";
import BackButton from "@/components/BackButton";
import FloatingButton from "@/components/FloatingButton";

interface Site {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  isPopular: boolean;
  audioAvailable: boolean;
}

// Sample data for when site not found in backend
const defaultSites: Record<string, Site> = {
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
  }
};

const SiteInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<Site | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [siteDescription, setSiteDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  
  useEffect(() => {
    // Get the user's selected language
    const language = getSelectedLanguage();
    setSelectedLanguage(language);
    
    // Set initial site data from our default sites
    if (id && defaultSites[id]) {
      setSite(defaultSites[id]);
    }
    
    if (id) {
      setIsLoading(true);
      // Get the site title from our default sites or use a placeholder
      const siteTitle = defaultSites[id]?.title || "Unknown Site";
      
      getHeritageSiteInfo(siteTitle, selectedLanguage)
        .then((response: any) => {
          setSiteDescription(response.description);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching site information:", error);
          toast.error("Failed to load site information");
          setIsLoading(false);
        });
    }
  }, [id, selectedLanguage]);
  
  if (!site) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Site Not Found</h1>
          <Link to="/home" className="text-heritage-primary underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const handlePlayAudio = () => {
    if (isPlaying) {
      stopSpeech()
        .then(() => {
          setIsPlaying(false);
          toast.info("Stopped audio narration");
        })
        .catch(error => {
          console.error("Error stopping audio:", error);
        });
    } else {
      speakText(siteDescription || site.description, selectedLanguage)
        .then(() => {
          setIsPlaying(true);
          toast.success("Playing audio narration", {
            description: `Narration in ${selectedLanguage}`
          });
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Failed to play audio narration");
        });
    }
  };

  return (
    <div className="min-h-screen bg-heritage-light">
      <div className="relative">
        <img 
          src={site.image} 
          alt={site.title} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
      </div>

      <div className="relative -mt-8 rounded-t-3xl bg-heritage-light pt-6 px-4 min-h-screen">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-heritage-dark">{site.title}</h1>
          <button 
            onClick={handlePlayAudio}
            className={`p-3 rounded-full ${isPlaying ? 'bg-heritage-primary text-white' : 'bg-white'} shadow-sm transition-colors`}
            aria-label={isPlaying ? "Stop audio narration" : "Play audio narration"}
          >
            <Speaker size={20} className={isPlaying ? "text-white" : "text-heritage-primary"} />
          </button>
        </div>
        
        <div className="flex items-center text-gray-600 mb-6">
          <MapPin size={16} className="mr-1" />
          <span>{site.location}</span>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-3 text-heritage-dark">About this site</h2>
          {isLoading ? (
            <div className="animate-pulse h-24 bg-gray-100 rounded"></div>
          ) : (
            <p className="text-gray-700 leading-relaxed">{siteDescription || site.description}</p>
          )}
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm mb-20">
          <h2 className="text-lg font-semibold mb-3 text-heritage-dark">Opening Hours</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Monday - Friday</span>
              <span className="font-medium">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Saturday & Sunday</span>
              <span className="font-medium">10:00 AM - 4:00 PM</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6">
        <FloatingButton 
          icon={<MessageCircle size={24} />} 
          to={`/chat/${id}`}
          ariaLabel="Chat about this site"
        />
      </div>
      
      <div className="fixed bottom-6 left-6">
        <FloatingButton 
          icon={<MapPin size={24} />} 
          to={`/map?site=${encodeURIComponent(site.title)}`}
          className="bg-heritage-dark"
          ariaLabel="View on map"
        />
      </div>
    </div>
  );
};

export default SiteInfo;

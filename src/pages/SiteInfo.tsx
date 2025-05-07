
import { useParams, Link } from "react-router-dom";
import { Speaker, MessageCircle, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { speakText, stopSpeech } from "@/services/api";
import BackButton from "@/components/BackButton";
import FloatingButton from "@/components/FloatingButton";
import { useLanguage } from "@/contexts/LanguageContext";
import TranslationWrapper from "@/components/TranslationWrapper";
import { fetchHeritageSiteDetails, HeritageSite } from "@/services/apiService";

const SiteInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<HeritageSite | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  const labels = {
    aboutSite: "About this site",
    openingHours: "Opening Hours",
    weekdays: "Monday - Friday",
    weekends: "Saturday & Sunday",
    siteNotFound: "Site Not Found",
    returnToHome: "Return to Home"
  };

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    
    fetchHeritageSiteDetails(id)
      .then((response) => {
        if (response.success && response.data) {
          setSite(response.data);
        } else {
          toast.error(response.error || "Failed to load site information");
        }
      })
      .catch(error => {
        console.error("Error fetching site information:", error);
        toast.error("Failed to load site information");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, language]);

  const handlePlayAudio = () => {
    if (!site) return;
    
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
      speakText(site.description, language)
        .then(() => {
          setIsPlaying(true);
          toast.success("Playing audio narration", {
            description: `Narration in ${language}`
          });
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Failed to play audio narration");
        });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-heritage-primary"></div>
      </div>
    );
  }

  if (!site) {
    return (
      <TranslationWrapper
        textContent={labels}
        render={(translatedLabels) => (
          <div className="min-h-screen flex justify-center items-center p-4">
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">{translatedLabels.siteNotFound}</h1>
              <Link to="/home" className="text-heritage-primary underline">
                {translatedLabels.returnToHome}
              </Link>
            </div>
          </div>
        )}
      />
    );
  }

  return (
    <TranslationWrapper
      textContent={labels}
      render={(translatedLabels) => (
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
              <h2 className="text-lg font-semibold mb-3 text-heritage-dark">{translatedLabels.aboutSite}</h2>
              <p className="text-gray-700 leading-relaxed">{site.description}</p>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm mb-20">
              <h2 className="text-lg font-semibold mb-3 text-heritage-dark">{translatedLabels.openingHours}</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{translatedLabels.weekdays}</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{translatedLabels.weekends}</span>
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
      )}
    />
  );
};

export default SiteInfo;

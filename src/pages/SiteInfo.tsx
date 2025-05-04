
import { useParams, Link } from "react-router-dom";
import { Speaker, MessageCircle, MapPin } from "lucide-react";
import { heritageSites } from "@/data/mockData";
import BackButton from "@/components/BackButton";
import FloatingButton from "@/components/FloatingButton";

const SiteInfo = () => {
  const { id } = useParams<{ id: string }>();
  const site = heritageSites.find(site => site.id === id);
  
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
    // In a real app, this would play the audio narration
    console.log("Playing audio for", site.title);
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
          {site.audioAvailable && (
            <button 
              onClick={handlePlayAudio}
              className="p-3 rounded-full bg-white shadow-sm"
              aria-label="Play audio narration"
            >
              <Speaker size={20} className="text-heritage-primary" />
            </button>
          )}
        </div>
        
        <div className="flex items-center text-gray-600 mb-6">
          <MapPin size={16} className="mr-1" />
          <span>{site.location}</span>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-3 text-heritage-dark">About this site</h2>
          <p className="text-gray-700 leading-relaxed">{site.description}</p>
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
          to="/map"
          className="bg-heritage-dark"
          ariaLabel="View on map"
        />
      </div>
    </div>
  );
};

export default SiteInfo;

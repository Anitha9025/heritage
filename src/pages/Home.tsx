
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, MessageCircle, Languages } from "lucide-react";
import { heritageSites } from "@/data/mockData";
import SearchBar from "@/components/SearchBar";
import FloatingButton from "@/components/FloatingButton";
import { toast } from "sonner";

const Home = () => {
  const [location, setLocation] = useState("Chennai");
  const navigate = useNavigate();

  const handleLanguageButtonClick = () => {
    toast.info("Changing language", {
      description: "Redirecting to language selection screen"
    });
    // Navigate to language selection page
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 bg-heritage-primary shadow-md p-4">
        <div className="flex items-center gap-3">
          <SearchBar 
            placeholder={`Exploring ${location}...`} 
            className="flex-1" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button 
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
            onClick={handleLanguageButtonClick}
            aria-label="Change language"
          >
            <Languages size={20} className="text-heritage-primary" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-heritage-dark mb-2">Discover Heritage</h1>
        <p className="text-gray-600 mb-6">Explore historical places around you</p>
        
        <div className="space-y-6">
          <h2 className="font-semibold text-lg text-heritage-dark">Featured Sites</h2>
          
          <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 snap-x">
            {heritageSites.map((site) => (
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
          
          <h2 className="font-semibold text-lg text-heritage-dark mt-8">All Heritage Sites</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heritageSites.map((site) => (
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
        </div>
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
  );
};

export default Home;

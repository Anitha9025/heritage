
import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import BackButton from "@/components/BackButton";
import { getCoordinates } from "@/services/api";
import { toast } from "sonner";

const MapSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    
    // Call our simulated API
    getCoordinates(searchValue)
      .then((coords: any) => {
        setCoordinates(coords);
        toast.success(`Found location for ${searchValue}`, {
          description: `Coordinates: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
        });
      })
      .catch(error => {
        console.error("Error getting coordinates:", error);
        toast.error(`Could not find location for ${searchValue}`);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-[70vh] bg-gray-200">
        {/* This would be a real map in a production app */}
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <div className="text-heritage-dark text-lg font-medium">
            {isSearching ? "Searching for location..." : 
             coordinates ? `Showing: ${searchValue}` : "Interactive Map View"}
          </div>
        </div>
        
        {/* Map Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-bounce">
            <MapPin size={36} className="text-red-500" />
          </div>
        </div>
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <BackButton />
        </div>
        
        {/* Search Bar */}
        <div className="absolute top-4 left-0 right-0 px-16">
          <div className="bg-white rounded-full shadow-lg flex items-center py-2 px-4">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search heritage sites"
              className="flex-1 outline-none text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-t-2xl -mt-6 relative z-10 p-4">
        <form onSubmit={handleSearch}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Find a Heritage Site
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter site name or location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-heritage-primary"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSearching || !searchValue.trim()}
            className={`w-full ${isSearching || !searchValue.trim() ? 'bg-gray-400' : 'bg-heritage-primary hover:bg-blue-600'} text-white font-medium py-3 rounded-lg transition-colors`}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-3">Nearby Sites</h3>
          <div className="space-y-2">
            {["Fort St. George", "Kapaleeshwarar Temple", "Mahabalipuram"].map((site, index) => (
              <div 
                key={index} 
                className="p-3 border border-gray-200 rounded-lg flex items-center cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSearchValue(site);
                  handleSearch(new Event('submit') as any);
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

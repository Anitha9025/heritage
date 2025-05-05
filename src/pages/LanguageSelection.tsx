
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import BackButton from "@/components/BackButton";
import { getSupportedLanguages, saveSelectedLanguage, translateText } from "@/services/api";
import { toast } from "sonner";

interface Language {
  id: string;
  name: string;
}

const LanguageSelection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [welcomeText, setWelcomeText] = useState("Choose your Language");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const supportedLangs = await getSupportedLanguages();
        setLanguages(supportedLangs as Language[]);
      } catch (error) {
        console.error("Error fetching languages:", error);
        toast.error("Failed to load supported languages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = async (language: string) => {
    try {
      saveSelectedLanguage(language);
      
      // Translate the success message to the selected language
      const translatedMessage = await translateText(`Language set to ${language}`, language);
      const translatedDescription = await translateText("The app will now display content in your selected language", language);
      
      toast.success(translatedMessage, {
        description: translatedDescription
      });
      
      navigate("/home");
    } catch (error) {
      console.error("Error selecting language:", error);
      toast.error(`Failed to set language to ${language}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center animate-fade-in"
         style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1466442929976-97f336a657be)' }}>
      
      <div className="p-4">
        <BackButton className="bg-white/20" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-center mb-6 text-heritage-dark">
            {welcomeText}
          </h1>
          
          <SearchBar 
            placeholder="Search language..." 
            className="mb-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-16 rounded-xl bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language) => (
                  <button
                    key={language.id}
                    onClick={() => handleLanguageSelect(language.name)}
                    className="w-full py-4 px-6 text-left rounded-xl bg-white border border-gray-200 hover:border-heritage-primary hover:bg-heritage-light transition-all flex items-center justify-between card-shadow"
                  >
                    <span className="text-lg font-medium">{language.name}</span>
                    <svg className="w-5 h-5 text-heritage-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-500 py-6">
                  No languages found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;

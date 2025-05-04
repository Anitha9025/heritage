
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { languages } from "@/data/mockData";
import SearchBar from "@/components/SearchBar";
import BackButton from "@/components/BackButton";

const LanguageSelection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = () => {
    // In a real app, we would store the selected language
    navigate("/home");
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
            Choose your Language
          </h1>
          
          <SearchBar 
            placeholder="Search language..." 
            className="mb-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="space-y-4">
            {filteredLanguages.map((language) => (
              <button
                key={language.id}
                onClick={handleLanguageSelect}
                className="w-full py-4 px-6 text-left rounded-xl bg-white border border-gray-200 hover:border-heritage-primary hover:bg-heritage-light transition-all flex items-center justify-between card-shadow"
              >
                <span className="text-lg font-medium">{language.name}</span>
                <svg className="w-5 h-5 text-heritage-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;

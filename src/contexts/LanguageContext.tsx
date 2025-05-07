
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSelectedLanguage, translateText } from '@/services/api';
import { toast } from 'sonner';

interface LanguageContextType {
  language: string;
  translate: (text: string) => Promise<string>;
  translateBatch: (texts: Record<string, string>) => Promise<Record<string, string>>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  translate: async (text) => text,
  translateBatch: async (texts) => texts,
  isLoading: true,
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const detectLanguage = () => {
      const selectedLanguage = getSelectedLanguage();
      const currentTimestamp = localStorage.getItem('languageTimestamp') || '';
      
      setLanguage(selectedLanguage);
      setTimestamp(currentTimestamp);
      setIsLoading(false);
      
      console.log(`Language context initialized: ${selectedLanguage}`);
    };

    detectLanguage();
    
    // Check for language changes
    const checkLanguage = setInterval(() => {
      const storedTimestamp = localStorage.getItem('languageTimestamp') || '';
      if (storedTimestamp !== timestamp && timestamp !== '') {
        window.location.reload();
      }
    }, 1000);
    
    return () => clearInterval(checkLanguage);
  }, [timestamp]);

  const translate = async (text: string): Promise<string> => {
    if (language === 'English') return text;
    try {
      const translated = await translateText(text, language);
      return translated as string;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const translateBatch = async (texts: Record<string, string>): Promise<Record<string, string>> => {
    if (language === 'English') return texts;
    
    try {
      const translatedTexts: Record<string, string> = {};
      
      for (const [key, value] of Object.entries(texts)) {
        const translated = await translateText(value, language);
        translatedTexts[key] = translated as string;
      }
      
      return translatedTexts;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, translate, translateBatch, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

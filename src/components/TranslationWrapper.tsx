
import { useEffect, useState, ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslationWrapperProps {
  children: ReactNode;
  textContent: Record<string, string>;
  render: (translatedTexts: Record<string, string>) => ReactNode;
  loadingComponent?: ReactNode;
}

const TranslationWrapper = ({
  children,
  textContent,
  render,
  loadingComponent
}: TranslationWrapperProps) => {
  const { language, translateBatch, isLoading: contextLoading } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<Record<string, string>>(textContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const translateContent = async () => {
      if (contextLoading) return;
      
      setIsLoading(true);
      try {
        const translated = await translateBatch(textContent);
        setTranslatedContent(translated);
      } catch (error) {
        console.error('Error translating content:', error);
        // Fallback to original content
        setTranslatedContent(textContent);
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [language, textContent, translateBatch, contextLoading]);

  if (isLoading || contextLoading) {
    return loadingComponent || <>{children}</>;
  }

  return <>{render(translatedContent)}</>;
};

export default TranslationWrapper;

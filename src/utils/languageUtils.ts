export function getFontClassForLanguage(language: string): string {
  const languageFontMap: Record<string, string> = {
    'Tamil': 'font-tamil',
    'Hindi': 'font-hindi',
    'Bengali': 'font-bengali',
    'Telugu': 'font-telugu',
    'Malayalam': 'font-malayalam',
    'Kannada': 'font-kannada'
  };

  return languageFontMap[language] || '';
}

export function getLanguageCode(language: string): string {
  const languageCodeMap: Record<string, string> = {
    'English': 'en',
    'Tamil': 'ta',
    'Hindi': 'hi',
    'Bengali': 'bn',
    'Telugu': 'te',
    'Malayalam': 'ml',
    'Kannada': 'kn'
  };

  return languageCodeMap[language] || 'en';
} 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('languagePreference') || null;
  });

  useEffect(() => {
    if (language) {
      localStorage.setItem('languagePreference', language);
      document.documentElement.lang = language;
      if (language === 'zh') {
        document.documentElement.classList.add('lang-zh');
      } else {
        document.documentElement.classList.remove('lang-zh');
      }
    }
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (key) => {
    // Return original key if no language selected yet, or fallback to english, then key
    if (!language) return key.split('.').pop(); // Simple fallback
    
    const keys = key.split('.');
    let current = translations[language];
    
    for (let k of keys) {
      if (current === undefined || current === null) return key;
      current = current[k];
    }
    
    if (current === undefined || current === null) {
      // Fallback to english
      let fallback = translations['en'];
      for (let k of keys) {
        if (fallback === undefined || fallback === null) return key;
        fallback = fallback[k];
      }
      return fallback !== undefined ? fallback : key;
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

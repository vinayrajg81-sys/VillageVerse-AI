// VillageVerse AI: Bilingual Language Context (English & Kannada / ಕನ್ನಡ)
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav & Common
    app_title: 'VillageVerse AI',
    app_subtitle: 'Digital Twin for Intelligent Village Development',
    panchayat_tag: 'Shivalli Gram Panchayat, Mandya, Karnataka',
    government_karnataka: 'Government of Karnataka | Digital Gram Swaraj',
    national_motto: 'Satyameva Jayate',
    search_placeholder: 'Search village assets, farmlands, water tanks, complaints...',
    switch_role: 'Switch Role',
    notifications: 'Notifications',
    profile: 'Profile',
    language: 'Language',
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    view_details: 'View Details',
    status: 'Status',
    health_score: 'Health Score',
    quick_actions: 'Quick Actions',
    ai_recommendation: 'AI Recommendation',

    // 20 Modules
    m_dashboard: 'Dashboard',
    m_digital_twin: 'Digital Twin',
    m_agriculture: 'Agriculture',
    m_water: 'Water Resources',
    m_roads: 'Roads & Works',
    m_electricity: 'Electricity & Solar',
    m_healthcare: 'Healthcare',
    m_education: 'Education',
    m_waste: 'Waste Management',
    m_environment: 'Environment & Climate',
    m_disaster: 'Disaster Prediction',
    m_future_prediction: 'AI Future Prediction',
    m_development_planner: 'AI Development Planner',
    m_simulation: 'What-if Simulation',
    m_complaints: 'Complaint Management',
    m_sustainability: 'Sustainability Dashboard',
    m_chatbot: 'AI Village Chatbot',
    m_reports: 'Reports & Analytics',
    m_user_management: 'User Management',
    m_settings: 'Settings'
  },
  kn: {
    // Nav & Common
    app_title: 'ವಿಲೇಜ್‌ವರ್ಸ್ ಎಐ',
    app_subtitle: 'ಸ್ಮಾರ್ಟ್ ಗ್ರಾಮ ಅಭಿವೃದ್ಧಿಗಾಗಿ ಎಐ ಡಿಜಿಟಲ್ ಟ್ವಿನ್',
    panchayat_tag: 'ಶಿವಳ್ಳಿ ಗ್ರಾಮ ಪಂಚಾಯಿತಿ, ಮಂಡ್ಯ ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ',
    government_karnataka: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ | ಡಿಜಿಟಲ್ ಗ್ರಾಮ ಸ್ವರಾಜ್',
    national_motto: 'ಸತ್ಯಮೇವ ಜಯತೇ',
    search_placeholder: 'ಆಸ್ತಿಗಳು, ಬೆಳೆಗಳು, ನೀರಿನ ಟ್ಯಾಂಕ್‌ಗಳು, ದೂರುಗಳನ್ನು ಹುಡುಕಿ...',
    switch_role: 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    language: 'ಭಾಷೆ',
    dark_mode: 'ಡಾರ್ಕ್ ಮೋಡ್',
    light_mode: 'ಲೈಟ್ ಮೋಡ್',
    view_details: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    status: 'ಸ್ಥಿತಿ',
    health_score: 'ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ',
    quick_actions: 'ತ್ವರಿತ ಕ್ರಮಗಳು',
    ai_recommendation: 'ಎಐ ಸಲಹೆ',

    // 20 Modules
    m_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    m_digital_twin: 'ಡಿಜಿಟಲ್ ಟ್ವಿನ್ (3D)',
    m_agriculture: 'ಕೃಷಿ ಮತ್ತು ಬೆಳೆಗಳು',
    m_water: 'ಜಲ ಸಂಪನ್ಮೂಲ',
    m_roads: 'ರಸ್ತೆಗಳು ಮತ್ತು ಮೂಲಸೌಕರ್ಯ',
    m_electricity: 'ವಿದ್ಯುತ್ ಮತ್ತು ಸೌರಶಕ್ತಿ',
    m_healthcare: 'ಆರೋಗ್ಯ ಸೇವೆ',
    m_education: 'ಶಿಕ್ಷಣ ಮತ್ತು ಅಂಗನವಾಡಿ',
    m_waste: 'ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ',
    m_environment: 'ಪರಿಸರ ಮತ್ತು ವಾಯು ಗುಣಮಟ್ಟ',
    m_disaster: 'ವಿಪತ್ತು ಮುನ್ಸೂಚನೆ',
    m_future_prediction: 'ಎಐ ಭವಿಷ್ಯ ಮುನ್ಸೂಚನೆ',
    m_development_planner: 'ಗ್ರಾಮ ಅಭಿವೃದ್ಧಿ ಯೋಜನೆ',
    m_simulation: 'ವಾಟ್-ಇಫ್ ಸಿಮ್ಯುಲೇಶನ್',
    m_complaints: 'ದೂರು ನಿವಾರಣಾ ವ್ಯವಸ್ಥೆ',
    m_sustainability: 'ಸುಸ್ಥಿರತೆ ಮತ್ತು SDG',
    m_chatbot: 'ಎಐ ಗ್ರಾಮ ಸಹಾಯಕ',
    m_reports: 'ವರದಿಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಣೆ',
    m_user_management: 'ಬಳಕೆದಾರರ ನಿರ್ವಹಣೆ',
    m_settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('villageverse_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('villageverse_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'kn' : 'en';
    setLanguage(next);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

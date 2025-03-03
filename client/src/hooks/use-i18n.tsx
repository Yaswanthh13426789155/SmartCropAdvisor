import { createContext, useContext, useState, ReactNode } from "react";

const translations = {
  welcome: {
    en: "Welcome to KisanAI",
    hi: "किसान एआई में आपका स्वागत है",
  },
  login: {
    en: "Login",
    hi: "लॉग इन करें",
  },
  register: {
    en: "Register",
    hi: "पंजीकरण करें",
  },
  welcomeUser: {
    en: "Welcome back,",
    hi: "वापसी पर स्वागत है,",
  },
  username: {
    en: "Username",
    hi: "उपयोगकर्ता नाम",
  },
  password: {
    en: "Password",
    hi: "पासवर्ड",
  },
  fullName: {
    en: "Full Name",
    hi: "पूरा नाम",
  },
  location: {
    en: "Location",
    hi: "स्थान",
  },
  landSize: {
    en: "Land Size (acres)",
    hi: "जमीन का आकार (एकड़)",
  },
  currentWeather: {
    en: "Current Weather",
    hi: "मौजूदा मौसम",
  },
  temperature: {
    en: "Temperature",
    hi: "तापमान",
  },
  humidity: {
    en: "Humidity",
    hi: "नमी",
  },
  rainfall: {
    en: "Rainfall",
    hi: "वर्षा",
  },
  cropRecommendations: {
    en: "Crop Recommendations",
    hi: "फसल की सिफारिशें",
  },
  refresh: {
    en: "Refresh",
    hi: "रीफ्रेश",
  },
  confidence: {
    en: "confidence",
    hi: "विश्वास",
  },
  appDescription: {
    en: "AI-Powered Agricultural Advisory System",
    hi: "एआई-संचालित कृषि सलाहकार प्रणाली",
  },
  appBenefits: {
    en: "Get personalized crop recommendations based on your location, weather conditions, and land characteristics.",
    hi: "अपने स्थान, मौसम की स्थिति और भूमि की विशेषताओं के आधार पर व्यक्तिगत फसल सिफारिशें प्राप्त करें।",
  },
} as const;

type TranslationKey = keyof typeof translations;
type Language = "en" | "hi";

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: TranslationKey) => {
    return translations[key][language];
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
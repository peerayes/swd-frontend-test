import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import JSON files directly
import enCommon from "@/locales/en/common.json";
import enHome from "@/locales/en/home.json";
import enDesignSystem from "@/locales/en/design-system.json";
import enNav from "@/locales/en/nav.json";
import thCommon from "@/locales/th/common.json";
import thHome from "@/locales/th/home.json";
import thDesignSystem from "@/locales/th/design-system.json";
import thNav from "@/locales/th/nav.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      home: enHome,
      "design-system": enDesignSystem,
      nav: enNav,
    },
    th: {
      common: thCommon,
      home: thHome,
      "design-system": thDesignSystem,
      nav: thNav,
    },
  },
  lng: "en", // Always start with English to avoid hydration mismatch
  fallbackLng: "en",
  debug: process.env.NODE_ENV === "development",
  defaultNS: "common",
  fallbackNS: ["common", "home"],

  interpolation: {
    escapeValue: false, // React already escapes
  },

  react: {
    useSuspense: false, // Disable suspense mode
  },
});

export default i18n;

// Export helper functions
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  if (typeof window !== "undefined") {
    localStorage.setItem("language", lng);
  }
};

// Initialize language on client side only
export const initializeLanguage = () => {
  if (typeof window !== "undefined") {
    const savedLanguage = localStorage.getItem("language");
    const browserLanguage = navigator.language;
    const detectedLanguage =
      savedLanguage && ["en", "th"].includes(savedLanguage)
        ? savedLanguage
        : browserLanguage.startsWith("th")
          ? "th"
          : "en";

    if (detectedLanguage !== "en") {
      i18n.changeLanguage(detectedLanguage);
    }
  }
};

export const getCurrentLanguage = () => i18n.language;
export const availableLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
] as const;

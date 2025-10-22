import { useTranslation as useReactTranslation } from "react-i18next";

export const useTranslation = (namespace?: string) => {
  const { t, i18n } = useReactTranslation(namespace);

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    isThai: i18n.language === "th",
    isEnglish: i18n.language === "en",
    changeLanguage: (lng: string) => {
      i18n.changeLanguage(lng);
      if (typeof window !== "undefined") {
        localStorage.setItem("language", lng);
      }
    },
  };
};

export default useTranslation;

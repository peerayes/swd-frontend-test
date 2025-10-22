"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { initializeLanguage } from "@/lib/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    initializeLanguage();
  }, []);

  // Avoid hydration mismatch - render with default language on server
  if (!isClient) {
    return (
      <I18nextProvider i18n={i18n} defaultNS="common">
        {children}
      </I18nextProvider>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

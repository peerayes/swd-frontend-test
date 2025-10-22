"use client";

import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { availableLanguages, changeLanguage } from "@/lib/i18n/index";
import { useEffect, useState } from "react";

const { Option } = Select;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Select defaultValue="en" style={{ width: 120 }} size="middle" disabled>
        <Option value="en">
          <span style={{ marginRight: 8 }}>🇺🇸</span>
          English
        </Option>
      </Select>
    );
  }

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      style={{ width: 120 }}
      size="middle"
    >
      {availableLanguages.map((lang) => (
        <Option key={lang.code} value={lang.code}>
          <span style={{ marginRight: 8 }}>{lang.flag}</span>
          {lang.name}
        </Option>
      ))}
    </Select>
  );
}

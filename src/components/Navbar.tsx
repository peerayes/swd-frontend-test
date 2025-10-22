"use client";

import { Layout, Space, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo/Brand */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          color: pathname === "/" ? "#E53E3E" : "#E53E3E",
          textDecoration: "none",
        }}
      >
        <Text strong style={{ fontSize: "18px", color: "inherit" }}>
          SWD
        </Text>
      </Link>

      {/* Navigation Links */}
      <Space size="large" style={{ flex: 1, justifyContent: "center" }}>
        <Link
          href="/move-shape"
          style={{
            color: pathname === "/move-shape" ? "#E53E3E" : "#666",
            textDecoration: "none",
            fontSize: "16px",
            padding: "8px 16px",
            borderRadius: "6px",
            transition: "all 0.3s ease",
            backgroundColor:
              pathname === "/move-shape" ? "#fff5f5" : "transparent",
          }}
          className="nav-link"
        >
          Move Shape
        </Link>
        <Link
          href="/person-management"
          style={{
            color: pathname === "/person-management" ? "#E53E3E" : "#666",
            textDecoration: "none",
            fontSize: "16px",
            padding: "8px 16px",
            borderRadius: "6px",
            transition: "all 0.3s ease",
            backgroundColor:
              pathname === "/person-management" ? "#fff5f5" : "transparent",
          }}
          className="nav-link"
        >
          {t("common:personManagement")}
        </Link>
      </Space>

      {/* Language Switcher */}
      <LanguageSwitcher />
    </Header>
  );

  // Add hover effect for navigation links
  if (typeof window !== "undefined") {
    const style = document.createElement("style");
    style.textContent = `
      .nav-link:hover {
        color: #E53E3E !important;
        background-color: #fff5f5 !important;
      }
      .nav-link.active {
        color: #E53E3E !important;
        background-color: #fff5f5 !important;
      }
    `;
    document.head.appendChild(style);
  }
}

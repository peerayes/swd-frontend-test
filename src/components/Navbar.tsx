"use client";

import { Layout, Space, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Divide } from "lucide-react";

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <div className="w-full bg-white shadow-xl">
      <nav className="max-w-7xl mx-auto">
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            backgroundColor: "#fff",
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
          <Space
            size="large"
            style={{ flex: 1, justifyContent: "center" }}
            className="hidden md:flex"
          >
            <Link
              href="/move-shape"
              className={`
                transition-all duration-300 ease
                px-4 py-2 rounded-lg
                text-base
                ${
                  pathname === "/move-shape"
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }
              `}
            >
              {t("common:moveShape")}
            </Link>
            <Link
              href="/person-management"
              className={`
                transition-all duration-300 ease
                px-4 py-2 rounded-lg
                text-base
                ${
                  pathname === "/person-management"
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }
              `}
            >
              {t("common:personManagement")}
            </Link>
          </Space>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </Header>
      </nav>
    </div>
  );
}

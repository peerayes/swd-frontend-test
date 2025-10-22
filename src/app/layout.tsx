import AntdProvider from "@/components/AntdProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Debt Management App",
  description: "Chayo Official Debt Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <I18nProvider>
          <AntdProvider>
            <Navbar />
            {children}
          </AntdProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

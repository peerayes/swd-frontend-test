import AntdProvider from "@/components/AntdProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { Toaster } from "@/components/ui/toaster";
import { App } from "antd";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

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
      <body className={`${geist.variable} ${geistMono.variable} font-sans`}>
        <ReduxProvider>
          <I18nProvider>
            <AntdProvider>
              <App>
                <Navbar />
                {children}
                <Toaster />
              </App>
            </AntdProvider>
          </I18nProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

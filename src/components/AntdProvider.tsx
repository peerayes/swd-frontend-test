"use client";

import { ConfigProvider } from "antd";
import thTH from "antd/locale/th_TH";
import React from "react";

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        token: {
          colorPrimary: "#E53E3E",
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

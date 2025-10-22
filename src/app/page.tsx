"use client";

import { Button, Typography, Card, Space } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 py-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <Title level={1} className="mb-6" style={{ color: "#E53E3E" }}>
            {t("home:title")}
          </Title>

          <Title
            level={3}
            className="mb-8"
            style={{ color: "#666", fontWeight: 400 }}
          >
            {t("home:subtitle")}
          </Title>

          <Paragraph
            className="text-lg mb-10"
            style={{ color: "#888", maxWidth: "600px", margin: "0 auto 40px" }}
          >
            {t("home:description")}
          </Paragraph>

          <Space size="large">
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#E53E3E", borderColor: "#E53E3E" }}
            >
              {t("home:getStarted")}
            </Button>
            <Button size="large">{t("home:learnMore")}</Button>
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <Title level={2} className="text-center mb-12">
            Features
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverable style={{ textAlign: "center", height: "200px" }}>
              <Title level={4} style={{ color: "#E53E3E" }}>
                Move Shape
              </Title>
              <Paragraph>Interactive shape movement with controls</Paragraph>
            </Card>

            <Card hoverable style={{ textAlign: "center", height: "200px" }}>
              <Title level={4} style={{ color: "#E53E3E" }}>
                Person Management
              </Title>
              <Paragraph>Complete CRUD operations with local storage</Paragraph>
            </Card>

            <Card hoverable style={{ textAlign: "center", height: "200px" }}>
              <Title level={4} style={{ color: "#E53E3E" }}>
                Multi-language
              </Title>
              <Paragraph>Support for English and Thai languages</Paragraph>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

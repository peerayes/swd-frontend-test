"use client";

import { Button, Typography, Card, Space, Row, Col, Tag, Spin } from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize page with loading to prevent UI flash
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 py-20">
        <div className="max-w-6xl mx-auto px-8 text-center font-sans">
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
              className="font-sans"
              style={{ backgroundColor: "#E53E3E", borderColor: "#E53E3E" }}
            >
              {t("home:getStarted")}
            </Button>
            <Button size="large" className="font-sans">
              {t("home:learnMore")}
            </Button>
          </Space>
        </div>
      </div>

      {/* Font Test Section */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Title
            level={2}
            className="mb-6 font-mono"
            style={{ color: "#E53E3E" }}
          >
            {t("home:fontTestSection.title")}
          </Title>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card
                hoverable
                size="small"
                title={
                  <span className="text-gray-700">
                    <Text strong>{t("home:fontTestSection.defaultFont")}</Text>
                  </span>
                }
                style={{ height: "140px" }}
              >
                <div>
                  <Text className="font-sans" style={{ color: "#666" }}>
                    This text should use Geist font - สวัสดี ภาษาไทย Hello World
                    1234567890
                  </Text>
                  <div className="mt-2">
                    <Tag color="green">font-sans</Tag>
                    <Text type="secondary" className="text-xs">
                      {t("home:fontTestSection.classUsed")}{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        font-sans
                      </code>{" "}
                      {t("home:fontTestSection.mainFont")}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                hoverable
                size="small"
                title={
                  <span className="text-gray-700">
                    <Text strong>
                      {t("home:fontTestSection.monospaceFont")}
                    </Text>
                  </span>
                }
                style={{ height: "140px" }}
              >
                <div>
                  <Text className="font-mono" style={{ color: "#666" }}>
                    This text should use Geist Mono font - สวัสดี ภาษาไทย Hello
                    World 1234567890
                  </Text>
                  <div className="mt-2">
                    <Tag color="blue">font-mono</Tag>
                    <Text type="secondary" className="text-xs">
                      {t("home:fontTestSection.classUsed")}{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        font-mono
                      </code>{" "}
                      {t("home:fontTestSection.codeFont")}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                hoverable
                size="small"
                title={
                  <span className="text-gray-700">
                    <Text strong>{t("home:fontTestSection.systemFont")}</Text>
                  </span>
                }
                style={{ height: "140px" }}
              >
                <div>
                  <Text style={{ color: "#666" }}>
                    This text uses system font if custom fonts fail to load -
                    สวัสดี ภาษาไทย Hello World 1234567890
                  </Text>
                  <div className="mt-2">
                    <Tag color="default">system-ui</Tag>
                    <Text type="secondary" className="text-xs">
                      {t("home:fontTestSection.classUsed")}{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        font-sans
                      </code>{" "}
                      {t("home:fontTestSection.fallbackFont")}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <div className="mt-6 text-center">
            <Space>
              <Tag color="green">Geist Sans</Tag>
              <Tag color="blue">Geist Mono</Tag>
              <Tag color="default">System Fallback</Tag>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Alert, Button, Card, Checkbox, Input, Tag } from "antd";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

export default function DesignSystem() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">
          {t("designSystem.title")}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl">
          {t("designSystem.subtitle")}
        </p>
        <p className="text-gray-500 text-center mb-12 max-w-2xl">
          {t("designSystem.description")}
        </p>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {t("designSystem.components")}
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Primary - Active</p>
                <Button type="primary" size="large" className="w-full">
                  ถัดไป
                </Button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Primary - Disabled</p>
                <Button type="primary" size="large" disabled className="w-full">
                  ลงทะเบียน
                </Button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Default - Active</p>
                <Button size="large" className="w-full">
                  ย้อนกลับ
                </Button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Default - Disabled</p>
                <Button size="large" disabled className="w-full">
                  ย้อนกลับ
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Outline Style</p>
                <Button
                  size="large"
                  className="w-full border-red-500 text-red-500 hover:bg-red-50"
                >
                  รายละเอียดบัญชี
                </Button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Small Button</p>
                <Button type="primary" size="small">
                  ชำระเงิน
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Fields Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibent mb-6 text-gray-800">
            Input Fields
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Interactive Input</p>
                <Input
                  placeholder="กรอกหมายเลขบัตรประจำตัวประชาชน"
                  size="large"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Value: {inputValue}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Filled State</p>
                <Input value="1-1234-12345-67-8" size="large" readOnly />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Error State</p>
                <Input
                  status="error"
                  placeholder="กรอกเบอร์โทรศัพท์"
                  size="large"
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                />
                <p className="text-red-500 text-xs mt-1">
                  กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Focus State</p>
                <Input placeholder="เบอร์โทรศัพท์" size="large" />
              </div>
            </div>
          </div>
        </section>

        {/* OTP Input */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            OTP Input
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-center gap-3">
              {[1, 2, 4, 3, 4, 1].map((digit, index) => (
                <Input
                  key={index}
                  value={digit}
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-bold"
                  readOnly
                />
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm mt-4">
              รหัสค้างอยู่: 3578
            </p>
          </div>
        </section>

        {/* Checkboxes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Checkboxes
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                >
                  ยอมรับเงื่อนไขการใช้งาน (Interactive)
                </Checkbox>
                <span className="text-xs text-gray-500">
                  Status: {isChecked ? "Checked" : "Unchecked"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox>ยอมรับเงื่อนไขการใช้งาน</Checkbox>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox disabled>ยอมรับเงื่อนไขการใช้งาน (Disabled)</Checkbox>
              </div>
            </div>
          </div>
        </section>

        {/* Status Tags */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Status Tags
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-3">
              <Tag
                color="#FFF3CD"
                style={{ color: "#856404", border: "1px solid #FFEAA7" }}
              >
                รอชำระ
              </Tag>
              <Tag
                color="#D4F6D4"
                style={{ color: "#0F5132", border: "1px solid #C3E6CB" }}
              >
                ชำระสำเร็จ
              </Tag>
              <Tag
                color="#F8F9FA"
                style={{ color: "#495057", border: "1px solid #DEE2E6" }}
              >
                ปิดยอดหนี้สำเร็จ
              </Tag>
              <Tag
                color="#E7F3FF"
                style={{ color: "#0969DA", border: "1px solid #B6E5FF" }}
              >
                อนุมัติปรับโครงสร้างหนี้
              </Tag>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cards</h2>
          <div className="space-y-4">
            <Card className="border-red-100 bg-red-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">
                    เลขที่สัญญา : 0155091602611
                  </p>
                  <p className="text-sm text-gray-600">ธนาคาร : ไทยพาณิชย์</p>
                </div>
                <span className="text-gray-400">▼</span>
              </div>
            </Card>

            <Card className="border-green-100 bg-green-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">
                    เลขที่สัญญา : 0155091602612
                  </p>
                  <p className="text-sm text-gray-600">ธนาคาร : กสิกรไทย</p>
                </div>
                <Tag color="#D4F6D4" style={{ color: "#0F5132" }}>
                  ชำระสำเร็จ
                </Tag>
              </div>
            </Card>
          </div>
        </section>

        {/* Alerts */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Alerts & Notifications
          </h2>
          <div className="space-y-4">
            <Alert message="รหัส OTP ไม่ถูกต้อง" type="error" showIcon />
            <Alert message="กรอกรหัสช้าเกิน 5 นาที" type="warning" showIcon />
            <Alert
              message="ลงทะเบียนเชื่อมต่อสมาชิกสำเร็จ"
              type="success"
              showIcon
            />
            <Alert message="ไม่พบข้อมูลในระบบ" type="info" showIcon />
          </div>
        </section>
      </div>
    </div>
  );
}

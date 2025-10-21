'use client';

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentPerson, resetForm } from "@/store/personSlice";
import { PersonFormData } from "@/types/person";
import { th } from "@/locales/th";
import { en } from "@/locales/en";
import { store } from "@/store/store";

// Import Ant Design locales
import enUS from 'antd/locale/en_US';
import thTH from 'antd/locale/th_TH';

// Direct imports for Ant Design components
import {
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Button,
  Row,
  Col,
  InputNumber,
  message,
  ConfigProvider,
} from "antd";

const { Option } = Select;

interface PersonFormProps {
  onSubmit?: (data: PersonFormData) => void;
  editingId?: string;
}

const PersonForm: React.FC<PersonFormProps> = ({ onSubmit, editingId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { currentPerson, language } = useSelector(
    (state: RootState) => state.person,
  );
  const [mounted, setMounted] = useState(false);

  const t = language === "th" ? th : en;
  const antdLocale = language === "th" ? thTH : enUS;

  // Memoize options
  const titleOptions = [
    { value: "นาย", label: t.titles.mr },
    { value: "นาง", label: t.titles.mrs },
    { value: "นางสาว", label: t.titles.miss },
  ];

  const nationalityOptions = Object.entries(t.nationalities).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const countryCodeOptions = Object.entries(t.countryCodes).map(([key, value]) => ({
    value: key,
    label: (
      <span>
        <span style={{ marginRight: 8 }}>{value.flag}</span>
        {value.name} ({value.code})
      </span>
    ),
  }));



  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (editingId) {
        // Load person data for editing
        form.setFieldsValue(currentPerson);
      } else {
        form.resetFields();
      }
    }
  }, [editingId, currentPerson, form, mounted]);



  const handleSubmit = (values: PersonFormData) => {
    // Combine citizen ID parts
    const citizenId = `${values.citizenId1}-${values.citizenId2}-${values.citizenId3}-${values.citizenId4}-${values.citizenId5}`;
    const formData: PersonFormData = {
      ...values,
      citizenId,
    };

    if (onSubmit) {
      onSubmit(formData);
    }

    form.resetFields();
    dispatch(resetForm());
    message.success(t.personAdded);
  };

  const handleReset = () => {
    form.resetFields();
    dispatch(resetForm());
  };



  if (!mounted) {
    return (
      <div className="form-container">
        <div style={{ fontSize: '16px' }}>Loading form...</div>
      </div>
    );
  }

  return (
    <ConfigProvider
      locale={antdLocale}
      getPopupContainer={(triggerNode) => triggerNode?.parentElement || document.body}
    >
      <div className="form-container">
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>{t.formAndTable}</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={currentPerson}
        >
          {/* Row 1: Title, First Name, Last Name */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label={t.title}
                name="title"
                rules={[{ required: true, message: "Please select title!" }]}
              >
                <Select
                  id="title"
                  placeholder={t.selectTitle}
                >
                  {titleOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                label={t.firstName}
                name="firstName"
                rules={[{ required: true, message: "Please enter first name!" }]}
              >
                <Input
                  id="firstName"
                  placeholder={t.enterFirstName}
                />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                label={t.lastName}
                name="lastName"
                rules={[{ required: true, message: "Please enter last name!" }]}
              >
                <Input
                  id="lastName"
                  placeholder={t.enterLastName}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2: Birthdate, Nationality */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t.birthdate}
                name="birthDate"
              >
                <ConfigProvider locale={antdLocale}>
                  <DatePicker
                    id="birthDate"
                    defaultValue={dayjs('2015-01-01', 'YYYY-MM-DD')}
                  />
                </ConfigProvider>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t.nationality}
                name="nationality"
                rules={[
                  { required: true, message: "Please select nationality!" },
                ]}
              >
                <Select
                  id="nationality"
                  placeholder={t.selectNationality}
                >
                  {nationalityOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3: Citizen ID */}
          <Row gutter={8}>
            <Col span={4}>
              <Form.Item
                label={t.citizenId}
                name="citizenId1"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  id="citizenId1"
                  maxLength={1}
                  placeholder="X"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="citizenId2"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  id="citizenId2"
                  maxLength={4}
                  placeholder="XXXX"
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="citizenId3"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  id="citizenId3"
                  maxLength={5}
                  placeholder="XXXXX"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="citizenId4"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  id="citizenId4"
                  maxLength={2}
                  placeholder="XX"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="citizenId5"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  id="citizenId5"
                  maxLength={1}
                  placeholder="X"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 4: Gender */}
          <Row>
            <Col span={24}>
              <Form.Item
                label={<span id="gender-label">{t.gender}</span>}
                name="gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Radio.Group aria-labelledby="gender-label">
                  <Radio value="male">{t.male}</Radio>
                  <Radio value="female">{t.female}</Radio>
                  <Radio value="unsex">{t.unsex}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 5: Mobile Phone */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={t.countryCode}
                name="countryCode"
                rules={[
                  { required: true, message: "Please select country code!" },
                ]}
              >
                <Select
                  id="countryCode"
                  placeholder={t.enterCountryCode}
                >
                  {countryCodeOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label={t.mobilePhone}
                name="mobilePhone"
                rules={[
                  { required: true, message: "Please enter mobile phone!" },
                ]}
              >
                <Input
                  id="mobilePhone"
                  placeholder={t.enterMobilePhone}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 6: Passport No */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t.passportNo} name="passportNo">
                <Input
                  id="passportNo"
                  placeholder={t.enterPassportNo}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 7: Expected Salary */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t.expectedSalary}
                name="expectedSalary"
                rules={[
                  { required: true, message: "Please enter expected salary!" },
                ]}
              >
                <InputNumber
                  id="expectedSalary"
                  style={{ width: "1 0 0%" }}
                  placeholder={t.enterExpectedSalary}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 8: Buttons */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 8 }}
                >
                  {t.submit}
                </Button>
                <Button onClick={handleReset}>{t.reset}</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default React.memo(PersonForm);

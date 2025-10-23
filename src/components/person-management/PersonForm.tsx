"use client";

import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Row,
  Col,
  Select,
  DatePicker,
  Radio,
  InputNumber,
  Spin,
} from "antd";
import { useEffect, useMemo, useState, useRef } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import type {
  Person,
  RegistrationFormValues,
  FormSubmitHandler,
  TitleOption,
} from "@/types/person.types";
import { createValidationRules } from "@/types/person.types";
import {
  countryCodeOptions,
  nationalityOptions,
} from "@/constants/countryOptions";
import { renderSelectOptions } from "@/components/shared/SelectOption";
import { setEditingPerson } from "@/store/personSlice";
import { useAppSelector } from "@/store/store";

interface PersonFormProps {
  onSubmit: FormSubmitHandler;
  onReset: () => void;
  onCancelEdit: () => void;
  onAfterSubmit?: () => void; // Callback to trigger table refresh
}

const PersonForm = ({ onSubmit, onReset, onCancelEdit, onAfterSubmit }: PersonFormProps) => {
  const { t } = useTranslation(["person-management", "common"]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux state
  const editingPerson = useAppSelector((state) => state.persons.editingPerson);

  // Dynamic validation rules with i18n - recreate on language change
  const validationRules = useMemo(() => createValidationRules(t), [t]);

  // Initialize component on mount - Show initial loading to prevent UI flash
  useEffect(() => {
    const initializeComponent = async () => {
      // Small delay to prevent flash of content
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsLoading(false);
    };

    initializeComponent();
  }, []);

  // Set form values when editingPerson changes
  useEffect(() => {
    if (editingPerson) {
      form.setFieldsValue({
        title: editingPerson.title,
        firstname: editingPerson.firstname,
        lastname: editingPerson.lastname,
        birthday: editingPerson.birthday ? dayjs(editingPerson.birthday) : null,
        nationality: editingPerson.nationality,
        citizenId1: editingPerson.citizenId1,
        citizenId2: editingPerson.citizenId2,
        citizenId3: editingPerson.citizenId3,
        citizenId4: editingPerson.citizenId4,
        citizenId5: editingPerson.citizenId5,
        gender: editingPerson.gender,
        countryCode: editingPerson.countryCode,
        mobilePhone: editingPerson.mobilePhone,
        passportNo: editingPerson.passportNo,
        expectedSalary: editingPerson.expectedSalary,
      });
    }
  }, [editingPerson, form]);

  // Handle form submission with loading
  const handleSubmit: FormSubmitHandler = async (
    values: RegistrationFormValues,
  ) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      // Reset form after successful submission
      form.resetFields();
      dispatch(setEditingPerson(null));

      // Trigger table refresh after successful submit
      if (onAfterSubmit) {
        onAfterSubmit();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormReset = () => {
    onReset();
  };

  const handleCancelEdit = () => {
    dispatch(setEditingPerson(null));
    form.resetFields();
    onCancelEdit();
  };

  if (isLoading) {
    return (
      <Card>
        <div
          className="flex flex-col justify-center items-center"
          style={{ height: "400px" }}
        >
          <Spin size="large" />
          <div className="mt-4 text-gray-600">กำลังโหลดฟอร์ม...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="mb-8">
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          margin: "0 0 24px 0",
        }}
      >
        {editingPerson ? `แก้ไขข้อมูล: ${editingPerson.name}` : t("form.title")}
      </h1>
      <Card
        style={{
          border: editingPerson ? "2px solid #ff4d4f" : "1px solid #d9d9d9",
        }}
      >
        <Form<RegistrationFormValues>
          id="register"
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onReset={handleFormReset}
          initialValues={{
            expectedSalary: 0,
          }}
        >
          {/* Row 1: Title, Firstname, Lastname, Gender */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={4}>
              <Form.Item<RegistrationFormValues>
                name="title"
                label={t("form.fields.title.label")}
                rules={validationRules.title}
              >
                <Select<TitleOption["value"]>
                  placeholder={t(
                    "person-management:form.fields.title.placeholder",
                  )}
                >
                  <Select.Option value="นาย">
                    {t("form.fields.title.options.นาย")}
                  </Select.Option>
                  <Select.Option value="นาง">
                    {t("form.fields.title.options.นาง")}
                  </Select.Option>
                  <Select.Option value="นางสาว">
                    {t("form.fields.title.options.นางสาว")}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={5}>
              <Form.Item<RegistrationFormValues>
                name="firstname"
                label={t("form.fields.firstname.label")}
                rules={validationRules.firstname}
              >
                <Input placeholder={t("form.fields.firstname.placeholder")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={5}>
              <Form.Item<RegistrationFormValues>
                name="lastname"
                label={t("form.fields.lastname.label")}
                rules={validationRules.lastname}
              >
                <Input placeholder={t("form.fields.lastname.placeholder")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item<RegistrationFormValues>
                name="gender"
                label={t("form.fields.gender.label")}
                rules={validationRules.gender}
              >
                <Radio.Group>
                  <Radio value="male">
                    {t("form.fields.gender.options.male")}
                  </Radio>
                  <Radio value="female">
                    {t("form.fields.gender.options.female")}
                  </Radio>
                  <Radio value="unsex">
                    {t("form.fields.gender.options.unsex")}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2: Birthday, Nationality, Citizen ID */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8}>
              <Form.Item<RegistrationFormValues>
                name="birthday"
                label={t("form.fields.birthday.label")}
                rules={validationRules.birthday}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder={t("form.fields.birthday.placeholder")}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item<RegistrationFormValues>
                name="nationality"
                label={t("form.fields.nationality.label")}
                rules={validationRules.nationality}
              >
                <Select placeholder={t("form.fields.nationality.placeholder")}>
                  {renderSelectOptions(nationalityOptions, false, t)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item label={t("form.fields.citizenId.label")} required>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Form.Item<RegistrationFormValues>
                    name="citizenId1"
                    noStyle
                    rules={validationRules.citizenId1}
                  >
                    <Input
                      style={{ width: "40px", textAlign: "center" }}
                      maxLength={1}
                    />
                  </Form.Item>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    -
                  </span>
                  <Form.Item<RegistrationFormValues> name="citizenId2" noStyle>
                    <Input
                      style={{ width: "80px", textAlign: "center" }}
                      maxLength={4}
                    />
                  </Form.Item>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    -
                  </span>
                  <Form.Item<RegistrationFormValues> name="citizenId3" noStyle>
                    <Input
                      style={{ width: "100px", textAlign: "center" }}
                      maxLength={5}
                    />
                  </Form.Item>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    -
                  </span>
                  <Form.Item<RegistrationFormValues> name="citizenId4" noStyle>
                    <Input
                      style={{ width: "50px", textAlign: "center" }}
                      maxLength={2}
                    />
                  </Form.Item>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    -
                  </span>
                  <Form.Item<RegistrationFormValues> name="citizenId5" noStyle>
                    <Input
                      style={{ width: "40px", textAlign: "center" }}
                      maxLength={1}
                    />
                  </Form.Item>
                </div>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3: Country Code, Mobile Phone, Passport, Salary */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={5}>
              <Form.Item<RegistrationFormValues>
                name="countryCode"
                label={t("form.fields.countryCode.label")}
                rules={validationRules.countryCode}
              >
                <Select placeholder={t("form.fields.countryCode.placeholder")}>
                  {renderSelectOptions(countryCodeOptions, true, t)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item<RegistrationFormValues>
                name="mobilePhone"
                label={t("form.fields.mobilePhone.label")}
                rules={validationRules.mobilePhone}
              >
                <Input placeholder={t("form.fields.mobilePhone.placeholder")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item<RegistrationFormValues>
                name="passportNo"
                label={t("form.fields.passportNo.label")}
                rules={validationRules.passportNo}
              >
                <Input placeholder={t("form.fields.passportNo.placeholder")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={7}>
              <Form.Item<RegistrationFormValues>
                name="expectedSalary"
                label={t("form.fields.expectedSalary.label")}
                rules={validationRules.expectedSalary}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t("form.fields.expectedSalary.placeholder")}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Buttons */}
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    {editingPerson ? "อัปเดตข้อมูล" : t("form.buttons.submit")}
                  </Button>
                  {editingPerson && (
                    <Button onClick={handleCancelEdit} loading={isSubmitting}>
                      ยกเลิกการแก้ไข
                    </Button>
                  )}
                  <Button htmlType="reset" disabled={isSubmitting}>
                    {t("form.buttons.reset")}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default PersonForm;

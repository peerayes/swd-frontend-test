"use client";

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { renderSelectOptions } from "@/components/shared/SelectOption";
import {
  countryCodeOptions,
  nationalityOptions,
} from "@/constants/countryOptions";
import { setEditingPerson } from "@/store/personSlice";
import { useAppSelector } from "@/store/store";
import type {
  FormSubmitHandler,
  RegistrationFormValues,
  TitleOption,
} from "@/types/person.types";
import { createValidationRules } from "@/types/person.types";

interface PersonFormProps {
  onSubmit: FormSubmitHandler;
  onCancelEdit: () => void;
  onAfterSubmit?: () => void;
}

const PersonForm = ({
  onSubmit,
  onCancelEdit,
  onAfterSubmit,
}: PersonFormProps) => {
  const { t } = useTranslation(["person-management", "common"]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const inputRefs = useRef<any[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux state
  const editingPerson = useAppSelector((state) => state.persons.editingPerson);

  // Dynamic validation rules with i18n
  const validationRules = useMemo(() => createValidationRules(t), [t]);

  // Initialize component on mount
  useEffect(() => {
    // Set a minimal delay to prevent flash of content
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);
  // Re-validate fields with errors on language change or loading state change
  useEffect(() => {
    if (isLoading) return;

    // Get currently touched fields (fields that have errors)
    const fieldsError = form.getFieldsError();
    const hasErrors = fieldsError.some((field) => field.errors.length > 0);

    // Only re-validate if there are existing errors
    if (hasErrors) {
      // Get all field names that have errors
      const errorFields = fieldsError
        .filter((field) => field.errors.length > 0)
        .map((field) => field.name);

      // Validate only those fields to update error messages
      form.validateFields(errorFields).catch(() => {
        // Ignore validation errors, we just want to update messages
      });
    }
  }, [t, form, isLoading]);

  // Set form values when editingPerson changes (only after loading completes)
  useEffect(() => {
    if (editingPerson && !isLoading) {
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
  }, [editingPerson, isLoading, form]);

  // Handle form submission with loading
  const handleSubmit: FormSubmitHandler = async (
    values: RegistrationFormValues
  ) => {
    setIsSubmitting(true);
    try {
      // Add 2-3 seconds delay to simulate loading
      await new Promise((resolve) => setTimeout(resolve, 2500));

      await onSubmit(values);
      // Reset form after successful submission
      form.resetFields();
      dispatch(setEditingPerson(null));

      // Trigger table loading
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
    // Clear all form fields but stay in edit mode (don't clear editingPerson)
    form.resetFields();
  };

  const handleCancelEdit = () => {
    dispatch(setEditingPerson(null));
    form.resetFields();
    onCancelEdit();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    maxLength: number
  ) => {
    const value = e.target.value;

    // Move focus to next input if max length is reached
    if (value.length === maxLength && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
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
                    "person-management:form.fields.title.placeholder"
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
                      ref={(el) => {
                        inputRefs.current[0] = el;
                      }}
                      style={{ width: "40px", textAlign: "center" }}
                      maxLength={1}
                      onChange={(e) => handleInputChange(e, 0, 1)}
                      placeholder="X"
                    />
                  </Form.Item>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    -
                  </span>
                  <Form.Item<RegistrationFormValues> name="citizenId2" noStyle>
                    <Input
                      ref={(el) => {
                        inputRefs.current[1] = el;
                      }}
                      style={{ width: "80px", textAlign: "center" }}
                      maxLength={4}
                      onChange={(e) => handleInputChange(e, 1, 4)}
                      placeholder="XXXX"
                    />
                  </Form.Item>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    -
                  </span>
                  <Form.Item<RegistrationFormValues> name="citizenId3" noStyle>
                    <Input
                      ref={(el) => {
                        inputRefs.current[2] = el;
                      }}
                      style={{ width: "100px", textAlign: "center" }}
                      maxLength={5}
                      onChange={(e) => handleInputChange(e, 2, 5)}
                      placeholder="XXXXX"
                    />
                  </Form.Item>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    -
                  </span>
                  <Form.Item<RegistrationFormValues> name="citizenId4" noStyle>
                    <Input
                      ref={(el) => {
                        inputRefs.current[3] = el;
                      }}
                      style={{ width: "50px", textAlign: "center" }}
                      maxLength={2}
                      onChange={(e) => handleInputChange(e, 3, 2)}
                      placeholder="XX"
                    />
                  </Form.Item>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    -
                  </span>
                  <Form.Item<RegistrationFormValues> name="citizenId5" noStyle>
                    <Input
                      ref={(el) => {
                        inputRefs.current[4] = el;
                      }}
                      style={{ width: "40px", textAlign: "center" }}
                      maxLength={1}
                      onChange={(e) => handleInputChange(e, 4, 1)}
                      placeholder="X"
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
                    {editingPerson
                      ? t("form.buttons.update")
                      : t("form.buttons.submit")}
                  </Button>
                  {editingPerson && (
                    <Button onClick={handleCancelEdit} disabled={isSubmitting}>
                      {t("form.buttons.cancelEdit")}
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

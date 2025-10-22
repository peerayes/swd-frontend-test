"use client";

import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Table,
  App,
  Row,
  Col,
  Select,
  DatePicker,
  Radio,
  InputNumber,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import type {
  Person,
  RegistrationFormValues,
  FormSubmitHandler,
  TitleOption,
  NationalityOption,
  CountryCodeOption,
} from "@/types/person.types";
import { createValidationRules } from "@/types/person.types";
import {
  countryCodeOptions,
  nationalityOptions,
} from "@/constants/countryOptions";
import { renderSelectOptions } from "@/components/shared/SelectOption";
import {
  addPerson,
  deletePerson,
  updatePerson,
  setPersons,
  setEditingPerson,
  setSelectedRowKeys,
  setPagination,
} from "@/store/personSlice";
import { useAppSelector, useAppDispatch } from "@/store/store";

const PersonManagement = () => {
  const { t } = useTranslation("person-management");
  const { message } = App.useApp();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  // Redux state
  const persons = useAppSelector((state) => state.persons.persons) as Person[];
  const editingPerson = useAppSelector((state) => state.persons.editingPerson);
  const selectedRowKeys = useAppSelector(
    (state) => state.persons.selectedRowKeys,
  );
  const pagination = useAppSelector((state) => state.persons.pagination);

  // Dynamic validation rules with i18n - recreate on language change
  const validationRules = useMemo(() => createValidationRules(t), [t]);

  // Form handlers with type safety
  const handleFormSubmit: FormSubmitHandler = (
    values: RegistrationFormValues,
  ) => {
    console.log("Form submitted with type safety:", values);

    // Create person object from form values
    const newPerson: Person = {
      id: Date.now().toString(),
      title: values.title,
      name: `${values.title} ${values.firstname} ${values.lastname}`,
      gender: values.gender,
      phone: `${values.countryCode}${values.mobilePhone}`,
      nationality: values.nationality,
      firstname: values.firstname,
      lastname: values.lastname,
      birthday: values.birthday ? values.birthday.toISOString() : "",
      citizenId1: values.citizenId1,
      citizenId2: values.citizenId2,
      citizenId3: values.citizenId3,
      citizenId4: values.citizenId4,
      citizenId5: values.citizenId5,
      countryCode: values.countryCode,
      mobilePhone: values.mobilePhone,
      passportNo: values.passportNo,
      expectedSalary: values.expectedSalary,
    };

    // Add to persons list via Redux
    dispatch(addPerson(newPerson));
    localStorage.setItem("persons", JSON.stringify([...persons, newPerson]));

    message.success(t("form.messages.registrationSuccess"));
  };

  const handleFormReset = () => {
    dispatch(setEditingPerson(null));
    form.resetFields();
    form.setFieldsValue({
      expectedSalary: 0,
    });
    message.info(t("form.messages.resetInfo"));
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPersons = localStorage.getItem("persons");
    if (savedPersons) {
      const parsedPersons = JSON.parse(savedPersons);
      dispatch(setPersons(parsedPersons));
    }
  }, [dispatch]);

  // Save to localStorage whenever persons change
  useEffect(() => {
    if (persons.length > 0) {
      localStorage.setItem("persons", JSON.stringify(persons));
    }
  }, [persons]);

  // Set initial form values on mount
  useEffect(() => {
    if (!editingPerson) {
      form.setFieldsValue({
        expectedSalary: 0,
      });
    }
  }, [editingPerson, form]);
  const handleEdit = (person: Person) => {
    dispatch(setEditingPerson(person));
    form.setFieldsValue({
      title: person.title,
      firstname: person.firstname,
      lastname: person.lastname,
      birthday: person.birthday ? dayjs(person.birthday) : null,
      nationality: person.nationality,
      citizenId1: person.citizenId1,
      citizenId2: person.citizenId2,
      citizenId3: person.citizenId3,
      citizenId4: person.citizenId4,
      citizenId5: person.citizenId5,
      gender: person.gender,
      countryCode: person.countryCode,
      mobilePhone: person.mobilePhone,
      passportNo: person.passportNo,
      expectedSalary: person.expectedSalary,
    });

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });

    toast({
      title: "โหมดแก้ไข",
      description: `กำลังแก้ไขข้อมูลของ ${person.name}`,
    });
  };

  const handleUpdate = (values: RegistrationFormValues) => {
    if (!editingPerson) return;

    const updatedPerson: Person = {
      ...editingPerson,
      title: values.title,
      name: `${values.title} ${values.firstname} ${values.lastname}`,
      gender: values.gender,
      phone: `${values.countryCode}${values.mobilePhone}`,
      nationality: values.nationality,
      firstname: values.firstname,
      lastname: values.lastname,
      birthday: values.birthday ? values.birthday.toISOString() : "",
      citizenId1: values.citizenId1,
      citizenId2: values.citizenId2,
      citizenId3: values.citizenId3,
      citizenId4: values.citizenId4,
      citizenId5: values.citizenId5,
      countryCode: values.countryCode,
      mobilePhone: values.mobilePhone,
      passportNo: values.passportNo,
      expectedSalary: values.expectedSalary,
    };

    dispatch(updatePerson(updatedPerson));
    dispatch(setEditingPerson(null));
    form.resetFields();
    toast({
      title: "อัปเดตข้อมูลสำเร็จ",
      description: t("form.messages.updateSuccess"),
    });
  };

  const handleCancelEdit = () => {
    dispatch(setEditingPerson(null));
    form.resetFields();
    toast({
      title: "ยกเลิกการแก้ไข",
      description: "กลับสู่โหมดเพิ่มข้อมูลใหม่",
    });
  };

  const handleDelete = (id: string) => {
    dispatch(deletePerson(id));
    message.success(t("table.messages.deleteSuccess"));
  };

  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("กรุณาเลือกรายการที่ต้องการลบ");
      return;
    }

    selectedRowKeys.forEach((id) => {
      dispatch(deletePerson(id));
    });
    const deletedCount = selectedRowKeys.length;
    dispatch(setSelectedRowKeys([]));
    message.success(`ลบรายการที่เลือก ${deletedCount} รายการเรียบร้อยแล้ว`);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    dispatch(setSelectedRowKeys(newSelectedRowKeys as string[]));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "ชื่อ-นามสกุล",
      key: "fullname",
      width: 200,
      render: (_: any, record: Person) => (
        <div>
          <div className="font-medium">
            {record.firstname} {record.lastname}
          </div>
          {/*<div className="text-sm text-gray-500">{record.title}</div>*/}
        </div>
      ),
    },
    {
      title: "เพศ",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender: string) => (
        <span style={{ textTransform: "capitalize" }}>
          {gender === "male"
            ? t("form.fields.gender.options.male")
            : gender === "female"
              ? t("form.fields.gender.options.female")
              : t("form.fields.gender.options.unsex")}
        </span>
      ),
    },
    {
      title: "หมายเลขโทรศัพท์มือถือ",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "สัญชาติ",
      dataIndex: "nationality",
      key: "nationality",
      width: 120,
      render: (nationality: string) => (
        <span style={{ textTransform: "capitalize" }}>
          {nationality === "thai"
            ? t("form.fields.nationality.options.thai")
            : nationality}
        </span>
      ),
    },
    {
      title: "จัดการ",
      key: "actions",
      width: 150,
      render: (_: any, record: Person) => (
        <Space key={`actions-${record.id}`}>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            {t("table.actions.edit")}
          </Button>
          <Popconfirm
            title={t("table.confirm.delete.title")}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small">
              {t("table.actions.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const paginatedData = persons.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* section 1 */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 0 24px 0",
            }}
          >
            {editingPerson
              ? `แก้ไขข้อมูล: ${editingPerson.name}`
              : t("form.title")}
          </h1>

          <Form<RegistrationFormValues>
            id="register"
            form={form}
            layout="vertical"
            onFinish={editingPerson ? handleUpdate : handleFormSubmit}
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
                  <Select
                    placeholder={t("form.fields.nationality.placeholder")}
                  >
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
                    <Form.Item<RegistrationFormValues>
                      name="citizenId2"
                      noStyle
                    >
                      <Input
                        style={{ width: "80px", textAlign: "center" }}
                        maxLength={4}
                      />
                    </Form.Item>
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                      -
                    </span>
                    <Form.Item<RegistrationFormValues>
                      name="citizenId3"
                      noStyle
                    >
                      <Input
                        style={{ width: "100px", textAlign: "center" }}
                        maxLength={5}
                      />
                    </Form.Item>
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                      -
                    </span>
                    <Form.Item<RegistrationFormValues>
                      name="citizenId4"
                      noStyle
                    >
                      <Input
                        style={{ width: "50px", textAlign: "center" }}
                        maxLength={2}
                      />
                    </Form.Item>
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                      -
                    </span>
                    <Form.Item<RegistrationFormValues>
                      name="citizenId5"
                      noStyle
                    >
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
                  <Select
                    placeholder={t("form.fields.countryCode.placeholder")}
                  >
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
                  <Input
                    placeholder={t("form.fields.mobilePhone.placeholder")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item<RegistrationFormValues>
                  name="passportNo"
                  label={t("form.fields.passportNo.label")}
                  rules={validationRules.passportNo}
                >
                  <Input
                    placeholder={t("form.fields.passportNo.placeholder")}
                  />
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

            {/* Row 8: Buttons */}
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      {editingPerson
                        ? "อัปเดตข้อมูล"
                        : t("form.buttons.submit")}
                    </Button>
                    {editingPerson && (
                      <Button onClick={handleCancelEdit}>ยกเลิกการแก้ไข</Button>
                    )}
                    <Button htmlType="reset">{t("form.buttons.reset")}</Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>

        {/* section 2 */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Popconfirm
                title={`ลบรายการที่เลือก (${selectedRowKeys.length} รายการ)`}
                onConfirm={handleDeleteSelected}
                okText="Yes"
                cancelText="No"
                disabled={selectedRowKeys.length === 0}
              >
                <Button
                  type="primary"
                  danger
                  disabled={selectedRowKeys.length === 0}
                >
                  ลบรายการที่เลือก ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            </Space>
          </div>
          <Table
            dataSource={paginatedData}
            columns={columns}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: persons.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, pageSize) => {
                dispatch(
                  setPagination({
                    current: page,
                    pageSize: pageSize || 10,
                    total: persons.length,
                  }),
                );
              },
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default PersonManagement;

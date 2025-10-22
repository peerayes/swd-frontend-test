"use client";

import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Table,
  App,
  Row,
  Col,
  Select,
  DatePicker,
  Radio,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useTranslation as useReactTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
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
  addPerson,
  deletePerson,
  updatePerson,
  setPersons,
} from "@/store/personSlice";
import { useAppSelector, useAppDispatch } from "@/store/store";

const PersonManagement = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const persons = useAppSelector((state) => state.persons) as Person[];
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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

    message.success(t("person-management:form.messages.registrationSuccess"));
  };

  const handleFormReset = () => {
    message.info(t("person-management:form.messages.resetInfo"));
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPersons = localStorage.getItem("persons");
    if (savedPersons) {
      const parsedPersons = JSON.parse(savedPersons) as Person[];
      dispatch(setPersons(parsedPersons));
    }
  }, [dispatch]);

  // Save to localStorage whenever persons change
  useEffect(() => {
    if (persons.length > 0) {
      localStorage.setItem("persons", JSON.stringify(persons));
    }
  }, [persons]);

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
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
    setIsModalOpen(true);
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
    setIsModalOpen(false);
    setEditingPerson(null);
    form.resetFields();
    message.success(t("person-management:form.messages.updateSuccess"));
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t("person-management:table.confirm.delete.title"),
      content: t("person-management:table.confirm.delete.content"),
      okText: t("person-management:table.confirm.delete.okText"),
      okType: "danger",
      cancelText: t("person-management:table.confirm.delete.cancelText"),
      onOk: () => {
        dispatch(deletePerson(id));
        message.success(t("person-management:table.messages.deleteSuccess"));
      },
    });
  };

  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("กรุณาเลือกรายการที่ต้องการลบ");
      return;
    }

    Modal.confirm({
      title: `ลบรายการที่เลือก (${selectedRowKeys.length} รายการ)`,
      content: "คุณแน่ใจหรือไม่ว่าต้องการลบรายการที่เลือกทั้งหมด?",
      okText: "ลบทั้งหมด",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: () => {
        selectedRowKeys.forEach((id) => {
          dispatch(deletePerson(id));
        });
        setSelectedRowKeys([]);
        message.success(
          `ลบรายการที่เลือก ${selectedRowKeys.length} รายการเรียบร้อย`,
        );
      },
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys as string[]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: t("person-management:table.columns.title"),
      dataIndex: "title",
      key: "title",
      width: 80,
    },
    {
      title: "เพศ",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender: string) => (
        <span style={{ textTransform: "capitalize" }}>
          {gender === "male"
            ? t("person-management:form.fields.gender.options.male")
            : gender === "female"
              ? t("person-management:form.fields.gender.options.female")
              : t("person-management:form.fields.gender.options.unsex")}
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
            ? t("person-management:form.fields.nationality.options.thai")
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
            {t("person-management:table.actions.edit")}
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            {t("person-management:table.actions.delete")}
          </Button>
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
            {t("person-management:form.title")}
          </h1>

          <Form<RegistrationFormValues>
            id="register"
            layout="vertical"
            initialValues={{
              expectedSalary: 0,
            }}
            onFinish={handleFormSubmit}
            onReset={handleFormReset}
          >
            {/* Row 1: Title, Firstname, Lastname */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={8}>
                <Form.Item<RegistrationFormValues>
                  name="title"
                  label={t("person-management:form.fields.title.label")}
                  rules={validationRules.title}
                >
                  <Select<TitleOption["value"]>
                    placeholder={t(
                      "person-management:form.fields.title.placeholder",
                    )}
                  >
                    <Select.Option value="นาย">
                      {t("person-management:form.fields.title.options.นาย")}
                    </Select.Option>
                    <Select.Option value="นาง">
                      {t("person-management:form.fields.title.options.นาง")}
                    </Select.Option>
                    <Select.Option value="นางสาว">
                      {t("person-management:form.fields.title.options.นางสาว")}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item<RegistrationFormValues>
                  name="firstname"
                  label={t("person-management:form.fields.firstname.label")}
                  rules={validationRules.firstname}
                >
                  <Input
                    placeholder={t(
                      "person-management:form.fields.firstname.placeholder",
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item<RegistrationFormValues>
                  name="lastname"
                  label={t("person-management:form.fields.lastname.label")}
                  rules={validationRules.lastname}
                >
                  <Input
                    placeholder={t(
                      "person-management:form.fields.lastname.placeholder",
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 2: Birthday, Nationality */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12}>
                <Form.Item<RegistrationFormValues>
                  name="birthday"
                  label={t("person-management:form.fields.birthday.label")}
                  rules={validationRules.birthday}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder={t(
                      "person-management:form.fields.birthday.placeholder",
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item<RegistrationFormValues>
                  name="nationality"
                  label={t("person-management:form.fields.nationality.label")}
                  rules={validationRules.nationality}
                >
                  <Select<NationalityOption["value"]>
                    placeholder={t(
                      "person-management:form.fields.nationality.placeholder",
                    )}
                  >
                    <Select.Option value="thai">
                      {t(
                        "person-management:form.fields.nationality.options.thai",
                      )}
                    </Select.Option>
                    <Select.Option value="other">
                      {t(
                        "person-management:form.fields.nationality.options.other",
                      )}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Row 3: Citizen ID */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24}>
                <Form.Item
                  label={t("person-management:form.fields.citizenId.label")}
                  required
                >
                  <Space.Compact>
                    <Form.Item<RegistrationFormValues>
                      name="citizenId1"
                      noStyle
                      rules={validationRules.citizenId1}
                    >
                      <Input
                        style={{ width: "50px", textAlign: "center" }}
                        maxLength={1}
                      />
                    </Form.Item>
                    <Form.Item<RegistrationFormValues>
                      name="citizenId2"
                      noStyle
                      rules={validationRules.citizenId2}
                    >
                      <Input
                        style={{ width: "150px", textAlign: "center" }}
                        maxLength={4}
                      />
                    </Form.Item>
                    <Form.Item<RegistrationFormValues>
                      name="citizenId3"
                      noStyle
                      rules={validationRules.citizenId3}
                    >
                      <Input
                        style={{ width: "180px", textAlign: "center" }}
                        maxLength={5}
                      />
                    </Form.Item>
                    <Form.Item<RegistrationFormValues>
                      name="citizenId4"
                      noStyle
                      rules={validationRules.citizenId4}
                    >
                      <Input
                        style={{ width: "80px", textAlign: "center" }}
                        maxLength={2}
                      />
                    </Form.Item>
                    <Form.Item<RegistrationFormValues>
                      name="citizenId5"
                      noStyle
                      rules={validationRules.citizenId5}
                    >
                      <Input
                        style={{ width: "50px", textAlign: "center" }}
                        maxLength={1}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </Row>

            {/* Row 4: Gender */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24}>
                <Form.Item<RegistrationFormValues>
                  name="gender"
                  label={t("person-management:form.fields.gender.label")}
                  rules={validationRules.gender}
                >
                  <Radio.Group>
                    <Radio value="male">
                      {t("person-management:form.fields.gender.options.male")}
                    </Radio>
                    <Radio value="female">
                      {t("person-management:form.fields.gender.options.female")}
                    </Radio>
                    <Radio value="unsex">
                      {t("person-management:form.fields.gender.options.unsex")}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            {/* Row 5: Mobile Phone */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={6}>
                <Form.Item<RegistrationFormValues>
                  name="countryCode"
                  label={t("person-management:form.fields.countryCode.label")}
                  rules={validationRules.countryCode}
                >
                  <Select<CountryCodeOption["value"]>
                    placeholder={t(
                      "person-management:form.fields.countryCode.placeholder",
                    )}
                  >
                    <Select.Option value="+66">
                      {t(
                        "person-management:form.fields.countryCode.options.+66",
                      )}
                    </Select.Option>
                    <Select.Option value="+1">
                      {t(
                        "person-management:form.fields.countryCode.options.+1",
                      )}
                    </Select.Option>
                    <Select.Option value="+44">
                      {t(
                        "person-management:form.fields.countryCode.options.+44",
                      )}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={18}>
                <Form.Item<RegistrationFormValues>
                  name="mobilePhone"
                  label={t("person-management:form.fields.mobilePhone.label")}
                  rules={validationRules.mobilePhone}
                >
                  <Input
                    placeholder={t(
                      "person-management:form.fields.mobilePhone.placeholder",
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 6: Passport No */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24}>
                <Form.Item<RegistrationFormValues>
                  name="passportNo"
                  label={t("person-management:form.fields.passportNo.label")}
                  rules={validationRules.passportNo}
                >
                  <Input
                    placeholder={t(
                      "person-management:form.fields.passportNo.placeholder",
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 7: Expected Salary */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col xs={24}>
                <Form.Item<RegistrationFormValues>
                  name="expectedSalary"
                  label={t(
                    "person-management:form.fields.expectedSalary.label",
                  )}
                  rules={validationRules.expectedSalary}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={t(
                      "person-management:form.fields.expectedSalary.placeholder",
                    )}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
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
                      {t("person-management:form.buttons.submit")}
                    </Button>
                    <Button htmlType="reset">
                      {t("person-management:form.buttons.reset")}
                    </Button>
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
              <Button
                type="primary"
                danger
                onClick={handleDeleteSelected}
                disabled={selectedRowKeys.length === 0}
              >
                ลบรายการที่เลือก ({selectedRowKeys.length})
              </Button>
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
                setPagination({
                  current: page,
                  pageSize: pageSize || 10,
                  total: persons.length,
                });
              },
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default PersonManagement;
